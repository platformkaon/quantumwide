<template>
	<section class="section">
		<div class="module-tab">
			<ul class="tab-label-list tab-label-list-2">
				<!-- class option : none / active / disabled -->
				<li class="tab-label-item" v-for='tab in tabs' :class="{ 'active': currentTab === tab.id }"
					@click="currentTab = tab.id, currentType = tab.type" :key='tab.id'>
					<div v-if="tab.label_2 != null" class="tab-label">{{ t(tab.label) + " " + t(tab.label_2) }}</div>
					<div v-else class="tab-label">{{ t(tab.label) }}</div>
				</li>
			</ul>
			<form :name='fronthaulForm.name' @submit.prevent='save_bandsteering_easymesh()' v-loading="loading"
				v-if="currentType === 'global'">
				<ul class="tab-content">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="bsd">{{ t('wifi-5.0-bandsteering').cap
													}}</label>
												</th>
												<td>
													<div class="form-checkbox">
													 <input :disabled="meshStatus === 'agent'" type="checkbox" id="bsd" name='bsd'
															class="checkbox" v-model='bandsteering' true-value='1'
															false-value='0'>
														<label class="label" for="bsd">checkbox label</label>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="easy">{{ t('easy-mesh').cap }}</label>
												</th>
												<td>
													<label class="form-label" for="easy">{{ t(`${meshStatus}`) }}</label>
												</td>
											</tr>
											<tr v-if="mesh == '2'">
												<th>
													<label class="form-label" for="active_back_type">{{ t('active-backhaul-type').cap }}</label>
												</th>
												<td>
													<label class="form-label" for="active_back_type">{{ t(`${backhaulType}`) }}</label>
												</td>
											</tr>
											<tr v-if="mesh == '2'">
												<th>
													<label class="form-label" for="backhaulSta">{{ t('backhaul-sta-interface').cap }}</label>
												</th>
												<td>
													<label class="form-label" for="backhaulSta">{{ t(`${backhaulSta}`) }}</label>
												</td>
											</tr>
										</tbody>
									</b-card-text>
								</b-card>
							</table>
						</div>
					</li>
				</ul>
				<div class="btn-area btn-setting-area" v-if="mesh == '3'">
					<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
			</form>

			<form :name='fronthaulForm.name' @submit.prevent='save()' v-loading="loading" v-else>
				<ul class="tab-content" v-if="currentType === '5g'">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<div v-if="bandsteering_form">
								<p class="text-sm text-info">
									<strong>{{ t('bandsteering-error') }}</strong>
								</p>
								<br>
							</div>
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="main_wifi5G_enable">{{ t('wifi').cap }}
														{{ t('enable').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled="bandsteering_form" type="checkbox"
															id="main_wifi5G_enable" name='main_wifi5G_enable'
															class="checkbox" v-model='fronthaulForm.fields.disabled'
															true-value='0' false-value='1'>
														<label class="label" for="main_wifi5G_enable">checkbox label</label>
													</div>
												</td>
												<td rowspan="6">
													<div v-if='fronthaulForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(fronthaulForm.fields.encryption) === -1'
														v-html='qrCode'>
													</div>
													<div
														v-else-if='fronthaulForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(fronthaulForm.fields.encryption) !== -1'>
														<span class='u-type--warning u-spc-left--xlrg'>
															{{ t('qr-doesnt-support-wpa3').cap }}
														</span>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_5G_hidden">{{ t('wifi').cap }} {{
														t('hidden').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input type="checkbox" id="main_5G_hidden" name='main_5G_hidden'
															class="checkbox" v-model='fronthaulForm.fields.hidden'
															true-value='1' false-value='0'>
														<label class="label" for="main_5G_hidden">checkbox label</label>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_5G_id">{{ t('ssid').cap }}</label>
												</th>
												<td>
													<input type="text" class="form-control" name='main_5G_id'
														id="main_5G_id" v-model='fronthaulForm.fields.ssid'>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_5G_encryption">{{
														t('encryption').cap }}</label>
												</th>
												<td>
													<select class="form-select" v-model='fronthaulForm.fields.encryption'
														name='main_5G_encryption'>
														<option v-for='item in encryptionOptions' :value='item.value'
															:key='item.value'>
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="fronthaulForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_5G_algo">{{
														t('algo').cap }}</label>
												</th>
												<td>
													<select class="form-select" v-model='fronthaulForm.fields.algo'
														name='main_5G_algo'>
														<option v-for='item in algoOptions' :value='item.value' :key='item.value' v-if="checkAlgoOptions(item)">
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="fronthaulForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_5G_password">{{ t('password').cap
													}}</label>
												</th>
												<td>
													<div class="form-password-wrap" :class="{ 'type-view': !showPassword }">
														<input :type='showPassword ? "text" : "password"'
															class="form-control" id="main_5G_password" placeholder=""
															v-model='fronthaulForm.fields.key'>
														<span class="icon-view-passowrd"
															@click="togglePassword('new')"></span>
													</div>
												</td>
											</tr>
										</tbody>
									</b-card-text>
								</b-card>
							</table>
						</div> <!-- /.table-responsive -->
					</li>
				</ul>
				<ul class="tab-content" v-if="currentType === '2g'">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<div v-if="bandsteering_form">
								<p class="text-sm text-info">
									<strong>{{ t('bandsteering-error') }}</strong>
								</p>
								<br>
							</div>
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="main_wifi2G_enable">{{ t('wifi').cap }}
														{{ t('enable').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox"
															id="main_wifi2G_enable" name='main_wifi2G_enable'
															class="checkbox" v-model='fronthaulForm.fields.disabled'
															true-value='0' false-value='1'>
														<label class="label" for="main_wifi2G_enable">checkbox label</label>
													</div>
												</td>
												<td rowspan="6">
													<div v-if='fronthaulForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(fronthaulForm.fields.encryption) === -1'
														v-html='qrCode'>
													</div>
													<div
														v-else-if='fronthaulForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(fronthaulForm.fields.encryption) !== -1'>
														<span class='u-type--warning u-spc-left--xlrg'>
															{{ t('qr-doesnt-support-wpa3').cap }}
														</span>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_2G_hidden">{{ t('wifi').cap }} {{
														t('hidden').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox"
															id="main_2G_hidden" name='main_2G_hidden' class="checkbox"
															v-model='fronthaulForm.fields.hidden' true-value='1'
															false-value='0'>
														<label class="label" for="main_2G_hidden">checkbox label</label>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_2G_id">{{ t('ssid').cap }}</label>
												</th>
												<td>
													<input :disabled='bandsteering_form' type="text" class="form-control"
														name='main_2G_id' id="main_2G_id"
														v-model='fronthaulForm.fields.ssid'>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_2G_encryption">{{
														t('encryption').cap }}</label>
												</th>
												<td>
													<select :disabled='bandsteering_form' class="form-select"
														v-model='fronthaulForm.fields.encryption' name='main_2G_encryption'>
														<option v-for='item in encryptionOptions' :value='item.value'
															:key='item.value'>
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="fronthaulForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_2G_algo">{{
														t('algo').cap }}</label>
												</th>
												<td>
													<select class="form-select" v-model='fronthaulForm.fields.algo'
														name='main_2G_algo'>
														<option v-for='item in algoOptions' :value='item.value' :key='item.value' v-if="checkAlgoOptions(item)">
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="fronthaulForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_2G_password">{{ t('password').cap
													}}</label>
												</th>
												<td>
													<div class="form-password-wrap" :class="{ 'type-view': !showPassword }">
														<input :disabled='bandsteering_form'
															:type='showPassword ? "text" : "password"' class="form-control"
															id="main_2G_password" placeholder=""
															v-model='fronthaulForm.fields.key'>
														<span class="icon-view-passowrd"
															@click="togglePassword('new')"></span>
													</div>
												</td>
											</tr>
										</tbody>
									</b-card-text>
								</b-card>
							</table>
						</div> <!-- /.table-responsive -->
					</li>
				</ul>
				<ul class="teb-content" v-if="currentType === '6g'">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<div v-if="bandsteering_form">
								<p class="text-sm text-info">
									<strong>{{ t('bandsteering-error') }}</strong>
								</p>
								<br>
							</div>
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="main_wifi6G_enable">{{ t('wifi').cap }}
														{{ t('enable').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox"
															id="main_wifi6G_enable" name='main_wifi6G_enable'
															class="checkbox" v-model='fronthaulForm.fields.disabled'
															true-value='0' false-value='1'>
														<label class="label" for="main_wifi6G_enable">checkbox label</label>
													</div>
												</td>
												<td rowspan="6">
													<div v-if='fronthaulForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(fronthaulForm.fields.encryption) === -1'
														v-html='qrCode'>
													</div>
													<div
														v-else-if='fronthaulForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(fronthaulForm.fields.encryption) !== -1'>
														<span class='u-type--warning u-spc-left--xlrg'>
															{{ t('qr-doesnt-support-wpa3').cap }}
														</span>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_6G_hidden">{{ t('wifi').cap }} {{
														t('hidden').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox" id="main_6G_hidden" name='main_6G_hidden'
															class="checkbox" v-model='fronthaulForm.fields.hidden'
															true-value='1' false-value='0'>
														<label class="label" for="main_6G_hidden">checkbox label</label>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_6G_id">{{ t('ssid').cap }}</label>
												</th>
												<td>
													<input :disabled='bandsteering_form' type="text" class="form-control" name='main_6G_id'
														id="main_6G_id" v-model='fronthaulForm.fields.ssid'>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_6G_encryption">{{
														t('encryption').cap }}</label>
												</th>
												<td>
													<select :disabled='bandsteering_form' class="form-select" v-model='fronthaulForm.fields.encryption'
														name='main_6G_encryption'>
														<option v-for='item in encryptionOptions6' :value='item.value'
															:key='item.value'>
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="fronthaulForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_6G_algo">{{
														t('algo').cap }}</label>
												</th>
												<td>
													<select class="form-select" v-model='fronthaulForm.fields.algo'
														name='main_6G_algo'>
														<option v-for='item in algoOptions' :value='item.value' :key='item.value' v-if="checkAlgoOptions(item)">
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="fronthaulForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_6G_password">{{ t('password').cap
													}}</label>
												</th>
												<td>
													<div class="form-password-wrap" :class="{ 'type-view': !showPassword }">
														<input :disabled='bandsteering_form' :type='showPassword ? "text" : "password"'
															class="form-control" id="main_6G_password" placeholder=""
															v-model='fronthaulForm.fields.key'>
														<span class="icon-view-passowrd"
															@click="togglePassword('new')"></span>
													</div>
												</td>
											</tr>
										</tbody>
									</b-card-text>
								</b-card>
							</table>
						</div> <!-- /.table-responsive -->
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
import Qrcode from 'qrcode-generator'
import str_length from '@/shared/validators/str-length.js'
import number from '@/shared/validators/number.js'
import { encrypt_aes256, decrypt_aes256 } from '@/shared/functions'
import validator from 'validator'

export default {
	props: {
		direct: {
			type: String,
			default: ''
		}
	},
	components: {
		Password,
	},
	data() {
		return {
			tabs: [],
			rules: [],
			ifname: '',
			name: '',
			columns: [
				{ name: 'number', key: 'number', align: 'center' },
				{ name: 'mac-address', key: 'mac', align: 'center' },
				{ name: 'actions', key: 'actions', align: 'center' }
			],
			formShown: false,
			currentTab: 'global',
			currentType: 'global',
			fronthaulForm: {
				name: 'iface-form',
				loading: false,
				fields: {
					name:'',
					ifname:'',
					ssid: '',
					isolate: '1',
					hidden: '0',
					encryption: 'none',
					algo: '',
					key: '',
					disabled: '',
				}
			},
			encryptionOptions: [
				{ label: 'WPA-PSK', value: 'psk' },
				{ label: 'WPA2-PSK', value: 'psk2' },
				{ label: 'WPA3-Personal', value:'sae' },
				{ label: 'WPA-WPA2', value: 'psk-mixed' },
				{ label: 'WPA2-WPA3', value: 'sae-mixed' },
				{ label: this.t('none').cap, value: 'none' }
			],
			encryptionOptions6: [
				{ label: 'WPA3 (SAE)', value: 'sae' },
			],
			algoOptions: [
				{ label: this.t('auto (tkip+aes)').cap, value: 'tkip+aes' },
				{ label: this.t('tkip').cap, value: 'tkip' },
				{ label: this.t('aes').cap, value: 'aes' },
			],
			loading: false,
			showPassword: false,
			SpinTime: 0,
			fetchInterval: '',
			btnMore: false,
			qrCode: '',
			realchannel: '',
			bandsteering: '',
			bandsteering_form: false,
			mesh: '',
			meshStatus: '',
			backhaulType: '',
			backhaulSta: ''
		}
	},
	beforeMount() {
		this.loadWiFi()
		if (this.$route.params.direct) {
			this.currentTab = 'global'
			this.currentType = 'global'
		}
	},
	mounted() {
		this.fetchData()
	},

	watch: {
		'currentTab'(radio) {
			if (radio) {
				this.loading = true
				this.fetchData()
			}
		}
	},

	methods: {
		checkAlgoOptions(item) {
			if(this.fronthaulForm.fields.encryption.includes("sae") && item.value.includes("tkip"))
				return false
			return true
		},
		togglePassword(field, e) {
			this.showPassword = !this.showPassword
		},
		loadWiFi() {
			this.tabs = [{ id: 'global', type: 'global', label: 'mesh-settings', label_2: null }]
			Promise.all([
				ws.call(API.multiap.wbdcfg)
			]).then(
				([
					{ dict: feature }
				]) => {
					this.mesh = feature.mesh

					if(this.mesh == '3') {
						this.meshStatus = 'controller'
						ws.call(API.multiap.fronthaul.get).then(({ dict }) => {
							dict.list.forEach(item => {
								if (item.band === "5g") {
									this.tabs.push({ id: item.band, type: '5g', label: 'map-bss', label_2: '5ghz' })
									return false
								}
							})
							dict.list.forEach(item => {
								if (item.band === "2g") {
									this.tabs.push({ id: item.band, type: '2g', label: 'map-bss', label_2: '2.4ghz' })
									return false
								}
							})
							dict.list.forEach(item => {
								if (item.band === "6g") {
									this.tabs.push({ id: item.band, type: '6g', label: 'map-bss', label_2: '6ghz' })
									return false
								}
							})
						})
					}
					else {
						this.meshStatus = 'agent'
						this.backhaulType = feature.active_bh_type ? feature.active_bh_type : 'unknown'
						this.backhaulSta = feature.map_bhsta_ifnames
					}
				}
			)
		},
		fetchData() {
			this.loading = true
			const requests = []

			const typeNumber = 7
			const errorCorrectionLevel = 'L'
			Qrcode.stringToBytes = Qrcode.stringToBytesFuncs['UTF-8']
			const qr = Qrcode(typeNumber, errorCorrectionLevel)
			this.fronthaulForm.loading = true

			requests[0] = ws.call(API.multiap.wbdcfg).then(({ dict }) => {
				if (dict) {
					this.bandsteering = dict.bandsteer
					this.bandsteering == '1' ? (this.bandsteering_form = true) : (this.bandsteering_form = false)
					this.bandsteering_tmp = dict.bandsteer
				}
			})

			if (this.currentTab !== "global") {
				requests[1] = ws.call(apiRPC("/multiap/fronthaul/" + this.currentTab, "get", {})).then(({ dict: ssidResp }) => {
					if (ssidResp.list[0]) {
						fillObject(this.fronthaulForm.fields, ssidResp.list[0])

						if (this.fronthaulForm.fields.encryption === 'none') {
							qr.addData(`WIFI:T:nopass;S:${this.fronthaulForm.fields.ssid};;;`)
						}
						else {
							qr.addData(`WIFI:T:WPA;S:${this.fronthaulForm.fields.ssid};P:${this.fronthaulForm.fields.key};;`)
						}
						qr.make()

						this.qrCode = qr.createImgTag(4)
					}
				})
			}

			// What if an error pops up? ... it only causes argument ... 
			//.catch(reportError)
			Promise.all(requests).catch(reportError).finally(() => this.loading = false)
		},
		async save_bandsteering_easymesh() {
/*
			QSpinshow()
			let requests = []

			const ssidPromise = ws.call(apiRPC("/wifi/ssid/fronthaul/w5g", "get", {}))

			if (this.bandsteering_tmp !== this.bandsteering) {
				const bsParams = {
				bandsteer: this.bandsteering
				}
				requests.push(ws.call(API.wireless.global.set, bsParams))
			}

			if (this.bandsteering == '1') {
				reportNotice(this.t('warning-bandsteering').cap)
				await ssidPromise.then(({ dict: ssidResp }) => {
				const w2gParams = {
					encryption: ssidResp.list[0].encryption,
					ifname: "wl2",
					key: ssidResp.list[0].key,
					name: "fh0w2g",
					ssid: ssidResp.list[0].ssid
				}
				requests.push(ws.call(API.wireless.ssid.set, w2gParams))

				const w6gParams = {
					ifname: "wl1",
					key: ssidResp.list[0].key,
					name: "fh0w6g",
					ssid: ssidResp.list[0].ssid
				}

				requests.push(ws.call(API.wireless.ssid.set, w6gParams))
				})
			} else if (this.bandsteering == '0') {
				reportNotice(this.t('disabled-bandsteering').cap)
				await ssidPromise.then(({ dict: ssidResp }) => {
				const w2gParams = {
					ifname: "wl2",
					name: "fh0w2g",
					ssid: ssidResp.list[0].ssid + "_2.4GHz"
				}
				requests.push(ws.call(API.wireless.ssid.set, w2gParams))

				const w6gParams = {
					ifname: "wl1",
					name: "fh0w6g",
					ssid: ssidResp.list[0].ssid + "_6GHz"
				}

				requests.push(ws.call(API.wireless.ssid.set, w6gParams))
				})
			}

			requests.push(ws.call(API.multiap.commit))

			if (requests.length) {
				Promise.all(requests)
				.then(() => {})
				.catch(reportError)
				.finally(() => {
					QSpinTimer(15).finally(() => reportSuccess() & this.fetchData())
				})
			}
*/
		},
		async save() {
			QSpinshow()
			let requests = []
			let blank_pattern = /[\s]/g;

			if (str_length(this.fronthaulForm.fields.ssid, 1, 32)) {
				reportError(this.t('err.validation.wifi-ssid-1').cap)
				return QSpinhide()
			}
			else if (blank_pattern.test(this.fronthaulForm.fields.ssid) == true) {
				reportError(this.t('ssid-space-alert').cap)
				return QSpinhide()
			}

			else if (str_length(this.fronthaulForm.fields.key, 8, 32)) {
				reportError(this.t('err.validation.wifi-pass-1').cap)
				return QSpinhide()
			}
			else if (blank_pattern.test(this.fronthaulForm.fields.key) == true) {
				reportError(this.t('password-blank-no').cap)
				return QSpinhide()
			}
			else if (!validator.isAscii(this.fronthaulForm.fields.key) || !validator.isAscii(this.fronthaulForm.fields.ssid)) {
				reportError(this.t('ssid').cap + ", " + this.t('password').cap + " : " + this.t('err.validation.wifi-pass-6').cap)
				return QSpinhide()
			}

			requests.push(
				ws.call(API.multiap.set, this.fronthaulForm.fields)
			)
/*
			if (this.bandsteering == '1') {
				const w2gParams = {
					encryption: this.fronthaulForm.fields.encryption,
					ifname: "wl2",
					key: this.fronthaulForm.fields.key,
					name: "fh0w2g",
					ssid: this.fronthaulForm.fields.ssid
				}
				requests.push(ws.call(API.wireless.ssid.set, w2gParams))

				const w6gParams = {
					ifname: "wl1",
					key: this.fronthaulForm.fields.key,
					name: "fh0w6g",
					ssid: this.fronthaulForm.fields.ssid
				}

				requests.push(ws.call(API.wireless.ssid.set, w6gParams))
			}
*/
			requests.push(
				ws.call(API.multiap.commit)
			)

			if (requests.length) {
				Promise.all(requests).then(() => {
					
				}, reportError).finally(() => {
					QSpinTimer(15).finally(() => reportSuccess() & this.fetchData())
				})
			}
		},

	}
}
</script>
