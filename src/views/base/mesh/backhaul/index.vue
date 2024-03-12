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
			<form :name='backhaulForm.name' @submit.prevent='save()' v-loading="backhaulForm.loading">
				<ul class="teb-content" v-if="currentType === '5g'">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
											<label class="form-label" for="guest_5G_enable">{{ t('wifi').cap }} {{ t('enable').cap }}</label>
												</th>
												<td>
											<div class="form-checkbox">
												<input type="checkbox" id="guest_5G_enable" name='guest_5G_enable' class="checkbox" v-model='backhaulForm.fields.disabled' true-value='0' false-value='1'>
												<label class="label" for="guest_5G_enable">checkbox label</label>
											</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="guest_5G_hidden">{{ t('wifi').cap }} {{ t('hidden').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input type="checkbox" id="guest_5G_hidden" name='guest_5G_hidden' class="checkbox" v-model='backhaulForm.fields.hidden' true-value='1' false-value='0'>
														<label class="label" for="guest_5G_hidden">checkbox label</label>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="guest_5G_ssid">{{ t('ssid').cap }}</label>
												</th>
												<td>
													<input type="text" class="form-control" name='guest_5G_ssid' id="guest_5G_ssid" v-model='backhaulForm.fields.ssid'>
												</td>
											</tr>

											<tr v-if="backhaulForm.fields.encryption !== 'none'">
												<th >
													<label class="form-label" for="guest_5G_password">{{ t('password').cap }}</label>
												</th>
												<td>
													<div class="form-password-wrap" :class="{'type-view': !showPassword}">
														<input :type='showPassword ? "text" : "password"' class="form-control" id="guest_5G_password" placeholder="" v-model='backhaulForm.fields.key'>
														<span class="icon-view-passowrd" @click="togglePassword('new')"></span>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="guest_5G_encryption">{{t('encryption').cap}}</label>
												</th>
												<td>
													<select class="form-select" v-model='backhaulForm.fields.encryption' name='guest_5G_encryption'>
														<option v-for='item in encryptionOptions'
															:value='item.value'
															:key='item.value'>
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
					</li>
					<li class="tab-content-item">
						Tab 2 Content
					</li>
				</ul>

				<ul class="teb-content" v-if="currentType === '2g'">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="guest_2G_enable">{{ t('wifi').cap }} {{ t('enable').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input type="checkbox" id="guest_2G_enable" name='guest_2G_enable' class="checkbox" v-model='backhaulForm.fields.disabled' true-value='0' false-value='1'>
														<label class="label" for="guest_2G_enable">checkbox label</label>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="guest_2G_hidden">{{ t('wifi').cap }} {{ t('hidden').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input type="checkbox" id="guest_2G_hidden" name='guest_2G_hidden' class="checkbox" v-model='backhaulForm.fields.hidden' true-value='1' false-value='0'>
														<label class="label" for="guest_2G_hidden">checkbox label</label>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="guest_2G_ssid">{{ t('ssid').cap }}</label>
												</th>
												<td>
													<input type="text" class="form-control" name='guest_2G_ssid' id="guest_2G_ssid" v-model='backhaulForm.fields.ssid'>
												</td>
											</tr>

											<tr v-if="backhaulForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="guest_2G_password">{{ t('password').cap }}</label>
												</th>
												<td>
													<div class="form-password-wrap" :class="{'type-view': !showPassword}">
														<input :type='showPassword ? "text" : "password"' class="form-control" id="guest_2G_password" placeholder="" v-model='backhaulForm.fields.key'>
														<span class="icon-view-passowrd" @click="togglePassword('new')"></span>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="guest_2G_encryption">{{t('encryption').cap}}</label>
												</th>
												<td>
													<select class="form-select" v-model='backhaulForm.fields.encryption' name='guest_2G_encryption'>
														<option v-for='item in encryptionOptions'
															:value='item.value'
															:key='item.value'>
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
					</li>
				</ul>

				<ul class="teb-content" v-if="currentType === '6g'">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="guest_6g_enable">{{ t('wifi').cap }} {{ t('enable').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input type="checkbox" id="guest_6g_enable" name='guest_6g_enable' class="checkbox" v-model='backhaulForm.fields.disabled' true-value='0' false-value='1'>
														<label class="label" for="guest_6g_enable">checkbox label</label>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="guest_6g_hidden">{{ t('wifi').cap }} {{ t('hidden').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input type="checkbox" id="guest_6g_hidden" name='guest_6g_hidden' class="checkbox" v-model='backhaulForm.fields.hidden' true-value='1' false-value='0'>
														<label class="label" for="guest_6g_hidden">checkbox label</label>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="guest_6g_ssid">{{ t('ssid').cap }}</label>
												</th>
												<td>
													<input type="text" class="form-control" name='guest_6g_ssid' id="guest_6g_ssid" v-model='backhaulForm.fields.ssid'>
												</td>
											</tr>

											<tr v-if="backhaulForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="guest_6g_password">{{ t('password').cap }}</label>
												</th>
												<td>
													<div class="form-password-wrap" :class="{'type-view': !showPassword}">
														<input :type='showPassword ? "text" : "password"' class="form-control" id="guest_6g_password" placeholder="" v-model='backhaulForm.fields.key'>
														<span class="icon-view-passowrd" @click="togglePassword('new')"></span>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="guest_6g_encryption">{{t('encryption').cap}}</label>
												</th>
												<td>
													<select class="form-select" v-model='backhaulForm.fields.encryption' name='guest_6g_encryption'>
														<option v-for='item in encryptionOptions'
															:value='item.value'
															:key='item.value'>
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
import { RPC, API, apiRPC } from '@/shared/constants'
import { reportSuccess, reportError, fillObject, trackFields, QSpinTimer, QSpinhide, QSpinshow } from '@/shared/functions'
import Password from 'vue-password-strength-meter'
import str_length from '@/shared/validators/str-length.js'
import number from '@/shared/validators/number.js'
import { encrypt_aes256, decrypt_aes256 } from '@/shared/functions'
import validator from 'validator'
import Qrcode from 'qrcode-generator'

export default {
	components: {
		Password
	},
	data () {
		return {
			tabs: [],
			currentTab: '5g',
			currentType: '5g',
			backhaulForm: {
				name: 'iface-form',
				loading: false,
				fields: {
					name:'',
					ifname:'',
					ssid: '',
					hidden: '0',
					encryption: 'none',
					key: '',
					disabled: '',
				}
			},
			encryptionOptions: [
				//	{ label: 'WPA-PSK (AES)', value: 'psk' },
				{ label: 'WPA2-PSK (AES)', value: 'psk2+aes' },
				//	{ label: 'WPA-PSK (AES/TKIP)', value: 'psk+tkip+aes' },
				{ label: 'WPA3-Personal (SAE)', value: 'sae' },
				{ label: 'WPA2-WPA3 (PSK/SAE)', value: 'sae-mixed' },
				{ label: this.t('none').cap, value: 'none' }
			],
			encryptionOptions6: [
				{ label: 'WPA3 (SAE)', value: 'sae' },
			],
			rootContainerOptions: [
				{label: 'OFF', value: '0'},
				{label: 'ON', value: '1'},
			],
			loading: false,
			showPassword: false,
			SpinTime : 0,
			fetchInterval: ''
		}
	},
	beforeMount() {
		this.loadWiFi()
	},
	mounted () {
		this.fetchData()
	},
	watch: {
		'currentTab' (radio) {
			if (radio) {
				this.backhaulForm.loading = true
				this.fetchData()
			}
		}
	},
	methods: {
		togglePassword (field, e) {
			this.showPassword = !this.showPassword
		},
		loadWiFi () {
			ws.call(API.multiap.backhaul.get).then(({ dict }) => {
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
		},
		fetchData() {
			this.loading = true
			const requests = []

			const typeNumber = 7
			const errorCorrectionLevel = 'L'
			Qrcode.stringToBytes = Qrcode.stringToBytesFuncs['UTF-8']
			const qr = Qrcode(typeNumber, errorCorrectionLevel)
			this.backhaulForm.loading = true

			requests[1] = ws.call(apiRPC("/multiap/backhaul/" + this.currentTab, "get", {})).then(({ dict: ssidResp }) => {
				if (ssidResp.list[0]) {
					fillObject(this.backhaulForm.fields, ssidResp.list[0])

					if (this.backhaulForm.fields.encryption === 'none') {
						qr.addData(`WIFI:T:nopass;S:${this.backhaulForm.fields.ssid};;;`)
					}
					else {
						qr.addData(`WIFI:T:WPA;S:${this.backhaulForm.fields.ssid};P:${this.backhaulForm.fields.key};;`)
					}
					qr.make()

					this.qrCode = qr.createImgTag(4)
				}
			})
			Promise.all(requests).catch(reportError).finally(() => {
				this.loading = false
				this.backhaulForm.loading = false
			})
		},
		async save () {
			QSpinshow()
			let requests = []
			let blank_pattern = /[\s]/g;

			if(str_length(this.backhaulForm.fields.ssid, 1, 32)){
				reportError(this.t('err.validation.wifi-ssid-1').cap)
				return QSpinhide()
			}
			else if(blank_pattern.test(this.backhaulForm.fields.ssid)==true){
				reportError(this.t('ssid-space-alert').cap)
				return QSpinhide()
			}
			else if(str_length(this.backhaulForm.fields.key, 8, 32) && this.backhaulForm.fields.encryption !== 'none'){
				reportError(this.t('err.validation.wifi-pass-1').cap)
				return QSpinhide()
			}
			else if(blank_pattern.test(this.backhaulForm.fields.key)==true){
				reportError(this.t('password-blank-no').cap)
				return QSpinhide()
			}
			else if(!validator.isAscii(this.backhaulForm.fields.key)||!validator.isAscii(this.backhaulForm.fields.ssid)) {
				reportError(this.t('ssid').cap+", "+this.t('password').cap+" : "+this.t('err.validation.wifi-pass-6').cap)
				return QSpinhide()
			}

			requests.push(
				ws.call(API.multiap.set, this.backhaulForm.fields)
			)

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
