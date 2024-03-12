<template>
	<section class="section">
		<form
			:name='wpsStatus.name'
			@submit.prevent='reportPbc()'>
			<div class="table-responsive">
					<div class="table-title">
						{{t('wifi-protected-setup')}}
					</div>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="wps_instruct_1">1. {{ t('wps-btn-instructions-1-1').cap }}</label>
											</th>
											<td></td>
									</tr>
									<tr>
											<th>
													<label class="form-label" for="wps_instruct_2">2. {{ t('wps-btn-instructions-2-1').cap }}</label>
											</th>
											<td></td>
									</tr>
									<button @click='reportPbc' class="btn btn-secondary">{{ t('register').cap }}</button>
									<tr>
											<th>
													<label class="form-label" for="wps_instruct_3">3. {{ t('wps-btn-instructions-3').cap }}</label>
											</th>
											<td></td>
									</tr>
									<hr>
							</tbody>
					<div class="table-title">
						{{t('wps-status')}}
					</div>

					<div v-loading="wpsForm.loading">
						<p>{{ wpsStatus.wl1.name }} 
							<span v-if='wpsStatus.wl1 && wpsStatus.wl1.status === "Active"' class="circleWPSenabled" />
							<span v-else class="circleWPSdisabled" />
						</p>

						<p class='u-type--eta u-spc-left--med'>{{ wpsStatus.wl0.name }}
							<span v-if='wpsStatus.wl0 && wpsStatus.wl0.status === "Active"' class="circleWPSenabled" />
							<span v-else class="circleWPSdisabled" />
						</p>
					</div>
			</div>
		</form>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC } from '@/shared/constants'
import MainPage from "../main/index"
import { QSpinshow, QSpinhide} from '@/shared/functions'

export default {
	components: {
		MainPage
	},
	data () {
		return {
			list: [
				'main-wifi'
			],
			pageLoading: false,
			wpsStatus:  {
				name: 'wps-status',
				wl0: {
					name: '',
					hwmode: ''
				},
				wl1: {
					name: '',
					hwmode: ''
				}
			},
			tabs: [
				{
					label: this.t('method-1-wps-btn').cap,
					id: 'btn'
				},
			],
			currentTab: 'btn',
			wpsForm: {
				name: 'wps-form',
				loading: false,
				fields: {
					pin: ''
				}
			},
			apPin: '',
			statusInterval: ''
		}
	},
	mounted () {
		this.wpsForm.loading = true
		this.statusInterval = setInterval(() => {
			this.getStatusAndApPin()	
		}, 2000)
	},
	methods: {
		getStatusAndApPin () {
			ws.call(RPC.wireless.wps.getStatus)
				.then(({ dict }) => {
					this.wpsStatus = dict.result
					this.wpsStatus.wl0.name = this.wpsStatus.wl0.hwmode === '11a' ? this.t('wifi-5.0-ghz').cap : this.t('wifi-2.4-ghz').cap
					this.wpsStatus.wl1.name = this.wpsStatus.wl1.hwmode === '11a' ? this.t('wifi-5.0-ghz').cap : this.t('wifi-2.4-ghz').cap
				})
			ws.call(RPC.wireless.wps.getApPin)
				.then(({ dict }) => {
					this.apPin = dict.result
				})
			this.wpsForm.loading = false
		},
		setApPin () {
			ws.call(RPC.wireless.wps.setApPin)
				.then(({ dict }) => {
					this.apPin = dict.result
				})
		},
		isPinValid (pin) {
			return !isNaN(pin) && (pin.length === 4 || pin.length === 8)
		},
		reportPbc () {
			QSpinshow()

			ws.call(RPC.wireless.wps.reportPbc)
				.catch(reportError)
				.finally(() => {
					this.getStatusAndApPin()
					QSpinhide()
				})
		},
		async save () {
			QSpinshow()

			ws.call(RPC.wireless.wps.reportPin, this.wpsForm.fields)
				.then(({ dict }) => {
					if (dict.result === 'ok') {
						reportSuccess()
					}
					else {
						reportError(this.t('wrong-wps-pin').cap)
					}
				}, reportError)
				.finally(() => QSpinhide())
		}
	},
	beforeDestroy () {
		if (this.statusInterval) {
			clearInterval(this.statusInterval)
		}
	}
}
</script>
<style scoped>
.circleWPSenabled {
	display: inline-block;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    margin-left: 5px;
	margin-bottom: -3px;
    background-color: #1fbb46;
}
.circleWPSdisabled {
	display: inline-block;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    margin-left: 5px;
	margin-bottom: -3px;
    background-color: color(black a(0.2));
}
</style>