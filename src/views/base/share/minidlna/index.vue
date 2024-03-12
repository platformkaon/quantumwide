<template>
	<section class="section">
		<div class="module-tab">
				<ul class="tab-label-list tab-label-list-2">
						<!-- class option : none / active / disabled -->
						<li class="tab-label-item" v-for='tab in tabs' :class="{'active': currentTab === tab.id}" @click="currentTab= tab.id" :key='tab.id'>
								<div class="tab-label">{{ t(tab.label) }}</div>
						</li>
				</ul>
				<form :name='minidlnaForm.name' @submit.prevent='save()' v-loading="minidlnaForm.loading">
					<ul class="teb-content" v-if="currentTab === 'general'">
							<!-- class option : none / active -->
							<li class="tab-content-item active">
									<div class="table-responsive mt-4">
											<table class="table-setting">
													<tbody>
															<tr>
																	<th>
																			<label class="form-label" for="enable">{{ t('enable').cap }}</label>
																	</th>
																	<td>
																			<div class="form-checkbox">
																					<input type="checkbox" id="enable" name='enabled' class="checkbox" v-model='minidlnaForm.fields.enabled' true-value='1' false-value='0'>
																					<label class="label" for="enable">checkbox label</label>
																			</div>
																	</td>
															</tr>
															<tr v-if="false">
																	<th>
																			<label class="form-label" for="port">{{ t('port').cap }}</label>
																	</th>
																	<td>
																			<input type="text" class="form-control" name='port' id="port" v-model='minidlnaForm.fields.port'>
																	</td>
															</tr>
															<tr>
																	<th>
																			<label class="form-label" for="root_container">{{ t("root-container").cap }}<label style="color: red;">*</label></label>
																	</th>
																	<td>
																			<select class="form-select" v-model='minidlnaForm.fields.root_container' name='root_container'>
																				<option v-for='item in rootContainerOptions'
																					:value='item.value'
																					:key='item.value'>
																					{{ item.label }}
																				</option>
																			</select>
																	</td>
															</tr>
															<tr>
																	<th>
																			<label class="form-label" for="media_directories">{{ t("media-dir").cap }}<label style="color: red;">*</label></label>
																	</th>
																	<td>
																		<select
																			v-model='minidlnaForm.fields.media_dir'
																			class="form-select">
																			<option v-for='item in minidlnaForm.pathOptions'
																				:value='item.value'
																				:key='item.value'>
																				{{ item.label }}
																			</option>
																		</select> 
																			<!--el-select no-data-text=" " class="el-multi-select" v-model="minidlnaForm.fields.media_dir" multiple placeholder="Select">
																				<el-option
																					v-for="item in minidlnaForm.pathOptions"
																					:key="item.value"
																					:label="item.value"
																					:value="item.value">
																				</el-option>
																			</el-select-->
																	</td>
															</tr>
													</tbody>
											</table>
									</div> <!-- /.table-responsive -->
							</li>
							<li class="tab-content-item">
									Tab 2 Content
							</li>
					</ul>
					<ul class="teb-content" v-if="currentTab === 'advanced'">
						<!-- class option : none / active -->
						<li class="tab-content-item active">
								<div class="table-responsive mt-4">
										<table class="table-setting">
												<tbody>
														<tr>
																<th>
																		<label class="form-label" for="enable_inotify">{{ t('enable-inotify').cap }}</label>
																</th>
																<td>
																		<div class="form-checkbox">
																				<input type="checkbox" id="enable_inotify" name='inotify' class="checkbox" v-model='minidlnaForm.fields.inotify' true-value='1' false-value='0'>
																				<label class="label" for="enable_inotify">checkbox label</label>
																		</div>
																</td>
														</tr>
														<tr>
																<th>
																		<label class="form-label" for="enable_tivo">{{ t('enable-tivo').cap }}</label>
																</th>
																<td>
																		<div class="form-checkbox">
																				<input type="checkbox" id="enable_tivo" name='enable_tivo' class="checkbox" v-model='minidlnaForm.fields.enable_tivo' true-value='1' false-value='0'>
																				<label class="label" for="enable_tivo">checkbox label</label>
																		</div>
																</td>
														</tr>
														<tr>
																<th>
																		<label class="form-label" for="wide_links">{{ t('enable-wide-links').cap }}</label>
																</th>
																<td>
																		<div class="form-checkbox">
																				<input type="checkbox" id="wide_links" name='wide_links' class="checkbox" v-model='minidlnaForm.fields.wide_links' true-value='1' false-value='0'>
																				<label class="label" for="wide_links">checkbox label</label>
																		</div>
																</td>
														</tr>
														<tr>
																<th>
																		<label class="form-label" for="strict_dlna">{{ t('enable-strict-dlna').cap }}</label>
																</th>
																<td>
																		<div class="form-checkbox">
																				<input type="checkbox" id="strict_dlna" name='strict_dlna' class="checkbox" v-model='minidlnaForm.fields.strict_dlna' true-value='1' false-value='0'>
																				<label class="label" for="strict_dlna">checkbox label</label>
																		</div>
																</td>
														</tr>
														<tr>
																<th>
																		<label class="form-label" for="presentation_url">{{ t('presentation-url').cap }}</label>
																</th>
																<td>
																		<input type="text" class="form-control" id="presentation_url" name='presentation_url' v-model='minidlnaForm.fields.presentation_url'>
																</td>
														</tr>
														<tr>
																<th>
																		<label class="form-label" for="notify_interval">{{ t('notify-interval').cap }}</label>
																</th>
																<td>
																		<input type="text" class="form-control" id="notify_interval" name='notify_interval' v-model='minidlnaForm.fields.notify_interval'>
																</td>
														</tr>
														<tr>
																<th>
																		<label class="form-label" for="announced_serial_number">{{ t('serial').cap }}</label>
																</th>
																<td>
																		<input type="text" class="form-control" id="announced_serial_number" name='serial' v-model='minidlnaForm.fields.serial'>
																</td>
														</tr>
														<tr>
																<th>
																		<label class="form-label" for="announced_uuid">{{ t('uuid').cap }}</label>
																</th>
																<td>
																		<input type="text" class="form-control" id="announced_uuid" name='uuid' v-model='minidlnaForm.fields.uuid'>
																</td>
														</tr>
														<tr>
																<th>
																		<label class="form-label" for="announced_model_number">{{ t('model-number').cap }}</label>
																</th>
																<td>
																		<input type="text" class="form-control" id="announced_model_number" name='model_number' v-model='minidlnaForm.fields.model_number'>
																</td>
														</tr>
														<tr>
																<th>
																		<label class="form-label" for="minissdp_socket">{{ t('minissdp-socket').cap }}</label>
																</th>
																<td>
																		<input type="text" class="form-control" id="minissdp_socket" name='minissdpsocket' v-model='minidlnaForm.fields.minissdpsocket'>
																</td>
														</tr>
												</tbody>
										</table>
								</div> <!-- /.table-responsive -->
						</li>
						<li class="tab-content-item">
								Tab 2 Content
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
import { RPC, API } from '@/shared/constants'
import { reportSuccess, reportError, fillObject, trackFields, QSpinshow, QSpinhide } from '@/shared/functions'

const params_lan = {
	section: 'LanPortBlockAndException'
}

export default {
	components: {
	},
	data () {
		return {
			tabs: [
				{id: 'general', label: 'general-settings'},
				{id: 'advanced', label: 'advanced-settings'}
			],
			currentTab: 'general',
			enableflag: '0',
			minidlnaForm: {
				name: 'minidlna-form',
				loading: false,
				pathOptions: [],
				fields: {
					enabled: '0',
					port: '',
					interface: '',
					root_container: '',
					friendly_name: '',
					media_dir: '',
					db_dir: '',
					log_dir: '',
					inotify: '0',
					enable_tivo: '0',
					wide_links: '0',
					strict_dlna: '0',
					presentation_url: '',
					notify_interval: '',
					serial: '',
					uuid: '',
					model_number: '',
					minissdpsocket: ''
				},
			},
			interfaceOptions: [
				{label: 'br0', value: 'br0'}
			],
			rootContainerOptions: [
				{label: 'Standard container', value: '.'},
				{label: 'Browse directory', value: 'B'},
				{label: 'Music', value: 'M'},
				{label: 'Video', value: 'V'},
				{label: 'Pictures', value: 'P'}
			]
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData () {
			this.minidlnaForm.loading = true

			Promise.all([
				//ws.call(RPC.firewall.LanPortBlockAndException.get, params_lan),
				ws.call(API.usb.get),
			]).then(([
				//{ dict:LanPortBlockAndException },
				{ dict:usb }
			])	=> {
				this.minidlnaForm.pathOptions =  usb.blockdevices.filter(item => !item.name.startsWith("mtd") && !item.name.startsWith("ubi")).map(item => {
					return {
						label: item.children[0].mountpoint,
						value: item.children[0].mountpoint
					}
				})
				return ws.call(API.share.minidlna.get).then(({dict}) => {
					fillObject(this.minidlnaForm.fields, dict.minidlna)
					this.enableflag = this.minidlnaForm.fields.enabled
					//this.minidlna_config_port = this.minidlnaForm.fields.port
					//this.lan_accept_port = LanPortBlockAndException.values.lan_accept_port

				}).catch(reportError).finally(() =>  {
					this.minidlnaForm.loading = false
					this.untrackFields = trackFields.call(this, 'minidlnaForm')
				})
			}).catch(reportError)
		},
		async save () {
			const fields = this.$store.getters.nonEmptyFieldsValues(this.minidlnaForm.name)

			let requests = []

			if ((this.enableflag != fields.enabled) && fields.enabled == '1') {
				if(confirm(this.t('upnpd-forcibly-enabled').cap)){
					const params = {
						enabled: '1'
					}
					requests.push(ws.call(API.upnp.put, params))
				}
				else
					return
			}
/*
			let accept_port
			if (this.minidlnaForm.fields.port == '80' || this.minidlnaForm.fields.port == '443' || this.minidlnaForm.fields.port == '5000' || this.minidlnaForm.fields.port == '8000') {
				if (this.minidlna_config_port == '80' || this.minidlna_config_port == '443' || this.minidlna_config_port == '5000' || this.minidlna_config_port == '8000') {
					accept_port = this.lan_accept_port
				}
				else {
					accept_port = this.lan_accept_port.split(' ').filter((element => element !== this.minidlna_config_port)).join(' ')
				}
			}
			else {
				if (this.minidlna_config_port == '80' || this.minidlna_config_port == '443' || this.minidlna_config_port == '5000' || this.minidlna_config_port == '8000') {
					this.minidlna_config_port = ''
				}
				accept_port = this.lan_accept_port.split(' ').filter((element => element !== this.minidlna_config_port)).join(' ')+" "+this.minidlnaForm.fields.port
			}

			const params = {
				type: 'minidlna',
				values: this.minidlnaForm.fields,
				section: 'config'
			}

			const params_LanPortBlockAndException = {
				section: 'LanPortBlockAndException',
				values: {
					lan_accept_port: accept_port
				}
			}

			const params_LanTcp = {
				section : 'lanTcpAcceptsForminiDLNAINPUT',
				values: {
					enabled : this.minidlnaForm.fields.enabled
				}
			}

			const params_LanUdp = {
				section : 'lanUdpAcceptsForminiDLNAINPUT',
				values: {
					enabled : this.minidlnaForm.fields.enabled
				}
			}

			if (Object.keys(fields).length)  {
				requests.push(
					await ws.call(RPC.firewall.LanPortBlockAndException.set, params_LanTcp),
					await ws.call(RPC.firewall.LanPortBlockAndException.set, params_LanUdp),
					await ws.call(RPC.firewall.LanPortBlockAndException.set, params_LanPortBlockAndException),
					await ws.call(API.share.minidlna.put, params)
				)
			}
			if (requests.length > 0) {
				QSpinshow()
				this.minidlna_config_port = ''
				this.lan_accept_port = ''
				this.minidlnaForm.fields.port = ''
				Promise.all(requests).then(() => {
					reportSuccess()
				}).finally(() => {
					return ws.call(RPC.minidlna.restart).finally(() => {
						ws.call(RPC.firewall.restart).finally(() => {
							this.fetchData()
							QSpinhide()
						})
					})
				})
			}
*/

			if (Object.keys(fields).length)  {
				requests.push(ws.call(API.share.minidlna.put, fields))
			}

			if (requests.length > 0) {
				QSpinshow()

				Promise.all(requests)
				.then(() => { 
					ws.call(API.commit)
				})
				.finally(() => {
					reportSuccess()
					QSpinhide()
				})
			}
		}
	}
}
</script>

<style>
	/* .el-multi-select {
		border-radius: 0.25rem;
		border-color: #d6d6d6;
		background-color: #f3f3f3;
	} 
	.el-input__inner {
		border-radius: 0.25rem;
		border-color: #d6d6d6;
		background-color: #f3f3f3;
	}
	.el-input el-input--suffix {
		border: 1px solid red;
	} */
</style>