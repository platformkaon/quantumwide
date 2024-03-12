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
			<form :name='global.name' @submit.prevent='save()' v-loading="loading"
				v-if="currentType === 'global'">
				<ul class="tab-content">
					<li class="tab-content-item active">
						<div class="layer-body form-container">
							<div class="table-responsive">
								<table class="table-setting">
									<tbody>
										<tr>
											<th>
												<label class="form-label" for="bindif">{{ t("bindif").cap }}</label>
											</th>
											<td>
												<select class="form-select" v-model='global.fields.bindif'>
													<option v-for="item in boundInterfaceNameOption" :value="item.value" :key="item.value">
														{{ item.label }}
													</option>
												</select>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="dns_enabled">{{ t("dns_enabled").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="dns_enabled" class="checkbox" v-model='global.fields.dns_enabled'>
													<label class="label" for="dns_enabled">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="dns1">{{ t("dns1").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="dns1" v-model='global.fields.dns1' :disabled="global.fields.dns_enabled == false">
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="dns2">{{ t("dns2").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="dns2" v-model='global.fields.dns2' :disabled="global.fields.dns_enabled == false">
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="country">{{ t("country").cap }}</label>
											</th>
											<td>
												<select class="form-select" v-model='global.fields.country'>
													<option v-for="item in countryOption" :value="item.value" :key="item.value">
														{{ item.label }}
													</option>
												</select>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="dialplan">{{ t("dialplan").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="dialplan" v-model='global.fields.dialplan'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="protocal">{{ t("protocal").cap }}</label>
											</th>
											<td>
												<select class="form-select" v-model='global.fields.proto'>
													<option v-for="item in protocalOption" :value="item.value" :key="item.value">
														{{ item.label }}
													</option>
												</select>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="dtmf">{{ t("dtmf").cap }}</label>
											</th>
											<td>
												<select class="form-select" v-model='global.fields.dtmf'>
													<option v-for="item in dtmfOption" :value="item.value" :key="item.value">
														{{ item.label }}
													</option>
												</select>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="regexpire">{{ t("regexpire").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="regexpire" v-model='global.fields.regexpire'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="regretry">{{ t("regretry").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="regretry" v-model='global.fields.regretry'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="domain">{{ t("domain").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="domain" v-model='global.fields.domain'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="registrar_host">{{ t("sip_registrar").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="registrar_host" v-model='global.fields.registrar_host'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="registrar_port">{{ t("sip_registrar_port").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="registrar_port" v-model='global.fields.registrar_port'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="host">{{ t("sip_proxy").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="host" v-model='global.fields.host'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="port">{{ t("sip_proxy_port").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="port" v-model='global.fields.port'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="outproxy_host">{{ t("sip_outbound_proxy").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="outproxy_host" v-model='global.fields.outproxy_host'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="outproxy_port">{{ t("sip_outbound_proxy_port").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="outproxy_port" v-model='global.fields.outproxy_port'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="secondary_enabled">{{ t("secondary_server").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="secondary_enabled" class="checkbox" v-model='global.fields.secondary_enabled'>
													<label class="label" for="secondary_enabled">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="secondary_registrar_host">{{ t("secondary_sip_registrar").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="secondary_registrar_host" v-model='global.fields.secondary_registrar_host' :disabled="global.fields.secondary_enabled == false">
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="secondary_registrar_port">{{ t("secondary_sip_registrar_port").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="secondary_registrar_port" v-model='global.fields.secondary_registrar_port' :disabled="global.fields.secondary_enabled == false">
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="secondary_host">{{ t("secondary_sip_proxy").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="secondary_host" v-model='global.fields.secondary_host' :disabled="global.fields.secondary_enabled == false">
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="secondary_port">{{ t("secondary_sip_proxy_port").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="secondary_port" v-model='global.fields.secondary_port' :disabled="global.fields.secondary_enabled == false">
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="secondary_outproxy_host">{{ t("secondary_sip_outbound_proxy").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="secondary_outproxy_host" v-model='global.fields.secondary_outproxy_host' :disabled="global.fields.secondary_enabled == false">
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="secondary_outproxy_port">{{ t("secondary_sip_outbound_proxy_port").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="secondary_outproxy_port" v-model='global.fields.secondary_outproxy_port' :disabled="global.fields.secondary_enabled == false">
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</li>
				</ul>
				<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
			</form>

			<form :name='sipaccount.name' @submit.prevent='save()' v-loading="loading" v-else-if="currentType === 'sip-account-configuration'">
				<ul class="tab-content">
					<li class="tab-content-item active">
						<div class="table-title font-weight-normal">LINE 0</div>
						<div class="layer-body form-container">
							<div class="table-responsive">
								<table class="table-setting">
									<tbody>
										<tr>
											<th>
												<label class="form-label" for="enabled">{{ t("enabled").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="enabled" class="checkbox" v-model='sipaccount.fields.enabled'>
													<label class="label" for="enabled">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="extension">{{ t("extension").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="extension" v-model='sipaccount.fields.extension'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="displayname">{{ t("display_name").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="displayname" v-model='sipaccount.fields.displayname'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="authuser">{{ t("auth_name").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="authuser" v-model='sipaccount.fields.authuser'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="secret">{{ t("password").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="secret" v-model='sipaccount.fields.secret'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="phyif">{{ t("physical_terminal_assignment").cap }}</label>
											</th>
											<td>
												<select class="form-select" v-model='sipaccount.fields.phyif'>
													<option v-for="item in PhysicalTerminalAssignmentOption" :value="item.value" :key="item.value">
														{{ item.label }}
													</option>
												</select>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="cforward">{{ t("forward_unconditionally").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="cforward" class="checkbox" v-model='sipaccount.fields.cforward' @change="toggleOtherCheckboxes('cforward')">
													<label class="label" for="cforward">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="cforward_busy">{{ t("forward_on_busy").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="cforward_busy" class="checkbox" v-model='sipaccount.fields.cforward_busy' @change="toggleOtherCheckboxes('cforward_busy')">
													<label class="label" for="cforward_busy">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="cforward_noanswer">{{ t("forward_on_no_asnwer").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="cforward_noanswer" class="checkbox" v-model='sipaccount.fields.cforward_noanswer' @change="toggleOtherCheckboxes('cforward_noanswer')">
													<label class="label" for="cforward_noanswer">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="cforward_num">{{ t("forward_number").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="cforward_num" v-model='sipaccount.fields.cforward_num'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="codec">{{ t("codec").cap }}</label>
											</th>
										</tr>
										<tr v-for="codec in codecs" :key="codec.name">
											<td>
												<input type="checkbox" v-model="codec.enabled">
											</td>
											<td>{{ codec.name }}</td>
											<td>
												<button type="button" @click="changeCodecOrder(codec, 'up')">Up</button>
											</td>
											<td>
												<button type="button" @click="changeCodecOrder(codec, 'down')">Down</button>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="call_waiting">{{ t("call_waiting").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="call_waiting" class="checkbox" v-model='sipaccount.fields.call_waiting'>
													<label class="label" for="call_waiting">checkbox label</label>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</li>
				</ul>
				<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit" @click.prevent="save">{{ t('save').cap }}</button>
				</div>
			</form>
			<form :name='advop.name' @submit.prevent='save()' v-loading="loading" v-else-if="currentType === 'advanced-options'">
				<ul class="tab-content">
					<li class="tab-content-item active">
						<div class="layer-body form-container">
							<div class="table-responsive">
								<table class="table-setting">
									<tbody>
										<tr>
											<th>
												<label class="form-label" for="t38enable">{{ t("t38").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="t38enable" class="checkbox" v-model='advop.fields.t38enable'>
													<label class="label" for="t38enable">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="bindport">{{ t("local_port").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="bindport" v-model='advop.fields.bindport'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="sip_tos">{{ t("sip_tos").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="sip_tos" v-model='advop.fields.sip_tos'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="rtp_tos">{{ t("rtp_tos").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="rtp_tos" v-model='advop.fields.rtp_tos'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="txgain">{{ t("speaker_gain").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="txgain" v-model='advop.fields.txgain'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="rxgain">{{ t("mic_gain").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="rxgain" v-model='advop.fields.rxgain'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="_100rel">{{ t("prack").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="_100rel" class="checkbox" v-model='advop.fields._100rel'>
													<label class="label" for="_100rel">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="timers">{{ t("timer").cap  }}</label>
											</th>
											<td>
												<div class="form-checkbox">
													<input type="checkbox" id="timers" class="checkbox" v-model='advop.fields.timers'>
													<label class="label" for="timers">checkbox label</label>
												</div>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="timers_sess_expires">{{ t("session_expires").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="timers_sess_expires" v-model='advop.fields.timers_sess_expires'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="timers_min_se">{{ t("min_se").cap }}</label>
											</th>
											<td>
												<input type="text" class="form-control" id="timers_min_se" v-model='advop.fields.timers_min_se'>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</li>
				</ul>
				<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
			</form>
		</div>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import { reportSuccess, reportNotice, reportError, fillObject, trackFields, isEmpty, QSpinTimer, QSpinshow, QSpinhide } from '@/shared/functions'
import Password from 'vue-password-strength-meter'

export default {
	components: {
	},
	data() {
		return {
			tabs:[
				{ id: 'global', type: 'global', label: 'global'},
				{ id: 'sipaccount', type: 'sip-account-configuration', label: 'sip-account-configuration'},
				{ id: 'advop', type: 'advanced-options', label: 'options'},
			],
			currentTab: 'global',
			currentType: 'global',
			loading: false,
			global: {
				name: 'global-form',
				loading: false,
				fields: {
					bindif: '',
					dns_enabled: false,
					dns1: '',
					dns2: '',
					country: '',
					dialplan: '',
					proto: '',
					dtmf: '',
					regexpire: '',
					regretry: '',
					domain: '',
					registrar_host: '',
					registrar_port: '',
					host: '',
					port: '',
					outproxy_host: '',
					outproxy_port: '',
					secondary_enabled: false,
					secondary_registrar_host: '',
					secondary_registrar_port: '',
					secondary_host: '',
					secondary_port: '',
					secondary_outproxy_host: '',
					secondary_outproxy_port: '',
				}
			},
			sipaccount:{
				name: 'sip-account-form',
				loading: false,
				fields: {
					enabled: false,
					extension: '',
					displayname: '',
					authuser: '',
					secret: '',
					phyif: '',
					cforward: false,
					cforward_busy: false,
					cforward_noanswer: false,
					cforward_num: '',
					codec: '',
					call_waiting: false
				}
			},
			advop:{
				name: 'advanced-optionForm-form',
				loading: false,
				fields: {
					t38enable: false,
					bindport: '',
					sip_tos: '',
					rtp_tos: '',
					txgain: '',
					rxgain: '',
					_100rel: false,
					timers: false,
					timers_sess_expires: '',
					timers_min_se: ''
				}
			},
			boundInterfaceNameOption: [],
			countryOption: [
				{ label: 'AUS', value: 'AUS' },
				{ label: 'AUT', value: 'AUT' },
				{ label: 'BEL', value: 'BEL' },
				{ label: 'BRA', value: 'BRA' },
				{ label: 'CHL', value: 'CHL' },
				{ label: 'CHN', value: 'CHN' },
				{ label: 'CYP', value: 'CYP' },
				{ label: 'CZH', value: 'CZH' },
				{ label: 'DNK', value: 'DNK' },
				{ label: 'ETS', value: 'ETS' },
				{ label: 'FIN', value: 'FIN' },
				{ label: 'FRA', value: 'FRA' },
				{ label: 'DEU', value: 'DEU' },
				{ label: 'HUN', value: 'HUN' },
				{ label: 'IND', value: 'IND' },
				{ label: 'ITA', value: 'ITA' },
				{ label: 'JPN', value: 'JPN' },
				{ label: 'NLD', value: 'NLD' },
				{ label: 'NZL', value: 'NZL' },
				{ label: 'USA', value: 'USA' },
				{ label: 'ESP', value: 'ESP' },
				{ label: 'SWE', value: 'SWE' },
				{ label: 'NOR', value: 'NOR' },
				{ label: 'SVN', value: 'SVN' },
				{ label: 'CHE', value: 'CHE' },
				{ label: 'T57', value: 'T57' },
				{ label: 'GBR', value: 'GBR' },
				{ label: 'TWN', value: 'TWN' },
				{ label: 'MYS', value: 'MYS' },
			],
			protocalOption: [
				{ label: 'TCP', value: 'tcp' },
				{ label: 'UDP', value: 'udp' },
			],
			dtmfOption: [
				{ label: 'Info', value: 'info' },
				{ label: 'RFC2833', value: 'rfc2833' },
				{ label: 'Inband', value: 'inband' },
				{ label: 'Auto', value: 'auto' },
			],
			PhysicalTerminalAssignmentOption: [
				{ label: 'FXS 0', value: '0' },
				{ label: 'FXS 1', value: '1' },
			],
			codecs: [
				{ name: 'alaw', enabled: false },
				{ name: 'ulaw', enabled: false },
				{ name: 'g729', enabled: false },
			],
		}
	},
	mounted() {
		this.fetchData()
	},
	watch: {
		'currentTab'() {
			this.loading = true
			this.fetchData()
		}
	},
	methods: {
		fetchData() {
			this.loading = true
			
			ws.call(apiRPC("/voice/" + this.currentTab, "get", {})).then(({ dict }) => {
				if(this.currentTab == 'global') {
					fillObject(this.global.fields, dict)
					this.untrackFields = trackFields.call(this, 'global')

					ws.call(apiRPC("/wan/interface/table", "get", {})).then(({ dict }) => {
						this.boundInterfaceNameOption = []
						const CheckInterface = new Set()
						Object.values(dict).forEach(item => {
							if (Array.isArray(item)) {
								item.forEach(listItem => {
									if (!CheckInterface.has(listItem.ifname)) {
          								this.boundInterfaceNameOption.push({
            								label: listItem.ifname,
											value: listItem.name
										})
										CheckInterface.add(listItem.ifname)
									}
								})
							}
						})
					})
				}
				else if(this.currentTab == 'sipaccount') {
					fillObject(this.sipaccount.fields, dict)
					this.untrackFields = trackFields.call(this, 'sipaccount')
					const serverCodecs = dict.codec
					const enabledCodecs = serverCodecs.split(' ')
					this.codecs.forEach((codec) => {
						if (enabledCodecs.includes(codec.name)) {
							codec.enabled = true;
						}
					})
				}
				else {
					fillObject(this.advop.fields, dict)
					this.untrackFields = trackFields.call(this, 'advop')
				}
			})
			.catch(err => reportError(err))
			this.loading = false
		},
		async save(){
			QSpinshow()
			this.untrackFields = trackFields.call(this, this.currentTab)
			const fields = this.$store.getters.nonEmptyFieldsValues(this[this.currentTab].name)
			if(this.currentTab == 'global') {
				fields.dns_enabled = fields.dns_enabled ? '1' : '0'
				fields.secondary_enabled = fields.secondary_enabled ? '1' : '0'
			}
			else if (this.currentTab == 'sipaccount'){
				fields.enabled = fields.enabled ? '1' : '0'
				fields.cforward = fields.cforward ? '1' : '0'
				fields.cforward_busy = fields.cforward_busy ? '1' : '0'
				fields.cforward_noanswer = fields.cforward_noanswer ? '1' : '0'
				fields.call_waiting = fields.call_waiting ? '1' : '0'
				
				const codec = this.codecs.filter(codec => codec.enabled).map(codec => codec.name).join(' ')
				fields.codec = codec

			}
			else {
				fields.t38enable = fields.t38enable ? '1' : '0'
				fields._100rel = fields._100rel ? '1' : '0'
				fields.timers = fields.timers ? '1' : '0'
			}
			ws.call(apiRPC("/voice/" + this.currentTab, "put", fields))
			.then(() => { 
				ws.call(API.commit)
			})
			.finally(() => {
				QSpinhide()
			}, reportError)
		},
		toggleOtherCheckboxes(checkboxId) {
			if (checkboxId === 'cforward') {
				this.sipaccount.fields.cforward_busy = false;
				this.sipaccount.fields.cforward_noanswer = false;
			} else if (checkboxId === 'cforward_busy') {
				this.sipaccount.fields.cforward = false;
				this.sipaccount.fields.cforward_noanswer = false;
			} else if (checkboxId === 'cforward_noanswer') {
				this.sipaccount.fields.cforward = false;
				this.sipaccount.fields.cforward_busy = false;
			}
		},
		changeCodecOrder(selectedCodec, direction) {
			const currentIndex = this.codecs.indexOf(selectedCodec)
			const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
			if (newIndex < 0 || newIndex >= this.codecs.length)
				return

			const isEnabledCodec = selectedCodec.enabled

			this.codecs.splice(currentIndex, 1)
			this.codecs.splice(newIndex, 0, selectedCodec)
		}
	}
}
</script>
