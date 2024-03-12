<template>
	<section class="layer-popup-wrap">
		<form :name='ruleForm.name'
			:loading='ruleForm.loading'
			:actions='false'
			@submit.prevent='saveRule'>
			<div class="layer-popup">
					<div class="layer-content none-min-width">
							<div class="layer-header">
									<div class="layer-title">
											<div class="title">{{ t(`${section ? 'edit' : 'add'}-rule`) }}</div>
									</div>
									<div class="close" @click='closeForm'>close</div>
							</div>
							<div class="layer-body">
									<div class="table-responsive">
											<table class="table-setting" v-loading="this.ruleForm.loading">
													<tbody>
															<tr>
																	<th>
																			<label class="form-label" for="name">{{ t("name").cap }}<label style="color: red;">*</label></label>
																	</th>
																	<td>
																			<input type="text" class="form-control" id="name" placeholder="" v-model='ruleForm.fields.name'>
																	</td>
															</tr>
													</tbody>
                                                    <tbody>
                                                            <tr>
                                                                <th>
                                                                    <label class="form-label" for="path">{{ t("path").cap }}<label style="color: red;">*</label></label>
                                                                </th>
                                                                <td>
                                                                    <select
                                                                        v-model='ruleForm.fields.path'
                                                                        class="form-select">
                                                                        <option v-for='item in ruleForm.pathOptions'
                                                                            :value='item.value'
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
                                                                        <label class="form-label" for="read">{{ t('read-only').cap }}</label>
                                                                </th>
                                                                <td>
                                                                        <div class="form-checkbox">
                                                                                <input type="checkbox" id="read" name='read' class="checkbox" v-model='ruleForm.fields.read_only' true-value='yes' false-value='no'>
                                                                                <label class="label" for="read">checkbox label</label>
                                                                        </div>
                                                                </td>
															</tr>
                                                            <tr>
                                                                <th>
                                                                        <label class="form-label" for="browseable">{{ t('browseable').cap }}</label>
                                                                </th>
                                                                <td>
                                                                        <div class="form-checkbox">
                                                                                <input type="checkbox" id="browseable" name='browseable' class="checkbox" v-model='ruleForm.fields.browseable' true-value='yes' false-value='no'>
                                                                                <label class="label" for="browseable">checkbox label</label>
                                                                        </div>
                                                                </td>
															</tr>
                                                            <tr>
                                                                <th>
                                                                        <label class="form-label" for="guest">{{ t('guest-ok').cap }}</label>
                                                                </th>
                                                                <td>
                                                                        <div class="form-checkbox">
                                                                                <input type="checkbox" id="guest" name='guest' class="checkbox" v-model='ruleForm.fields.guest_ok' true-value='yes' false-value='no'>
                                                                                <label class="label" for="guest">checkbox label</label>
                                                                        </div>
                                                                </td>
															</tr>
                                                    </tbody>
											</table>
									</div>
							</div>
							<div class="layer-footer justify-content-center mt-5">
									<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
							</div>
					</div>
			</div>
		</form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { fillObject, reportError, trackFields, QSpinshow, QSpinhide  } from '@/shared/functions'

export default {
	props: {
		section: Object
	},
	data () {
		return {
			ruleForm: {
				name: 'sharedsamba-form',
				loading: true,
				fields: {
					name: '',
                    path: '',
                    read_only: 'no',
                    browseable: 'no',
                    guest_ok: 'no',
					users: '',
					session_name: 'temp_session_name',
					type: 'sambashare'
				},
                pathOptions : [],
				showid: ''
			},
		}
	},
    mounted() {
		QSpinshow()
        this.ruleForm.loading = true

        this.fetchData()

		if (this.section) {
			fillObject(this.ruleForm.fields, this.section)
		}

		this.untrackFields = trackFields.call(this, 'ruleForm')
		this.ruleForm.loading = false
		QSpinhide()
    },
	methods: {
        fetchData() {
			this.ruleForm.loading=true
			Promise.all([
				ws.call(API.usb.get)
			]).then(([ {dict:usb} ]) => {
				if (usb.blockdevices && usb.blockdevices.length != 0) {
					this.ruleForm.pathOptions = usb.blockdevices.filter(item => !item.name.startsWith("mtd") && !item.name.startsWith("ubi")).map(item => {
						return {
							label: item.children[0].mountpoint,
							value: item.children[0].mountpoint
						}
					})
				}
			}).finally(()=>{
				this.ruleForm.loading=false
			})
        },

		async saveRule () {
			this.ruleForm.loading = true

			if(this.ruleForm.fields.guest_ok==='no'){
				this.ruleForm.fields.users='smbuser'
			}
			else {
				this.ruleForm.fields.users=''
			}

			this.untrackFields = trackFields.call(this, 'ruleForm')

			const requests = []

			const fields = this.$store.getters.nonEmptyFieldsValues(this.ruleForm.name)
			if (Object.keys(fields).length) {
				requests.push(ws.call(API.share.samba.put, fields))
			}

			Promise.all(requests).then(() => {
				this.closeForm(true)
                this.ruleForm.loading = false
			}, reportError)

		},
		closeForm (refresh) {
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
