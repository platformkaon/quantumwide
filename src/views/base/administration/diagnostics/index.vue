<template>
	<article class="article">
		<div class="wrap-content">
			<div class="container-fluid">
				<section class="section" v-loading="pingForm.loading">
					<div class="table-title">{{ t('settings').cap }}</div>
					<table class="table-setting-wide">
						<tbody>
							<tr>
								<th>
									<label class="form-label" for="target">{{ t("target").cap }}<label
											style="color: red;">*</label></label>
								</th>
								<td>
									<input type="text" class="form-control" id="target" placeholder=""
										v-model="pingForm.fields.target">
								</td>
							</tr>
							<tr v-if="false">
								<th>
									<label class="form-label" for="ping">{{ t("ping-size").cap }}</label>
								</th>
								<td>
									<input :disabled="true" type="number"
										oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');" min="1"
										class="form-control" id="ping" placeholder="" v-model="pingForm.fields.size">
								</td>
							</tr>
							<tr>
								<th>
									<label class="form-label" for="amount">{{ t("no-of-pings").cap }}</label>
								</th>
								<td>
									<input type="number"
										oninput="event.target.value = event.target.value.replace(/[^0-9]*/g,'');" min="1"
										max="10" class="form-control" id="amount" placeholder=""
										v-model="pingForm.fields.no">
								</td>
							</tr>
						</tbody>
					</table>

					<br>
					<div class="btn-area btn-setting-area">
						<button v-if="!start_stop" style="text-transform : uppercase;" class="btn btn-secondary"
							@click="save" type="button">{{ t('start') }}</button>
						<button v-if="start_stop" style="text-transform : uppercase;" class="btn btn-secondary"
							@click="abortTest" type="button">{{ t("stop") }}</button>
						<button v-if="!start_stop" style="text-transform : uppercase;" class="btn btn-secondary"
							@click="clearResult" type="button">{{ t("clear") }}</button>
					</div>

					<br>
					<div class="table-title">{{ t('result').cap }}</div>
					<textarea class="kaon-textarea" v-model="pingForm.result">
										</textarea>
				</section>
			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { reportSuccess, reportError, trackFields } from '@/shared/functions'
import val_ip4 from '@/shared/validators/ip.js'

export default {
	components: {

	},
	mounted() {
		Promise.all([
			ws.call(API.feature)
		])
		.catch(err => reportError(err))
		this.$nextTick(() => {
			document.body.className = 'full-page';
		})
		this.fetchData()
	},
	data() {
		return {
			pingForm: {
				name: "pingForm",
				loading: false,
				fields: {
					target: "",
					size: "56",
					no: "3"
				},
				result: "",
				pid: "",
				interval: null,
				stop_result_flog: 0,
			},
			start_stop: false
		}
	},
	mounted() {
		this.untrackFields = trackFields.call(this, this.pingForm.name)
	},
	methods: {
		fetchData() {
		},
		async save() {
			if (this.pingForm.fields.target.length === 0) {
				reportError(this.t('err.validation.filled-1').cap + "->" + this.t('target').cap)
				return
			}

			else if (val_ip4(this.pingForm.fields.target)) {
				reportError(this.t('err.validation.ip-1').cap)
				return
			}

			else if (!(this.pingForm.fields.size > 0) || !(this.pingForm.fields.size < 1473)) {
				reportError("0 < " + this.t('ping-size').cap + " < 1473")
				return
			}


			else if (this.pingForm.fields.size === '') {
				reportError(this.t('ping-size').cap)
				return
			}

			else if (!(this.pingForm.fields.no > 0) || !(this.pingForm.fields.no < 11)) {
				reportError("0 < " + this.t('no-of-pings').cap + " < 11")
				return
			}

			else if (this.pingForm.fields.no === '') {
				reportError(this.t('no-of-pings').cap)
				return
			}

			this.clearResult()

			this.pingForm.loading = true
			this.pingForm.stop_result_flog == 0
			this.start_stop = true
			ws.call(API.ping.start, this.$store.getters.nonEmptyFieldsValues(this.pingForm.name)).then(({ dict: data }) => {
				if(data.pid == 0 ) {
					reportError(this.t('unable-to-perform-ping-operation').cap)
					this.pingForm.result = "PING: transmit failed. General failure."
					return
				}

				this.pingForm.pid = data.pid
				this.startPingResultHandler()
			})
		},
		startPingResultHandler() {
			if (!this.pingForm.interval) {
				this.pingForm.interval = setInterval(() => {
					this.pingResult()
				}, 1000)
			}
		},
		stopPingResultHandler() {
			if (this.pingForm.interval) {
				clearInterval(this.pingForm.interval)
				this.pingForm.interval = null
			}
		},
		pingResult() {
			const params = {
				pid: this.pingForm.pid
			}
			Promise.all([
				ws.call(API.ping.status, params)
			]).then(([
				{ dict: data }
			]) => {
				this.pingForm.result = data.result

				if((data.result.indexOf("round-trip") != -1 || data.result.indexOf("packets transmitted") != -1 || data.result.indexOf("sendto") != -1) 
				&& data.status === "completed" && this.pingForm.stop_result_flog == 1) {
					this.pingForm.pid = ''
					this.start_stop = false
					this.stopPingResultHandler()
					reportSuccess()
				}

				if (data.result.indexOf("round-trip") != -1 || data.result.indexOf("packets transmitted") != -1 || data.result.indexOf("sendto") != -1) 
					this.pingForm.stop_result_flog = 1

			}).catch(err => {
				this.pingForm.stop_result_flog = 1;
				this.pingForm.result = "PING: transmit failed. General failure."
			}).finally(() => {
				if (this.pingForm.result) {
					this.pingForm.loading = false
				}
			})
		},
		abortTest() {
			this.pingForm.loading = true
			this.start_stop = false

			const params = {
				pid: this.pingForm.pid
			}
			ws.call(API.ping.stop, params).then((dict) => {
			})
			.then(() => {
				this.stopPingResultHandler()
				this.pingForm.loading = false
			})
		},
		clearResult() {
			this.pingForm.result = ''
		}
	},
	destroyed() {
		this.stopPingResultHandler()
		if (this.pingForm.pid !== '') this.abortTest()
	}
}
</script>

<style>.kaon-textarea {
	min-height: 180px;
	min-width: 70%;
}</style>
