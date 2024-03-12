<template>
	<section class="section">
		<form
			v-loading="loading"
			:name='upnp.name'
			@submit.prevent='save()'>

			<div class="table-responsive">
					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">{{ t('settings').cap }}</div>
								</h6>
							</template>
							<b-card-text>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="upnp">{{ t("upnp").cap }}</label>
											</th>
											<td>
													<div class="form-checkbox">
															<input type="checkbox" id="upnp" class="checkbox" name='upnp'
																v-model='upnp.fields.upnp'
																true-value='true' 
																false-value='false'>
															<label class="label" for="upnp">checkbox label</label>
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
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { reportError, fillObject, reportSuccess, trackFields, getSubObject} from '@/shared/functions'
import { Component, Vue } from "vue-property-decorator";

export default{
	data() {
		return {
			loading: false,
			upnp: {
				name: 'upnp',
				fields: {
					upnp: false,
				}
			}
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData () {
			this.loading = true
			ws.call(API.upnp.get).then(({ dict }) => {
				this.upnp.fields.upnp = dict.enabled == '1' ? true : false
			})
			.catch(err => reportError(err))
			this.loading = false
		},
		save () {
			this.loading = true

			let requests = []

			const params = {
				enabled: this.upnp.fields.upnp.toString() == "true" ? '1' : '0'
			}
			requests.push(ws.call(API.upnp.put, params))

			Promise.all(requests)
			.then(() => {
				ws.call(API.commit)
			})
			.finally(() => {
				setTimeout(() => {
					this.loading = false
					this.fetchData()
					reportSuccess()
				}, 5000)
			})
		}
	}
}
</script>