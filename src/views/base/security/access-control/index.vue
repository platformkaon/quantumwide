<template>
	<section class="section">
		<form :name="formName" @submit.prevent="save">
			<div class="table-responsive">
				<div class="table-title">{{ t('accesscontrol') }} Config</div>
				<table class="table-setting-wide table-setting-checkbox-group mt-3">
					<tbody>
						<tr>
							<th>
								<label class="form-label" for="">{{ t("lan-side").str }}</label>
							</th>
							<td>
								<div class="checkbox-list-flex">
									<div class="form-check">
										<input type="checkbox" class="form-check-input" id="SSH" name="lan-ssh"
											v-model="remoteAccessForm.fields.ssh_lan">
										<label class="form-check-label" for="SSH">{{ t('ssh').str }}</label>
									</div>
									<div class="form-check">
										<input type="checkbox" class="form-check-input" id="Web" name="lan-web"
											v-model="remoteAccessForm.fields.https_lan">
										<label class="form-check-label" for="Web">{{ t('web').str }}</label>
									</div>
									<div class="form-check">
										<input type="checkbox" class="form-check-input" id="ICMP" name="lan-icmp"
											v-model="remoteAccessForm.fields.icmp_lan">
										<label class="form-check-label" for="ICMP">{{ t('icmp').str }}</label>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<table class="table-setting-wide table-setting-checkbox-group mt-3" v-if="rtmode != 'bridge' ">
					<tbody>
						<tr>
							<th>
								<label class="form-label" for="">{{ t("wan-side").str }}</label>
							</th>
							<td>
								<div class="checkbox-list-flex">
									<div class="form-check">
										<input type="checkbox" class="form-check-input" name="wan-ssh" id="SSH2"
											v-model="remoteAccessForm.fields.ssh_wan">
										<label class="form-check-label" for="SSH2">{{ t('ssh').str }}</label>
									</div>
									<div class="form-check">
										<input type="checkbox" class="form-check-input" name="wan-web" id="Web2"
											v-model="remoteAccessForm.fields.https_wan">
										<label class="form-check-label" for="Web2">{{ t('web').str }}</label>
									</div>
									<div class="form-check">
										<input type="checkbox" class="form-check-input" id="ICMP2" name="wan-icmp"
											v-model="remoteAccessForm.fields.icmp_wan">
										<label class="form-check-label" for="ICMP2">{{ t('icmp').str }}</label>
									</div>
									<div class="form-check">
										<input type="checkbox" class="form-check-input" name="wan-tr69c" id="TR69C"
											v-model="remoteAccessForm.fields.tr69c_wan">
										<label class="form-check-label" for="TR69C">{{ t('tr69c').str }}</label>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<table class="table-setting-wide table-setting-checkbox-group mt-3" v-if="rtmode != 'bridge' ">
					<tbody>
						<tr>
							<th>
								<label class="form-label" for="">{{ t("prevent-syn-flood").str }}</label>
							</th>
							<td>
								<div class="checkbox-list-flex">
									<div class="form-check">
										<input type="checkbox" class="form-check-input" name="prevent-syn-flood" id="syn"
											v-model="remoteAccessForm.fields.prevent_syn_flood">
										<label class="form-check-label" for="syn">{{ t('prevent-syn-flood').str }}</label>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div> <!-- /.table-responsive -->
			<div class="btn-area btn-setting-area">
				<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				<!--button class="btn btn-secondary" @click="reset">{{ t('cancel').cap }}</button-->
			</div>
		</form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import { fillObject, reportError, trackFields, QSpinshow, QSpinhide } from '@/shared/functions'

export default {
	components: {
	},
	data() {
		return {
			formShown: false,
			formName: 'access-control-form',
			remoteAccessForm: {
				name: 'remote-access-form',
				loading: false,
				fields: {
					ssh_lan: false,
					http_lan: false,
					https_lan: false,
					icmp_lan: false,
					ssh_wan: false,
					http_wan: false,
					https_wan: false,
					icmp_wan: false,
					tr69c_wan: false,
					prevent_syn_flood: false
				},
			},
			fieldMappings : {
				'Access-SSH-LAN': 'ssh_lan',
				'Access-HTTP-LAN': 'http_lan',
				'Access-HTTPS-LAN': 'https_lan',
				'Access-ICMP-LAN': 'icmp_lan',
				'Access-SSH-WAN': 'ssh_wan',
				'Access-HTTP-WAN': 'http_wan',
				'Access-HTTPS-WAN': 'https_wan',
				'Access-ICMP-WAN': 'icmp_wan',
				'Access-TR69C-WAN': 'tr69c_wan',
				'defaults' : 'prevent_syn_flood'
			},
			rtmode: "",
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.remoteAccessForm.loading = true

			Promise.all([
				ws.call(API.feature)
			]).then(([
				{ dict: feature }
			]) => {
				this.rtmode = feature.rtmode
			})
			.catch(err => reportError(err))

			ws.call(API.access_control.get).then(({ dict: accessControl }) => {
				accessControl.list.forEach(item =>{
					let optionName
					if(item.option_name)
						optionName = item.option_name
					else
						optionName = item.session_name
					const enabled = item.enabled

					if (this.fieldMappings.hasOwnProperty(optionName)) {
						const field = this.fieldMappings[optionName]
						if(field.includes('lan'))
							this.remoteAccessForm.fields[field] = enabled === 0
						else
							this.remoteAccessForm.fields[field] = enabled === 1
					}
				})
			})
			.catch(err => reportError(err))

			this.untrackFields = trackFields.call(this, 'remoteAccessForm')
			
			this.remoteAccessForm.loading = false
		},
		async save() {
			QSpinshow()
			const savedValues = {}
			const requests = []

			Object.keys(this.remoteAccessForm.fields).forEach(field => {
				const optionName = Object.keys(this.fieldMappings).find(key => this.fieldMappings[key] === field)
				console.log(optionName)
				if (optionName && optionName.includes('LAN'))
					savedValues[optionName] = this.remoteAccessForm.fields[field] ? '0' : '1'
				else
					savedValues[optionName] = this.remoteAccessForm.fields[field] ? '1' : '0'
			})

			requests.push(ws.call(API.access_control.put, savedValues))

			Promise.all(requests)
			.then(() => { 
				ws.call(API.commit)
			})
			.finally(() => {
				this.fetchData()
				QSpinhide()
			}, reportError)
		}
	}
}
</script>

<style>.content-end {
	align-content: end;
}</style>
