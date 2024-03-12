<template>
	<section class="section">
		<form :name='natloopback.name' v-loading="loading" @submit.prevent='save()'>
			<div class="table-responsive">
				<div class="table-title">{{ t('settings').cap }}</div>
				<table class="table-setting-wide">
					<tbody>
						<tr>
							<th>
								<label class="form-label" for="nat_enabled" v-if="natloopback.fields.enabled">{{
									t("enabled").cap }}</label>
								<label class="form-label" for="nat_enabled" v-else>{{ t("disabled").cap }}</label>
							</th>
							<td>
								<div class="form-checkbox">
									<input type="checkbox" id="nat_enabled" class="checkbox"
										v-model="natloopback.fields.enabled">
									<label class="label" for="nat_enabled">checkbox label</label>
								</div>
							</td>
						</tr>
						<tr v-if="natloopback.fields.enabled">
							<th>
								<label class="form-label" for="local_ip">{{ t("local-address").cap }}</label>
							</th>
							<td>
								<input type="text" class="form-control" id="local_ip" v-model="natloopback.fields.local_ip">
							</td>
						</tr>
						<tr v-if="natloopback.fields.enabled">
							<th>
								<label class="form-label" for="nat_ip">{{ t("nat").cap + " " + t("address").cap }}</label>
							</th>
							<td>
								<input type="text" class="form-control" id="nat_ip" v-model="natloopback.fields.nat_ip">
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
import { RPC } from '@/shared/constants'
import { reportError, reportSuccess, fillObject } from '@/shared/functions'
import val from '@/shared/validators/ip.js'

export default {
	components: {
		val
	},
	data() {
		return {
			natloopback: {
				name: 'natloop-form',
				fields: {
					local_ip: '',
					nat_ip: '',
					enabled: false
				},
			},
			loading: false
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.loading = true

			ws.call(RPC.firewall.LanPortBlockAndException.get, { section: 'natloopback' }).then(({ dict }) => {
				fillObject(this.natloopback.fields, dict.values)
			}).finally(() => this.loading = false)
		},
		save() {
			this.loading = true
			let request = []

			if (!this.natloopback.fields.enabled) {
				this.natloopback.fields.local_ip = ''
				this.natloopback.fields.nat_ip = ''
			}
			else if (!this.natloopback.fields.local_ip || !this.natloopback.fields.nat_ip) {
				this.loading = false
				reportError(this.t('err.validation.filled-1').cap)
				return
			}
			else if (val(this.natloopback.fields.local_ip) || val(this.natloopback.fields.nat_ip)) {
				this.loading = false
				reportError(this.t('err.validation.ip-1').cap)
				return
			}

			let params = {
				section: 'natloopback',
				values: this.natloopback.fields
			}
			request.push(ws.call(RPC.firewall.LanPortBlockAndException.set, params))

			Promise.all(request).finally(() => {
				this.loading = false & reportSuccess()
			})
		}
	},
}
</script>
