<template>
	<section class="section">
		<div class="module-tab">
			<ul class="tab-label-list tab-label-list-2">
				<!-- class option : none / active / disabled -->
				<li class="tab-label-item" v-for='tab in tabs' :class="{'active': currentTab === tab.id}" @click="currentTab= tab.id" :key='tab.id'>
					<div class="tab-label">{{ t(tab.label) }}</div>
				</li>
			</ul>

			<form :name='sambaForm.name' v-loading="loading" @submit.prevent='save()'>
				<ul class="teb-content" v-if="currentTab === 'general'">
					<!-- class option : none / active -->
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<template #header>
										<h6 class="mb-0">
											<div class="table-title">
												{{t('settings').cap}}
											</div>
										</h6>
									</template>
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="hostname">{{ t('hostname').cap }}</label>
												</th>
												<td>
													<input type="text" class="form-control" name='hostname' id="hostname" v-model='sambaForm.fields.name'>
												</td>
											</tr>
										</tbody>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="workgroup">{{ t('workgroup').cap }}</label>
												</th>
												<td>
													<input type="text" class="form-control" name='workgroup' id="workgroup" v-model='sambaForm.fields.workgroup'>
												</td>
											</tr>
										</tbody>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="description">{{ t('description').cap }}</label>
												</th>
												<td>
													<input type="text" class="form-control" name='description' id="description" v-model='sambaForm.fields.description'>
												</td>
											</tr>
										</tbody>
									</b-card-text>
								</b-card>
								<div class="btn-area btn-setting-area">
									<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
								</div>
							</table>
						</div>
					</li>
					<samba-table
						:columns="columns"
						:data="rules"
						@edit='onRowEdit'
						@delete='onRowDelete'
						@add='openForm'
					></samba-table>
					<rule-form
						v-if='formShown'
						:section='section'
						@close='closeForm($event)'>
					</rule-form>
				</ul>
			</form>

			<form :name='accountForm.name' v-loading="loading" @submit.prevent='account_save()'>
				<ul class="teb-content" v-if="currentTab === 'account'">
					<!-- class option : none / active -->
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<template #header>
										<h6 class="mb-0">
											<div class="table-title">
												{{t('account-settings').cap}}
											</div>
										</h6>
									</template>
									<b-card-text>
									<tbody>
										<tr>
											<th>
												<label class="form-label" for="hostname">ID<label style="color: red;">*</label></label>
											</th>
											<td>
												<input type="text" class="form-control" id="smb_u" disabled=1 v-model='accountForm.fields.users'>
											</td>
										</tr>
									</tbody>
									<tbody>
										<tr>
											<th>
												<label class="form-label" for="workgroup">{{ t('password').cap }}<label style="color: red;">*</label></label>
											</th>
											<td>
												<div class="form-password-wrap" :class="{'type-view': !showPassword.new}">
													<input :type='showPassword.new ? "text" : "password"' class="form-control" id="smb_p" v-model='accountForm.fields.password'>
													<span class="icon-view-passowrd" @click="togglePassword('new')"></span>
												</div>
											</td>
										</tr>
									</tbody>
									</b-card-text>
								</b-card>
								<!--p class="text-sm text-info">
									<strong>{{ t('current-user-id')}} : {{this.showid}}</strong>
								</p-->
								<div class="btn-area btn-setting-area">
									<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
								</div>
							</table>
						</div>
					</li>
				</ul>
			</form>
		</div>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { fillObject, reportSuccess, reportError, trackFields, QSpinshow, QSpinhide, encrypt_aes256, decrypt_aes256  } from '@/shared/functions'
import SambaTable from './table.vue'
import RuleForm from './form.vue'
import str_length from '@/shared/validators/str-length.js'
import passwordcheck from '@/shared/validators/password.js'

export default {
	components: {
		SambaTable,
		RuleForm,
	},
	data () {
		return {
			tabs: [
				{id: 'general', label: 'general-settings'},
				{id: 'account', label: 'account-settings'}
			],
			currentTab: 'general',
			loading: false,
			formShown: false,
			rules: [],
			columns: [
				{ name: 'name', key: 'name', align: 'left' },
				{ name: 'path', key: 'path', align: 'center' },
				{ name: 'read-only', key: 'read_only', align: 'center' },
				{ name: 'browseable', key: 'browseable', align: 'center' },
				{ name: 'guest-ok', key: 'guest_ok', align: 'center' },
				{ name: 'actions', key: 'actions', align: 'center' }
			],
			sambaForm: {
				name: 'samba-form',
				loading: false,
				fields: {
					name: '',
					workgroup: '',
					description: '',
					interface: '',
					session_name: '',
					type: ''
				},
			},
			accountForm: {
				name: 'samba-account',
				loading: false,
				fields: {
					users: 'smbuser',
					password: '',
					type: 'samba-account'
				}
			},
			showPassword: {
				new: false,
				old: false,
				repeat: false
			}
		}
	},
	mounted () {
		this.fetchData()
	},
	watch: {
		'currentTab' (radio) {
			if (radio) {
				this.loading = true
				this.fetchData()
			}
		}
	},
	methods: {
		togglePassword (field, e) {
			this.showPassword[field] = !this.showPassword[field]
		},
		fetchData () {
			this.rules = []
			this.loading = true
			Promise.all([
				ws.call(API.share.samba.get),
				ws.call(API.usb.get)
			]).then(([ { dict:sambainfo }, { dict:mount } ]) => {
				const samba = sambainfo.list.filter((item) => item.type === "samba")
				const sambashare = sambainfo.list.filter((item) => item.type === "sambashare")
				fillObject(this.sambaForm.fields, samba[0])

				Object.keys(sambashare|| {})
					.forEach(k => {
						this.rules.push(sambashare[k])
					})
			})

			.catch(err => reportError(err))
			.finally(()=>{
				this.untrackFields = trackFields.call(this, 'sambaForm')
				this.loading=false
			})
		},
		deleteRule (rule) {
			QSpinshow()

			let params = {
				session_name: rule['session_name'],
			}

			if (confirm(this.t('are-you-sure-to-delete').cap)) {
				ws.call(API.share.samba.del, params)
				.then(() => { 
					ws.call(API.commit)
				})
				.finally(() => {
					this.fetchData()
					QSpinhide()
				})
			}
			else {
				QSpinhide()
			}
		},
		onRowEdit(ruleIdx) {
			this.openForm(this.rules[ruleIdx])
		},
		onRowDelete(rowIdx) {
			this.deleteRule(this.rules[rowIdx])
		},
		openForm (rule) {
			this.section = rule ? rule : null
			this.formShown = true
		},
		closeForm (refresh) {
			if (refresh) {
				this.fetchData()
			}
			this.formShown = false
			window.scrollTo(0, 0)
		},
		async account_save () {
			if(str_length(this.accountForm.fields.password, 8, 32)){
				reportError(this.t('err.validation.wifi-pass-1').cap)
				return
			}
			else if(!passwordcheck(this.accountForm.fields.password, false)){
				reportError(this.t('err.validation.password-3').cap)
				return
			}

			else {
				let requests = []
				this.untrackFields = trackFields.call(this, 'accountForm')
				const fields = this.$store.getters.nonEmptyFieldsValues(this.accountForm.name)
				console.log(fields)
				if (Object.keys(fields).length)  {
					requests.push(ws.call(API.share.samba.put, fields))
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
		},
		async save () {
			let requests = []

			const fields = this.$store.getters.nonEmptyFieldsValues(this.sambaForm.name)

			if (Object.keys(fields).length)  {
				requests.push(ws.call(API.share.samba.put, fields))
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
		},
	}
}
</script>
