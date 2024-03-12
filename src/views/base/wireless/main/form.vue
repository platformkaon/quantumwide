<template>
	<section class="layer-popup-wrap">
		<form v-loading="ruleForm.loading" :name='ruleForm.name' :actions='false' @submit.prevent='saveRule'>
			<div class="layer-popup">
				<div class="layer-content none-min-width">
					<div class="layer-header">
						<div class="layer-title">
							<div class="title">{{ t(`add-rule`) }}</div>
						</div>
						<div class="close" @click='closeForm'>close</div>
					</div> <!-- /.layer-header -->
					<div class="layer-body">
						<div class="table-responsive">
							<table class="table-setting">
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="mac-address">{{ t("mac-address").cap }}
												<label style="color: red;">*</label>
											</label>
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
import { API, apiRPC } from '@/shared/constants'
import { fillObject, reportError, trackFields, QSpinshow, QSpinhide } from '@/shared/functions'
import val_mac from '@/shared/validators/mac.js'


export default {
	components: {
	},
	props: {
		interface: String
	},
	data() {
		return {
			ruleForm: {
				name: 'mac-filtering-rule-form',
				loading: false,
				fields: {
					mac: '',
				}
			},
			existingNumbers: [],
			check_option_name: []
		}
	},
	mounted() {
	},
	methods: {
		saveRule() {
			QSpinshow()

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

			ws.call(apiRPC("/wifi/ssid/fronthaul/" + this.interface, "get", {})).then(({ dict: ssidResp }) => {
				if (ssidResp.list[0]) {
					if(ssidResp.list[0].maclist.includes(this.ruleForm.fields.src_mac)) {
						reportError(this.t('mac-already-exists').cap)
						QSpinhide()
						return	
					}
					else {
						const fields = {
							name: ssidResp.list[0].name,
							ifname: ssidResp.list[0].ifname,
							maclist: ssidResp.list[0].maclist + ' ' + this.ruleForm.fields.src_mac
						}
						requests.push(
							ws.call(API.wireless.ssid.set, fields)
						)
						Promise.all(requests)
						.then(() => { 
							ws.call(API.commit)
						})
						.finally(() => {
							this.closeForm(true)
							QSpinhide()
						}, reportError)
					}
				}
			})
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