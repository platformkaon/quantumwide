<template>
	<section class="section">
		<form v-loading="packetcaptureForm.loading" :name='packetcaptureForm.name' @submit.prevent='start()'>
			<div class="table-responsive">
				<table class="table-setting-wide">
					<b-card header-tag="header" footer-tag="footer">
						<template #header>
							<h6 class="mb-0">
								<div class="table-title">{{ t('packetcapture') }}</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="interface">{{ t("wan-interface").cap }}</label>
									</th>
									<td>
										<select class="form-select" v-model='packetcaptureForm.fields.interface'>
											<option v-for='item in wanOptions' :value='item.value' :key='item.value'>
												{{ item.label }}
											</option>
										</select>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="direction">{{ t("direction").cap }}</label>
									</th>
									<td>
										<select class="form-select" v-model='packetcaptureForm.fields.direction'>
											<option v-for='item in directionOptions' :value='item.value' :key='item.value'>
												{{ item.label }}
											</option>
										</select>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="duration">{{ t("duration").cap }}</label>
									</th>
									<td>
										<input type="text" class="form-control" id="duration" v-model='packetcaptureForm.fields.duration' placeholder='1-600 sec'>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="filename">{{ t("file-name").cap }}</label>
									</th>
									<td>
										<input type="text" class="form-control" id="filename" v-model='packetcaptureForm.fields.filename' placeholder='ex) *.pcap'>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="url">{{ t("url").cap }}</label>
									</th>
									<td>
										<input type="text" class="form-control" id="url" v-model='packetcaptureForm.fields.url'>
									</td>
								</tr>
								<!--tr>
									<th>
										<label class="form-label" for="username">{{ t("username").cap }}</label>
									</th>
									<td>
										<input type="text" class="form-control" id="username" v-model='packetcaptureForm.fields.username'>
									</td>
								</tr>
								<tr>
									<th>
										<label class="form-label" for="password">{{ t("password").cap }}</label>
									</th>
									<td>
										<input type="password" class="form-control" id="password" v-model='packetcaptureForm.fields.password'>
									</td>
								</tr-->
								<tr>
									<tr>
										<th>
											<label class="form-label" for="status">{{ t('status').cap }}</label>
										</th>
										<td>
											<label class="form-label" for="status">{{ t(`${packetcaptureForm.fields.status}`) }}</label>
										</td>
									</tr>
								</tr>
							</tbody>
						</b-card-text>
					</b-card>
				</table>
			</div> <!-- /.table-responsive -->
			<div class="btn-area btn-setting-area">
				<button class="btn btn-secondary" type="submit">{{ t('start').cap }}</button>
			</div>
		</form>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC, API, apiRPC } from '@/shared/constants'
import { fillObject, reportSuccess, reportError, getSubObject, trackFields } from '@/shared/functions'
import val_ip from '@/shared/validators/ip.js'
import number from '@/shared/validators/number.js'

export default {
	components: {
	},
	data() {
		return {
			packetcaptureForm: {
				name: 'portmirror-form',
				loading: false,
				fields: {
					interface: '',
					direction: 'inout',
					duration: '',
					filename: '',
					url: '',
					//username: '',
					//password: '',
					status: 'completed'
				},
			},
			wanOptions: [],
			directionOptions: [
				{label: 'in', value: 'in'},
				{label: 'out', value: 'out'},
				{label: 'in/out', value: 'inout'},
			]
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.packetcaptureForm.loading = true
			ws.call(apiRPC("/wan/interface/table", "get", {})).then(({ dict }) => {
				this.wanOptions = []
				const CheckInterface = new Set()

				Object.values(dict).forEach(item => {
					if (Array.isArray(item)) {
						item.forEach(listItem => {
							if (!CheckInterface.has(listItem.ifname)) {
								this.wanOptions.push({
									label: listItem.ifname != listItem.l3_device ? listItem.l3_device : listItem.ifname,
									value: listItem.ifname
								})
								CheckInterface.add(listItem.ifname)
							}
						})
					}
				})
			})
			.catch(err => reportError(err))

			ws.call(API.packetcapture.status).then(({ dict }) => {
				this.packetcaptureForm.fields.status = dict.status
			})
			.catch(err => reportError(err))

			this.untrackFields = trackFields.call(this, 'packetcaptureForm')

			this.packetcaptureForm.loading = false
		},
		async start() {
			let requests = []
			const fields = this.$store.getters.nonEmptyFieldsValues(this.packetcaptureForm.name)
			const deleteFields = this.$store.getters.emptyFields(this.packetcaptureForm.name)

			if (deleteFields.length > 0 ) {
				return reportError(this.t('err.validation.filled-1').cap)
			}

			if(val_ip(fields.url)){
				return reportError(this.t('ipv4-address').cap+" : "+this.t("err.validation.ip4-3").cap)
			}
			else if(number(fields.duration, 1, 600)){
				return reportError(this.t("err.validation.dhcp-range-1").cap)
			}
			else if(!fields.filename.includes(".pcap")){
				fields.filename += ".pcap"
			}

			this.packetcaptureForm.loading = true

			requests.push(ws.call(API.packetcapture.start, fields))

			Promise.all(requests)
			.finally(() => {
				this.packetcaptureForm.loading = false
				reportSuccess()
				this.fetchData()
			})
		},
	}
}
</script>
