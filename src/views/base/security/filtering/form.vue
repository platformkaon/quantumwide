<template>
	<section class="layer-popup-wrap">
		<form v-loading="ruleForm.loading" :name='ruleForm.name' :actions='false' @submit.prevent='saveRule'>
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
											<label class="form-label" for="name">{{ t("name").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="name" placeholder=""
												v-model='ruleForm.fields.option_name'>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="direction">{{ t("direction").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<select v-model='ruleForm.fields.direction' class="form-select">
												<option v-for='item in directionOptions' :value='item.value'
													:key='item.value'>
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="src_ip">{{ t("source-ip").cap }}<label
													v-if="!ruleForm.fields.dest_ip || (ruleForm.fields.dest_ip && ruleForm.fields.src_ip)"
													style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="src_ip" placeholder=""
												v-model='ruleForm.fields.src_ip'>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="src_port">{{ t("src-port-or-range").cap
											}}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="src_port" placeholder=""
												v-model='ruleForm.fields.src_port'>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="dest_ip">{{ t("destination-ip").cap }}<label
													v-if="!ruleForm.fields.src_ip || (ruleForm.fields.dest_ip && ruleForm.fields.src_ip)"
													style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="dest_ip" placeholder=""
												v-model='ruleForm.fields.dest_ip'>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="dest_port">{{ t("port-or-range").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="dest_port" placeholder=""
												v-model='ruleForm.fields.dest_port'>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="proto">{{ t("protocol").cap }}<label
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
								</tbody>
							</table>
						</div>
					</div> <!-- /.layer-body -->
					<div class="layer-footer justify-content-center mt-5">
						<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
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
import val_port from '@/shared/validators/port-range.js'
import validator from 'validator'

export default {
	components: {
	},
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
					direction: '',
					enabled: '1',
					src_ip: '',
					src_port: '',
					dest_ip: '',
					dest_port: '',
					proto: 'tcp',
				}
			},
			protoOptions: [
				{ label: 'TCP', value: 'tcp' },
				{ label: 'UDP', value: 'udp' },
				{ label: 'TCP/UDP', value: 'tcpudp' },
				// {label: 'ICMP', value: 'icmp'},
				// {label: 'GRE', value: 'gre'},
				// {label: this.t('any'), value:'all'},
			],
			directionOptions: [
				{ label: this.t('inbound').cap, value: 'in' },
				{ label: this.t('outbound').cap, value: 'out' },
			],
			existingNumbers: [],
			check_option_name: []
		}
	},
	mounted() {
		QSpinshow()
		this.ruleForm.loading = true
		ws.call(API.ipfilter.get).then(({ dict }) => {
			this.max_userRule = dict.list.length + 1
			dict.list.forEach((item) => {
				this.check_option_name.push(item.option_name)
				const number = parseInt(item.session_name.split("_")[1])
				this.existingNumbers.push(number)
			})
		})

		if (this.section) {
			fillObject(this.ruleForm.fields, this.section)
		}

		this.untrackFields = trackFields.call(this, 'ruleForm')
		this.ruleForm.loading = false
		QSpinhide()
	},
	methods: {
		saveRule() {
			QSpinshow()
			if(validator.isAlphanumeric(this.ruleForm.fields.option_name, 'en-US', {ignore:' '})===false){
				QSpinhide()
				return reportError(this.t('policy-name').cap+" : "+this.t('err.validation.mac-1').cap)
			}
			else if(this.check_option_name.find(element => element == this.ruleForm.fields.option_name) && !this.section){
				QSpinhide()
				return reportError(this.t('filter-with-same-name-already-exists').cap)
			}
			else if (this.ruleForm.fields.direction.length === 0) {
				QSpinhide()
				reportError(this.t('direction').cap + " : " + this.t('err.validation.filled-1').cap)
				return
			}
			else if (this.ruleForm.fields.proto.length === 0) {
				QSpinhide()
				reportError(this.t('protocol').cap + " : " + this.t('err.validation.filled-1').cap)
				return
			}

			if (this.ruleForm.fields.src_ip === "" && this.ruleForm.fields.dest_ip === "") {
				reportError(this.t('err.validation.filled-1').cap)
				QSpinhide()
				return
			}
			else if (this.ruleForm.fields.src_ip.length > 0 && val_ip(this.ruleForm.fields.src_ip)) {
				reportError(this.t("err.validation.ip4-3").cap)
				QSpinhide()
				return
			}
			else if (this.ruleForm.fields.dest_ip.length > 0 && val_ip(this.ruleForm.fields.dest_ip)) {
				reportError(this.t("err.validation.ip4-3").cap)
				QSpinhide()
				return
			}
			
			if (this.ruleForm.fields.dest_port.length > 0) {
				if (val_port(this.ruleForm.fields.dest_port)) {
					QSpinhide()
					reportError(this.t('port').cap + " : " + this.t('err.validation.filled-1'))
					return
				}
			}
			else if (this.ruleForm.fields.src_port.length > 0) {
				if (val_port(this.ruleForm.fields.src_port)) {
					QSpinhide()
					reportError(this.t('port').cap + " : " + this.t('err.validation.filled-1'))
					return
				}
			}
			this.ruleForm.loading = true
			const requests = []
			const fields = this.$store.getters.nonEmptyFieldsValues(this.ruleForm.name)

			let newNumber = 1
			while (this.existingNumbers.includes(newNumber)) {
				newNumber++
			}

			if (!this.section) {
				fields.session_name = 'ipfilter_' + newNumber
			}

			if(fields.direction == 'in') {
				fields.src = 'wan'
				fields.target = 'DROP'
			}
			else {
				fields.dest = 'wan'
				fields.target = 'REJECT'
			}
			requests.push(ws.call(API.ipfilter.put, fields))

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
