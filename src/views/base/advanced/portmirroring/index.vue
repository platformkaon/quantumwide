<template>
	<section class="section">
		<form v-loading="portmirrorForm.loading" :name='portmirrorForm.name' @submit.prevent='save()'>
			<div class="table-responsive">
				<table class="table-setting-wide">
					<b-card header-tag="header" footer-tag="footer">
						<template #header>
							<h6 class="mb-0">
								<div class="table-title">{{ t('portmirroring') }}</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="enabled" v-if="portmirrorForm.fields.enabled">{{	t("enabled").cap }}</label>
									</th>
									<td>
										<div class="form-checkbox">
											<input type="checkbox" id="enabled" class="checkbox"
												v-model='portmirrorForm.fields.enabled'
												true-value='true' 
												false-value='false'>
											<label class="label" for="enabled">checkbox label</label>
										</div>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="monitor">{{ t("monitor-interface").cap }}</label>
									</th>
									<td>
										<select class="form-select" v-model='portmirrorForm.fields.monitor'>
											<option v-for='item in monitorOptions' :value='item.value' :key='item.value'>
												{{ item.label }}
											</option>
										</select>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="mirroring">{{ t("mirroring-interface").cap }}</label>
									</th>
									<td>
										<select class="form-select" v-model='portmirrorForm.fields.mirroring'>
											<option v-for='item in mirroringOptions' :value='item.value' :key='item.value'>
												{{ item.label }}
											</option>
										</select>
									</td>
								</tr>
							</tbody>
						</b-card-text>
					</b-card>
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
import { RPC, API } from '@/shared/constants'
import { fillObject, reportSuccess, reportError, getSubObject, trackFields } from '@/shared/functions'

export default {
	components: {
	},
	data() {
		return {
			portmirrorForm: {
				name: 'portmirror-form',
				loading: false,
				fields: {
					enabled: 'false',
					monitor: 'eth1',
					mirroring: 'eth1',
				},
			},
			monitorOptions: [],
			mirroringOptions: [],
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.portmirrorForm.loading = true
			ws.call(API.portmirroring.get).then(({ dict }) => {
				ws.call(API.status.ports).then(({ dict }) => {
					const ports = dict.ports.split(' ').filter(item => item !== '')
					ports.forEach((port) => {
						this.monitorOptions.push({
							label: port,
							value: port
						})
					})
					this.mirroringOptions = this.monitorOptions
				})
				fillObject(this.portmirrorForm.fields, dict)
				this.untrackFields = trackFields.call(this, 'portmirrorForm')
			})
			.catch(err => reportError(err))
			this.portmirrorForm.loading = false
		},
		async save() {
			let requests = []
			this.portmirrorForm.loading = true
			const fields = this.$store.getters.nonEmptyFieldsValues(this.portmirrorForm.name)

			requests.push(ws.call(API.portmirroring.put, fields))

			Promise.all(requests)
			.then(() => {
				ws.call(API.commit)
			})
			.finally(() => {
				this.portmirrorForm.loading = false
				reportSuccess()
			})
		},
	}
}
</script>
