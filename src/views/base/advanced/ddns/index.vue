<template>
	<section class="section">
		<form v-loading="ddnsForm.loading" :name='ddnsForm.name' @submit.prevent='save()'>
			<div class="table-responsive">
				<table class="table-setting-wide">
					<b-card header-tag="header" footer-tag="footer">
						<template #header>
							<h6 class="mb-0">
								<div class="table-title">{{ t('ddns') }} {{ t('settings').cap }}</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="enabled" v-if="ddnsForm.fields.enabled">{{
											t("enabled").cap }}</label>
										<label class="form-label" for="enabled" v-else>{{ t("disabled").cap }}</label>
									</th>
									<td>
										<div class="form-checkbox">
											<input type="checkbox" id="enabled" class="checkbox"
												v-model='ddnsForm.fields.enabled'>
											<label class="label" for="enabled">checkbox label</label>
										</div>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="provider">{{ t("service-provider").cap }}</label>
									</th>
									<td>
										<select class="form-select" v-model='ddnsForm.fields.provider'
											:disabled='!ddnsForm.fields.enabled'>
											<option v-for='item in providerOptions' :value='item.value' :key='item.value'>
												{{ item.label }}
											</option>
										</select>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="username">{{ t("username").cap }}</label>
									</th>
									<td>
										<input type="text" class="form-control" name="username" id="username"
											v-model='ddnsForm.fields.username' :disabled='!ddnsForm.fields.enabled'>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" v-if='ddnsForm.fields.provider == "duckdns.org"'>
											{{ t("token").cap }}
										</label>
										<label class="form-label" v-else>
											{{ t("password").cap }}
										</label>
									</th>
									<td>
										<div class="form-password-wrap" :class='showPassword ? "" : "type-view"'>
											<input class="form-control" id="password" name="password"
												v-model='ddnsForm.fields.password' :disabled='!ddnsForm.fields.enabled'
												:type='showPassword.new ? "text" : "password"'>
											<span class="icon-view-passowrd" @click="togglePassword('new')"></span>
										</div>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="hostname">{{ t("hostname").cap }}</label>
									</th>
									<td>
										<input type="text" class="form-control" id="hostname" name="hostname"
											v-model='ddnsForm.fields.hostname' :disabled='!ddnsForm.fields.enabled'>
									</td>
								</tr>
								<tr v-if="false">
									<th>
										<label class="form-label" for="ip_source">{{ t("ddns-ip-source").cap }}</label>
									</th>
									<td>
										<select class="form-select" v-model='ddnsForm.fields.ipsource'
											:disabled='!ddnsForm.fields.enabled' name='ip_source'>
											<option v-for='item in ipSourceOptions' :value='item.value' :key='item.value'>
												{{ item.label }}
											</option>
										</select>
									</td>
								</tr>
							</tbody>
						</b-card-text>
					</b-card>
				</table>
			</div> <!-- /.table-responsive -->
			<div class="btn-area btn-setting-area">
				<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
			</div>
		</form>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { fillObject, reportSuccess, reportError, getSubObject, trackFields } from '@/shared/functions'

export default {
	components: {
	},
	data() {
		return {
			ddnsForm: {
				name: 'ddns-form',
				loading: false,
				fields: {
					enabled: false,
					//allow_https_from_wan: false,
					provider: '',
					username: '',
					password: '',
					hostname: '',
					//ipsource: 'public',
				},
				ddns_ip: null,
			},
			providerOptions: [
				{label: 'DYNDNS (www.dyn.com)', value: 'dyn.com'},
				{label: 'No-IP (www.no-ip.com)', value: 'noip.com'},
				{label: 'FreeDNS (freedns.afraid.org)', value: 'freedns.afraid.org'},
				{label: 'DYNU DNS (www.dynu.com)', value: 'dynu.com'},
				{label: 'Change IP DNS (www.changeip.com)', value: 'changeip.com'},
				{label: 'DuckDNS (www.duckdns.org)', value: 'duckdns.org'},
				{label: 'DNS-O-Matic (www.dnsomatic.com)', value: 'dnsomatic.com'}
			],
			ipSourceOptions: [
				{ label: this.t('ddns-public-ip').cap, value: 'public' },
				{ label: this.t('ddns-wan-if-ip').cap, value: 'interface' }
			],
			showPassword: {
				new: false,
				old: false,
				repeat: false
			},
			fetchInterval: '',
			SpinTime: 0
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.ddnsForm.loading = true
			ws.call(API.ddns.get).then(({ dict: data }) => {
				fillObject(this.ddnsForm.fields, data)
			}).catch(err => reportError(err))
				.finally(() => {
					this.ddnsForm.loading = false
					//this.getSentIP()
				})
		},
		async save() {
			const requests = []

			const params = {
				enabled: this.ddnsForm.fields.enabled.toString() == "true" ? '1' : '0',
				provider: this.ddnsForm.fields.provider,
				username: this.ddnsForm.fields.username,
				password: this.ddnsForm.fields.password,
				hostname: this.ddnsForm.fields.hostname
			}

			const rule_params = {
				"Access-HTTP-WAN" : params.enabled,
				"Access-HTTPS-WAN" : params.enabled,
			}

			requests[0] = ws.call(API.ddns.put, params)
			requests[1] = ws.call(API.access_control.put, rule_params)

			this.ddnsForm.loading = true
			Promise.all(requests).then(() => {
				ws.call(API.commit)
			}).finally(() => {
				this.ddnsForm.loading = false
			})
/*
			Promise.all(requests).then(([, { dict: status }]) => {
				if (
					(this.ddnsForm.fields.enabled && status.ddns === 'started') ||
					(!this.ddnsForm.fields.enabled && status.ddns === 'stopped')
				) {
					this.$store.commit('UNSTAGE_FORM', {
						formName: this.ddnsForm.name
					})
				}
				else {
					reportError({ desc: this.t('conn-error').cap })
				}
			})
				//.catch(err => reportError(err))
				.finally(() => {
					reportSuccess()
					// this.ddnsForm.loading = false
					setTimeout(() => {
						this.getSentIP()
						this.restartDDNS()
					}, 5000)
				})
*/
		},
		getSentIP() {
			ws.call(RPC.ddns.info).then(({ dict: info }) => {
				if (info.ddns_ip !== "N/A") {
					this.ddnsForm.ddns_ip = info.ddns_ip
				}
				else {
					this.ddnsForm.ddns_ip = null
				}
			})
		},
		togglePassword(field, e) {
			this.showPassword[field] = !this.showPassword[field]
		},
		restartDDNS() {
			//this.ddnsForm.loading = true
			setTimeout(() => {
				this.ddnsForm.loading = false
			}, 5000)
			ws.call(RPC.ddns.restart)
		},
	}
}
</script>
