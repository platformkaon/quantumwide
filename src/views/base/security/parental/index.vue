<template>
	<section class="section">
		<form
			v-loading="accessTimeForm.loading"
			:name='accessTimeForm.name'
			@submit.prevent='save()'>
			<div class="table-responsive">

			<div class="mb-3">
			<!-- <a v-b-toggle href="#example-collapse" @click.prevent>Toggle Collapse</a> -->
				<b-button v-b-toggle href="#example-collapse" @click.prevent>{{ t('show').cap+" "+t('connected-devices').cap }}</b-button>
			</div>
			<b-collapse id="example-collapse">
			<b-card title="">
				<CdPage></CdPage>
			</b-card>
			<br>
			</b-collapse>

			<table class="table-setting-wide">
				<b-card header-tag="header" footer-tag="footer">
					<template #header>
						<h6 class="mb-0">
							<div class="table-title">{{ t('settings').cap }}</div>
						</h6>
					</template>

					<b-card-text>
						<ul class="list-setting">
							<li>
								<div class="label-sm">
									<tr>
										<label class="form-label" for="policy">{{ t('policy-name').cap }}<label style="color: red;">*</label></label>
										<input type="text" class="form-control" name='policy' id="policy" v-model='accessTimeForm.fields.option_name' :disabled="disable_useip">
									</tr>
								</div>
							</li>
							<li>
								<div class="label-sm">
									<tr v-if="useIp">
										<label class="form-label" for="ip_addr">{{ t('ip-address').cap }}<label style="color: red;">*</label></label>
										<input type="text" class="form-control" name='ip_addr' id="ip_addr" v-model='accessTimeForm.fields.ip'>
									</tr>
									<tr v-else>
										<label class="form-label" for="mac_addr">{{ t('mac-address').cap }}<label style="color: red;">*</label></label>
										<input type="text" class="form-control" name='mac_addr' id="mac_addr" v-model='accessTimeForm.fields.mac'>
									</tr>
								</div>
							</li>
							<li>
								<div class="label-sm">
									<tr>
										<label class="form-label" for="enabled" v-if="useIp">{{ t("use-ip-enabled").cap }}</label>
										<label class="form-label" for="enabled" v-else>{{ t("use-ip-disabled").cap }}</label>
										<div class="form-checkbox">
												<input :disabled='disable_useip' type="checkbox" id="enabled" class="checkbox" v-model='useIp'>
												<label class="label" for="enabled">checkbox label</label>
										</div>
									</tr>
								</div>
							</li>
						</ul>
						<hr>
						<ul class="list-setting">
							<li>
									<div class="label-sm">
												<div class="table-title">{{ t('blocking-days').cap }}</div>
												<div>
													<el-checkbox v-model="accessTimeForm.fields.blockedDays.Mon">{{ t('monday').cap }}</el-checkbox>
												</div>
												<div>	
													<el-checkbox v-model="accessTimeForm.fields.blockedDays.Tue">{{ t('tuesday').cap}}</el-checkbox>
												</div>
												<div>
													<el-checkbox v-model="accessTimeForm.fields.blockedDays.Wed">{{ t('wednesday').cap}}</el-checkbox>
												</div>
												<div>
													<el-checkbox v-model="accessTimeForm.fields.blockedDays.Thu">{{ t('thursday').cap}}</el-checkbox>
												</div>
												<div>
													<el-checkbox v-model="accessTimeForm.fields.blockedDays.Fri">{{ t('friday').cap}}</el-checkbox>
												</div>
												<div>
													<el-checkbox v-model="accessTimeForm.fields.blockedDays.Sat">{{ t('saturday').cap}}</el-checkbox>
												</div>
												<div>
													<el-checkbox v-model="accessTimeForm.fields.blockedDays.Sun">{{ t('sunday').cap}}</el-checkbox>
												</div>
									</div>
							</li>
							<li>
									<div class="label-sm">
												<div class="table-title">{{ t('blocking-time').cap }}</div>
													<tr>
														<label class="form-label" for="sthm">{{ t('start').cap+' '+t('hours').cap+':'+t('minutes').cap}}</label>
														<input type="text" class="form-control" placeholder="00:00" name='sthm' id="sthm" v-model='accessTimeForm.fields.startTime.hrmin'>
													</tr>
													<tr>
														<label class="form-label" for="ethm">{{ t('end').cap+' '+t('hours').cap+':'+t('minutes').cap}}</label>
														<input type="text" class="form-control" placeholder="00:00" name='ethm' id="ethm" v-model='accessTimeForm.fields.endTime.hrmin'>
													</tr>
									</div>
							</li>
							<li>
									<div class="label-sm">
												<div class="table-title">{{ t('block-url').cap }}</div>
													<tr>
															<label class="form-label" for="url" v-if="useUrl">{{ t("block-url-enabled").cap }}</label>
															<label class="form-label" for="url" v-else>{{ t("block-url-disabled").cap }}</label>
															<div class="form-checkbox">
																	<input :disabled="disable_useip" type="checkbox" id="url" class="checkbox" v-model='useUrl'>
																	<label class="label" for="url">checkbox label</label>
															</div>
													</tr>
													<tr v-if="useUrl">
														<label class="form-label" for="url_addr">{{ t('url').cap }}</label>
														<input :disabled="disable_useip" placeholder="ex) google.com" type="text" class="form-control" name='url_addr' id="url_addr" v-model='accessTimeForm.fields.url'>
													</tr>
									</div>
							</li>
						</ul>
					</b-card-text>

					<div class="btn-area btn-setting-area">
							<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
					</div>

				</b-card>
			</table>
			</div>

			<br>


<!-- 
			<table>
				<b-card header-tag="header" footer-tag="footer">
					<template #header>
						<h6 class="mb-0">
							<div class="table-title">{{ t('settings').cap }}</div>
						</h6>
					</template> -->

					<h6 class="mb-0">
						<div class="table-title">{{ t('management').cap+" "+t('settings').cap }}</div>
					</h6>
					<el-table
						empty-text=" "
						:data="tableData"
						style="width: 100%">

						<el-table-column label="" fixed>
							<template slot-scope="scope">
								<el-button size="mini" type="button" value="Criar" @click='editPolicy(scope.row)'>
									{{ t('edit').cap }}
								</el-button>
							</template>
						</el-table-column>

						<el-table-column label="Remove" align="center" fixed>
							<template slot-scope="scope">
								<el-checkbox v-model="scope.row.delete"></el-checkbox>
							</template>
						</el-table-column>

						<el-table-column prop="option_name" :label="this.t('name').cap"></el-table-column>
						<el-table-column prop="mac" :label="this.t('mac').cap"></el-table-column>
						<el-table-column prop="ip" :label="this.t('ip').cap"></el-table-column>
						<el-table-column prop="url" :label="this.t('url').cap"></el-table-column>

						<el-table-column align="center" :label="this.t('monday_3').cap">
							<template slot-scope="scope">
								<i v-if="scope.row.blockedDays.Mon" class="el-icon-check"></i>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="this.t('tuesday_3').cap">
							<template slot-scope="scope">
								<i v-if="scope.row.blockedDays.Tue" class="el-icon-check"></i>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="this.t('wednesday_3').cap">
							<template slot-scope="scope">
								<i v-if="scope.row.blockedDays.Wed" class="el-icon-check"></i>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="this.t('thursday_3').cap">
							<template slot-scope="scope">
								<i v-if="scope.row.blockedDays.Thu" class="el-icon-check"></i>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="this.t('friday_3').cap">
							<template slot-scope="scope">
								<i v-if="scope.row.blockedDays.Fri" class="el-icon-check"></i>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="this.t('saturday_3').cap">
							<template slot-scope="scope">
								<i v-if="scope.row.blockedDays.Sat" class="el-icon-check"></i>
							</template>
						</el-table-column>
						<el-table-column align="center" :label="this.t('sunday_3').cap">
							<template slot-scope="scope">
								<i v-if="scope.row.blockedDays.Sun" class="el-icon-check"></i>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="startTime.hrmin" :label="this.t('start').cap"></el-table-column>
						<el-table-column align="center" prop="endTime.hrmin" :label="this.t('end').cap"></el-table-column>
					</el-table>

					<br>
					<fieldset class="fieldset">
						<button
							type="button"
							for="input-create"
							class="btn btn-secondary"
							value="Remover"
							@click="deletePolicies()"
						>
							<div class="holder-icon">
								{{ t('remove').cap }}
							</div>
						</button>
					</fieldset>
		</form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { reportError, reportSuccess, fillObject, QSpinshow, QSpinhide } from '@/shared/functions'
import val_ip4 from '@/shared/validators/ip.js'
import val_ip6 from '@/shared/validators/ip6.js'
import val_mac from '@/shared/validators/mac.js'
import val_domain from '@/shared/validators/domain.js'
// import isUrlValid from 'is-valid-domain';
import validator from 'validator';
import CdPage from "../../status/device/index"

export default {
	components: {
		CdPage
	},
	data () {
		return {
			useIp: false,
			useUrl: false,
			accessTimeForm: {
				name: "access-time-form",
				loading: false,
				fields: {
					imenabled: '',
					enabled: '1',
					session_name: '',
					option_name: '',
					mac: '',
					ip: '',
					blockedDays: {
						Mon: false,
						Tue: false,
						Wed: false,
						Thu: false,
						Fri: false,
						Sat: false,
						Sun: false
					},
					startTime: {
						hr: '',
						min: '',
						hrmin: '00:00'
					},
					endTime: {
						hr: '',
						min: '',
						hrmin: '23:59'
					},
					url: ''
				}
			},
			emptyFields: {
				enabled: '1',
				session_name: '',
				option_name: '',
				mac: '',
				ip: '',
				blockedDays: {
					Mon: false,
					Tue: false,
					Wed: false,
					Thu: false,
					Fri: false,
					Sat: false,
					Sun: false
				},
				startTime: {
					hr: '',
					min: '',
					hrmin: '00:00'
				},
				endTime: {
					hr: '',
					min: '',
					hrmin: '23:59'
				},
				url: ''
			},
			SpinTime: 0,
			policies: [],
			disable_useip: false,
			check_name: [],
			/*FOR PARENTAL CONTROL TABLE*/
			tableData: [],
			existingNumbers: [],
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData () {
			this.accessTimeForm.loading = true
			this.disable_useip = false

			this.tableData = []
			ws.call(API.parentalcontrol.get).then(({ dict }) => {
				dict.list.forEach(item => {
					const number = parseInt(item.session_name.split("_")[1])
   					this.existingNumbers.push(number)
					let blockedDays = {
						Mon: false,
						Tue: false,
						Wed: false,
						Thu: false,
						Fri: false,
						Sat: false,
						Sun: false
					}

					let startTime = {
						hr: '',
						min: '',
						hrmin: item.start_time
					}

					let endTime = {
						hr: '',
						min: '',
						hrmin: item.stop_time
					}

					item.weekdays.split(',').forEach(day => {
						if (blockedDays.hasOwnProperty(day)) {
							blockedDays[day] = true;
						}
					})

					this.tableData.push({
						session_name: item.session_name,
						option_name: item.option_name,
						blockedDays,
						startTime: startTime,
						endTime: endTime,
						ip: item.src_ip,
						mac: item.src_mac,
						url: item.url
					})
				})
			})
			this.accessTimeForm.loading = false
		},
		async save () {
			const requests = []
			let day = this.accessTimeForm.fields.blockedDays
			var policyName = this.accessTimeForm.fields.option_name
			var start = this.accessTimeForm.fields.startTime
			var end = this.accessTimeForm.fields.endTime
			var ipAddr = this.accessTimeForm.fields.ip
			var macAddr = this.accessTimeForm.fields.mac

			if(validator.isAlphanumeric(this.accessTimeForm.fields.option_name, 'en-US', {ignore:' '})===false){
				return reportError(this.t('policy-name').cap+" : "+this.t('err.validation.mac-1').cap)
			}
			else  if(this.check_name.find(element=>element===this.accessTimeForm.fields.option_name)&&this.disable_useip===false){
				return reportError(this.t('filter-with-same-name-already-exists').cap)
			}
			else if(policyName.length <= 0) {
				return reportError(this.t('policy-name').cap+" : "+this.t('err.validation.filled-1').cap)
			}
			else if((day.Sun === false && day.Mon === false && day.Tue === false && day.Wed === false && day.Thu === false && day.Fri === false && day.Sat === false) || (start.hrmin === '' || end.hrmin ==='' )){
				return reportError(this.t('warning-parentalcontrol-2').cap)
			}

			let newNumber = 1
			while (this.existingNumbers.includes(newNumber)) {
				newNumber++;
			}

			let start_p =  start.hrmin.split(':')[0]*60 + start.hrmin.split(':')[1]
			let end_p = end.hrmin.split(':')[0]*60 + end.hrmin.split(':')[1]
			var regExp = /^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/;

			if(!regExp.test(start.hrmin)||!regExp.test(end.hrmin)){
				return reportError(this.t('hhmm-24h-format').cap)
			}
			else if(end_p-start_p>0){
				console.log("GOOD")
			}
			else {
				return reportError(this.t('blocking-time').cap)
			}

			let timeStrings = ""
			let blockedDaysArray = Object.keys(this.accessTimeForm.fields.blockedDays).filter((key) => {
				if(this.accessTimeForm.fields.blockedDays[key]==true||this.accessTimeForm.fields.blockedDays[key]=="true"){
					return this.accessTimeForm.fields.blockedDays[key]
				}
			})

			timeStrings = blockedDaysArray.join(',')

			let params = {
				session_name: this.accessTimeForm.fields.session_name ? this.accessTimeForm.fields.session_name : "parentalcontrol_" + newNumber,
				option_name: this.accessTimeForm.fields.option_name.replace(/ /g,""),
				enabled: this.accessTimeForm.fields.enabled,
				weekdays: timeStrings,
				proto: "tcp udp",
				src: "lan",
				dest: "wan",
				start_time: start.hrmin,
				stop_time: end.hrmin
			}

			if (this.useIp) {
				if(val_ip4(ipAddr)) {
					reportError("IP address"+" : "+this.t('invaild-address').str) 
					return
				} 
				params.src_ip = this.accessTimeForm.fields.ip
			}
			else {
				if(val_mac(macAddr)) {
					reportError("MAC address"+" : "+this.t('invaild-address').str) 
					return
				}
				params.src_mac = this.accessTimeForm.fields.mac
			}

			if (this.useUrl) {
				if(this.accessTimeForm.fields.url.length <= 0) {
					return reportError(this.t('url').cap+": "+this.t('err.validation.filled-1').cap)
				}
				else if(validator.isURL(this.accessTimeForm.fields.url)===false){
					return reportError(this.t('url').cap+": "+this.t('invaild-address').cap)
				}

				params.url = this.accessTimeForm.fields.url
			}
			requests.push(ws.call(API.parentalcontrol.put, params))

			Promise.all(requests)
			.then(() => { 
				ws.call(API.commit)
     		})
			.finally(() => {
				this.accessTimeForm.fields = JSON.parse(JSON.stringify(this.emptyFields))
				this.fetchData()
				QSpinhide()
			}, reportError)
		},
		editPolicy (policy) {
			this.accessTimeForm.fields = JSON.parse(JSON.stringify(this.emptyFields))
			fillObject(this.accessTimeForm.fields, policy)

			if (this.accessTimeForm.fields.ip)
				this.useIp = true
			else
				this.useIp = false

			if (this.accessTimeForm.fields.url)
				this.useUrl = true
			else
				this.useUrl = false
			this.disable_useip = true
			
		},
		deletePolicies () {
			QSpinshow()
			let params = {
				session_name: '',
			}
			this.tableData.forEach(obj => {
				if(obj.delete) {
					params.session_name = obj.session_name
				}
			})
			if (confirm(this.t('are-you-sure-to-delete').cap)) {
				ws.call(API.parentalcontrol.del, params)
				.then(() => { 
					ws.call(API.commit)
				})
				.finally(() => {
					this.fetchData()
					QSpinhide()
				})
			}
			else {
				QSpinhide()
			}
		},	
	}
}
</script>

<style>
	.kaon-table {
	width: 70%;
	border-top: 1px solid #444444;
	border-collapse: collapse;
	}
	.kaon-th {
	border-bottom: 1px solid #444444;
	padding: 10px;
	}
	.kaon-td {
	border-bottom: 1px solid #444444;
	padding: 10px;
	}
</style>
