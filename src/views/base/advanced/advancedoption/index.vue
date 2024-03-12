<template>
	<section class="section">
		<form
			v-loading="loading"
			:name='advOptForm.name'
			@submit.prevent='save()'>

			<div class="table-responsive">
					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">{{ t('settings').cap }}</div>
								</h6>
							</template>
							<b-card-text>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="ip-pass">{{ t("ipsec-passthrough").cap }}</label>
											</th>
											<td>
													<div class="form-checkbox">
															<input type="checkbox" id="ip-pass" class="checkbox" name='ip-pass'
																v-model='advOptForm.fields.ipsec_passthrough'
																true-value='true' 
																false-value='false'>
															<label class="label" for="ip-pass">checkbox label</label>
													</div>
											</td>
									</tr>
									<tr>
											<th>
													<label class="form-label" for="pp-pass">{{ t("pptp-passthrough").cap }}</label>
											</th>
											<td>
													<div class="form-checkbox">
															<input type="checkbox" id="pp-pass" class="checkbox" name='pp-pass'
																v-model='advOptForm.fields.pptp_passthrough'
																true-value='true' 
																false-value='false'>
															<label class="label" for="pp-pass">checkbox label</label>
													</div>
											</td>
									</tr>
									<tr v-if="!$buildOptions.magyarRequest">
											<th>
													<label class="form-label" for="re-mg">{{ t("remote-mgmt").cap }}</label>
											</th>
											<td>
													<div class="form-checkbox">
															<input type="checkbox" id="re-mg" class="checkbox" name='re-mg'
																v-model='advOptForm.fields.remote_mgmt'
																:true-value='true' 
																:false-value='false'>
															<label class="label" for="re-mg">checkbox label</label>
													</div>
											</td>
									</tr>
									<tr v-if="!$buildOptions.magyarRequest">
											<th>
													<label class="form-label" for="multicast">{{ t("multicast").cap }}</label>
											</th>
											<td>
													<div class="form-checkbox">
															<input type="checkbox" id="multicast" class="checkbox" name='multicast'
																v-model='advOptForm.fields.multicast'
																true-value='true' 
																false-value='false'>
															<label class="label" for="multicast">checkbox label</label>
													</div>
											</td>
									</tr>
							</tbody>
							</b-card-text>
						</b-card>
					</table>
			</div>

			<div class="table-responsive" v-if="false">
					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">{{t("settings").cap+" "+t("remote-mgmt").cap+" "+t("ip").cap}}</div>
								</h6>
							</template>
							<b-card-text>

							<div class="table-title">{{ t('ipv4')+" "+t('settings') }}</div>
							<table class="table-setting-wide">
								<tr>
									<th>
										<label class="form-label" for="enabled_remote_ip" v-if="aclForm.fields.enable==='1'">{{t("enabled").cap}}</label>
										<label class="form-label" for="enabled_remote_ip" v-else>{{t("disabled").cap+" "+"(default)"}}</label>
									</th>
									<td>
										<div class="form-checkbox">
											<input type="checkbox" id="enabled_rm_ip" class="checkbox"
											v-model='aclForm.fields.enable'
											true-value='1'
											false-value='0'
											@change='$emit("on-field-change", "aclForm.fields.enable", false, !$event.target.checked)'>
											<label class="label" for="enabled_rm_ip">checkbox label</label>
										</div>
									</td>
								</tr>
							</table>

							<tbody>
								<ul class="list-setting">
									<li>
											<div class="label-sm">
													<label class="form-label" for="remote_start_ip">{{t("start").cap+" "+t("ipv4-address").cap}}</label>
													<input type="text" class="form-control" id="remote_start_ip" v-model='aclForm.fields.startip'>
											</div>
									</li>
									<li>
											<div class="label-sm">
													<label class="form-label" for="remote_end_ip">{{t("end").cap+" "+t("ipv4-address").cap}}</label>
													<input type="text" class="form-control" id="remote_end_ip" v-model='aclForm.fields.endip'>
											</div>
									</li>
								</ul>
							</tbody>

							<div v-if="false">
							<hr>
							<div class="table-title">{{ t('ipv6')+" "+t('settings') }}</div>
							<table class="table-setting-wide">
								<tr>
									<th>
										<label class="form-label" for="enabled_remote_ip_v6" v-if="aclForm.fields.ipv6_enable==='1'">{{t("enabled").cap}}</label>
										<label class="form-label" for="enabled_remote_ip_v6" v-else>{{t("disabled").cap+" "+"(default)"}}</label>
									</th>
									<td>
										<div class="form-checkbox">
											<input type="checkbox" id="enabled_rm_ip_v6" class="checkbox"
											v-model='aclForm.fields.ipv6_enable'
											true-value='1'
											false-value='0'
											@change='$emit("on-field-change", "aclForm.fields.enable", false, !$event.target.checked)'>
											<label class="label" for="enabled_rm_ip_v6">checkbox label</label>
										</div>
									</td>
								</tr>
							</table>
							<tbody>
								<ul class="list-setting">
									<li>
											<div class="label-sm">
													<label class="form-label" for="remote_start_ipv6">{{t("ipv6-address").cap}}</label>
													<input type="text" class="form-control" id="remote_start_ipv6" v-model='aclForm.fields.ipv6'>
											</div>
									</li>
									<li>
											<div class="label-sm">
													<label class="form-label" for="remote_end_ipv6">{{t("ipv6-prefix").cap}}</label>
													<input type="text" class="form-control" id="remote_end_ipv6" v-model='aclForm.fields.ipv6_prefix'>
											</div>
									</li>
								</ul>
							</tbody>
							</div>
							</b-card-text>
						</b-card>
					</table>
			</div>

			<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
			</div>
		</form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { reportError, fillObject, reportSuccess, trackFields, getSubObject} from '@/shared/functions'
import { Component, Vue } from "vue-property-decorator";

export default{
	components: {
	},
	data() {
		return {
			advOptForm : {
				name: 'advOptForm',
				fields: {
					wan_blocking: false,
					ipsec_passthrough: false,
					pptp_passthrough: false,
					remote_mgmt: false,
					multicast: false,
					upnp: false,
				}
			},
			loading: false,
			section_ipv4 : '',
			section_ipv6 : ''
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData () {
			this.loading = true
			Promise.all([
				ws.call(API.advoptions.get)
			]).then(([
				{ dict: advoptions},
			]) => {
				fillObject(this.advOptForm.fields, advoptions)
			})
			.catch(err => reportError(err))
			.finally(() => this.loading = false)

		},
		async save () {
			this.loading = true

			let requests = []

			const params = {
				wan_blocking: this.advOptForm.fields.wan_blocking.toString() == "true" ? '1' : '0',
				ipsec_passthrough: this.advOptForm.fields.ipsec_passthrough.toString() == "true" ? '1' : '0',
				pptp_passthrough: this.advOptForm.fields.pptp_passthrough.toString() == "true" ? '1' : '0',
				remote_mgmt: this.advOptForm.fields.remote_mgmt.toString() == "true" ? '1' : '0',
				multicast: this.advOptForm.fields.multicast.toString() == "true" ? '1' : '0',
				upnp: this.advOptForm.fields.upnp.toString() == "true" ? '1' : '0'
			}
			requests.push(ws.call(API.advoptions.put, params))

			Promise.all(requests)
			.then(() => {
				ws.call(API.commit)
			})
			.finally(() => {
				this.loading = false
				reportSuccess()
			})
		}
	}
}
</script>

