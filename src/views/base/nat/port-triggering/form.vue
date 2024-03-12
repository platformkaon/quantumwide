<template>
	<section class="layer-popup-wrap">
		<form :name='ruleForm.name' v-loading="ruleForm.loading" :actions='false' @submit.prevent='saveRule'>
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
							<table class="table-setting-wide">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="name">{{ t("name").cap }}<label
												style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="name" placeholder=""
												v-model='ruleForm.fields.option_name'>
										</td>
									</tr>
								</tbody>
							</table>
							<div class="table-title font-weight-normal">Trigger</div>
							<table class="table-setting-wide">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="trigger_port_start">{{
												t("trigger-port-start").cap }}<label style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="trigger_port_start"
												v-model="ruleForm.fields.trigger_port_start">
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="trigger_port_end">{{ t("trigger-port-end").cap
											}}<label style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="trigger_port_end"
												v-model="ruleForm.fields.trigger_port_end">
										</td>
									</tr>
								</tbody>
							</table>
							<div class="table-title font-weight-normal mt-4">Open</div>
							<table class="table-setting-wide">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="open_port_start">{{ t("open-port-start").cap
											}}<label style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="open_port_start" placeholder=""
												v-model="ruleForm.fields.open_port_start">
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="open_port_end">{{ t("open-port-end").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="open_port_end" placeholder=""
												v-model="ruleForm.fields.open_port_end">
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="protocol_02">{{ t("protocol").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<select v-model='ruleForm.fields.proto' class="form-select">
												<option v-for='item in protoOptions' :value='item.value' :key='item.value'>
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="interface">{{ t("interface").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<select v-model='ruleForm.fields.dest' class="form-select">
												<option v-for='item in iFaceOptions' :value='item.value' :key='item.value'>
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div> <!-- /.layer-body -->
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
import validator from 'validator';

export default {
	props: {
		section: Object
	},
	data() {
		return {
			ruleForm: {
				name: 'rule-form',
				loading: true,
				fields: {
					session_name: '',
					option_name: '',
					enabled: '1',
					trigger_port_start: '',
					trigger_port_end: '',
					open_port_start: '',
					open_port_end: '',
					dest: '',
					proto: '',
				},
			},
			protoOptions: [
				{ label: 'TCP', value: 'tcp' },
				{ label: 'UDP', value: 'udp' },
				{ label: 'TCP+UDP', value: 'tcpudp' },
			],
			iFaceOptions: [
				{ label: 'WAN', value: 'wan' },
			],
			existingNumbers: [],
			check_option_name: []
		}
	},
	mounted() {
		QSpinshow()
		this.ruleForm.loading = true

		if (this.section) {
			fillObject(this.ruleForm.fields, this.section)
		}

		ws.call(API.porttrigger.get).then(({ dict }) => {
			dict.list.forEach((item) =>{
				this.check_option_name.push(item.option_name)
				const number = parseInt(item.session_name.split("_")[1])
				this.existingNumbers.push(number)
			})
		})

		this.untrackFields = trackFields.call(this, 'ruleForm')
		this.ruleForm.loading = false
		QSpinhide()
	},
	methods: {
		async saveRule() {
			QSpinshow()
			if(validator.isAlphanumeric(this.ruleForm.fields.option_name, 'en-US', {ignore:' '})===false){
				QSpinhide()
				return reportError(this.t('policy-name').cap+" : "+this.t('err.validation.mac-1').cap)
			}
			else if(this.check_option_name.find(element => element == this.ruleForm.fields.option_name) && !this.section){
				QSpinhide()
				return reportError(this.t('filter-with-same-name-already-exists').cap)
			}

			let newNumber = 1
			while (this.existingNumbers.includes(newNumber)) {
				newNumber++;
			}

			this.ruleForm.loading = true
			const requests = []
			const params = {
				session_name: this.section ? this.ruleForm.fields.session_name : 'porttrigger_' + newNumber,
				option_name: this.ruleForm.fields.option_name,
				enabled: '1',
				src: 'lan',
				dest: 'wan',
				dest_port: this.ruleForm.fields.open_port_start + ':' + this.ruleForm.fields.open_port_end,
				src_dport: this.ruleForm.fields.trigger_port_start + ':' + this.ruleForm.fields.trigger_port_end,
				target: 'ACCEPT',
				proto: this.ruleForm.fields.proto
			}

			requests.push(ws.call(API.porttrigger.put , params))

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
				formName: this.ruleForm.name
			})

			this.$emit('close', refresh)
		}
	}
}
</script>
