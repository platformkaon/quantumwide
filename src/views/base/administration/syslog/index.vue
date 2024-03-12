<template>
	<article class="article">
		<div class="wrap-content">
			<div class="container-fluid">
				<section class="section">
					<form :name='systemForm.name' @submit.prevent='save()'>
						<table class="table-setting-wide">
							<b-card header-tag="header" footer-tag="footer">
								<template #header>
									<h6 class="mb-0">
										<div class="table-title">{{ t('settings') }}</div>
									</h6>
								</template>
								<b-card-text>
									<tbody>
										<tr>
											<th>
												<label class="form-label" for="conloglevel">{{ t("conloglevel").cap }}</label>
											</th>
											<td>
												<select class="form-select"	name='conloglevel' v-model="systemForm.fields.conloglevel">
													<option v-for='item in levelOpts' :value='item.value' :key='item.value'>
														{{ item.label }}
													</option>
												</select>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="cronloglevel">{{ t("cronloglevel").cap }}</label>
											</th>
											<td>
												<select class="form-select"	name='cronloglevel' v-model="systemForm.fields.cronloglevel">
													<option v-for='item in levelOpts' :value='item.value' :key='item.value'>
														{{ item.label }}
													</option>
												</select>
											</td>
										</tr>
									</tbody>
								</b-card-text>
							</b-card>
							<div class="btn-area btn-setting-area">
								<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
							</div>
						</table>
					</form>

					<div class="btn-area btn-setting-area">
						<button class="btn btn-secondary" type="button"  @click="toggleTextarea">{{ showtextarea ? t('hide').cap : t('show').cap }}</button>
					</div>
					<br>
					<textarea v-if="showtextarea" class="kaon-textarea" v-model="systemForm.fields.logview"></textarea>
				</section>
			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { reportSuccess, reportError, fillObject, trackFields } from '@/shared/functions'

export default {
	data() {
		return {
			showtextarea: false,
			systemForm: {
				name: 'system-form',
				loading: false,
				fields: {
					conloglevel: '8',
					cronloglevel: '8',
					log_file: '/var/log/messages',
					logview: ''
				}
			},
			levelOpts: [
				{label: this.t('debug').cap, value: '8'},
				{label: this.t('info').cap, value: '7'},
				{label: this.t('notice').cap, value: '6'},
				{label: this.t('warning').cap, value: '5'},
				{label: this.t('error').cap, value: '4'},
				{label: this.t('critical').cap, value: '3'},
				{label: this.t('alert').cap, value: '2'},
				{label: this.t('emergency').cap, value: '1'},
			],
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.systemForm.loading = true
			ws.call(API.syslog.get).then(({ dict }) => {
				fillObject(this.systemForm.fields, dict)
				this.untrackFields = trackFields.call(this, 'systemForm')
			})
			.catch(err => reportError(err))
			this.systemForm.loading = false
		},
		async save() {
			let requests = []
			this.systemForm.loading = true
			const fields = this.$store.getters.nonEmptyFieldsValues(this.systemForm.name)

			requests.push(ws.call(API.syslog.put, fields))

			Promise.all(requests)
			.then(() => {
				ws.call(API.commit)
			})
			.finally(() => {
				this.systemForm.loading = false
				reportSuccess()
			})
		},
		toggleTextarea() {
			this.showtextarea = !this.showtextarea 
		}
	}
}
</script>
<style>
.kaon-textarea {
	min-height: 180px;
	min-width: 70%;
}</style>