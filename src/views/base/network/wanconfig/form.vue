<template>
	<section class="layer-popup-wrap">
		<form :name='interface.name' :loading='interface.loading' :actions='false' @submit.prevent='saveRule'>
			<div class="layer-popup">
				<div class="layer-content none-min-width">
					<div class="layer-header">
						<div class="layer-title">
							<div class="title">{{ t(`${section ? 'edit' : 'add'}-interface`) }}</div>
						</div>
						<div class="close" @click='closeForm'>close</div>
					</div> <!-- /.layer-header -->
					<div class="layer-body form-container">
						<div class="table-responsive">
							<div class="table-title font-weight-normal">WAN Setup</div>
							<table class="table-setting">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="description">{{ t("description").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="desc" v-model='interface.fields.desc'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="interface-type">{{ t("interface-type").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='interface.fields.interface_type'>
												<option v-for="item in interfaceTypeOption" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="service-type">{{ t("service-type").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='interface.fields.stype'>
												<option v-for="item in serviceTypeOption" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="protocol">{{ t("protocol").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='interface.fields.ipver'>
												<option v-for="item in protoOptions" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="default-gateway">{{ t("default-gateway").cap  }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" id="default-gateway" class="checkbox" v-model='interface.fields.defaultroute'
												true-value='1' false-value='0'>
												<label class="label" for="default-gateway">checkbox label</label>
											</div>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="vlan-operation-mode">{{ t("vlan-operation-mode").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='interface.fields.dtype'>
												<option v-for="item in vlanOperationModeOptions" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="vid">{{ t("vlan-id").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" placeholder='1~4094' id="vid"
												v-model='interface.fields.vid' :disabled="interface.fields.dtype === 'untagged'">
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="priority">{{ t("priority").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='interface.fields.priority' :disabled="interface.fields.dtype === 'untagged'">
												<option v-for="item in priorityOptions" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr v-if="interface.fields.stype === 'pppoe'">
										<th>
											<label class="form-label" for="username">{{ t("username").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" placeholder='' id="username"
												v-model='interface.fields.username'>
										</td>
									</tr>
									<tr v-if="interface.fields.stype === 'pppoe'">
										<th>
											<label class="form-label" for="password">{{ t("password").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" placeholder='' id="password"
												v-model='interface.fields.password'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="max-mtu-size">{{ t("mtu").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="mtu"
												v-model='interface.fields.mtu'>
										</td>
									</tr>
								</tbody>
							</table>
							<div class="table-title font-weight-normal mt-4" v-if="interface.fields.ipver != 'ipv6'">IPv4
								<table class="table-setting">
									<tbody>
										<tr>
											<th>
												<label class="form-label" for="connection-type">{{ t("connection-type").cap }}</label>
											</th>
											<td>
												<select class="form-select" v-model='interface.fields.ip4proto' :disabled="interface.fields.ipver == 'ipv6'">
													<option v-for="item in ipv4ConnectionType" :value="item.value" :key="item.value">
														{{ item.label }}
													</option>
												</select>
											</td>
										</tr>
										<tr v-if="interface.fields.ip4proto === 'static'">
											<th>
												<label class="form-label" for="ipv4-address">{{ t("ipv4-address").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="ipaddr" :disabled="interface.fields.ipver == 'ipv6'"
													v-model='interface.fields.ipaddr'>
											</td>
										</tr>
										<tr v-if="interface.fields.ip4proto === 'static'">
											<th>
												<label class="form-label" for="netmask">{{ t("subnet-mask").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="netmask" :disabled="interface.fields.ipver == 'ipv6'"
													v-model='interface.fields.netmask'>
											</td>
										</tr>
										<tr v-if="interface.fields.ip4proto === 'static'">
											<th>
												<label class="form-label" for="gateway">{{ t("gateway").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="gateway" :disabled="interface.fields.ipver == 'ipv6'"
													v-model='interface.fields.gateway'>
											</td>
										</tr>
										<tr v-if="interface.fields.ip4proto === 'static'">
											<th>
												<label class="form-label" for="primary-dns">{{ t("primary-dns").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="ipv4_dns_primary_server" :disabled="interface.fields.ipver == 'ipv6'"
													v-model='interface.fields.ipv4_dns_primary_server'>
											</td>
										</tr>
										<tr v-if="interface.fields.ip4proto === 'static'">
											<th>
												<label class="form-label" for="secondary-dns">{{ t("secondary-dns").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="ipv4_dns_secondary_server" :disabled="interface.fields.ipver == 'ipv6'"
													v-model='interface.fields.ipv4_dns_secondary_server'>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="table-title font-weight-normal mt-4" v-if="interface.fields.ipver != 'ipv4'">IPv6
								<table class="table-setting">
									<tbody>
										<tr>
											<th>
												<label class="form-label" for="connection-type">{{ t("connection-type").cap }}</label>
											</th>
											<td>
												<select class="form-select" v-model='interface.fields.ip6proto' :disabled="interface.fields.ipver == 'ipv4'">
													<option v-for="item in ipv6ConnectionType" :value="item.value" :key="item.value">
														{{ item.label }}
													</option>
												</select>
											</td>
										</tr>
										<tr v-if="interface.fields.ip6proto != 'static'">
											<th>
												<label class="form-label" for="prefix-deligation">{{ t("prefix-deligation").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="prefix-deligation" class="checkbox" v-model='interface.fields.reqprefix' :disabled="interface.fields.ipver == 'ipv4'"
													true-value='0' false-value='no'>
													<label class="label" for="prefix-deligation">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr v-if="interface.fields.ip6proto != 'static'">
											<th>
												<label class="form-label" for="noslaaconly">{{ t("slaac").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="noslaaconly" class="checkbox" v-model='interface.fields.noslaaconly' :disabled="interface.fields.ipver == 'ipv4'"
													true-value='0' false-value='1'>
													<label class="label" for="noslaaconly">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr v-if="interface.fields.ip6proto === 'static'">
											<th>
												<label class="form-label" for="ipv6-address">{{ t("ipv6-address").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="ip6addr" :disabled="interface.fields.ipver == 'ipv4'"
													v-model='interface.fields.ip6addr'>
											</td>
										</tr>
										<tr v-if="interface.fields.ip6proto === 'static'">
											<th>
												<label class="form-label" for="prefix-length">{{ t("prefix-length").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="ip6prefix" :disabled="interface.fields.ipver == 'ipv4'"
													v-model='interface.fields.ip6prefix'>
											</td>
										</tr>
										<tr v-if="interface.fields.ip6proto === 'static'">
											<th>
												<label class="form-label" for="gateway">{{ t("gateway").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="ip6gw" :disabled="interface.fields.ipver == 'ipv4'"
													v-model='interface.fields.ip6gw'>
											</td>
										</tr>
										<tr v-if="interface.fields.ip6proto === 'static'">
											<th>
												<label class="form-label" for="dns-primary-server">{{ t("primary-dns").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="ipv6_dns_primary_server" :disabled="interface.fields.ipver == 'ipv4'"
													v-model='interface.fields.ipv6_dns_primary_server'>
											</td>
										</tr>
										<tr v-if="interface.fields.ip6proto === 'static'">
											<th>
												<label class="form-label" for="dns-secondary-server">{{ t("secondary-dns").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="ipv6_dns_secondary_server" :disabled="interface.fields.ipver == 'ipv4'"
													v-model='interface.fields.ipv6_dns_secondary_server'>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="table-title font-weight-normal mt-4">Multicast</div>
							<table class="table-setting">
								<tbody>
									<tr v-if="interface.fields.ipver != 'ipv6'">
										<th>
											<label class="form-label" for="multicast-source">{{ t("multicast-source").cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" id="multicast_source" class="checkbox" v-model='interface.fields.igmp_mcast_source'
												true-value='1' false-value='0'>
												<label class="label" for="multicast_source">checkbox label</label>
											</div>
										</td>
									</tr>
									<tr v-if="interface.fields.ipver != 'ipv6'">
										<th>
											<label class="form-label" for="igmp-proxy">{{ t("igmp-proxy").cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" id="igmp" class="checkbox" v-model='interface.fields.igmp_proxy'
												true-value='1' false-value='0'>
												<label class="label" for="igmp">checkbox label</label>
											</div>
										</td>
									</tr>
									<tr v-if="interface.fields.ipver != 'ipv4'">
										<th>
											<label class="form-label" for="mld-source">{{ t("mld-source").cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" id="mld_source" class="checkbox" v-model='interface.fields.mld_mcast_source'
												true-value='1' false-value='0'>
												<label class="label" for="mld_source">checkbox label</label>
											</div>
										</td>
									</tr>
									<tr v-if="interface.fields.ipver != 'ipv4'">
										<th>
											<label class="form-label" for="mld-proxy">{{ t("mld-proxy").cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" id="mld" class="checkbox" v-model='interface.fields.mld_proxy'
												true-value='1' false-value='0'>
												<label class="label" for="mld">checkbox label</label>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div> <!-- /.layer-body -->
					<div class="layer-footer justify-content-center mt-5">
						<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
						<button class="btn btn-secondary" @click='closeForm'>{{ t('cancel').cap }}</button>
					</div><!-- /.layer-footer -->
				</div> <!-- /.layer-content -->
			</div>
		</form>
	</section> <!-- /.layer-popup-wrap -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API, apiRPC } from '@/shared/constants'
import { fillObject, reportError, trackFields, QSpinshow, QSpinhide } from '@/shared/functions'
import val_ip from '@/shared/validators/ip.js'
import val_ip6 from '@/shared/validators/ip6.js'
import validator from 'validator'
import number from '@/shared/validators/number.js'
import filled from '@/shared/validators/filled.js'
import ip4netmask from '@/shared/validators/ip4netmask.js'

export default {
	components: {
	},
	props: {
		section: String
	},
	data() {
		return {
			interface: {
				name: 'rule-form',
				loading: true,
				fields: {
					name: '',
					desc: '',
					interface_type: 'ethernet',
					stype: 'ipoe',
					ipver: 'ipv4',
					defaultroute: '0',
					dtype: 'untagged',
					vid: '',
					priority: '0',
					username: '',
					password: '',
					mtu: '',
					ip4proto: 'dhcp',
					ipaddr: '',
					netmask: '',
					gateway: '',
					ip4dns: [],
					ipv4_dns_primary_server: '',
					ipv4_dns_secondary_server: '',
					ip6proto: 'dhcp',
					reqprefix: '0',
					noslaaconly: '0',
					ipv6: '0',
					ip6addr: '',
					ip6prefix: '',
					ip6gw: '',
					ip6dns: [],
					ipv6_dns_primary_server: '',
					ipv6_dns_secondary_server: '',
					igmp_mcast_source: '0',
					igmp_proxy: '0',
					mld_mcast_source: '0',
					mld_proxy: '0',
					disabled: '0',
					nat: '1'
				},
			},
			interfaceTypeOption: [
				{ label: 'Ethernet', value: 'ethernet' },
			],
			serviceTypeOption: [
				{ label: 'IPoE', value: 'ipoe' },
				{ label: 'PPPoE', value: 'pppoe' },
			],
			protoOptions: [
				{ label: 'IPv4 Only', value: 'ipv4' },
				{ label: 'IPv4 & IPv6(Dual Stack)', value: 'ipv4_ipv6' },
				{ label: 'IPv6 Only', value: 'ipv6' },
			],
			vlanOperationModeOptions: [
				{ label: 'Untag', value: 'untagged' },
				{ label: 'Tag', value: 'tagged' },
			],
			priorityOptions: [
				{ label: '0', value: '0' },
				{ label: '1', value: '1' },
				{ label: '2', value: '2' },
				{ label: '3', value: '3' },
				{ label: '4', value: '4' },
				{ label: '5', value: '5' },
				{ label: '6', value: '6' },
				{ label: '7', value: '7' },
			],
			ipv4ConnectionType: [
				//{ label: 'None', value: 'none' },
				{ label: 'AUTO(DHCP)', value: 'dhcp' },
				{ label: 'Static', value: 'static' },
			],
			ipv6ConnectionType: [
				//{ label: 'None', value: 'none' },
				{ label: 'AUTO(DHCP)', value: 'dhcp' },
				{ label: 'Static', value: 'static' },
			],
			existingNumbers: [],
			check_option_name: []
		}
	},
	mounted() {
		QSpinshow()
		this.interface.loading = true
		if(this.section != null) {
			ws.call(apiRPC("/wan/interface/" + this.section , "get", {})).then(({ dict }) => {
				fillObject(this.interface.fields, dict)

				if(this.interface.fields.ip4proto == 'none')
					this.interface.fields.ip4proto = 'dhcp'
				if(this.interface.fields.ip6proto == 'none')
					this.interface.fields.ip6proto = 'dhcp'

				const ip4dns = this.interface.fields.ip4dns || []
				const ip6dns = this.interface.fields.ip6dns || []

				this.interface.fields.ipv4_dns_primary_server = ip4dns[0] || ''
				this.interface.fields.ipv4_dns_secondary_server = ip4dns[1] || ''
				this.interface.fields.ipv6_dns_primary_server = ip6dns[0] || ''
				this.interface.fields.ipv6_dns_secondary_server = ip6dns[1] || ''

				if(this.interface.fields.stype === 'pppoe' && this.interface.fields.mtu == '')
					this.interface.fields.mtu = '1492'
				else if(this.interface.fields.stype != 'pppoe' && this.interface.fields.mtu == '')
					this.interface.fields.mtu = '1500'

			})
			.catch(err => reportError(err))
		}
		this.untrackFields = trackFields.call(this, 'interface')
		this.interface.loading = false
		QSpinhide()
	},
	methods: {
		saveRule() {
			QSpinshow()
			const requests = []

			if(filled(this.interface.fields.desc)){
				QSpinhide()
				return reportError(this.t('desc').cap+" : "+this.t('err.validation.filled-1').cap)
			}

			if(this.interface.fields.dtype != 'untagged'){
				if(number(this.interface.fields.vid, 1, 4094)){
					QSpinhide()
					return reportError(this.t('vid-over').cap)
				}
			}
			else{
				this.interface.fields.vid = '0'
			}

			if(this.interface.fields.stype === 'pppoe' && this.interface.fields.mtu != 1492){
				QSpinhide()
				return reportError(this.t('mtu-over').cap)
			}
			else if(this.interface.fields.stype != 'pppoe' && this.interface.fields.mtu != 1500){
				QSpinhide()
				return reportError(this.t('mtu-over').cap)
			}

			if(this.interface.fields.stype === 'pppoe'){
				if(filled(this.interface.fields.username)){
					QSpinhide()
					return reportError(this.t('username').cap+" : "+this.t('err.validation.filled-1').cap)
				}
				if(filled(this.interface.fields.password)){
					QSpinhide()
					return reportError(this.t('password').cap+" : "+this.t('err.validation.filled-1').cap)
				}
			}

			if(this.interface.fields.ipver === 'ipv4'){
				this.interface.fields.ipv6 = '0'
				this.interface.fields.ip6proto = ''
			}
			else if(this.interface.fields.ipver === 'ipv6'){
				this.interface.fields.ipv6 = '1'
				this.interface.fields.ip4proto = ''
			}

			if(this.interface.fields.ip4proto === 'static'){
				if(val_ip(this.interface.fields.ipaddr)){
					QSpinhide()
					return reportError(this.t('ipv4-address').cap+" : "+this.t("err.validation.ip4-3").cap)
				}
				if(ip4netmask(this.interface.fields.netmask)){
					QSpinhide()
					return reportError(this.t('subnet-mask').cap+" : "+this.t("err.validation.subnet-1").cap)
				}
				if(val_ip(this.interface.fields.gateway)){
					QSpinhide()
					return reportError(this.t('default-gateway').cap+" : "+this.t("err.validation.ip4-3").cap)
				}
				if(this.interface.fields.ipv4_dns_primary_server.length != 0 && val_ip(this.interface.fields.ipv4_dns_primary_server)){
					QSpinhide()
					return reportError(this.t('primary-dns').cap+" : "+this.t("err.validation.ip4-3").cap)
				}
				if(this.interface.fields.ipv4_dns_secondary_server.length != 0 &&val_ip(this.interface.fields.ipv4_dns_secondary_server)){
					QSpinhide()
					return reportError(this.t('secondary-dns').cap+" : "+this.t("err.validation.ip4-3").cap)
				}
			}

			if(this.interface.fields.ip6proto === 'static'){
				if(val_ip6(this.interface.fields.ip6addr)){
					QSpinhide()
					return reportError(this.t('ipv6-address').cap+" : "+this.t("err.validation.ip4-3").cap)
				}
				if(number(this.interface.fields.ip6prefix, 0, 128)){
					QSpinhide()
					return reportError(this.t('prefix-over').cap)
				}
				if(val_ip6(this.interface.fields.ip6gw)){
					QSpinhide()
					return reportError(this.t('gateway').cap+" : "+this.t("err.validation.ip4-3").cap)
				}
				if(this.interface.fields.ipv6_dns_primary_server.length != 0 && val_ip6(this.interface.fields.ipv6_dns_primary_server)){
					QSpinhide()
					return reportError(this.t('primary-dns').cap+" : "+this.t("err.validation.ip4-3").cap)
				}
				if(this.interface.fields.ipv6_dns_secondary_server.length != 0 &&val_ip6(this.interface.fields.ipv6_dns_secondary_server)){
					QSpinhide()
					return reportError(this.t('secondary-dns').cap+" : "+this.t("err.validation.ip4-3").cap)
				}
			}

			const ip4dns = this.interface.fields.ipv4_dns_primary_server + ' ' + this.interface.fields.ipv4_dns_secondary_server
			const ip6dns = this.interface.fields.ipv6_dns_primary_server + ' ' + this.interface.fields.ipv6_dns_secondary_server

			this.interface.fields.ip4dns = ip4dns
			this.interface.fields.ip6dns = ip6dns

			this.untrackFields = trackFields.call(this, 'interface')

			const fields = this.$store.getters.nonEmptyFieldsValues(this.interface.name)
			requests.push(ws.call(API.wan.put, fields))

			Promise.all(requests)
			.then(() => { 
				ws.call(API.commit)
     		})
			.finally(() => {
				this.closeForm(true)
				QSpinhide()
			}, reportError)
		},
		closeForm(refresh) {
			if (this.untrackFields) {
				this.untrackFields()
			}
			this.$store.commit('UNSTAGE_FORM', {
				formName: this.interface.name
			})

			this.$emit('close', refresh)
		}
	}
}
</script>

<style>
	.form-container {
		max-height: 700px;
		overflow-y: scroll;
	}
</style>
