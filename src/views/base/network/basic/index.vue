<template>
	<section class="section">
		<form :name='basicNetworkForm.name' @submit.prevent>
			<div class="table-responsive" v-loading="basicNetworkForm.loading">
				<table class="table-setting-wide">
					<b-card header-tag="header" footer-tag="footer">
						<template #header>
							<h6 class="mb-0">
								<div class="table-title">
									{{ t('lan') }}
								</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv4-addr">{{ t('ipv4-address').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv4-addr"><strong>{{ data.lan.ipv4 || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv6-addr">{{ t('ipv6-address').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv6-addr"><strong>{{ data.lan.ipv6 || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv6-pre">{{ t('ipv6-prefix').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv6-pre"><strong>{{ data.lan.ipv6_prefix || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="mac">{{ t('mac-address').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="mac"><strong>{{ data.lan.mac || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
						</b-card-text>
					</b-card>
				</table>

				<table class="table-setting-wide">
					<br>
					<b-card header-tag="header" footer-tag="footer">
						<template #header>
							<h6 class="mb-0">
								<div class="table-title">
									{{ t('wan') }}
								</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv4-addr-w">{{ t('ipv4-address').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv4-addr-w"><strong>{{ data.wan.ipv4 || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv4-exp-w">{{ t('exp-ipv4-pref').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv4-exp-w"><strong>{{ data.wan.expires || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv4-dur-w">{{ t('ipv4-duration').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv4-dur-w"><strong>{{ data.wan.duration || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv6-pd-w">{{ t('ipv6_pd_address').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv6-pd-w"><strong>{{ data.wan.ipv6pd || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv6-na-w">{{ t('ipv6_na_address').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv6-na-w"><strong>{{ data.wan.ipv6 || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv4-dns-w">{{ t('ipv4-dns').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv4-dns-w"><strong>{{ data.wan.ipv4dns || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="ipv6-dns-w">{{ t('ipv6-dns').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv6-dns-w"><strong>{{ data.wan.ipv6dns || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="mac-w">{{ t('mac-address').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="mac-w"><strong>{{ data.wan.mac || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
						</b-card-text>
					</b-card>
				</table>
				<br v-if="!$buildOptions.magyarRequest">

				<!--
				<table v-if="!$buildOptions.magyarRequest" class="table-setting-wide">
					<div class="table-title">
						{{ t('wan-connection-type') }}
					</div>
					<br>

					<tbody>
						<button @click="renewLease" class="btn btn-secondary" type="submit">{{ t('renew-wan').cap
						}}</button>
					</tbody>
					<br>

					<tr>
						<th>
							<label class="form-label" for="wan-type">{{ t('wan-connection-type') }}</label>
						</th>
						<td>
							<select class="form-select" name='bridge' v-model='basicNetworkForm.fields.bridge'>
								<option v-for='item in wanType' :value='item.value' :key='item.value'>
									{{ item.label }}
								</option>
							</select>
						</td>
					</tr>

					<div class="btn-area btn-setting-area">
						<button @click='confirmModalShown = "reboot"' type="submit" class="btn btn-secondary">{{
							t("save").cap }}</button>
					</div>

					<c-confirm v-if='confirmModalShown === "reboot"' @close='confirmModalShown = ""' @done='save'
						:type="confirmModalShown" :yeslabel='t("Reboot").cap' :modallabel='t("Reboot").cap'
						:modalmsg='t("are-you-sure-to-reboot").cap' />

				</table>
				-->
			</div>
		</form>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import cConfirm from './confirm-password-dialog'
import { reportSuccess, reportError, QSpinTimer } from '@/shared/functions'

momentDurationFormatSetup(moment)

export default {
	components: {
		cConfirm
	},
	data() {
		return {
			confirmModalShown: '',
			data: {
				lan: {
					ipv4: 'n/a',
					ipv6: 'n/a',
					ipv6_prefix: 'n/a',
					mac: 'n/a',
				},
				wan: {
					ipv4: 'n/a',
					ipv6: 'n/a',
					expires: 'n/a',
					duration: 'n/a',
					ipv4dns: 'n/a',
					mac: 'n/a',
					ipv6pd: 'n/a',
					ipv6dns: 'n/a'
				},
			},
			ignoreWanInterfaces: [
				'guest1vlan',
				'guest2vlan',
				'guest3vlan',
				'lan',
				'loopback',
				'privbr',
				'guest',
				'dmz'
			],
			basicNetworkForm: {
				name: 'basic-network-form',
				loading: false,
				fields: {
					bridge: ""
				},
			},
			isBridgeInitial: false,
			wanType: [
				{ label: this.t('router').cap, value: 'off' },
				{ label: this.t('bridged').cap, value: 'on' },
			],
			ipaddrLan: '',
			subnetLan: '',
			SpinTime: 0,
			fetchInterval: '',
			value1: false
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData(setBridge = true) {
			this.basicNetworkForm.loading = true

			Promise.all([
				ws.call(API.network.lan.get),
				ws.call(API.network.dump.get),
				ws.call(API.network.status.get),
				//ws.call(RPC.bridge.status)
			]).then(([
				{ dict: lanIp },
				{ dict: networkDump },
				{ dict: deviceStatus },
				//{ dict: bridge },
			]) => {
				this.ipaddrLan = lanIp.ipaddr
				this.subnetLan = lanIp.netmask
				const wan6 = networkDump.interface.find(item => item.interface === 'wan6')
				//const ipv6 = wan6['ipv6-address'] ? wan6['ipv6-address'].map(item => item.address) : []

				//this.basicNetworkForm.fields.bridge = bridge.result.bridge.status
				if (setBridge) {
					this.isBridgeInitial = true
				}
				const lan = networkDump.interface.find(item => item.interface === 'lan')
				if (lan['ipv4-address'] !== undefined && lan['ipv4-address'].length > 0) {
					this.data.lan.ipv4 = lan['ipv4-address'][0].address
					//const ipv6 = wan6['ipv6-address'] ? wan6['ipv6-address'].map(item => item.address) : []
				}

				/*
				if (lan['ipv6-prefix-assignment'] !== undefined && lan['ipv6-prefix-assignment'].length > 0) {
					this.data.lan.ipv6 = lan['ipv6-prefix-assignment'][0]['local-address'].address
					const prefix = lan['ipv6-prefix-assignment'][0]
					this.data.lan.ipv6_prefix = `${prefix.address}/${prefix.mask}`
				}
				*/
				this.data.lan.mac = deviceStatus.hasOwnProperty('br-lan') ? deviceStatus['br-lan'].macaddr : deviceStatus.br0.macaddr

				const wan = networkDump.interface.find(item => item.interface === 'wan')
				if (wan['ipv4-address'] !== undefined && wan['ipv4-address'].length > 0) {
					this.data.wan.ipv4 = wan['ipv4-address'][0].address
				}
				if (networkDump.interface.find(item => item.interface === 'wan')['dns-server']) {
					this.data.wan.ipv4dns = networkDump.interface.find(item => item.interface === 'wan')['dns-server'].join()
				}
				//this.data.wan.ipv6 = ipv6.join() || 'n/a'
				//this.data.wan.ipv6pd = wan6['ipv6-prefix'].length ? wan6['ipv6-prefix'][0]['assigned']['lan']['address'] : 'n/a'
				//this.data.wan.ipv6dns = wan6['dns-server'] ? wan6['dns-server'].join() : 'n/a'

				if (wan.data.leasetime !== undefined) {
					this.data.wan.expires = wan.data.leasetime
					this.data.wan.expires = moment.duration(this.data.wan.expires, 'second').format('D [days] H:mm:ss')
				}
				if (wan.uptime !== undefined) {
					this.data.wan.duration = wan.uptime
					this.data.wan.duration = moment.duration(this.data.wan.duration, 'second').format('D [days] H:mm:ss')
				}
				ws.call(RPC.network.wanIfaceStatus).then(({ dict: ifaceStatus }) => {
					const wan_device = ifaceStatus.device
					ws.call(RPC.network.deviceStatus, { name: wan_device }).then(({ dict }) => {
						this.data.wan.mac = dict.macaddr
					})
				})

			}).finally(() => this.basicNetworkForm.loading = false)

		},
		save() {
			if (this.basicNetworkForm.fields.bridge == "on") {
				this.basicNetworkForm.loading = true
				return ws.call(RPC.bridge.on).then(reportSuccess, reportError)
					.then(() => {
						ws.call(RPC.reboot).then(this.basicNetworkForm.loading = false, reportSuccess, reportError)
					})
			}
			else {
				this.basicNetworkForm.loading = true
				return ws.call(RPC.bridge.off).then(reportSuccess, reportError)
					.then(() => {
						ws.call(RPC.reboot).then(this.basicNetworkForm.loading = false, reportSuccess, reportError)
					})
			}
		},

		renewLease() {
			let requests = []

			requests[0] = ws.call(RPC.network.renewWanLease)
			requests[1] = ws.call(RPC.network.renewWan6Lease)

			Promise.all(requests).then(() => {
				QSpinTimer(15)
			}).finally(() => {
				reportSuccess()
			})
		},

		// Spinner() {
		// 	Spin.show({
		// 		render: h => {
		// 			return h('div', this.t('Spin_left', [ '',(15 - this.SpinTime)]).str)
		// 		}
		// 	})
		// 	this.fetchInterval = setInterval(() => {
		// 		this.SpinTime++
		// 		if (this.SpinTime === 15) {
		// 			Spin.hide()
		// 			clearInterval(this.fetchInterval)
		// 			reportSuccess()
		// 			return this.SpinTime = 0
		// 		}
		// 	}, 1000)
		// },
	}
}
</script>
