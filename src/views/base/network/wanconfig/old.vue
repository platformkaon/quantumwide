<template>
	<section class="section">
		<form :name='wanForm.name' @submit.prevent v-loading="loading">
			<div class="table-responsive">
				<div class="table-title">
					{{ t('wide-area-network-settings') }} ({{ t('wan') }})
				</div>
				<table class="table-setting-wide table-setting-checkbox-group">
					<tr>
						<td>
							<div class="checkbox-list-flex">
								<div class="form-check">
									<el-radio label="dhcp" id="auto-ip" name='auto' value="dhcp"
										v-model='wanForm.fields.proto' @change="protoChange()">
										{{ t('obtain-ip-auto').cap }}
									</el-radio>
								</div>
							</div>
							<div class="checkbox-list-flex">
								<div class="form-check">
									<el-radio label="static" id="static-ip" name='static' value="static"
										v-model='wanForm.fields.proto' @change="protoChange_reverse()">
										{{ t('use-static-ip').cap }}
									</el-radio>
								</div>
							</div>
							<div class="checkbox-list-flex" v-if="false">
								<div class="form-check">
									<input style="margin-left: 5px; margin-top: 5px; zoom:1.8;" type="radio" class="radio"
										id="dslite-ip" name='dslite' value="dslite" v-model='wanForm.fields.proto'
										@change="protoChange()">
									<label class="radio-check-label" for="dslite-ip"> DS-Lite </label>
									<label class="radio-check" for="dslite-ip"></label>
								</div>
							</div>
						</td>
					</tr>
				</table>
				<hr>
				<table class="table-setting-wide" v-show="wanForm.fields.proto === 'static'">
					<tr>
						<th>
							<label class="form-label" for="wan-ip">{{ t('wan-ip-address').cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="wan-address" v-model='wanForm.fields.ipaddr'>
						</td>
					</tr>

					<tr>
						<th>
							<label class="form-label" for="wan-sub">{{ t('wan-subnet-mask').cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="wan-subnet-mask" v-model='wanForm.fields.netmask'>
						</td>
					</tr>

					<tr>
						<th>
							<label class="form-label" for="wan-gt">{{ t('wan-gateway-ip').cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="wan-gateway-ip" v-model='wanForm.fields.gateway'>
						</td>
					</tr>

					<tr>
						<th>
							<label class="form-label" for="wan-pri-dns">{{ t('primary-dns').cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="primarydns" v-model='wanForm.primaryDns'>
						</td>
					</tr>

					<tr>
						<th>
							<label class="form-label" for="wan-sec-dns">{{ t("secondary-dns").cap }} ({{ t('optional').cap
							}})</label>
						</th>
						<td>
							<input type="text" class="form-control" id="secondarydns" v-model='wanForm.secondaryDns'>
						</td>
					</tr>

					<tr>
						<th>
							<label class="form-label" for="wan-trd-dns">{{ t("tertiary-dns").cap }} ({{ t('optional').cap
							}})</label>
						</th>
						<td>
							<input type="text" class="form-control" id="tertiarydns" v-model='wanForm.tertiaryDns'>
						</td>
					</tr>
				</table>
			</div>

			<div class="btn-area btn-setting-area">
				<button @click="save" class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
			</div>

		</form>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC } from '@/shared/constants'
import { fillObject, trackFields, reportSuccess, reportError, QSpinshow, QSpinhide } from '@/shared/functions'

const SECTION = 'wan'
const TYPE = 'interface'

export default {
	data() {
		return {
			wanForm: {
				name: 'wan-form',
				fields: {
					proto: 'dhcp',
					ipaddr: '',
					netmask: '',
					gateway: '',
					dns: []
				},
				primaryDns: '',
				secondaryDns: '',
				tertiaryDns: '',
				staticFields: []
			},
			// [kaon] Variables to store temporary values @jiwan
			temp_wanForm: {
				name: 'wan-form',
				fields: {
					proto: 'dhcp',
					ipaddr: '',
					netmask: '',
					gateway: '',
					dns: []
				},
				primaryDns: '',
				secondaryDns: '',
				tertiaryDns: '',
				staticFields: []
			},
			saver: {
				trgger: '0'
			},
			loading: false
		}
	},
	mounted() {
		this.fetchData()
	},

	methods: {
		// [kaon] Change the value normally even when refresh and re-reset @jiwan
		protoChange() {
			if (this.wanForm.fields.proto === 'dhcp' || this.wanForm.fields.proto === 'dslite') {
				this.temp_wanForm.fields.ipaddr = this.wanForm.fields.ipaddr
				this.temp_wanForm.fields.netmask = this.wanForm.fields.netmask
				this.temp_wanForm.fields.gateway = this.wanForm.fields.gateway
				this.temp_wanForm.primaryDns = this.wanForm.primaryDns
				this.temp_wanForm.secondaryDns = this.wanForm.secondaryDns
				this.temp_wanForm.tertiaryDns = this.wanForm.tertiaryDns
				if (this.wanForm.fields.proto === 'dhcp' || this.wanForm.fields.proto === 'dslite') {
					this.wanForm.fields.ipaddr = ''
					this.wanForm.fields.netmask = ''
					this.wanForm.fields.gateway = ''
					this.wanForm.primaryDns = ''
					this.wanForm.secondaryDns = ''
					this.wanForm.tertiaryDns = ''
				}
			}
		},
		// [kaon] Description: To change the initial value, change the value after wanForm.fields~ = @jiwan
		protoChange_reverse() {
			if (this.wanForm.fields.proto === 'static') {
				this.wanForm.fields.ipaddr = this.temp_wanForm.fields.ipaddr
				this.wanForm.fields.netmask = this.temp_wanForm.fields.netmask
				this.wanForm.fields.gateway = this.temp_wanForm.fields.gateway
				this.wanForm.primaryDns = this.temp_wanForm.primaryDns
				this.wanForm.secondaryDns = this.temp_wanForm.secondaryDns
				this.wanForm.tertiaryDns = this.temp_wanForm.tertiaryDns
				if (this.wanForm.fields.ipaddr === "") {
					this.wanForm.fields.ipaddr = '0.0.0.0'
					this.wanForm.fields.netmask = '255.255.255.0'
					this.wanForm.fields.gateway = '0.0.0.0'
					this.wanForm.primaryDns = '8.8.8.8'
					this.wanForm.secondaryDns = '8.8.4.4'
					this.wanForm.tertiaryDns = '0.0.0.0'
				}
			}
		},
		fetchData() {
			this.loading = true

			const params = {
				section: SECTION,
				type: TYPE,
			}
			ws.call(RPC.network.get, params).then(({ dict }) => {
				const fields = dict.values
				fillObject(this.wanForm.fields, fields)
				if (dict.values.dns && dict.values.dns.length) {
					this.wanForm.primaryDns = dict.values.dns[0]
					this.wanForm.secondaryDns = dict.values.dns[1]
					this.wanForm.tertiaryDns = dict.values.dns[2]
				}

				['ipaddr', 'netmask', 'gateway'].forEach(f => {
					if (fields[f] && fields[f].length) {
						this.wanForm.staticFields.push(f)
					}
				})
				this.untrackFields = trackFields.call(this, 'wanForm')
			}).catch(reportError).finally(() => this.loading = false)
		},
		async save() {
			let dnsArray = []
			let requests = []

			if (this.wanForm.primaryDns) dnsArray.push(this.wanForm.primaryDns)
			if (this.wanForm.secondaryDns) dnsArray.push(this.wanForm.secondaryDns)
			if (this.wanForm.tertiaryDns) dnsArray.push(this.wanForm.tertiaryDns)

			const fields = this.$store.getters.nonEmptyFieldsValues(this.wanForm.name)

			let deleteFields = []
			fields.proto = this.wanForm.fields.proto

			// clean up static fields
			// [kaon] I gave a trigger, but it doesn't work because I have nothing to write TBD @jiwan
			if (fields.proto === 'dhcp' || fields.proto === 'dslite') {
				deleteFields = []
				deleteFields.push(...this.wanForm.staticFields)
				this.saver.trgger = 0
			}

			// add dnsArray to call
			if (dnsArray.length) {
				fields['dns'] = dnsArray
			}

			// remove empty DNS addresses
			if (!dnsArray.length && this.wanForm.fields.dns.length) {
				deleteFields.push('dns')
				if (fields.dns && !fields.dns.length) {
					delete fields.dns
					this.wanForm.fields.dns = []
				}
			}

			const params = {
				section: SECTION,
				values: fields
			}
			requests.push(ws.call(RPC.network.set, params))

			if (deleteFields.length) {
				const params = {
					section: SECTION,
					options: deleteFields,
				}
				requests.push(ws.call(RPC.network.delete, params))
			}
			if (requests.length) {
				QSpinshow()
				Promise.all(requests).then(() => {
					ws.call(RPC.network.restart)
					QSpinhide()
					reportSuccess()
				}).catch(reportError).finally(() => this.fetchData())
			}
		},
	},
}
</script>
