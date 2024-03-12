<template>
	<section class="section">
		<div class="module-tab">
			<ul class="tab-label-list tab-label-list-2">
				<!-- class option : none / active / disabled -->
				<li class="tab-label-item" v-for='tab in tabs' :class="{ 'active': currentTab === tab.id }"
					@click="currentTab = tab.id, currentType = tab.type" :key='tab.id'>
					<div class="tab-label">{{ t(tab.label) }}</div>
				</li>
			</ul>
			<form :name='dhcpForm.name' @submit.prevent v-loading="loading" v-if="currentType == 'ipv4'">

				<div class="table-title">{{ t('lan-network-settings') }}</div>
				<table class="table-setting-wide">
					<tr>
						<th>
							<label class="form-label" for="ip_address">{{ t("ip-address").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="ip_address" v-model='lanForm.fields.ipaddr'
								:validate="['filled']">
						</td>
					</tr>
					<tr>
						<th>
							<label class="form-label" for="subnet-mask">{{ t("subnet-mask").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="subnet-mask" v-model='lanForm.fields.netmask'
								:validate="['filled']">
						</td>
					</tr>
				</table>
				<hr>
	
				<div class="table-title">{{ t('secondary').cap }} {{ t('lan-network-settings') }}</div>
				<table class="table-setting-wide">
					<tr>
						<th>
							<label class="form-label" for="enabled">{{ t("enabled").cap }}</label>
						</th>
						<td>
							<div class="form-checkbox">
								<input type="checkbox" id="enabled_secondary" class="checkbox" v-model='secondarylanForm.fields.disabled'>
								<label class="label" for="enabled_secondary">checkbox label</label>
							</div>
						</td>
					</tr>
					<tr v-if="secondarylanForm.fields.disabled">
						<th>
							<label class="form-label" for="sec_ip_address">{{ t("ip-address").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="sec_ip_address" v-model='secondarylanForm.fields.ipaddr'
								:validate="['filled']">
						</td>
					</tr>
					<tr v-if="secondarylanForm.fields.disabled">
						<th>
							<label class="form-label" for="sec_subnet_mask">{{ t("subnet-mask").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="sec_subnet_mask" v-model='secondarylanForm.fields.netmask'
								:validate="['filled']">
						</td>
					</tr>
				</table>
				<hr>
	
				<div class="table-title">{{ t('dhcp-server') + ' ' + t('settings') }}</div>
				<table class="table-setting-wide">
					<tr>
						<th>
							<label class="form-label" for="enabled" v-if="ignore">{{ t("enabled").cap }}</label>
							<label class="form-label" for="enabled" v-else>{{ t("disabled").cap }}</label>
						</th>
						<td>
							<div class="form-checkbox">
								<input type="checkbox" id="enabled" class="checkbox" v-model='ignore' :true-value='true'
									:false-value='false'
									@change='$emit("on-field-change", "ignore", false, !$event.target.checked)'>
								<label class="label" for="enabled">checkbox label</label>
							</div>
						</td>
					</tr>
	
				</table>
	
				<ul class="list-setting">
					<li>
						<div class="label-sm">
							<label class="form-label" for="start">{{ t("start").cap }}</label>
							<input type="text" class="form-control" id="start" v-model='start_ip'>
						</div>
					</li>
					<li>
						<div class="label-sm">
							<label class="form-label" for="cpe">{{ t("number-of-cpes").cap }}</label>
							<input type="text" class="form-control" id="cpe" v-model='dhcpForm.fields.limit'>
						</div>
					</li>
					<li>
						<div class="label-sm">
							<label class="form-label" for="lease-time">{{ t('lease-time-tooltip').cap }}</label>
							<input type="text" class="form-control" id="lease-time" v-model='dhcpForm.fields.leasetime'>
						</div>
					</li>
				</ul>
	
				<div class="btn-area btn-setting-area">
					<button @click="save" class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
			</form>

			<form :name='dhcpForm.name' @submit.prevent v-loading="loading" v-else-if="currentType === 'ipv6'">
				<div class="table-title">{{ t('lan-network-settings') }}</div>
				<table class="table-setting-wide">
					<tr>
						<th>
							<label class="form-label" for="ipv6-address">{{ t("ipv6-address").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="ipv6-address" v-model='ipv6.fields.ip6addr'
								:validate="['filled']">
						</td>
					</tr>
					<tr>
						<th>
							<label class="form-label" for="ip6-prefix">{{ t("ipv6").cap }} {{ t("prefix-length").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="ip6-prefix" v-model='ipv6.fields.ip6prefix'
								:validate="['filled']">
						</td>
					</tr>
				</table>
				<hr>

				<div class="table-title">{{ t('address-type') }}</div>

				<table class="table-setting-wide">
					<tbody>
						<tr>
							<th>
								<label class="form-label">{{ t("radvd").cap }}</label>
							</th>
							<td>
								<div class="form-checkbox">
									<input type="checkbox" class="checkbox" id="ra" name="ra"
										:checked="ipv6.fields.ra === 'server'"
										@change="updateAddressType('ra')">
									<label class="label" for="ra">{{ `Checkbox label ra` }}</label>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				<table class="table-setting-wide" v-if="ipv6.fields.ra === 'server'">
					<tr>
						<th>
							<label class="form-label" for="ra_slaac"
								@mouseenter="showtip['ra_slaac'] = true"
								@mouseleave="showtip['ra_slaac'] = false">
								{{ t("ra-slaac").cap }}
								<b-icon font-scale="1.2" icon="question-circle-fill" :style="{ color: '#0E7AE6'}"
									v-if="showtip['ra_slaac']" v-b-tooltip.click.rightbottom="t('ra-slaac-info').str" >
							</b-icon>
							</label>
						</th>
						<td>
							<div class="form-checkbox">
								<input type="checkbox" class="checkbox" id="ra_slaac" v-model='ipv6.fields.ra_slaac'
								true-value='1' false-value='0'>
								<label class="label" for="ra_slaac">{{ `Checkbox label ra_slaac` }}</label>
							</div>
						</td>
					</tr>
					<tr>
						<th>
							<label class="form-label" for="ra_flags"
								@mouseenter="showtip['ra_flags'] = true"
								@mouseleave="showtip['ra_flags'] = false">
								{{ t("ra-flags").cap }}
								<b-icon font-scale="1.2" icon="question-circle-fill" :style="{ color: '#0E7AE6'}"
									v-if="showtip['ra_flags']" v-b-tooltip.click.rightbottom="t('ra-flags-info').str" >
							</b-icon>
							</label>
						</th>
						<td>
							<multiselect id="ra_flags" v-model='ipv6.fields.ra_flags' :multiple="true" :options="raflagsOption">
							</multiselect>
						</td>
					</tr>
					<tr>
						<th>
							<label class="form-label" for="ra_maxinterval"
								@mouseenter="showtip['ra_maxinterval'] = true"
								@mouseleave="showtip['ra_maxinterval'] = false">
								{{ t("ra-maxinterval").cap }}
								<b-icon font-scale="1.2" icon="question-circle-fill" :style="{ color: '#0E7AE6'}"
									v-if="showtip['ra_maxinterval']" v-b-tooltip.click.rightbottom="t('ra-maxinterval-info').str" >
							</b-icon>
							</label>
						</th>
						<td>
							<input type="text" class="form-control" id="ra_maxinterval" v-model='ipv6.fields.ra_maxinterval' placeholder='600'>
						</td>
					</tr>
					<tr>
						<th>
							<label class="form-label" for="ra_mininterval"
								@mouseenter="showtip['ra_mininterval'] = true"
								@mouseleave="showtip['ra_mininterval'] = false">
								{{ t("ra-mininterval").cap }}
								<b-icon font-scale="1.2" icon="question-circle-fill" :style="{ color: '#0E7AE6'}"
									v-if="showtip['ra_mininterval']" v-b-tooltip.click.rightbottom="t('ra-mininterval-info').str" >
							</b-icon>
							</label>
						</th>
						<td>
							<input type="text" class="form-control" id="ra_mininterval" v-model='ipv6.fields.ra_mininterval' placeholder='200'>
						</td>
					</tr>
					<tr>
						<th>
							<label class="form-label" for="ra_lifetime"
								@mouseenter="showtip['ra_lifetime'] = true"
								@mouseleave="showtip['ra_lifetime'] = false">
								{{ t("ra-lifetime").cap }}
								<b-icon font-scale="1.2" icon="question-circle-fill" :style="{ color: '#0E7AE6'}"
									v-if="showtip['ra_lifetime']" v-b-tooltip.click.rightbottom="t('ra-lifetime-info').str" >
							</b-icon>
							</label>
						</th>
						<td>
							<input type="text" class="form-control" id="ra_lifetime" v-model='ipv6.fields.ra_lifetime' placeholder='1800'>
						</td>
					</tr>
					<tr>
						<th>
							<label class="form-label" for="ra_mtu"
								@mouseenter="showtip['ra_mtu'] = true"
								@mouseleave="showtip['ra_mtu'] = false">
								{{ t("ra-mtu").cap }}
								<b-icon font-scale="1.2" icon="question-circle-fill" :style="{ color: '#0E7AE6'}"
									v-if="showtip['ra_mtu']" v-b-tooltip.click.rightbottom="t('ra-mtu-info').str" >
							</b-icon>
							</label>
						</th>
						<td>
							<input type="text" class="form-control" id="ra_mtu" v-model='ipv6.fields.ra_mtu' placeholder='1500'>
						</td>
					</tr>
					<tr>
						<th>
							<label class="form-label" for="ra_hoplimit"
								@mouseenter="showtip['ra_hoplimit'] = true"
								@mouseleave="showtip['ra_hoplimit'] = false">
								{{ t("ra-hoplimit").cap }}
								<b-icon font-scale="1.2" icon="question-circle-fill" :style="{ color: '#0E7AE6'}"
									v-if="showtip['ra_hoplimit']" v-b-tooltip.click.rightbottom="t('ra-hoplimit-info').str" >
							</b-icon>
							</label>
						</th>
						<td>
							<input type="text" class="form-control" id="ra_hoplimit" v-model='ipv6.fields.ra_hoplimit' placeholder='64'>
						</td>
					</tr>
				</table>
				<hr>

				<table class="table-setting-wide">
					<tbody>
						<tr>
							<th>
								<label class="form-label">{{ t("dhcpv6-server").cap }}</label>
							</th>
							<td>
								<div class="form-checkbox">
									<input type="checkbox" class="checkbox" id="dhcpv6" name="dhcpv6"
										:checked="ipv6.fields.dhcpv6 === 'server'"
										@change="updateAddressType('dhcpv6')">
									<label class="label" for="dhcpv6">{{ `Checkbox label dhcpv6` }}</label>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				<table class="table-setting-wide" v-if="ipv6.fields.dhcpv6 === 'server'">
					<tr>
						<th>
							<label class="form-label" for="start">{{ t("start").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="start" v-model='ipv6.fields.dhcpv6_lease_start' placeholder='aaaa'>
						</td>
					</tr>
					<tr>
						<th>
							<label class="form-label" for="end">{{ t("end").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="end" v-model='ipv6.fields.dhcpv6_lease_end' placeholder='fffe'>
						</td>
					</tr>
				</table>
				<hr>

				<div class="table-title">{{ t('ipv6-dns-settings') }}</div>
				<p class="text-sm text-info" v-if="froze_set">
					<strong>{{ t('dnsv4-error') }}</strong>
				</p>
				<table class="table-setting-wide">
					<tr>
						<th>
							<label class="form-label" for="primarydns">{{ t("primary-dns").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="primarydns" v-model='ipv6.fields.ipv6primaryDns'>
						</td>
					</tr>
	
					<tr>
						<th>
							<label class="form-label" for="seconddns">{{ t("secondary-dns").cap }}</label>
						</th>
						<td>
							<input type="text" class="form-control" id="seconddns" v-model='ipv6.fields.ipv6secondaryDns'>
						</td>
					</tr>
				</table>
				<hr>

				<div class="btn-area btn-setting-area">
					<button @click="save" class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
			</form>
		</div>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import { fillObject, reportSuccess, reportError, QSpinTimer, QSpinshow, QSpinhide, reportnote, trackFields} from '@/shared/functions'
import val_ip from '@/shared/validators/ip.js'
import val_lease from '@/shared/validators/lease-time.js'
import val_ip4 from '@/shared/validators/ip4.js'
import val_ip6 from '@/shared/validators/ip6.js'
import val_netmask from '@/shared/validators/ip4netmask.js'
import Multiselect from 'vue-multiselect'
import number from '@/shared/validators/number.js'

const LAN_SECTION = 'lan'
const DHCP_RELAY_SECTION = 'ipv4'
const LAN_TYPE = 'interface'

export default {
	components: {
		Multiselect
	},
	data() {
		return {
			tabs:[
				{ id: 'ipv4', type: 'ipv4', label: 'ipv4'},
				{ id: 'ipv6', type: 'ipv6', label: 'ipv6'},
			],
			currentTab: 'ipv4',
			currentType: 'ipv4',
			dhcpForm: {
				name: 'dhcp-form',
				fields: {
					start: '',
					limit: '',
					leasetime: '',
					ignore: ''
				},
			},
			lanForm: {
				name: 'lan-form',
				fields: {
					ipaddr: '',
					netmask: '',
				},
			},
			secondarylanForm: {
				name: 'secondary-lan-form',
				fields: {
					disabled: 0,
					ipaddr: '',
					netmask: ''
				},
			},
			ipv6:{
				name: 'ipv6-form',
				fields: {
					ip6addr: '',
					ip6prefix: '',
					ipv6primaryDns: '',
					ipv6secondaryDns: '',
					dhcpv6: '',
					dhcpv6_lease_start: '',
					dhcpv6_lease_end: '',
					ra: '',
					ra_slaac: '',
					ra_flags: '',
					ra_maxinterval:'',
					ra_mininterval:'',
					ra_lifetime:'',
					ra_mtu:'',
					ra_hoplimit:'',
				},
			},
			ignore: false,
			start_ip: '',
			ipaddr_nomask: '',
			SpinTime: 0,
			fetchInterval: '',
			loading: false,
			relay_trig: false,
			save_ipaddr: '',
			confirmModalShown: '',
			froze_set: '',
			out_of_range: false,
			raflagsOption: [
				'managed-config',
				'other-config'
			],
			showtip: {
				"ra_slaac": false,
				"ra_flags": false,
				"ra_maxinterval": false,
				"ra_mininterval": false,
				"ra_lifetime": false,
				"ra_mtu": false,
				"ra_hoplimit": false,
			},
		}
	},
	watch: {
		'currentTab'() {
			this.loading = true
			this.fetchData()
		},
		'lanForm.fields.ipaddr'(newIP) {
			if (val_ip(this.lanForm.fields.ipaddr) || val_netmask(this.lanForm.fields.netmask) || val_ip(this.start_ip)) {
				return
			}
			this.autoPool()
		},
		'lanForm.fields.netmask'(newMask) {
			if (val_ip(this.lanForm.fields.ipaddr) || val_netmask(this.lanForm.fields.netmask) || val_ip(this.start_ip)) {
				return
			}
			let binary_mask = [] //mask[0].toString(2) + mask[2].toString(2) + mask[2].toString(2) + mask[3].toString(2)
			binary_mask.push(parseInt(newMask.split('.')[0]).toString(2))
			binary_mask.push(parseInt(newMask.split('.')[1]).toString(2))
			binary_mask.push(parseInt(newMask.split('.')[2]).toString(2))
			binary_mask.push(parseInt(newMask.split('.')[3]).toString(2))
			while (binary_mask[0].length < 8)
				binary_mask[0] = '0' + binary_mask[0]
			while (binary_mask[1].length < 8)
				binary_mask[1] = '0' + binary_mask[1]
			while (binary_mask[2].length < 8)
				binary_mask[2] = '0' + binary_mask[2]
			while (binary_mask[3].length < 8)
				binary_mask[3] = '0' + binary_mask[3]
			let bin_netmask = binary_mask[0] + binary_mask[1] + binary_mask[2] + binary_mask[3]

			let zero = false
			for (let at = 0; at < bin_netmask.length; at++) {
				if (!zero && bin_netmask[at] == '0')
					zero = true
				if (zero && bin_netmask[at] == '1')
					return
			}
			if (newMask == "0.0.0.0" || newMask == "255.255.255.255")
				return
			this.autoPool()
		},
		'start_ip'(newIP) {
			if (val_ip(this.lanForm.fields.ipaddr) || val_netmask(this.lanForm.fields.netmask) || val_ip(this.start_ip)) {
				return
			}
		},
	},
	mounted() {
		let loadingpage = sessionStorage.getItem('startTime');
		if (loadingpage){
			QSpinTimer(15).finally(()=> reportSuccess())
		}

		this.fetchData()
	},
	methods: {
		updateAddressType(value) {
			if (value === 'ra') {
				if( this.ipv6.fields.ra === 'server' ) {
					this.ipv6.fields.ra = ''
				}
				else {
					this.ipv6.fields.ra = 'server'
				}
			}
			else {
				if( this.ipv6.fields.dhcpv6 === 'server' ) {
					this.ipv6.fields.dhcpv6 = ''
				}
				else {
					this.ipv6.fields.dhcpv6 = 'server'
				}
			}
		},
		isInRange(leaseStart, leaseEnd) {
			const isHex = /[0-9A-Fa-f]+$/
			if(leaseStart.startsWith('0x'))
				leaseStart = leaseStart.substr(2);
			if(leaseEnd.startsWith('0x'))
				leaseEnd = leaseEnd.substr(2);

			if (isHex.test(leaseStart) && isHex.test(leaseEnd)) {
				const startDec = parseInt(leaseStart, 16)
				const endDec = parseInt(leaseEnd, 16)
				if (startDec >= 0x0001 && endDec <= 0xFFFE && startDec <= endDec) {
					return false
				}
			}

			return true
		},
		fetchData() {
			this.loading = true

			Promise.all([
				ws.call(API.network.lan.get),
				ws.call(API.dhcp.get)
			]).then(([{ dict: lanlist }, { dict: dhcpLan }]) => {
				fillObject(this.lanForm.fields, lanlist)
				fillObject(this.dhcpForm.fields, dhcpLan)
				fillObject(this.ipv6.fields, dhcpLan)

				if (dhcpLan.ra_flags) {
				if(dhcpLan.ra_flags.length != 0)
					this.ipv6.fields.ra_flags = dhcpLan.ra_flags.split(' ')
				}

				this.ipv6.fields.dhcpv6_lease_start = dhcpLan.dhcpv6_lease_start.replace(/^0x/, '')
				this.ipv6.fields.dhcpv6_lease_end = dhcpLan.dhcpv6_lease_end.replace(/^0x/, '')

				const lan = lanlist.list.find(item => item.name == 'lan')
				const secondarylan = lanlist.list.find(item => item.name == 'lan_secondary')

				if(lan != undefined) {
					fillObject(this.lanForm.fields, lan)
					fillObject(this.ipv6.fields, lan)
					if (this.ipv6.fields.ip6prefix)
						this.ipv6.fields.ip6prefix = this.ipv6.fields.ip6prefix.split('/')[1]
				}

				if(secondarylan != undefined)
					fillObject(this.secondarylanForm.fields, secondarylan)

				this.ignore = (this.dhcpForm.fields.ignore == "0" ? true : false)

				this.ipaddr_nomask = lan.ipaddr.split('.')
				this.ipaddr_nomask[3] = this.dhcpForm.fields.start
				this.start_ip = this.ipaddr_nomask.join(".")

				this.save_ipaddr = this.lanForm.fields.ipaddr

				this.untrackFields = trackFields.call(this, 'lanForm')
				this.untrackFields = trackFields.call(this, 'secondarylanForm')
				this.untrackFields = trackFields.call(this, 'ipv6')

				/* @DSPARK, 20230707. ADD IPv6 DNS Value*/
				var ipv6_dns = []

				if (dhcpLan.dns6 != null)
				{
					ipv6_dns = dhcpLan.dns6.split(" ")
				}
				for(let i = 0; i < 2; i++)
				{
					if((ipv6_dns[i] == 'undefined') || (ipv6_dns[i] == "(null)"))
					{
						this.ipv6.fields.ipv6primaryDns = ''
						this.ipv6.fields.ipv6secondaryDns = ''
					}
					else
					{
						this.ipv6.fields.ipv6primaryDns = ipv6_dns[0]
						this.ipv6.fields.ipv6secondaryDns = ipv6_dns[1]
					}
				}
			})
			.catch(err => reportError(err))
			.finally(() => this.loading = false)
		},

		save() {
			let requests = []
			let changedLanIp = 0

			if( this.currentType == 'ipv4') {
				let lanipaddr_val = this.lanForm.fields.ipaddr.split('.')
				if (val_ip(this.start_ip) || val_ip(this.lanForm.fields.ipaddr)) {
					return reportError(this.t('err.validation.ip-1').cap)
				}
				else if(this.secondarylanForm.fields.disabled){
					if (val_ip(this.secondarylanForm.fields.ipaddr))
						return reportError(this.t('err.validation.ip-1').cap)
	
					if(val_netmask(this.secondarylanForm.fields.netmask))
						return reportError(this.t('subnet-mask').cap+" : "+this.t("err.validation.subnet-1").cap)
				}
				else if(val_netmask(this.lanForm.fields.netmask)){
					return reportError(this.t('subnet-mask').cap+" : "+this.t("err.validation.subnet-1").cap)
				}
				else if (Number(this.dhcpForm.fields.start) + Number(this.dhcpForm.fields.limit) > 255) {
					return reportError(this.t('number-of-cpes') + " : " + this.t('err.validation.number-3').cap)
				}
				else if (val_lease(this.dhcpForm.fields.leasetime)) {
					return reportError(this.t('lease-time') + " : " + this.t('err.validation.lease-time-1').cap)
				}
				else if (lanipaddr_val[0] === '255' || lanipaddr_val[1] === '255' || lanipaddr_val[2] === '255' || lanipaddr_val[3] === '255') {
					return reportError(this.t('err.validation.ip-1').cap)
				}
				else if (lanipaddr_val[0] !== '192' || lanipaddr_val[1] !== '168') {
					return reportError(this.t('err.validation.ip-1').cap)
				}
				else if (lanipaddr_val[2] === '100') {
					return reportError(this.t('err.validation.ip-1').cap)
				}
				else {
					this.loading = true
					this.dhcpForm.fields.start = this.start_ip.split('.')[3]
					this.ignore === true ? (this.dhcpForm.fields.ignore = "0") : (this.dhcpForm.fields.ignore = "1")
					let params = {
						type: 'dhcp',
						section: LAN_SECTION,
						values: this.dhcpForm.fields
					}
	
					requests.push(ws.call(API.dhcp.set, params.values))
	
					if(this.lanForm.fields.ipaddr != this.save_ipaddr) {
						if (!confirm(this.t('lan-ip-changed').cap)) {
							this.loading = false
							return
						}
						else
							changedLanIp = 1
					}
	
					const lanfields = this.$store.getters.nonEmptyFieldsValues(this.lanForm.name)
					const secfields = this.$store.getters.nonEmptyFieldsValues(this.secondarylanForm.name)
					secfields.disabled = secfields.disabled == 0 ? '1' : '0'
	
					const lanparams = {
						lan: lanfields,
						secondarylan: secfields
					}
	
					requests.push(ws.call(API.network.lan.set, lanparams))
				}
			}
			else 
			{
				if (val_ip6(this.ipv6.fields.ipv6primaryDns)
					|| ((!this.ipv6.fields.ipv6primaryDns || this.ipv6.fields.ipv6primaryDns =='')
					&& (this.ipv6.fields.ipv6secondaryDns && this.ipv6.fields.ipv6secondaryDns != '')))
				{
					this.loading = false
					return reportError(this.t('primary-ipv6-dns') + " : " + this.t('err.validation.ip-1').cap)
				}
				else if (val_ip6(this.ipv6.fields.ipv6secondaryDns))
				{
					this.loading = false
					return reportError(this.t('secondary-ipv6-dns') + " : " + this.t('err.validation.ip-1').cap)
				}
				else if (val_ip6(this.ipv6.fields.ip6addr)) {
					return reportError(this.t('err.validation.ip-1').cap)
				}
				else if(this.ipv6.fields.dhcpv6 == 'server' && (this.isInRange(this.ipv6.fields.dhcpv6_lease_start, this.ipv6.fields.dhcpv6_lease_end))){
					return reportError(this.t('err.validation.range-1', {name: 'lease range', 0: '0001', 1:'FFFE'}).cap)
				}
				else if(this.ipv6.fields.ra_maxinterval != '' && number(this.ipv6.fields.ra_maxinterval)){
					return reportError(this.t("ra-maxinterval").cap + ": " + this.t("err.validation.number-1").cap)
				}
				else if(this.ipv6.fields.ra_mininterval != '' && number(this.ipv6.fields.ra_mininterval)){
					return reportError(this.t("ra-mininterval").cap + ": " + this.t("err.validation.number-1").cap)
				}
				else if(this.ipv6.fields.ra_lifetime != '' && number(this.ipv6.fields.ra_lifetime, 0, 9000)){
					return reportError(this.t('err.validation.range-1', {name: 'lifetime', 0: 0, 1:9000}).cap)
				}
				else if(this.ipv6.fields.ra_mtu != '' && number(this.ipv6.fields.ra_mtu, 1280, 65535)){
					return reportError(this.t('err.validation.range-1', {name: 'mtu', 0: 1280, 1:65535}).cap)
				}
				else if(this.ipv6.fields.ra_hoplimit != '' && number(this.ipv6.fields.ra_hoplimit, 0, 255)){
					return reportError(this.t('err.validation.range-1', {name: 'hoplimit', 0: 0, 1:255}).cap)
				}
				else if (this.ipv6.fields.ip6prefix != '' && number(this.ipv6.fields.ip6prefix, 1, 64)){
					return reportError(this.t('err.validation.range-1', {name: 'prefix', 0: 1, 1:64}).cap)
				}
				else {
					this.loading = true
					if (this.ipv6.fields.ipv6secondaryDns == '')
					{
						this.ipv6.fields.ipv6secondaryDns = ''
					}

					let params = {
						dns6: this.ipv6.fields.ipv6primaryDns == '' ? "NULL" : (this.ipv6.fields.ipv6primaryDns + " " + this.ipv6.fields.ipv6secondaryDns),
					}

					params.dhcpv6 = this.ipv6.fields.dhcpv6
					params.dhcpv6_lease_start = '0x'+this.ipv6.fields.dhcpv6_lease_start
					params.dhcpv6_lease_end = '0x'+this.ipv6.fields.dhcpv6_lease_end
					params.ra = this.ipv6.fields.ra
					params.ra_slaac= this.ipv6.fields.ra_slaac
					params.ra_flags= this.ipv6.fields.ra_flags.join(' ')
					params.ra_maxinterval= this.ipv6.fields.ra_maxinterval
					params.ra_mininterval= this.ipv6.fields.ra_mininterval
					params.ra_lifetime= this.ipv6.fields.ra_lifetime
					params.ra_mtu= this.ipv6.fields.ra_mtu
					params.ra_hoplimit= this.ipv6.fields.ra_hoplimit

					requests.push(ws.call(API.dhcp.set, params))

					if (this.ipv6.fields.ip6addr != "" && this.ipv6.fields.ip6prefix != "") {
						if(!this.ipv6.fields.ip6addr.includes("/")) {
							if (confirm(this.t('check-ipv6-subnet').cap))
							{
								this.ipv6.fields.ip6addr += "/" + this.ipv6.fields.ip6prefix
							}
							else
							{
								this.loading = false
								return
							}
						}
						else {
							if( this.ipv6.fields.ip6addr.substring(this.ipv6.fields.ip6addr.lastIndexOf('/') + 1) > 96 ) {
								this.loading = false
								return reportError(this.t('ipv6-address').cap+" : "+this.t("err.validation.subnet-1").cap)
							}
						}

						let lanfields = {
							ip6addr: this.ipv6.fields.ip6addr,
							ip6prefix: this.ipv6.fields.ip6addr.substring(0, this.ipv6.fields.ip6addr.lastIndexOf(':') + 1) + "/" + this.ipv6.fields.ip6prefix
						}

						const lanparams = {
							lan: lanfields
						}
						requests.push(ws.call(API.network.lan.set, lanparams))
					}
				}
			}

			if (requests.length > 0) {
				Promise.all(requests)
				.then(() => { 
					ws.call(API.commit)
				})
				.then(() => {
					//if(changedLanIp == 1) {
						QSpinTimer(15).finally(() => {
							this.loading = false
							reportSuccess()
							//reportnote(this.t('If you change the LAN-side settings, the connection between the AP and the client is disconnected.').cap)
							this.$store.dispatch('clearSession')
							this.$store.dispatch('setLastPage', '')
							this.$router.replace({ name: 'login' }).catch(() => { })
							ws.disconnect()
						})
					//}
					/*
					else{
						this.loading = false
						reportSuccess()
						this.fetchData()
						//reportnote(this.t('If you change the LAN-side settings, the connection between the AP and the client is disconnected.').cap)
					}
					*/
				})
				.catch(reportError)
			}
		},
		autoPool() {
			/* Calculate Start IP
			 - lanForm.fields.ipaddr
			 - lanForm.fields.netmask
			*/
			let ip = []
			let ipaddr = this.lanForm.fields.ipaddr
			ip.push(parseInt(ipaddr.split(".")[0]))
			ip.push(parseInt(ipaddr.split(".")[1]))
			ip.push(parseInt(ipaddr.split(".")[2]))
			ip.push(parseInt(ipaddr.split(".")[3]))
			let mask = []
			let netmask = this.lanForm.fields.netmask
			mask.push(parseInt(netmask.split(".")[0]))
			mask.push(parseInt(netmask.split(".")[1]))
			mask.push(parseInt(netmask.split(".")[2]))
			mask.push(parseInt(netmask.split(".")[3]))

			let s1 = (ip[0]&mask[0]).toString()
			let s2 = (ip[1]&mask[1]).toString()
			let s3 = (ip[2]&mask[2]).toString()
			let s4 = ((ip[3]&mask[3])+1).toString()

			let sip = []
			sip.push(parseInt(this.start_ip.split(".")[0]))
			sip.push(parseInt(this.start_ip.split(".")[1]))
			sip.push(parseInt(this.start_ip.split(".")[2]))
			sip.push(parseInt(this.start_ip.split(".")[3]))

			this.out_of_range = false
			if (ip[0] < sip[0])
				this.out_of_range = true
			else if ((ip[0] == sip[0]) && ip[1] < sip[1])
				this.out_of_range = true
			else if ((ip[0] == sip[0]) && (ip[1] == sip[1]) && ip[2] < sip[2])
				this.out_of_range = true
			else if ((ip[0] == sip[0]) && (ip[1] == sip[1]) && (ip[2] == sip[2]) && ip[3] < sip[3])
				this.out_of_range = true
			else
				this.out_of_range = false

			//this.out_of_range = (ipaddr == s1+"."+s2+"."+s3+"."+s4) ? true : false
			//let start = this.out_of_range ? s1+"."+s2+"."+s3+"."+(parseInt(s4)+1).toString() : s1+"."+s2+"."+s3+"."+s4
			//this.start_ip = start

			/* Calculate Number of CLient
			 - lanForm.fields.netmask
			 - start_ip
			 - dhcpForm.fields.limit
			*/
			let binary_mask = [] //mask[0].toString(2) + mask[2].toString(2) + mask[2].toString(2) + mask[3].toString(2)
			binary_mask.push(mask[0].toString(2))
			binary_mask.push(mask[1].toString(2))
			binary_mask.push(mask[2].toString(2))
			binary_mask.push(mask[3].toString(2))
			while (binary_mask[0].length < 8)
				binary_mask[0] = '0' + binary_mask[0]
			while (binary_mask[1].length < 8)
				binary_mask[1] = '0' + binary_mask[1]
			while (binary_mask[2].length < 8)
				binary_mask[2] = '0' + binary_mask[2]
			while (binary_mask[3].length < 8)
				binary_mask[3] = '0' + binary_mask[3]
			
			let bin_netmask = binary_mask[0] + binary_mask[1] + binary_mask[2] + binary_mask[3]
			this.mask_binary = bin_netmask

			let noc = 0
			for (let at = 0; at < bin_netmask.length; at++) {
				if (bin_netmask[at] == '0') {
					noc=noc+(2**(31-at))
				}
			}
			let limit = noc - 2
			limit = limit < 0 ? 0 : limit
			this.dhcpForm.fields.limit = (limit - this.limitCheck()).toString()
			this.max_client = limit - this.limitCheck()
		},
		/*
			Function : limitCheck
			- Calculate Number from Network Address to Start Address
		*/
		limitCheck() {
			let mask = []
			let netmask = this.lanForm.fields.netmask
			mask.push(parseInt(netmask.split(".")[0]))
			mask.push(parseInt(netmask.split(".")[1]))
			mask.push(parseInt(netmask.split(".")[2]))
			mask.push(parseInt(netmask.split(".")[3]))

			let binary_mask = [] //mask[0].toString(2) + mask[1].toString(2) + mask[2].toString(2) + mask[3].toString(2)
			binary_mask.push(mask[0].toString(2))
			binary_mask.push(mask[1].toString(2))
			binary_mask.push(mask[2].toString(2))
			binary_mask.push(mask[3].toString(2))
			while (binary_mask[0].length < 8)
				binary_mask[0] = '0' + binary_mask[0]
			while (binary_mask[1].length < 8)
				binary_mask[1] = '0' + binary_mask[1]
			while (binary_mask[2].length < 8)
				binary_mask[2] = '0' + binary_mask[2]
			while (binary_mask[3].length < 8)
				binary_mask[3] = '0' + binary_mask[3]
			let bin_netmask = binary_mask[0] + binary_mask[1] + binary_mask[2] + binary_mask[3]

			let abit = 0
			for (let at = 0; at < bin_netmask.length; at++) {
				if (bin_netmask[at] == '1')  {
					abit = abit + 1
				}
				else {
					break;
				}
			}
			let start_bin = []
			start_bin.push(parseInt(this.start_ip.split('.')[0]).toString(2))
			start_bin.push(parseInt(this.start_ip.split('.')[1]).toString(2))
			start_bin.push(parseInt(this.start_ip.split('.')[2]).toString(2))
			start_bin.push(parseInt(this.start_ip.split('.')[3]).toString(2))

			while (start_bin[0].length < 8)
				start_bin[0] = '0' + start_bin[0]
			while (start_bin[1].length < 8)
				start_bin[1] = '0' + start_bin[1]
			while (start_bin[2].length < 8)
				start_bin[2] = '0' + start_bin[2]
			while (start_bin[3].length < 8)
				start_bin[3] = '0' + start_bin[3]

			let start_total_bin = start_bin[0] + start_bin[1] + start_bin[2] + start_bin[3]
			let start_val = ''

			for (let at = abit; at < 32; at++) {
				start_val = start_val + start_total_bin[at]
			}
			let ret = this.out_of_range ? parseInt(start_val, 2) - 2 : parseInt(start_val, 2) - 1
			return ret
		},
	}
}

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
