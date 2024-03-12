<template>
	<section class="section">
		<form :name='usernameForm.name' @submit.prevent='save' v-loading="loading">
			<div class="table-responsive">
				<div class="table-title">{{ t("user-info") }}</div>
				<table class="table-setting-wide">
					<tbody>
						<tr>
							<th>
								<label class="form-label" for="current_user_id">{{ t('current-user-id').cap }}<label
										style="color: red;">*</label></label>
							</th>
							<td>
								<input type="text" class="form-control" id="current_user_id" placeholder=""
									v-model="usernameForm.fields.oldName">
							</td>
						</tr>
						<tr>
							<th>
								<label class="form-label" for="old_password">{{ t('current-password').cap }}<label
										style="color: red;">*</label></label>
							</th>
							<td>
								<div class="form-password-wrap" :class="{ 'type-view': !showPassword.new }">
									<input :type='showPassword.new ? "text" : "password"' class="form-control"
										id="new_password" placeholder="" v-model="usernameForm.fields.password">
									<span class="icon-view-passowrd" @click="togglePassword('new')"></span>
								</div>
							</td>
						</tr>
						<br>
						<tr>
							<th>
								<label class="form-label" for="new_user_id">{{ t('new-user-id').cap }}<label
										style="color: red;">*</label></label>
							</th>
							<td>
								<input type="text" class="form-control" id="new_user_id" placeholder=""
									v-model="usernameForm.fields.newName">
							</td>
						</tr>
					</tbody>
				</table>
			</div> <!-- /.table-responsive -->
			<div class="btn-area btn-setting-area">
				<button class="btn btn-secondary" @click="save" type="button">{{ t("save") }}</button>
			</div>
		</form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC } from '@/shared/constants'
import { reportError, reportSuccess, digestMessage } from '@/shared/functions'
import validator from 'validator';
import passwordcheck from '@/shared/validators/password.js'

export default {
	components: {
	},
	data() {
		return {
			usernameForm: {
				name: 'username-form',
				fields: {
					oldName: '',
					newName: '',
					password: ''
				},
			},
			webId: '',
			webPassword: '',
			showPassword: {
				new: false,
			},
			loading: false
		}
	},

	computed: {
		user() {
			return this.$store.getters.user
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		togglePassword(field, e) {
			this.showPassword[field] = !this.showPassword[field]
		},
		fetchData() {
			this.loading = true
			ws.call(RPC.webCredential.get).then(({ dict: credentialResp }) => {
				this.webId = credentialResp.currentid
				this.webPassword = credentialResp.currentpassword
			}).catch(reportError).finally(() => this.loading = false)
		},
		async save() {
			let blank_pattern = /[\s]/g;

			digestMessage(this.usernameForm.fields.password).then(pass => {
				if (this.usernameForm.fields.newName === "" || this.usernameForm.fields.password === "" || this.usernameForm.fields.oldName === "") {
					reportError(this.t("err.validation.filled-1").cap)
					return
				}
				else if (!(pass.sha256_value == this.webPassword || pass == this.webPassword || this.usernameForm.fields.password == this.webPassword)) {
					reportError(this.t('current-password').cap + " : " + this.t("err.validation.custom-2").cap)
					return
				}
				else if (this.webId !== this.usernameForm.fields.oldName) {
					reportError(this.t('current-user-id').cap + " : " + this.t("err.validation.custom-0").cap)
					return
				}
				// else if(blank_pattern.test(this.usernameForm.fields.newName)){
				// 	reportError(this.t('new-user-id').cap+": "+this.t('input-no-blank').cap)
				// 	return
				// }
				//else if (process.env.VENDOR === 'vectra' && !passwordcheck(this.usernameForm.fields.newName, true)) {
				//	reportError(this.t('err.validation.id-1').cap)
				//	return
				//}
				else if (validator.isAlphanumeric(this.usernameForm.fields.newName, 'en-US', { ignore: ' ' }) === false) {
					reportError(this.t('new-user-id').cap + " : " + this.t('err.validation.mac-1').cap)
					return
				}
				else if (this.usernameForm.fields.newName.length < 8 || this.usernameForm.fields.newName.length > 63) {
					reportError(this.t('new-user-id').cap + " : " + "8 ~ 63 " + this.t('characters'))
					return
				}
				else {
					this.loading = true
					const idParams = {
						newid: this.usernameForm.fields.newName,
						newpassword: this.usernameForm.fields.password
					}

					ws.call(RPC.webCredential.set, idParams).then(reportSuccess, reportError).finally(() => {
						this.loading = false
						this.$store.dispatch('clearSession')
						this.$store.dispatch('setLastPage', '')
						this.$router.replace({ name: 'home' }).catch(() => { })
						ws.disconnect()
					})

				}
			})
			// }
		}
	}
}
</script>

