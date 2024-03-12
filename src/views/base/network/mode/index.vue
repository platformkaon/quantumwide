<template>
	<section class="section">
		<form :name='modeForm.name' @submit.prevent v-loading="loading">
			<div class="table-responsive">
				<div class="table-title">
					{{ t('mode') }} {{ t('settings') }}
				</div>
				<table class="table-setting-wide table-setting-checkbox-group">
					<tr>
						<td>
							<div class="checkbox-list-flex">
								<div class="form-check">
									<input style="margin-left: 5px; margin-top: 5px; zoom:1.8;" type="radio" class="radio"
										id="mode_ipv4" name='mode_ipv4' value="2" v-model='modeForm.fields.mode_ipv4'
										@change="protoChange2()">
									<label class="radio-check-label" for="mode_ipv4">&nbsp;&nbsp;&nbsp;{{ t('ipv4').str
									}}</label>
									<label class="radio-check" for="mode_ipv4"></label>
								</div>
							</div>
							<div class="checkbox-list-flex">
								<div class="form-check">
									<input style="margin-left: 5px; margin-top: 5px; zoom:1.8;" type="radio" class="radio"
										id="mode_ipv6" name='mode_ipv6' value="3" v-model='modeForm.fields.mode_ipv6'
										@change="protoChange3()">
									<label class="radio-check-label" for="mode_ipv6">&nbsp;&nbsp;&nbsp;{{ t('ipv6').str
									}}</label>
									<label class="radio-check" for="mode_ipv6"></label>
								</div>
							</div>
							<div class="checkbox-list-flex">
								<div class="form-check">
									<input style="margin-left: 5px; margin-top: 5px; zoom:1.8;" type="radio" class="radio"
										id="mode_dual" name='mode_dual' value="4" v-model='modeForm.fields.mode_dual'
										@change="protoChange4()">
									<label class="radio-check-label" for="mode_dual">&nbsp;&nbsp;&nbsp;{{ t('ipv4').str +
										"&nbsp;" + "/" + "&nbsp;" + t('ipv6').str }}</label>
									<label class="radio-check" for="mode_dual"></label>
								</div>
							</div>
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
import { MessageBox } from 'element-ui';

export default {
	data() {
		return {
			modeForm: {
				name: 'wan-form',
				fields: {
					mode_ipv4: '0',
					mode_ipv6: '0',
					mode_dual: '0',
					mode_org: '0',
				},
				wanFields: {
					proto: 'none'
				},
				wan6Fields: {
					proto: 'dhcpv6'
				},
				ertFields: {
					ip_prov_mode: 'ipv6'
				},
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
		protoChange2() {
			this.modeForm.fields.mode_ipv4 = '2'
			this.modeForm.fields.mode_ipv6 = '0'
			this.modeForm.fields.mode_dual = '0'
			this.modeForm.wanFields.proto = 'dhcp'
			this.modeForm.wan6Fields.proto = 'none'
			this.modeForm.ertFields.ip_prov_mode = 'ipv4'
		},
		protoChange3() {
			this.modeForm.fields.mode_ipv4 = '0'
			this.modeForm.fields.mode_ipv6 = '3'
			this.modeForm.fields.mode_dual = '0'
			this.modeForm.wanFields.proto = 'none'
			this.modeForm.wan6Fields.proto = 'dhcpv6'
			this.modeForm.ertFields.ip_prov_mode = 'ipv6'
		},
		protoChange4() {
			this.modeForm.fields.mode_ipv4 = '0'
			this.modeForm.fields.mode_ipv6 = '0'
			this.modeForm.fields.mode_dual = '4'
			this.modeForm.wanFields.proto = 'dhcp'
			this.modeForm.wan6Fields.proto = 'dhcpv6'
			this.modeForm.ertFields.ip_prov_mode = 'dual'
		},
		fetchData() {
			this.loading = true
			Promise.all([
				ws.call(RPC.network.get, { type: 'interface', section: 'wan' }),
				ws.call(RPC.network.get, { type: 'interface', section: 'wan6' })
			]).then(([
				{ dict: _wan },
				{ dict: _wan6 }
			]) => {
				this.modeForm.fields.mode_ipv4 = '0'
				this.modeForm.fields.mode_ipv6 = '0'
				this.modeForm.fields.mode_dual = '0'

				if (_wan.values.proto === 'dhcp' && _wan6.values.proto === 'none') {
					this.modeForm.fields.mode_ipv4 = '2'
					this.modeForm.fields.mode_org = '2'
				}
				else if (_wan.values.proto === 'none' && _wan6.values.proto === 'dhcpv6') {
					this.modeForm.fields.mode_ipv6 = '3'
					this.modeForm.fields.mode_org = '3'
				}
				else if (_wan.values.proto === 'dhcp' && _wan6.values.proto === 'dhcpv6') {
					this.modeForm.fields.mode_dual = '4'
					this.modeForm.fields.mode_org = '4'
				}
			}).finally(() => this.loading = false)
		},
		async save() {
			let requests = []
			const paramWan = {
				section: 'wan',
				values: this.modeForm.wanFields,
			}
			const paramWan6 = {
				section: 'wan6',
				values: this.modeForm.wan6Fields,
			}
			const paramErouter = {
				section: 'erouter',
				values: this.modeForm.ertFields,
			}
			if (this.modeForm.fields.mode_ipv4 === '2' && this.modeForm.fields.mode_org === '2') {
				return
			}
			if (this.modeForm.fields.mode_ipv6 === '3' && this.modeForm.fields.mode_org === '3') {
				retturn
			}
			if (this.modeForm.fields.mode_dual === '4' && this.modeForm.fields.mode_org === '4') {
				return
			}

			requests.push(ws.call(RPC.network.set, paramWan))
			requests.push(ws.call(RPC.network.set, paramWan6))
			requests.push(ws.call(RPC.network.set, paramErouter))
			if (this.modeForm.fields.mode_ipv4 === '2') {
				requests.push(ws.call(RPC.network.fwIpprovMode2))
			} else if (this.modeForm.fields.mode_ipv6 === '3') {
				requests.push(ws.call(RPC.network.fwIpprovMode3))
			} else if (this.modeForm.fields.mode_dual === '4') {
				requests.push(ws.call(RPC.network.fwIpprovMode4))
			}

			MessageBox.alert(this.t('reboot-required'), this.t('info').cap, {
				confirmButtonText: this.t('ok'),
				type: 'info',
				center: false,
				roundButton: true
			}).then(() => {
				// ok button
				if (requests.length) {
					QSpinshow()
					Promise.all(requests).then(() => {
						QSpinhide()
						ws.call(RPC.network.restart);
						reportSuccess()
					}).catch(reportError).finally(() => this.fetchData())
				}
			})
				.catch(() => {
					return
				});
		}
	},
}
</script>
