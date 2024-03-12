<template>
	<section class="section">
		<form :name='form.name' @submit.prevent v-loading="loading">

			<div class="table-title">{{ t('dns-settings') }}</div>
			<p class="text-sm text-info" v-if="froze_set">
				<strong>{{ t('dnsv4-error') }}</strong>
			</p>
			<table class="table-setting-wide">
			<!--
				<tr>
					<th>
						<label class="form-label" for="enabled_1_dns"
							v-if="form.fields.useUserDns">{{ t("enabled").cap }}</label>
						<label class="form-label" for="enabled_2_dns" v-else>{{ t("disabled").cap }}</label>
					</th>
					<td>
						<div class="form-checkbox">
							<input type="checkbox" id="enabled_dns" class="checkbox" v-model='form.fields.useUserDns'
								:true-value='true' :false-value='false' :disabled="froze_set">
							<label class="label" for="enabled_dns">checkbox label</label>
						</div>
					</td>
				</tr>
			-->

				<tr>
					<th>
						<label class="form-label" for="pri-dns">{{ t("primary-dns").cap }}</label>
					</th>
					<td>
						<input type="text" class="form-control" id="primarydns" v-model='form.fields.primaryDns'
							:disabled="froze_set">
					</td>
				</tr>

				<tr>
					<th>
						<label class="form-label" for="sec-dns">{{ t("secondary-dns").cap }}</label>
					</th>
					<td>
						<input type="text" class="form-control" id="seconddns" v-model='form.fields.secondaryDns'
							:disabled="froze_set">
					</td>
				</tr>
			</table>

			<div class="btn-area btn-setting-area">
				<button @click="save" class="btn btn-secondary" type="submit" v-if="!(froze_set)">{{
					t('save').cap }}</button>
			</div>

		</form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import { reportSuccess, reportError, QSpinshow, QSpinhide } from '@/shared/functions'
import val_ip from '@/shared/validators/ip.js'

export default {
	data() {
		return {
			form: {
				name: 'dns-form',
				fields: {
					primaryDns: '',
					secondaryDns: '',
					useUserDns: false
				}
			},
			loading: false,
			froze_set: false,
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.loading = true

			const params = {
				section: 'lan'
			}

			Promise.all([
				ws.call(API.dhcp.get),
				//ws.call(RPC.network.get, { type: 'interface', section: 'wan' }),
				//ws.call(RPC.network.get, { type: 'interface', section: 'wan6' })
			]).then(([
				{ dict: dhcp },
				//{ dict: wan },
				//{ dict: wan6 }
			]) => {
				if (dhcp.dhcp_option) {
					let optionArray = JSON.stringify(dhcp.dhcp_option).split('"')
					optionArray.forEach((value) => {
						if (value.startsWith("6,")) {
							let dnsArray = value.split(',')
							this.form.fields.primaryDns = dnsArray[1] || ''
							this.form.fields.secondaryDns = dnsArray[2] || ''
						}
					})
				}
				else {
					this.form.fields.primaryDns = ''
					this.form.fields.secondaryDns = ''
					this.form.fields.useUserDns = false
				}

				/*
				if (dhcp.use_wan_dns && dhcp.use_wan_dns == 1) {
					this.form.fields.useUserDns = false
				}
				else {
					this.form.fields.useUserDns = true
				}

				if (wan6 && wan6.values.proto === 'dhcpv6' && wan && wan.values.proto === 'none') {
					this.froze_set = true
				}
				else {
					this.froze_set = false
				}
				*/

			}, reportError).finally(() => this.loading = false)
		},
		save() {
			let requests = []

			const params = {
				dhcp_option: this.form.fields.primaryDns + "," + this.form.fields.secondaryDns
			}

			if (this.form.fields.primaryDns.length > 0) {
				if (val_ip(this.form.fields.primaryDns)) {
					reportError(this.t('primary-dns') + " : " + this.t('err.validation.ip-1').cap)
					return
				}
			}

			else if (this.form.fields.secondaryDns.length > 0) {
				if (val_ip(this.form.fields.secondaryDns)) {
					reportError(this.t('secondary-dns') + " : " + this.t('err.validation.ip-1').cap)
					return
				}
			}

			requests.push(ws.call(API.dhcp.set, params))
			Promise.all(requests)
			.then(() => { 
				//ws.call(API.network.commit),
				ws.call(API.dhcp.commit)
			})
			.finally(() => {
				this.loading = false
				reportSuccess()
			}, reportError)
		},
	}
}
</script>
