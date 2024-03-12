<template>
	<section class="layer-popup-wrap">
		<div class="layer-popup">
			<div class="layer-content none-min-width">
				<div class="layer-header">
					<div class="layer-title">
						<div class="title">{{ modallabel }}</div>
					</div>
					<div class="close" @click='$emit("close")'>close</div>
				</div> <!-- /.layer-header -->
				<div class="layer-body">
					<div>
						<p class="text">{{ modalmsg }}</p>
					</div>
					<div class="table-responsive mt-5" v-if="type !== 'reboot'">
						<table class="table-setting">
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="password">{{ t('password').cap }}</label>
									</th>
									<td>
										<!-- class option : none / type-view -->
										<div class="form-password-wrap type-view" :class="{ 'type-view': !showPassword }">
											<input class="form-control" id="password" v-model='password'
												:type='!showPassword ? "text" : "password"'>
											<span class="icon-view-passowrd" @click='togglePassword($event)'></span>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div> <!-- /.layer-body -->
				<div class="layer-footer justify-content-center mt-5">
					<button class="btn btn-primary" @click='checkAuth'>{{ yeslabel }}</button>
					<button class="btn btn-secondary" @click='$emit("close")'>{{ t('cancel').cap }}</button>
				</div><!-- /.layer-footer -->
			</div> <!-- /.layer-content -->
		</div>
	</section> <!-- /.layer-popup-wrap -->
</template>
<script>
import { reportError, digestMessage } from '@/shared/functions'

export default {
	components: {
	},
	props: {
		modallabel: String,
		modalmsg: String,
		yeslabel: String,
		type: String,
	},
	data() {
		return {
			password: '',
			showPassword: true,
		}
	},
	methods: {
		togglePassword(e) {
			this.showPassword = !this.showPassword
		},
		checkAuth() {
			if (this.type === "reboot") {
				this.$emit('done')
			} else {
				if (!this.password) return
				const pass = sessionStorage.getItem('password')
				digestMessage(this.password).then(passw => {
					if (passw.sha256_value === pass) {
						this.$emit('done')
					}
					else {
						reportError()
					}
				})
			}
		}
	},
}
</script>
