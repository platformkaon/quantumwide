<template>
	<section class="section">
		<form
			:name='mta.name'>
			<div class="table-responsive" v-loading="loading">
				<table class="table-setting-wide">
					<b-card header-tag="header" footer-tag="footer">
						<template #header>
							<h6 class="mb-0">
								<div class="table-title">
									{{t('cm-startup-procedure')}}
								</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="telephony">{{ t('telephony').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="telephony"><strong>{{ mta.mtaip || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="DHCP">DHCP {{ t('telephony').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="DHCP"><strong>{{ mta.dhcp_prov_status || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="security">{{ t('telephony-security').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="security"><strong>{{ mta.telephony_security || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="TFTP">TFTP {{ t('telephony').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="TFTP"><strong> L1: {{ mta.endpoint_reg_status_line1 || 'n/a' }} / L2: {{ mta.endpoint_reg_status_line2 || 'n/a'}}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="server">{{ t('telephony-call-server-log').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="server"><strong>{{ mta.telephony_complete_record || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
						</b-card-text>
					</b-card>
				</table>
				<br>

					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">
										{{ "LINE 1 STATUS" }}
									</div>
								</h6>
							</template>
							<b-card-text>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="hook">{{ t('hook-status').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="hook"><strong>{{ mta.endpoint_offhook_line1 || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="expiration">{{ t('expiration-time').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="expiration"><strong>{{ mta.endpoint_expiry_line1 || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="registration">{{ t('re-registration-time').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="registration"><strong>{{ mta.endpoint_reg_status_line1 || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							</b-card-text>
						</b-card>
					</table>
					<br>

					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">
										{{ "LINE 2 STATUS" }}
									</div>
								</h6>
							</template>
							<b-card-text>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="hook-2">{{ t('hook-status').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="hook-2"><strong>{{ mta.endpoint_offhook_line2 || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="expiration-2">{{ t('expiration-time').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="expiration-2"><strong>{{ mta.endpoint_expiry_line2 || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="registration-2">{{ t('re-registration-time').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="registration-2"><strong>{{ mta.endpoint_reg_status_line2 || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							</b-card-text>
						</b-card>
					</table>
			</div>
		</form>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC } from '@/shared/constants'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

momentDurationFormatSetup(moment)

export default {
	data () {
		return {
			mta: {
				name : 'mta-form',
				dhcp_prov_status: '',
				tftp_prov_status: '',
				telephony_security: '',
				telephony_complete_record: '',
				endpoint_expiry_line1: '',
				endpoint_expiry_line2: '',
				endpoint_offhook_line1: '',
				endpoint_offhook_line2: '',
				endpoint_reg_status_line1: '',
				endpoint_reg_status_line2: '',
				mtaip: ''
			},
			loading : false
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData(){
			this.loading = true

			const requests = []

			requests[0] = ws.call(RPC.voice.get).then(({ dict }) => {
				this.mta = dict.result
			})

			Promise.all(requests).finally(() => this.loading = false)
		}
	}
}
</script>
