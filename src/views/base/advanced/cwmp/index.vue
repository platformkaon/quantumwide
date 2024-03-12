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
			<form :name='tr069client.name' @submit.prevent='save()' v-loading="loading"
				v-if="currentType == 'tr069client'">
				<div class="table-responsive">
					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<b-card-text>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="acs_url">{{ t("acs-url").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="acs_url" v-model='tr069client.acsForm.fields.url'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="acs_username">{{ t("acs-username").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="acs_username"  v-model='tr069client.acsForm.fields.username'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="acs_password">{{ t("acs-password").cap }}</label>
										</th>
										<td>
											<div class="form-password-wrap" :class='showPassword ? "" : "type-view"'>
												<input class="form-control" id="acs_password"
													v-model='tr069client.acsForm.fields.password'
													:type='showPassword.acs ? "text" : "password"'>
												<span class="icon-view-passowrd" @click="togglePassword('acs')"></span>
											</div>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="inform">{{ t("inform").cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" id="inform" class="checkbox" v-model='tr069client.acsForm.fields.periodic_enable'>
												<label class="label" for="inform">checkbox label</label>
											</div>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="inform_interval">{{ t("inform-interval").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="inform_interval" v-model='tr069client.acsForm.fields.periodic_interval'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="management_interface">{{ t("management-interface").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='tr069client.localForm.fields.interface' >
												<option v-for='item in tr069client.localForm.ifaceOptions'
													:value='item.value'
													:key='item.value'>
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="management_port">{{ t("management-port").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="management_port" v-model='tr069client.localForm.fields.port'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="connection_request_username">{{ t("conn-req-username").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="connection_request_username" v-model='tr069client.localForm.fields.username'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="connection_request_password">{{ t("conn-req-password").cap }}</label>
										</th>
										<td>
											<div class="form-password-wrap" :class='showPassword ? "" : "type-view"'>
												<input class="form-control" id="connection_request_password"
													v-model='tr069client.localForm.fields.password'
													:type='showPassword.local ? "text" : "password"'>
												<span class="icon-view-passowrd" @click="togglePassword('local')"></span>
											</div>
										</td>
									</tr>
							</tbody>
							</b-card-text>
						</b-card>
					</table>
				</div>
				<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
			</form>

			<form :name='xmpp.name' @submit.prevent='save()' v-loading="loading" v-else-if="currentType === 'xmpp'">
				<div class="table-responsive">
					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<b-card-text>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="enabled">{{ t("enabled").cap  }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" id="enabled" class="checkbox" v-model='xmpp.fields.enable'>
												<label class="label" for="enabled">checkbox label</label>
											</div>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="usetls">{{ t("usetls").cap  }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" id="usetls" class="checkbox" v-model='xmpp.fields.usetls'>
												<label class="label" for="usetls">checkbox label</label>
											</div>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="username">{{ t("username").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="username" v-model='xmpp.fields.username'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="xmpp_passowrd">{{ t("password").cap }}</label>
										</th>
										<td>
											<div class="form-password-wrap" :class='showPassword ? "" : "type-view"'>
												<input class="form-control" id="xmpp_password"
													v-model='xmpp.fields.password'
													:type='showPassword.xmpp ? "text" : "password"'>
												<span class="icon-view-passowrd" @click="togglePassword('xmpp')"></span>
											</div>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="domain">{{ t("domain").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="domain" v-model='xmpp.fields.domain'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="resource">{{ t("resource").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="resource" v-model='xmpp.fields.resource'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="xmppServerAddress">{{ t("server-address").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="xmppServerAddress" v-model='xmpp.fields.xmppServerAddress'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="xmppServerPort">{{ t("server-port").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="xmppServerPort" v-model='xmpp.fields.xmppServerPort'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="jabberid">{{ t("jabber-id").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="jabberid" v-model='xmpp.fields.jabberid'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="lastchangedate">{{ t("lastchangedate").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="lastchangedate" v-model='xmpp.fields.lastchangedate'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="status">{{ t("status").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="status" v-model='xmpp.fields.status'>
										</td>
									</tr>
								</tbody>
							</b-card-text>
						</b-card>
					</table>
				</div>
				<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit" @click.prevent="save">{{ t('save').cap }}</button>
				</div>
			</form>


			<form :name='stun.name' @submit.prevent='save()' v-loading="loading" v-else-if="currentType === 'stun'">
				<div class="table-responsive">
					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<b-card-text>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="enabled">{{ t("enabled").cap  }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" id="enabled" class="checkbox" v-model='stun.fields.enable'>
												<label class="label" for="enabled">checkbox label</label>
											</div>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="username">{{ t("username").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="username" v-model='stun.fields.username'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="stun_passowrd">{{ t("password").cap }}</label>
										</th>
										<td>
											<div class="form-password-wrap" :class='showPassword ? "" : "type-view"'>
												<input class="form-control" id="stun_password"
													v-model='stun.fields.password'
													:type='showPassword.stun ? "text" : "password"'>
												<span class="icon-view-passowrd" @click="togglePassword('stun')"></span>
											</div>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="serverAddress">{{ t("server-address").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="serverAddress" v-model='stun.fields.server_address'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="serverPort">{{ t("server-port").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="serverPort" v-model='stun.fields.server_port'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="minimumkeepaliveperiod">{{ t("minimumkeepaliveperiod").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="minimumkeepaliveperiod" v-model='stun.fields.min_keepalive'>
										</td>
									</tr>
								</tbody>
							</b-card-text>
						</b-card>
					</table>
				</div>
				<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit" @click.prevent="save">{{ t('save').cap }}</button>
				</div>
			</form>
		</div>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API, apiRPC } from '@/shared/constants'
import { reportError, fillObject, reportSuccess, trackFields, isEmpty } from '@/shared/functions'

export default {
	components: {
	},
	data () {
		return {
			tabs:[],
			currentTab: 'tr069client',
			currentType: 'tr069client',
			loading: false,
			tr069client: {
				localForm: {
					name: 'local-form',
					fields: {
						port: '',
						interface: '',
						username: '',
						password: ''
					},
					ifaceOptions: []
				},
				acsForm: {
					name: 'acs-form',
					fields: {
						url: '',
						username: '',
						password: '',
						periodic_enable: false,
						periodic_interval: '',
					}
				},
			},
			xmpp: {
				name: 'xmpp-form',
				fields: {
					enable: '',
					usetls: '',
					username: '',
					password: '',
					domain: '',
					resource: '',
					xmppServerAddress: '',
					xmppServerPort: '',
					jabberid: '',
					lastchangedate: '',
					status: '',
				}
			},
			stun: {
				name: 'stun-form',
				fields: {
					enable: '',
					username: '',
					password: '',
					server_address: '',
					server_port: '',
					min_keepalive: '',
				}
			},
			showPassword: {
				acs: false,
				local: false,
				xmpp: false,
				stun: false
			},
		}
	},
	beforeMount() {
		this.checkcwebconfig()
	},
	mounted () {
		this.fetchData()
	},
	watch: {
		'currentTab'() {
			this.loading = true
			this.fetchData()
		}
	},
	methods: {
		checkcwebconfig () {
			this.tabs = [{ id: 'tr069client', type: 'tr069client', label: 'tr069client'}]
			if(this.$buildOptions.advancedCwmpStunPage)
				this.tabs.push({ id: 'xmpp', type: 'xmpp', label: 'xmpp'})
			if(this.$buildOptions.advancedCwmpXmppPage)
				this.tabs.push({ id: 'stun', type: 'stun', label: 'stun'})
		},
		fetchData () {
			this.loading = true
			if(this.currentTab == 'tr069client') {
				ws.call(API.cwmp.tr069client.get).then(({ dict }) => {
					fillObject(this.tr069client.localForm.fields, dict.local)

					fillObject(this.tr069client.acsForm.fields, dict.acs)
				})
				.catch(err => reportError(err))

				ws.call(apiRPC("/wan/interface/table", "get", {})).then(({ dict }) => {
					this.tr069client.localForm.ifaceOptions = []
					const CheckInterface = new Set()

					Object.values(dict).forEach(item => {
						if (Array.isArray(item)) {
							item.forEach(listItem => {
								if (!CheckInterface.has(listItem.ifname)) {
									this.tr069client.localForm.ifaceOptions.push({
										label: listItem.ifname,
										value: listItem.name
									})
									CheckInterface.add(listItem.ifname)
								}
							})
						}
					})
				})
				.catch(err => reportError(err))
			}
			else if (this.currentTab == 'xmpp'){
				ws.call(API.cwmp.xmpp.get).then(({ dict }) => {
					fillObject(this.xmpp.fields, dict)
					this.untrackFields = trackFields.call(this, 'xmpp')
				})
				.catch(err => reportError(err))
			}
			else if (this.currentTab == 'stun'){
				ws.call(API.cwmp.stun.get).then(({ dict }) => {
					fillObject(this.stun.fields, dict)
					this.untrackFields = trackFields.call(this, 'stun')
				})
				.catch(err => reportError(err))
			}
			else {
				reportError('please check currentTab')
			}
			this.loading = false
		},
		async save () {
			this.loading = true
			let requests = []
			if(this.currentTab == 'tr069client') {
				const fieldsLocal = this.$store.getters.nonEmptyFieldsValues(this.tr069client.localForm.name)
				const fieldsAcs = this.$store.getters.nonEmptyFieldsValues(this.tr069client.acsForm.name)
				fieldsAcs.periodic_enable = fieldsAcs.periodic_enable == 1 ? '1' : '0'

				const params = {
					local: fieldsLocal,
					acs: fieldsAcs
				}

				requests.push(ws.call(API.cwmp.tr069client.put, params))
			}
			else if (this.currentTab == 'xmpp'){
				const fieldsxmpp = this.$store.getters.nonEmptyFieldsValues(this.xmpp.name)
				fieldsxmpp.enable = fieldsxmpp.enable == 1 ? '1' : '0'
				fieldsxmpp.usetls = fieldsxmpp.usetls == 1 ? '1' : '0'

				requests.push(ws.call(API.cwmp.xmpp.put, fieldsxmpp))
			}
			else if (this.currentTab == 'stun'){
				const fieldsstun = this.$store.getters.nonEmptyFieldsValues(this.stun.name)
				fieldsstun.enable = fieldsstun.enable == 1 ? '1' : '0'

				requests.push(ws.call(API.cwmp.stun.put, fieldsstun))
			}

			Promise.all(requests)
			.then(() => {
				ws.call(API.commit)
			})
			.finally(() => {
				this.loading = false
				reportSuccess()
			})

		},
		togglePassword(field) {
			this.showPassword[field] = !this.showPassword[field]
		}
	}
}
</script>