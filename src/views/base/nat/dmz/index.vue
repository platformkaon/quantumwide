<template>
	<section class="section">
		<form 
			v-loading="loading"
			:name='dmzForm.name'
			@submit.prevent='save()'>
			<div class="table-responsive">
				<div class="table-title">{{ t('settings').cap }}</div>
				<table class="table-setting-wide">
						<tbody>
							<tr>
								<th>
									<label class="form-label" for="enabled" v-if="dmzForm.fields.enabled">{{ t("enabled").cap  }}</label>
									<label class="form-label" for="enabled" v-else>{{ t("disabled").cap }}</label>
								</th>
								<td>
									<div class="form-checkbox">
										<input type="checkbox" id="enabled" class="checkbox" v-model='dmzForm.fields.enabled'>
										<label class="label" for="enabled">checkbox label</label>
									</div>
								</td>
							</tr>
							<tr>
								<th>
									<label class="form-label" for="ip_address">{{ t("ip-address").cap }}</label>
								</th>
								<td>
									<input type="text" class="form-control" id="ip_address" placeholder="" :disabled='!dmzForm.fields.enabled' v-model='dmzForm.fields.dest_ip'>
								</td>
							</tr>
						</tbody>
				</table>
			</div> <!-- /.table-responsive -->
			<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
			</div>
		</form>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { fillObject, trackFields, reportError, reportSuccess } from '@/shared/functions'
import val_ip from '@/shared/validators/ip.js'

export default {
	data (){
		return{
			loading: false,
			dmzForm : {
				name: 'dmz-form',
				fields: {
					dest_ip: '',
					enabled: 0,
					src: 'wan',
					dest: 'lan',
					target: 'DNAT',
					proto: 'all',
					session_name: '',
					option_name: ''
				}
			}
		}
	},
	mounted () {
		this.fetchData()
	},
	
	methods: {
		fetchData () {
			this.loading = true
			ws.call(API.dmz.get).then(({ dict }) => {
				if(dict.list != undefined && dict.list.length != 0) {
					fillObject(this.dmzForm.fields, dict.list[0])
				}
				this.untrackFields = trackFields.call(this, 'dmzForm')
			})
			.catch(err => reportError(err))
			this.loading = false
		},
		save () {
			const requests = []
			const fields = {
				session_name: this.dmzForm.fields.session_name ?  this.dmzForm.fields.session_name : 'dmz',
				option_name: this.dmzForm.fields.option_name ?  this.dmzForm.fields.session_name : 'dmz',
				enabled: this.dmzForm.fields.enabled ? '1' : '0',
				src: 'wan',
				dest: 'lan',
				target: 'DNAT',
				proto: 'all',
				dest_ip: this.dmzForm.fields.dest_ip
			}

			if (this.dmzForm.fields.enabled && val_ip(this.dmzForm.fields.dest_ip)) {
				reportError(this.t("err.validation.ip4-3").cap)
				return
			}

			requests.push(ws.call(API.dmz.put , fields))

			Promise.all(requests)
			.then(() => { 
				ws.call(API.commit)
     		})
			.finally(() => {
				reportSuccess()
				this.fetchData ()
			}, reportError)
		}
	}
}
</script>
