<template>
	<section class="section">
		<form :name='info.model_name'>
			<div class="table-responsive" v-loading="loading">
				<table class="table-setting-wide">
					<b-card header-tag="header" footer-tag="footer">
						<template #header>
							<h6 class="mb-0">
								<div class="table-title">
									{{ t('information') }}
								</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
								<tr>
									<th>
										<label class="form-label">{{ t('model').cap }}</label>
									</th>
									<td>
										<label class="form-label"><strong>{{ info.model_name || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label">{{ t('serial-number').cap }}</label>
									</th>
									<td>
										<label class="form-label"><strong>{{ info.serial_number || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label">{{ t('hw-version').cap }}</label>
									</th>
									<td>
										<label class="form-label"><strong>{{ info.hardware_version || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label">{{ t('software-version').cap }}</label>
									</th>
									<td>
										<label class="form-label"><strong>{{ info.quantum_ver || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label">{{ t('mac-address').cap }}</label>
									</th>
									<td>
										<label class="form-label"><strong>{{ info.macaddr || 'n/a'
										}}</strong></label>
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
									{{ t('status') }}
								</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="sys">{{ t('sys-avail-time').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="sys"><strong>{{ uptime.uptime || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="allowed">{{ t('cpu').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="allowed"><strong>{{ cpu.all ||  'n/a' }} %
										</strong></label>
									</td>
								</tr>
							</tbody>
						</b-card-text>
					</b-card>
				</table>

				<table v-if="true" class="table-setting-wide">
					<br>
					<b-card header-tag="header" footer-tag="footer">
						<template #header>
							<h6 class="mb-0">
								<div class="table-title">
									{{ t('memory') + " " + t('used') }}
								</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="total">{{ t('total').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="total"><strong>{{ bytesToHuman(total) || 'n/a'
										}}</strong></label>
									</td>
								</tr>
							</tbody>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="available">{{ t('available').cap }}</label>
									</th>
									<td>
										<label class="form-label" for="available"><strong>{{ bytesToHuman(available) ||
											'n/a' }}</strong></label>
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
import { API } from '@/shared/constants'
import { reportError } from '@/shared/functions'

export default {
	data() {
		return {
			info: {},
			cpu: {},
			men: {},
			uptime: {},
			total: '',
			available: '',
			loading: false
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.loading = true
			Promise.all([
				ws.call(API.device.info.get, {}),
				ws.call(API.device.status.all, {})
			]).then(([
				{ dict: info },
				{ dict: status },
			]) => {
				this.info = info
				this.cpu = status.cpu
				this.mem = status.mem
				this.uptime = status.uptime
				this.total = status.mem.total
				this.available = status.mem.free

			})
			.catch(err => reportError(err))
			.finally(() => this.loading = false)
		},
		bytesToHuman(bytes) {
			if (isNaN(bytes))
				return ''

			if (bytes < 0)
				return ''

			let units = ''

			const k = Math.floor((Math.log2(bytes) / 10))
			if (k > 0)
				units = 'KMGTPEZY'[k - 1] + 'iB'

			return (bytes / Math.pow(1024, k)).toFixed(2) + ' ' + units
		}
	}
}
</script>
