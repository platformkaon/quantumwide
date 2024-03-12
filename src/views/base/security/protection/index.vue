<template>
	<section class="section">
		<form v-loading="wifiAdminAccForm.loading" :name='wifiAdminAccForm.name' @submit.prevent='save()'>
			<div class="table-responsive">
				<div class="table-title">{{ t('settings').cap }}</div>
				<table class="table-setting-wide">
					<tbody>
						<tr>
							<th>
								<label class="form-label" for="enabled" v-if="wifiAdminAccForm.fields.enabled">{{
									t("enabled").cap }}</label>
								<label class="form-label" for="enabled" v-else>{{ t("disabled").cap }}</label>
							</th>
							<td>
								<div class="form-checkbox">
									<input type="checkbox" id="enabled" class="checkbox"
										v-model='wifiAdminAccForm.fields.enabled'>
									<label class="label" for="enabled">checkbox label</label>
								</div>
							</td>
						</tr>
					</tbody>
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
import { RPC } from '@/shared/constants'
import { reportError, reportSuccess } from '@/shared/functions'

export default {
	components: {

	},
	data() {
		return {
			wifiAdminAccForm: {
				name: 'wifiAdminAccessForm',
				loading: false,
				fields: {
					enabled: false
				}
			}
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.wifiAdminAccForm.loading = true
			ws.call(RPC.blockWifiConfigAccess.status).then(({ dict: data }) => {
				if (data.result.wca.status === "active") {
					this.wifiAdminAccForm.fields.enabled = false
				}
				if (data.result.wca.status === "inactive") {
					this.wifiAdminAccForm.fields.enabled = true
				}
			}).catch(err => reportError(err)).finally(() => this.wifiAdminAccForm.loading = false)
		},
		save() {
			this.wifiAdminAccForm.loading = true

			if (this.wifiAdminAccForm.fields.enabled) {
				ws.call(RPC.blockWifiConfigAccess.off).then(({ dict }) => {
					if (dict.result.wca.status === "inactive") {
						reportSuccess()
					} else {
						reportError()
						fetchData()
					}
				}).catch(err => reportError(err)).finally(() => this.wifiAdminAccForm.loading = false)
			}
			else {
				ws.call(RPC.blockWifiConfigAccess.on).then(({ dict }) => {
					if (dict.result.wca.status === "active") {
						reportSuccess()
					} else {
						reportError()
						fetchData()
					}
				}).catch(err => reportError(err)).finally(() => this.wifiAdminAccForm.loading = false)
			}
		}
	}
}
</script>
