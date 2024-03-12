<template>
	<section class="section">
		<form :name='basicNetworkForm.name'>
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

				<table class="table-setting-wide" v-if="rtmode != 'bridge' ">
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
										<label class="form-label" for="ipv4-addr-w">{{ t('ipv6-address').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="ipv4-addr-w"><strong>{{ data.wan.ipv6 || 'n/a'
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
			</div>
		</form>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
import { reportSuccess, reportError, QSpinTimer } from '@/shared/functions'

momentDurationFormatSetup(moment)

export default {
	components: {
	},
	data() {
		return {
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
			basicNetworkForm: {
				name: 'basic-network-form',
				loading: false,
				fields: {
					bridge: ""
				},
			},
			rtmode: "",
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.basicNetworkForm.loading = true
			const promises = [ws.call(API.status.lan), ws.call(API.status.mac)]

			Promise.all([
				ws.call(API.feature)
			]).then(([
				{ dict: feature }
			]) => {
				this.rtmode = feature.rtmode

				if (this.rtmode != 'bridge') {
					promises.push(ws.call(API.status.wan))
					promises.push(ws.call(API.status.wan6))
					Promise.all(promises).then(([
						{ dict: lan },
						{ dict: mac },
						{ dict: wan },
						{ dict: wan6 },
					]) => {
						if(lan.up) {
							if (lan['ipv4-address'].length) {
								this.data.lan.ipv4 = lan['ipv4-address'][0].address + '/' + lan['ipv4-address'][0].mask
							}
							if (lan['ipv6-prefix-assignment'].length){
								this.data.lan.ipv6 = lan['ipv6-prefix-assignment'][0]['local-address'].address
								this.data.lan.ipv6_prefix = lan['ipv6-prefix-assignment'][0].address
							}
							this.data.lan.mac = mac.mac
						}
				
						if(wan.up) {
							this.data.wan.ipv4 = wan['ipv4-address'][0].address  + '/' + wan['ipv4-address'][0].mask
							this.data.wan.expires = moment.duration(wan.data.leasetime, 'second').format('D [days] H:mm:ss')
							this.data.wan.duration = moment.duration(wan.uptime, 'second').format('D [days] H:mm:ss')
							this.data.wan.ipv4dns = wan['dns-server'].join(', ')
							this.data.wan.mac = mac.mac
						}

						if(wan6.up){
							this.data.wan.ipv6 = wan6['ipv6-address'][0].address
							this.data.wan.ipv6pd = wan6['ipv6-prefix'][0].address
							this.data.wan.ipv6dns = wan6['dns-server'].join(', ')
						}
					})
					.finally(() => this.basicNetworkForm.loading = false )
				}
				else
				{
					Promise.all(promises).then(([
						{ dict: lan },
						{ dict: mac },
					]) => {
						if(lan.up) {
							if (lan['ipv4-address'].length) {
								this.data.lan.ipv4 = lan['ipv4-address'][0].address + '/' + lan['ipv4-address'][0].mask
							}
							if (lan['ipv6-prefix-assignment'].length){
								this.data.lan.ipv6 = lan['ipv6-prefix-assignment'][0]['local-address'].address
								this.data.lan.ipv6_prefix = lan['ipv6-prefix-assignment'][0].address
							}
							this.data.lan.mac = mac.mac
						}
					})
					.finally(() => this.basicNetworkForm.loading = false )
				}
			})
			.catch(err => reportError(err))
		},
	}
}
</script>
