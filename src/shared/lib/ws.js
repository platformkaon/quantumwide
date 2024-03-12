import { serverAddresses, defer, reportError, t, reportSuccess, fetchCsrfToken } from '@/shared/functions'
import { parse } from './parser'
import get from 'lodash/get'
import set from 'lodash/set'
import merge from 'lodash/merge'
import store from './../../store'
import { digestMessage } from '@/shared/functions'

class Instance {
	constructor () {
		// WebSocket object
		this.ws = null

		// WebSocket connection states
		// order of items are important
		this.states = [
			'CONNECTING',
			'OPEN',
			'CLOSING',
			'CLOSED',
		]

		// queue used to hold calls,
		// when ws connection hasn't
		// yet been initiated. It's
		// flushed, once ws becomes
		// available
		this.queue = []

		// all ws calls go through
		// requests map. Structure is:
		// ['callId': promiseInstance]
		this.requests = []

		// subscription callbacks map.
		// Structure is: 
		// ['alias': callbacks[]]
		this.subscriptions = {}

		// initiate unique call IDs
		// and increment on each call
		this.reqId = {
			base: (Date.now() + '').substr(-5),
			increment: 0
		}

		// intervalToken contains interval functions that checks and refreshes token
		this.intervalToken = null
	}

	init (options) {
		this.onConnect = options.onConnect
		this.onDisconnect = options.onDisconnect
		this.onError = options.onError
		this.onAuthError = options.onAuthError
		this.onActivity = options.onActivity
		this.onTimeout = options.onTimeout
	}

	catchError(err) {
		if (err.code == 7) {
				err.message = t(store, 'too-many-attempts').cap
		}
		else if (err.code == 5) {
				err.message = t(store, 'invalid-credentials').cap
		}
		else if (err.code == 6) {
				err.message = t(store, 'login-err').cap
		}
		else {
				err.message = t(store, 'conn-error').cap
		}
		this.onAuthError()
		this.disconnect()
		reportError(err.message)
	}

	async conn (username = null, password = null, token = null) {
		return this.onConnect()
	}

	// adds a call to
	// global queue
	addToQueue (args) {
		this.queue.push(args)
	}

	// invokes each call
	// held in queue and
	// cleares queue
	flushQueue () {
		this.queue.forEach(queue => {
			// differenciate call from subscription
			if (typeof queue[1] === 'function') {
				this.subscribe(...queue)
			}
			else {
				this.call(...queue)
			}
		})
		this.queue = []
	}

	emptyQueue () {
		this.queue = []
	}

	// each time this func
	// called, global ID
	// is incremented and
	// returned
	genReqId () {
		return parseInt(this.reqId.base + ++this.reqId.increment)
	}

	// Makes an RPC call.
	//
	// existingId param will be
	// passed when flushing queue
	call (input, arg, existingId) {
		const id = existingId ? existingId : this.genReqId()

		// means this call isn't
		// invoked from queue
		if (!existingId) {
			this.requests[id] = defer()
		}

		// input is required param
		if (!input) {
			this.requests[id].reject()
			return this.requests[id]
		}

		// avoid mutating input
		input = JSON.parse(JSON.stringify(input))

		// when no ws connection ready yet,
		// add this call to queue
		if (!this.ws || this.states[this.ws.readyState] !== 'OPEN') {
			// we don't queue ping requests
			if (input.ping) {
				this.requests[id].reject()
				return this.requests[id]
			}
			// ...but only if it
			// doesn't exist yet
			// and it's not ping request
			if (!existingId) {
				this.addToQueue([input, arg, id])
			}
			return this.requests[id]
		}

		// id is essential prop,
		// since we differenciate
		// returned responses by it
		const defaultInput = {
			jsonrpc: '2.0',
			id
		}

		// merge defaults with new input
		const data = Object.assign({}, defaultInput, input)

		// merge default params with new.
		// arg.$params is an object
		// with all params
		if (get(data, 'params') && arg && get(arg, '$params')) {
			merge(data.params, arg.$params)
		}
		// ...if no arg.$params given,
		// merge `arg` itself
		else if (get(data.params, 'msg') && arg) {
			data.params.msg = {
				...data.params.msg,
				...arg
			}
		}

		data.params.sid = store.getters.sid()
		data.params.csrftoken = store.getters.csrftoken()
		
		// attach input for later access
		this.requests[id].requestData = data

		// send it to server
		this.ws.send(JSON.stringify(data))

		return this.requests[id]
			.then(this.commit(id, data))
	}

	// invokes commit request
	commit (id, data) {
		// check if ubus path and method exist
		if (data.params.PT_OWRT_UBUS_PATH && data.params.PT_OWRT_UBUS_METHOD) {
			const commitableUid = ['uci_add', 'uci_set', 'uci_delete', 'uci_order']
			const uid = `${data.params.PT_OWRT_UBUS_PATH}_${data.params.PT_OWRT_UBUS_METHOD}`
			if (commitableUid.includes(uid) && uid !== 'uci_commit') {
				const commitArg = JSON.parse(data.params.PT_OWRT_UBUS_ARG).config
				return this.call({
					method: "ubus",
					params: {
						path: "uci",
						action: "commit",
						msg: {
							config: commitArg
						}
					}
				})
			}
		}
		return this.requests[id]
	}

	// Adds subscription
	//
	// existingId param will be
	// passed when flushing queue
	subscribe (input, callback, existingId) {
		// input is required param
		if (!input) {
			return Promise.reject('missing params')
		}

		// check if subscription exists
		if (Array.isArray(this.subscriptions[input.method])) {
			// no duplicate callbacks allowed
			const callbackExists = this.subscriptions[input.method].some(func => {
				return func.toString() === callback.toString()
			})
			if (callbackExists) {
				return Promise.resolve({duplicate: true})
			}

			// append callback to existing subscription
			const requestId = this.requests.findIndex(req => {
				return get(req, 'requestData.params.ref') === input.method
			})
			if (requestId !== -1) {
				return this.requests[requestId].then(() => {
					this.subscriptions[input.method].push(callback)
				})
			}
		}

		this.subscriptions[input.method] = []
		const id = existingId ? existingId : this.genReqId()

		// means this call isn't
		// invoked from queue
		if (!existingId) {
			this.requests[id] = defer()
		}

		// // required prop for server
		// if (typeof get(input, 'params.uid') === 'undefined') {
		// 	return this.requests[id].reject()
		// }

		// avoid mutating input
		input = JSON.parse(JSON.stringify(input))

		// when no ws connection ready yet,
		// add this call to queue
		if (!this.ws || this.states[this.ws.readyState] !== 'OPEN') {
			// ...but only if it
			// doesn't exist yet
			if (!existingId) {
				this.addToQueue([input, callback, id])
			}
			return this.requests[id]
		}

		// id is essential prop,
		// since we differenciate
		// returned responses by it
		const defaultInput = {
			jsonrpc: '2.0',
			id,
		}

		// merge defaults with new input
		const data = Object.assign({}, defaultInput, input)

		// attach input for later access
		this.requests[id].requestData = data

		// send it to server
		this.ws.send(JSON.stringify(data))
		return this.requests[id].then(() => {
			this.subscriptions[input.method].push(callback)
		})
	}

	// Removes subscription callback.
	// When no callbacks left or 
	// `null` passed as `callback` param,
	// 'unsubscribe' call will be sent
	unsubscribe (input, callback) {
		// required param
		if (typeof get(input, 'params.ref') === 'undefined') {
			return Promise.reject('missing params.ref')
		}

		// check if subscription exists
		if (!Array.isArray(this.subscriptions[input.params.ref])) {
			return Promise.reject('subscription not found')
		}

		if (typeof callback === 'function') {
			// remove if such callback exists
			const callbackIndex = this.subscriptions[input.params.ref].findIndex(func => {
				return func.toString() === callback.toString()
			})
			if (callbackIndex === -1) {
				return Promise.reject('callback not found')
			}
			this.subscriptions[input.params.ref].splice(callbackIndex, 1)

			// no unsubscribe call will be sent if more callbacks left
			if (this.subscriptions[input.params.ref].length > 0) {
				return Promise.resolve()
			}
		}
		// passing null will send unsubscribe call
		else if (callback === null) {
			this.subscriptions[input.params.ref] = []
		}
		else {
			return Promise.reject('invalid callback')
		}

		return this.call({
			method: 'unsubscribe',
			params: {
				uid: input.params.uid,
				ref: input.params.ref
			}
		})
	}

	disconnect () {
		if (this.ws) {
			this.ws.close()
		}
	}
}

export function newWsInstance () {
	return new Instance()
}
export default new Instance()
