<template>
	<section class="layer-popup-wrap">
		<form :name='interface.name' :loading='interface.loading' :actions='false' @submit.prevent='saveRule'>
			<div class="layer-popup">
				<div class="layer-content none-min-width">
					<div class="layer-header">
						<div class="layer-title">
							<div class="title">{{ t(`${section ? 'edit' : 'add'}-interface`) }}</div>
						</div>
						<div class="close" @click='closeForm'>close</div>
					</div> <!-- /.layer-header -->
					<div class="layer-body form-container">
						<div class="table-responsive">
							<div class="table-title">{{ t("dsl-ptm-configuration").cap }}</div>
							<table class="table-setting">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="device">{{ t("interface").cap }}</label>
										</th>
									</tr>
									<tr>
										<th>
											<input type="text" class="form-control" id="device" v-model='interface.fields.device' disabled="1">
										</th>
									</tr>
								</tbody>
							</table>
							<br>
							<div class="table-title font-weight-normal">{{ t("select-dsl-latency").cap }}</div>
							<table class="table-setting">
								<tbody>
									<tr>
										<th>
											<label class="form-label">{{ t("path0").cap }}</label>
										</th>
										<td>
											<label class="form-label">{{ t("path1").cap }}</label>
										</td>
									</tr>
									<tr>
										<th>
											<div class="form-checkbox">
												<input type="checkbox" class="checkbox" id="path0" name="path0"
													:checked="interface.fields.portid === '0' || interface.fields.portid === '4'"
													@change="updatePortId('0')">
												<label class="label" for="path0">{{ `Checkbox label portid` }}</label>
											</div>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" class="checkbox" id="path1" name="path1"
													:checked="interface.fields.portid === '1' || interface.fields.portid === '4'"
													@change="updatePortId('1')">
												<label class="label" for="path1">{{ `Checkbox label portid` }}</label>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
							<br>
							<div class="table-title font-weight-normal">{{ t("select-dsl-queue-scheduler").cap }}</div>
							<table class="table-setting">
								<tbody>
									<tr>
										<th>
											<label class="form-label">{{ t("weighted-round-robin").cap }}</label>
										</th>
										<td>
											<label class="form-label">{{ t("weighted-fair-queuing").cap }}</label>
										</td>
									</tr>
									<tr>
										<th>
											<div class="form-checkbox">
												<input type="checkbox" class="checkbox" id="wrr" name="wrr"
													:checked="interface.fields.queue_alg === 'wrr'"
                									@change="updateQueueAlg('wrr')">
												<label class="label" for="wrr"></label>
											</div>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" class="checkbox" id="wfq" name="wfq"
													:checked="interface.fields.queue_alg === 'wfq'"
                									@change="updateQueueAlg('wfq')">
												<label class="label" for="wfq"></label>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
							<br>
							<table class="table-setting">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="q_wght">{{ t("default-queue-weight").cap }}</label>
										</th>
									</tr>
									<tr>
										<td>
											<input type="text" class="form-control" id="q_wght" v-model='interface.fields.q_wght'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="q_prio">{{ t("default-queue-precedence").cap }}</label>
										</th>
									</tr>
									<tr>
										<td>
											<input type="text" class="form-control" id="q_prio" v-model='interface.fields.q_prio'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="mbr_kbps">{{ t("default-queue-min-rate").cap }}</label>
										</th>
									</tr>
									<tr>
										<td>
											<input type="text" class="form-control" id="mbr_kbps" v-model='interface.fields.mbr_kbps'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="pbr_kbps">{{ t("default-queue-shaping-rate").cap }}</label>
										</th>
									</tr>
									<tr>
										<td>
											<input type="text" class="form-control" id="pbr_kbps" v-model='interface.fields.pbr_kbps'>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="mbs_byte">{{ t("default-queue-shaping-burst").cap }}</label>
										</th>
									</tr>
									<tr>
										<td>
											<input type="text" class="form-control" id="mbs_byte" v-model='interface.fields.mbs_byte'>
										</td>
									</tr>
								</tbody>
							</table>
							<br>
							<div class="table-title font-weight-normal">{{ t("default-queue-drop-algorithm").cap }}</div>
							<table class="table-setting">
								<tbody>
									<tr>
										<th>
											<label class="form-label">{{ t("dt-drop-tail").cap }}</label>
										</th>
										<td>
											<label class="form-label">{{ t("red-random-early-detection").cap }}</label>
										</td>
										<td>
											<label class="form-label">{{ t("wred-weighted-red").cap }}</label>
										</td>
									</tr>
									<tr>
										<th>
											<div class="form-checkbox">
												<input type="checkbox" class="checkbox" id="dt" name="dt"
													:checked="interface.fields.queue_drop_alg === 'dt'"
                									@change="updateQueueDropAlg('dt')">
												<label class="label" for="dt"></label>
											</div>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" class="checkbox" id="red" name="red"
													:checked="interface.fields.queue_drop_alg === 'red'"
                									@change="updateQueueDropAlg('red')">
												<label class="label" for="red"></label>
											</div>
										</td>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" class="checkbox" id="wred" name="wred"
													:checked="interface.fields.queue_drop_alg === 'wred'"
                									@change="updateQueueDropAlg('wred')">
												<label class="label" for="wred"></label>
											</div>
										</td>
									</tr>
									<div v-if="interface.fields.queue_drop_alg === 'red'">
										<tr>
											<th>
												<label class="form-label" for="minThr">{{ t("minimum-threshold").cap }}</label>
											</th>
										</tr>
										<tr>
											<td>
												<input type="text" class="form-control" id="minThr" v-model='interface.fields.minThr'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="maxThr">{{ t("maximum-threshold").cap }}</label>
											</th>
										</tr>
										<tr>
											<td>
												<input type="text" class="form-control" id="maxThr" v-model='interface.fields.maxThr'>
											</td>
										</tr>
									</div>
									<div v-if="interface.fields.queue_drop_alg === 'wred'">
										<tr>
											<th>
												<label class="form-label" for="loMinThr">{{ t("low-class-min-threshold").cap }}</label>
											</th>
										</tr>
										<tr>
											<td>
												<input type="text" class="form-control" id="loMinThr" v-model='interface.fields.loMinThr'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="loMaxThr">{{ t("low-class-max-threshold").cap }}</label>
											</th>
										</tr>
										<tr>
											<td>
												<input type="text" class="form-control" id="loMaxThr" v-model='interface.fields.loMaxThr'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="hiMinThr">{{ t("high-class-min-threshold").cap }}</label>
											</th>
										</tr>
										<tr>
											<td>
												<input type="text" class="form-control" id="hiMinThr" v-model='interface.fields.hiMinThr'>
											</td>
										</tr>
										<tr>
											<th>
												<label class="form-label" for="hiMaxThr">{{ t("high-class-max-threshold").cap }}</label>
											</th>
										</tr>
										<tr>
											<td>
												<input type="text" class="form-control" id="hiMaxThr" v-model='interface.fields.hiMaxThr'>
											</td>
										</tr>
									</div>
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
import { RPC, API, apiRPC } from '@/shared/constants'
import { fillObject, reportError, trackFields, QSpinshow, QSpinhide } from '@/shared/functions'
import val_ip from '@/shared/validators/ip.js'
import val_ip6 from '@/shared/validators/ip6.js'
import validator from 'validator'
import number from '@/shared/validators/number.js'
import filled from '@/shared/validators/filled.js'

export default {
	components: {
	},
	props: {
		section: String
	},
	data() {
		return {
			interface: {
				name: 'rule-form',
				loading: true,
				fields: {
					session_name: '',
					device: '',
					portid: '1',
					priority: '1',
					queue_alg: 'wrr',
					queue_drop_alg: 'dt',
					q_wght: '1',
					q_prio: '7',
					mbr_kbps: '-1',
					pbr_kbps: '-1',
					mbs_byte: '3000',
					minThr: '',
					maxThr: '',
					loMinThr: '',
					loMaxThr: '',
					hiMinThr: '',
					hiMaxThr: '',
				},
			},
			existingNumbers: [],
		}
	},
	mounted() {
		QSpinshow()
		this.interface.loading = true
		ws.call(API.network.dsl.ptm.get).then(({ dict }) => {
			dict.list.forEach((item) => {
				const number = parseInt(item.session_name.split("ptm")[1])
				this.existingNumbers.push(number)
			})

			if(this.section != null) {
				const rule_number = Object.keys(dict.list).find(key => dict.list[key].session_name === this.section)
				fillObject(this.interface.fields, dict.list[rule_number])
			}
			else {
				let newNumber = 0
				while (this.existingNumbers.includes(newNumber)) {
					newNumber++
				}
				this.interface.fields.session_name = "ptm" + newNumber
				this.interface.fields.device = "ptm" + newNumber
			}
		})
		.catch(err => reportError(err))
		this.untrackFields = trackFields.call(this, 'interface')
		this.interface.loading = false
		QSpinhide()
	},
	methods: {
		updatePortId(value) {
			if ((value === '0' && this.interface.fields.portid === '1') ||
				(value === '1' && this.interface.fields.portid === '0') ) {
				this.interface.fields.portid = '4'
			} else if (this.interface.fields.portid = '4' && value === '0') {
				this.interface.fields.portid = '1'
			} else if (this.interface.fields.portid = '4' && value === '1') {
				this.interface.fields.portid = '0'
			}
		},
		updateQueueAlg(value) {
			if (this.interface.fields.queue_alg === value && value === "wfq") {
				this.interface.fields.queue_alg = "wrr"
			} 
			else if (this.interface.fields.queue_alg === value && value === "wrr") {
				this.interface.fields.queue_alg = "wfq"
			} else {
				this.interface.fields.queue_alg = value
			}
		},
		updateQueueDropAlg(value) {
			if (this.interface.fields.queue_drop_alg === value) {
				this.interface.fields.queue_drop_alg = "dt"
			} else {
				this.interface.fields.queue_drop_alg = value
			}
		},
		saveRule() {
			if(number(this.interface.fields.q_wght, 1, 63)){
				return reportError(this.t("default-queue-weight").cap)
			}
			else if(number(this.interface.fields.q_prio, 1, 8)){
				return reportError(this.t("default-queue-precedence").cap)
			}
			else if(number(this.interface.fields.mbr_kbps, 1, 50000) && this.interface.fields.mbr_kbps != -1 ){
				return reportError(this.t("default-queue-min-rate").cap)
			}
			else if(number(this.interface.fields.pbr_kbps, 1, 50000) && this.interface.fields.pbr_kbps != -1 ){
				return reportError(this.t("default-queue-shaping-rate").cap)
			}
			else if(number(this.interface.fields.mbs_byte, 1600)){
				return reportError(this.t("default-queue-shaping-burst").cap)
			}

			if(this.interface.fields.queue_drop_alg == "red"){
				if(number(this.interface.fields.minThr, 1, 100)){
					return reportError(this.t("minimum-threshold").cap)
				}
				else if(number(this.interface.fields.maxThr, 1, 100)){
					return reportError(this.t("maximum-threshold").cap)
				}
			}
			else if (this.interface.fields.queue_drop_alg == "wred"){
				if(number(this.interface.fields.loMinThr, 1, 100)){
					return reportError(this.t("low-class-min-threshold").cap)
				}
				else if(number(this.interface.fields.loMaxThr, 1, 100)){
					return reportError(this.t("low-class-max-threshold").cap)
				}
				else if(number(this.interface.fields.hiMinThr, 1, 100)){
					return reportError(this.t("high-class-min-threshold").cap)
				}
				else if(number(this.interface.fields.hiMaxThr, 1, 100)){
					return reportError(this.t("high-class-max-threshold").cap)
				}
			}

			QSpinshow()
			const requests = []
			const fields = this.$store.getters.nonEmptyFieldsValues(this.interface.name)

			requests.push(ws.call(API.network.dsl.ptm.put, fields))

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
				formName: this.interface.name
			})

			this.$emit('close', refresh)
		}
	}
}
</script>

<style>
	.form-container {
		max-height: 700px;
		overflow-y: scroll;
	}
</style>
