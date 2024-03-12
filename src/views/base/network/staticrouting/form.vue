<template>
	<section class="layer-popup-wrap">
		<form :name='staticroutingForm.name' :loading='staticroutingForm.loading' :actions='false' @submit.prevent='saveRule'>
			<div class="layer-popup">
				<div class="layer-content none-min-width">
					<div class="layer-header">
						<div class="layer-title">
							<div class="title">{{ t(`${section ? 'edit' : 'add'}-rule`) }}</div>
						</div>
						<div class="close" @click='closeForm'>close</div>
					</div> <!-- /.layer-header -->
					<div class="layer-body">
						<div class="table-responsive">
							<table class="table-setting">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="target">{{ t("destination-ip").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="target" placeholder=""
												v-model='staticroutingForm.fields.target'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="interface">{{ t("interface").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='staticroutingForm.fields.interface'>
												<option v-for="item in interfaceOptions" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="netmask">{{ t("netmask").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="netmask" placeholder=""
												v-model='staticroutingForm.fields.netmask'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="gateway">{{ t("gateway").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="gateway" placeholder=""
												v-model='staticroutingForm.fields.gateway'>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div class="layer-footer justify-content-center mt-5">
						<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
						<button class="btn btn-secondary" @click='closeForm'>{{ t('cancel').cap }}</button>
					</div><!-- /.layer-footer -->
				</div> <!-- /.layer-content -->
			</div>
		</form>
	</section> <!-- /.layer-popup-wrap -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { fillObject, reportError, trackFields, QSpinshow, QSpinhide } from '@/shared/functions'
import val_ip from '@/shared/validators/ip.js'
import ipaddr from 'ipaddr.js'

export default {
	components: {
	},
	props: {
		section: Object
	},
	data() {
		return {
			staticroutingForm: {
				name: 'rule-form',
				loading: true,
				fields: {
					session_name: '',
					target: '',
					interface: '',
					netmask:'',
					gateway:''
				},
			},
			interfaceOptions: [],
			existingNumbers: [],
		}
	},
	mounted() {
		QSpinshow()
		this.staticroutingForm.loading = true

		ws.call(API.network.interface.get).then(({ dict }) => {
			const interfaces = dict.interface.split(' ').filter(item => item !== '')

			interfaces.forEach((temp_interface) => {
				this.interfaceOptions.push({
					label: temp_interface,
					value: temp_interface
				})
			})

			ws.call(API.network.staticrouting.get).then(({ dict }) => {
				this.max_userRule = dict.list.length + 1
				dict.list.forEach((item) => {
					const number = parseInt(item.session_name.split("_")[1])
					this.existingNumbers.push(number)
				})
			})

			if (this.section) {
				fillObject(this.staticroutingForm.fields, this.section)
			}

			this.untrackFields = trackFields.call(this, 'staticroutingForm')
			this.staticroutingForm.loading = false
		}, reportError).finally(() => QSpinhide())

	},
	methods: {
		async saveRule() {
			QSpinshow()

			this.staticroutingForm.loading = true
			const requests = []

			if(val_ip(this.staticroutingForm.fields.gateway)){
				QSpinhide()
				return reportError(this.t('default-gateway').cap+" : "+this.t("err.validation.ip4-3").cap)
			}

			if(!ipaddr.isValid(this.staticroutingForm.fields.target)){
				QSpinhide()
				return reportError(this.t('target').cap+" : "+this.t("err.validation.ip4-3").cap)
			}

			if(!ipaddr.isValid(this.staticroutingForm.fields.netmask)){
				QSpinhide()
				return reportError(this.t('netmask').cap+" : "+this.t("err.validation.subnet-1").cap)
			}

			let newNumber = 1
			while (this.existingNumbers.includes(newNumber)) {
				newNumber++;
			}

			if (!this.section) {
				this.staticroutingForm.fields.session_name = 'route_' + this.max_userRule
			}
			this.untrackFields = trackFields.call(this, 'staticroutingForm')
			const fields = this.$store.getters.nonEmptyFieldsValues(this.staticroutingForm.name)

			requests.push(ws.call(API.network.staticrouting.put, fields))

			Promise.all(requests)
			.then(() => { 
				ws.call(API.commit)
     		})
			.finally(() => {
				this.closeForm(true)
				QSpinhide()
			}, reportError)

		},
		closeForm(refresh) {
			if (this.untrackFields) {
				this.untrackFields()
			}
			this.$store.commit('UNSTAGE_FORM', {
				formName: this.staticroutingForm.name
			})

			this.$emit('close', refresh)
		}
	}
}
</script>

