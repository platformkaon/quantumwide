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
											<label class="form-label" for="mac-address">{{ t("mac-address").cap }}<label
													style="color: red;">*</label></label>
										</th>
										<td>
											<input type="text" class="form-control" id="mac-address"
												placeholder=" XX:XX:XX:XX:XX:XX" v-model='ruleForm.fields.src_mac'>
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
import val_mac from '@/shared/validators/mac.js'
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
				name: 'mac-filtering-rule-form',
				loading: true,
				fields: {
					session_name: '',
					option_name: '',
					enabled: '1',
					src_mac: '',
					src: 'wan',
					target: 'DROP'
				}
			},
			existingNumbers: [],
			check_option_name: []
		}
	},
	mounted() {
		QSpinshow()
		this.ruleForm.loading = true
		ws.call(API.macfilter.get).then(({ dict }) => {
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

			if (this.ruleForm.fields.src_mac === "") {
				reportError(this.t('err.validation.filled-1').cap)
				QSpinhide()
				return
			}
			else if(val_mac(this.ruleForm.fields.src_mac)) {
				reportError(this.t('invaild-address').cap)
				QSpinhide()
				return
			}

			this.ruleForm.loading = true
			const requests = []
			const fields = this.$store.getters.nonEmptyFieldsValues(this.ruleForm.name)

			let newNumber = 1
			while (this.existingNumbers.includes(newNumber)) {
				newNumber++
			}

			if (!this.section) {
				fields.session_name = 'macfilter_' + newNumber
			}

			requests.push(ws.call(API.macfilter.put, fields))

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