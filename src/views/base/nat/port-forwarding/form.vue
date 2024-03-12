<template>
	<section class="layer-popup-wrap">
		<form :name='ruleForm.name' :loading='ruleForm.loading' :actions='false' @submit.prevent='saveRule'>
			<div class="layer-popup">
				<div class="layer-content none-min-width">
					<div class="layer-header">
						<div class="layer-title">
							<div class="title">{{ t(`${section ? 'edit' : 'add'}-rule`) }}</div>
						</div>
						<div class="close" @click='closeForm'>close</div>
					</div> <!-- /.layer-header -->
					<div class="layer-body" v-if="$vendor == 'kaon'">
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
									<tr>
										<th>
											<label class="form-label" for="ip_address_02">{{ t("ip-address").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='ruleForm.fields.dest_ip'>
												<option v-for="item in ipOptions" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr v-if="ruleForm.fields.dest_ip === '$custom'">
										<th>
											<label class="form-label" for="custom_port">{{ t("custom-ip").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="custom_port"
												:placeholder='t("custom-ip4-ip6").cap'
												v-model='ruleForm.customFields.dest_ip'
												@change="ruleForm.customFields.dest_ip = $event.target.value">
										</td>
									</tr>

									<tr>
										<th>
											<label class="form-label" for="protocol">{{ t("protocol").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='ruleForm.fields.proto'>
												<option v-for="item in protoOptions" :value="item.value" :key="item.value">
													{{ item.value }}
												</option>
											</select>
										</td>
									</tr>

									<tr>
										<th>
											<label class="form-label" for="port">{{ t("internal-port").cap }}</label>
										</th>
										<td>
											<select class="form-select" v-model='ruleForm.fields.dest_port'>
												<option v-for="item in portOptions" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr v-if="ruleForm.fields.dest_port === '$custom'">
										<th>
											<label class="form-label" for="custom_port">{{ t("custom-port").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="custom_port" placeholder='1-65535'
												v-model='ruleForm.customFields.dest_port'
												@change="ruleForm.customFields.dest_port = $event.target.value">
										</td>
									</tr>

									<tr>
										<th>
											<label class="form-label" for="external_port">{{ t("external-port").cap
											}}</label>
										</th>
										<td>
											<select v-model='ruleForm.fields.src_dport' class="form-select">
												<option v-for='item in portOptions' :value='item.value' :key='item.value'>
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr v-if="ruleForm.fields.src_dport === '$custom'">
										<th>
											<label class="form-label" for="custom_port">{{ t("custom-port").cap }}</label>
										</th>
										<td>
											<input type="text" class="form-control" id="custom_port" placeholder="1-65535"
												v-model='ruleForm.customFields.src_dport'
												@change="ruleForm.customFields.src_dport = $event.target.value">
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div class="layer-body" v-else>
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
												v-model='ruleForm.fields.name'>
										</td>
									</tr>
								</tbody>
							</table>
							<div class="table-title font-weight-normal mt-4">Source</div>
							<table class="table-setting-wide">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="network_zones">{{ t("network-zones").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<select v-model='ruleForm.fields.src' class="form-select">
												<option v-for='item in zoneOptions' :value='item.value' :key='item.value'>
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="ip_address">{{ t("ip-address").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="ip_address" placeholder=""
												v-model='ruleForm.fields.src_ip'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="external_port">{{ t("external-port").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<select v-model='ruleForm.fields.src_dport' class="form-select">
												<option v-for='item in portOptions' :value='item.value' :key='item.value'>
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr v-if="ruleForm.fields.src_dport === '$custom'">
										<th>
											<label class="form-label" for="custom_port">{{ t("custom-port").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="custom_port" placeholder="1-65535"
												v-model='ruleForm.customFields.src_dport'
												@change="ruleForm.customFields.src_dport = $event.target.value">
										</td>
									</tr>
								</tbody>
							</table>
							<div class="table-title font-weight-normal mt-4">Destination</div>
							<table class="table-setting-wide">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="network_zones_02">{{ t("network-zones").cap
											}}<label style="color: red;">*</label></label>
										</th>
										<td>
											<select class="form-select" v-model='ruleForm.fields.dest'>
												<option v-for="item in zoneOptions" :value="item.value" :key="item.value">
													{{ item.value }}
												</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="ip_address_02">{{ t("ip-address").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<select class="form-select" v-model='ruleForm.fields.dest_ip'>
												<option v-for="item in ipOptions" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr v-if="ruleForm.fields.dest_ip === '$custom'">
										<th>
											<label class="form-label" for="custom_port">{{ t("custom-ip").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="custom_port"
												:placeholder='t("custom-ip4-ip6").cap'
												v-model='ruleForm.customFields.dest_ip'
												@change="ruleForm.customFields.dest_ip = $event.target.value">
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="port">{{ t("port").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<select class="form-select" v-model='ruleForm.fields.dest_port'>
												<option v-for="item in portOptions" :value="item.value" :key="item.value">
													{{ item.label }}
												</option>
											</select>
										</td>
									</tr>
									<tr v-if="ruleForm.fields.dest_port === '$custom'">
										<th>
											<label class="form-label" for="custom_port">{{ t("custom-port").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="custom_port" placeholder='1-65535'
												v-model='ruleForm.customFields.dest_port'
												@change="ruleForm.customFields.dest_port = $event.target.value">
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="protocol">{{ t("protocol").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<select class="form-select" v-model='ruleForm.fields.proto'>
												<option v-for="item in protoOptions" :value="item.value" :key="item.value">
													{{ item.value }}
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
import val_ip from '@/shared/validators/ip.js'
import validator from 'validator'

function getZoneOpts() {
	return ws.call(RPC.firewall.zones).then(({ dict }) => {
		let zones = []
		for (let zone in dict.values) {
			let name = dict.values[zone].name
			zones.push({ label: name, value: name })
		}
		return zones
	})
}

function getArp() {
	return ws.call(API.status.arp).then(({ dict }) => dict)
}


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
					enabled: '1',
					src: 'wan',
					src_ip: '0.0.0.0/0',
					src_dport: '',
					dest: 'lan',
					dest_ip: '',
					dest_port: '',
					proto: '',
					target: 'DNAT',
				},
				customFields: {
					src_dport: '',
					dest_ip: '',
					dest_port: '',
				},
			},
			portOptions: [
				{ label: 'HTTP 80', value: '80' },
				{ label: 'SSH 22', value: '22' },
				{ label: 'SIP Encrypted 5060', value: '5060' },
				{ label: 'SIP Non-encrypted 5061', value: '5061' },
				{ label: 'FTP Passive 21', value: '21' },
				{ label: 'FTP Active 20', value: '20' },
				{ label: this.t("custom-port").cap, value: '$custom' }
			],
			protoOptions: [
				// {label: 'All', value: 'all'},
				{ label: 'TCP', value: 'tcp' },
				{ label: 'UDP', value: 'udp' },
				{ label: 'TCP+UDP', value: 'tcpudp' },
				// {label: 'ICMP', value:'icmp'},
			],
			zoneOptions: [],
			ipOptions: [],
			existingNumbers: [],
			check_option_name: []
		}
	},
	mounted() {
		QSpinshow()
		this.ruleForm.loading = true

		const requests = [
			getArp(),
		]

		Promise.all(requests).then(([{ arp }]) => {
			this.ipOptions = []
			const lines = arp.split('\n').slice(1, arp.split('\n').length - 1)
			lines.map(item => {
				const array = item.replace(/\s\s+/g, ' ').split(' ')
				if (array[array.length - 1] !== 'privbr') {
					this.ipOptions.push({
						label: array[0],
						value: array[0]
					})
				}
			})

			this.ipOptions.push({
				label: this.t("custom-ip").cap,
				value: '$custom'
			})

			ws.call(API.portforward.get).then(({ dict }) => {
				this.max_userRule = dict.list.length + 1
				dict.list.forEach((item) => {
					this.check_option_name.push(item.option_name)
					const number = parseInt(item.session_name.split("_")[1])
					this.existingNumbers.push(number)
				})
			})

			if (this.section) {
				fillObject(this.ruleForm.fields, this.section)

				if(!this.ipOptions.some(option => option.value === this.section.dest_ip)) {
					this.ruleForm.fields.dest_ip = '$custom'
					this.ruleForm.customFields.dest_ip = this.section.dest_ip
				}

				if(!this.portOptions.some(option => option.value === this.section.dest_port)) {
					this.ruleForm.fields.dest_port = '$custom'
					this.ruleForm.customFields.dest_port = this.section.dest_port
				}

				if(!this.portOptions.some(option => option.value === this.section.src_dport)) {
					this.ruleForm.fields.src_dport = '$custom'
					this.ruleForm.customFields.src_dport = this.section.src_dport
				}
			}

			this.untrackFields = trackFields.call(this, 'ruleForm')
			this.ruleForm.loading = false
		}, reportError).finally(() => QSpinhide())

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

			if (this.ruleForm.fields.src_ip === "") {
				reportError(this.t('err.validation.filled-1').cap)
				QSpinhide()
				return
			}
			else if (this.ruleForm.fields.dest_ip === undefined || (this.ruleForm.fields.dest_ip === '$custom' && this.ruleForm.customFields.dest_ip.length === 0)) {
				reportError(this.t('err.validation.filled-1').cap)
				QSpinhide()
				return
			}

			this.ruleForm.loading = true
			const requests = []
			const fields = this.$store.getters.nonEmptyFieldsValues(this.ruleForm.name)
			const deleteFields = this.$store.getters.emptyFields(this.ruleForm.name)
			if (deleteFields.length > 0  && !(deleteFields.length == 1 && deleteFields[0] == 'session_name' )) {
				reportError(this.t('err.validation.filled-1').cap)
				QSpinhide()
				return
			}
			else if (this.ruleForm.fields.dest_ip === '$custom' && val_ip(this.ruleForm.customFields.dest_ip)) {
				reportError(this.t("err.validation.ip4-3").cap)
				QSpinhide()
				return
			}

			fields.enabled = fields.enabled.toString()

			let newNumber = 1
			while (this.existingNumbers.includes(newNumber)) {
				newNumber++;
			}

			if (!this.section) {
				fields.session_name = 'portforward_' + this.max_userRule
			}

			requests.push(ws.call(API.portforward.put, fields))
			//requests.push(ws.call(RPC.dmz.reorder))

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

