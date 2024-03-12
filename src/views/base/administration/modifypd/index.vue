<template>
	<section class="section">
		<form :name='adminForm.name' v-loading="adminForm.loading" @submit.prevent='save'>
			<div class="table-responsive">
				<div class="table-title">
					{{ t("settings").cap }}
					<b-icon v-if="isProduction === 'kaon'" animation="fade" font-scale="1.2" icon="exclamation-circle-fill"
						variant="warning" v-b-tooltip.hover.rightbottom="t('password-info').str">
					</b-icon>
				</div>
				<table class="table-setting-wide">
					<tbody>
						<tr>
							<th>
								<label class="form-label" for="current_password">{{ t("current-password") }}<label
										style="color: red;">*</label></label>
							</th>
							<td>
								<!-- class option : none / type-view -->
								<div class="form-password-wrap" :class="{ 'type-view': !showPassword.old }">
									<input :type='showPassword.old ? "text" : "password"' class="form-control"
										id="current_password" placeholder="" v-model='adminForm.fields.oldPassword'>
									<span class="icon-view-passowrd" @click="togglePassword('old')"></span>
								</div>
							</td>
						</tr>
						<br>
						<tr>
							<th>
								<label class="form-label" for="new_password">{{ t("new-password") }}<label
										style="color: red;">*</label></label>
							</th>
							<td>
								<!-- class option : none / type-view -->
								<div class="form-password-wrap" :class="{ 'type-view': !showPassword.new }">
									<input :type='showPassword.new ? "text" : "password"' class="form-control"
										id="new_password" placeholder="" v-model='adminForm.fields.newPassword'>
									<span class="icon-view-passowrd" @click="togglePassword('new')"></span>
								</div>
							</td>
						</tr>
						<tr>
							<th>
								<label class="form-label" for="repeat_new_password">{{ t("repeat-password") }}<label
										style="color: red;">*</label></label>
							</th>
							<td>
								<!-- class option : none / type-view -->
								<div class="form-password-wrap" :class="{ 'type-view': !showPassword.repeat }">
									<input :type='showPassword.repeat ? "text" : "password"' class="form-control"
										id="repeat_new_password" placeholder="" v-model='adminForm.fields.repeatPassword'>
									<span class="icon-view-passowrd" @click="togglePassword('repeat')"></span>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div> <!-- /.table-responsive -->
			<div class="btn-area btn-setting-area">
				<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
			</div>
		</form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { API } from '@/shared/constants'
import { reportError, reportSuccess, trackFields, digestMessage } from '@/shared/functions'
import str_length from '@/shared/validators/str-length.js'
import passwordcheck from '@/shared/validators/password.js'
import validator from 'validator';

export default {
	components: {
	},
	data() {
		return {
			adminForm: {
				loading: false,
				name: 'administration-form',
				fields: {
					oldPassword: '',
					newPassword: '',
					repeatPassword: '',
					get_oldPassword: ''
				},
			},
			showPassword: {
				new: false,
				old: false,
				repeat: false
			},
			UserId: '',
			isProduction: process.env.VENDOR
		}
	},
	computed: {
		user() {
			return this.$store.getters.user
		}
	},
	mounted() {
		this.fetchData()
		this.untrackFields = trackFields.call(this, 'adminForm')
	},
	methods: {
		fetchData() {
			this.adminForm.loading = true
			this.UserId = sessionStorage.getItem('username')
			this.adminForm.fields.get_oldPassword = sessionStorage.getItem('password')
			this.adminForm.loading = false
		},
		togglePassword(field, e) {
			this.showPassword[field] = !this.showPassword[field]
		},
		async save() {
			let blank_pattern = /[\s]/g
			const deleteFields = this.$store.getters.emptyFields(this.adminForm.name)

			if (deleteFields.length > 0) {
				reportError(this.t('err.validation.filled-1').cap)
				return
			}

			if (str_length(this.adminForm.fields.repeatPassword, 8, 32) || str_length(this.adminForm.fields.newPassword, 8, 32)) {
				reportError(this.t('err.validation.wifi-pass-1').cap)
				return
			}
			else if (!passwordcheck(this.adminForm.fields.newPassword, true)) {
				if (process.env.VENDOR === 'kaon') {
					reportError(this.t('err.validation.password-5').cap)
				}
				else {
					reportError(this.t('err.validation.password-3').cap)
				}
				return
			}
			// else if(blank_pattern.test(this.adminForm.fields.repeatPassword)||blank_pattern.test(this.adminForm.fields.newPassword)){
			// 	reportError(this.t('input-no-blank').cap)
			// 	return

			digestMessage(this.adminForm.fields.oldPassword).then(pass => {
				if (!(pass.sha256_value == this.adminForm.fields.get_oldPassword || pass == this.adminForm.fields.get_oldPassword || this.adminForm.fields.oldPassword == this.adminForm.fields.get_oldPassword)) {
					reportError(this.t('err.validation.custom-1').cap)
					return
				}
				else if (this.adminForm.fields.newPassword != this.adminForm.fields.repeatPassword) {
					reportError(this.t('err.validation.custom-2').cap)
					return
				}
				else {
					this.adminForm.loading = true
					const userinfo = {
						username: this.UserId,
						password: this.adminForm.fields.newPassword
					}

					ws.call(API.password, userinfo).then(reportSuccess, reportError).finally(() => {
						this.adminForm.loading = false
						this.$store.dispatch('clearSession')
						this.$store.dispatch('setLastPage', '')
						this.$router.replace({ name: 'home' }).catch(() => { })
						ws.disconnect()
					})

				}
			})
		}
	}
}
</script>
