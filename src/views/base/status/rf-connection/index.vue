<template>
	<section class="section">
		<section class="section" v-loading="loading">
			<form
				:name='basicForm.name'>
				<div class="table-responsive">
					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">{{ t('connection-status') }}</div>
								</h6>
							</template>
							<b-card-text>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="ip">{{t("ip-address").cap}}</label>
											</th>
											<td>
													<label class="form-label" for="ip"><strong>{{startupData.ip || 'n/a'}}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody v-if="$buildOptions.magyarRequest">
									<tr>
											<th>
													<label class="form-label" for="ipv6">{{t("ipv6-address").cap}}</label>
											</th>
											<td>
													<label class="form-label" for="ipv6"><strong>{{cm_ipv6 || 'n/a'}}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="lease">{{t("lease-duration").cap}}</label>
											</th>
											<td>
													<label class="form-label" for="lease"><strong>{{startupData.lease || 'n/a'}}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="lease-ex">{{t("lease-expires").cap}}</label>
											</th>
											<td>
													<label class="form-label" for="lease-ex"><strong>{{startupData.leaseend || 'n/a'}}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="mode">{{t("cm-prov-mode").cap}}</label>
											</th>
											<td>
													<label class="form-label" for="mode"><strong>{{startupData.ipprov || 'n/a'}}</strong></label>
											</td>
									</tr>
							</tbody>
							</b-card-text>
						</b-card>
					</table>
				</div>
				<hr>

				<div class="table-title">{{ t('cm-downstream-freq') }}</div>
				<tbody v-if="!$buildOptions.magyarRequest">
					<tr>
						<td>
							<input v-model='cmFreq' type="text" class="form-control" id="cmFreq">
						</td>
					</tr>
					<div>
						<p class="text-sm text-info">{{ t('changes-will-take-effect') }}</p>
					</div>
					<br>
					<button @click="applyFreq" class="btn btn-secondary" type="submit">{{ t('apply').cap }}</button>
				</tbody>
				<tbody v-if="$buildOptions.magyarRequest">
					<tr>
						<td>
							<input :disabled='this.tableStartUp_data[1][1]!="Not operational"' v-model='cmFreq' type="text" class="form-control" id="cmFreq">
						</td>
					</tr>
					<div>
					</div>
					<br>
					<button v-if="this.tableStartUp_data[1][1]=='Not operational'" @click="applyFreq" class="btn btn-secondary" type="submit">{{ t('apply').cap }}</button>
				</tbody>
				<hr>
			</form>
		</section>

		<div class="table-responsive" v-loading="loading">
			<div class="table-title">{{t('cm-startup-procedure')}}</div>
			<table class="table table-sort"
				size='med'
				style='width:50%'>
				<thead>
					<th v-for='item in tableStartUp' :key='item.key'>
						{{t(item.name).cap}}
					</th>
				</thead>
				<tbody>
					<tr v-for='line in tableStartUp_data' :key='line.key'>
						<td v-for='item in line' :key='item.key'><strong>{{ t(item).cap }}</strong></td>
					</tr>
				</tbody>
			</table>
		</div>
		<hr>

		<div class="table-responsive" v-loading="loading">
			<div class="table-title">{{t('downstream-channel-status')}}</div>
			<table class="table table-sort">
				<thead>
					<th v-for='item in tableDownstream' :key='item.key'>
						{{t(item.name).cap}}
					</th>
				</thead>
				<tbody>
					<tr v-for='line in tableDownstream_data' :key='line.key'>
						<td v-for='item in line' :key='item.key'><strong>{{ item }}</strong></td>
					</tr>
				</tbody>
			</table>
		</div>
		<hr>

		<div class="table-responsive" v-loading="loading">
			<div class="table-title">{{t('upstream-channel-status')}}</div>
			<table class="table table-sort">
				<thead>
					<th v-for='item in tableUpstream' :key='item.key'>
						{{t(item.name).cap}}
					</th>
				</thead>
				<tbody>
					<tr v-for='line in tableUpstream_data' :key='line.key'>
						<td v-for='item in line' :key='item.key'><strong>{{ item }}</strong></td>
					</tr>
				</tbody>
			</table>
		</div>
		<hr>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC } from '@/shared/constants'
import { reportSuccess, reportError } from '@/shared/functions'
import val from '@/shared/validators/number.js'

export default {
	components: {
		val
	},
	data() {
		return {
			basicForm: {
				name: 'rf-connection',
			},
			tableStartUp: [
				{ name: 'procedure'},
				{ name: 'status'},
				{ name: 'comment'}
			],
			tableStartUp_data: [
				['obtained-downstream-channel'],
				['boot-status'],
				['conn-state'],
				['config-file'],
				['security'],
			],
			tableDownstream: [
				{ name: 'channel-index'},
				{ name: 'channel-id'},
				{ name: 'channel-type'},
				{ name: 'bonding-status'},
				{ name: 'lock-status'},
				{ name: 'center-frequency'},
				{ name: 'width'},
				{ name: 'sn-mer-val'},
				{ name: 'receive-level'},
				{ name: 'modulation-profile-id'},
				{ name: 'unerrored-codeworks'},
				{ name: 'corrected-codewords'},
				{ name: 'uncorrectable-codeworks'},
			],
			tableDownstream_data: [],
			tableUpstream: [
				{ name: 'channel-index'},
				{ name: 'channel-id'},
				{ name: 'channel-type'},
				{ name: 'bonding-status'},
				{ name: 'lock-status'},
				{ name: 'center-frequency'},
				{ name: 'width'},
				{ name: 'transmit-level'},
				{ name: 'modulation-profile-id'},
			],
			tableUpstream_data: [],
			freqsetClass: '',
			freqmsg: '',
			freqset: '',
			cmFreq: '',
			startupData: {
				ip: '',
				lease: '',
				ipprov: '',
				leaseend: '',
				startfreq: ''
			},
			fetchInterval: null,
			cm_online: '',
			loading: false,
			cm_ipv6: ''
		}
	},
	mounted () {
		/// #if !buildOptions.magyarRequest
		this.fetchData()
		/// #endif
		/// #if buildOptions.magyarRequest
		this.fetchData_CmOnline()
		/// #endif
	},
	destroyed () {
		clearInterval(this.fetchInterval)
	},
	methods: {
		// open() {
		// 	this.$alert('This is a message', this.t('modulation-profile-id').cap, {
		// 	confirmButtonText: 'OK',
		// 	callback: action => {
		// 		this.$message({
		// 		type: 'info',
		// 		message: `action: ${ action }`
		// 		});
		// 		if(action=='confirm'){
		// 			console.log("JIWAN")
		// 		}
		// 	}
		// 	});
		// },
		fetchData () {
			new Promise((resolve, reject) => setTimeout(resolve, 1000));

			const requests = []
			this.loading = true

			requests[0] = ws.call(RPC.cmDocsis.downstream).then(({ dict }) => {
				this.tableDownstream_data = dict.channels_data
			})

			requests[1] = ws.call(RPC.cmDocsis.upstream).then(({ dict }) => {
				this.tableUpstream_data = dict.channels_data
			})

			requests[2] = ws.call(RPC.cmDocsis.startup).then(({ dict }) => {
				this.startupData = dict
				this.cmFreq = this.startupData.startfreq
				this.tableStartUp_data[0][1]=dict.downstream
				this.tableStartUp_data[1][1]=dict.boot
				this.tableStartUp_data[2][1]=dict.connection
				this.tableStartUp_data[3][1]=dict.cfg
				this.tableStartUp_data[4][1]=dict.security
			})

			/// #if buildOptions.magyarRequest
			requests[3] = ws.call(RPC.cmDocsis.status).then(({ dict }) => {
				this.cm_ipv6 = dict.ipv6
			})
			/// #endif

			Promise.all(requests).catch(reportError).finally(() => this.loading = false)
		},

		fetchData_CmOnline () {
			ws.call(RPC.cmDocsis.startup).then(({ dict }) => {
				if((dict.boot).length!=15){
					this.cm_online = true
				}
				else {
					this.cm_online = false
				}
			}).finally(()=>{
				if(this.cm_online) {
					console.log("CM UP!!!")
					this.fetchData()
				}
				else {
					console.log("CM DOWN!!!")
					this.checkcm()
				}
			})
		},

		checkcm () {
			this.fetchInterval = setInterval(() => {
				clearInterval(this.fetchInterval)
				ws.call(RPC.cmDocsis.startup).then(({ dict }) => {
					this.cm_online = (dict.boot).length
					if(this.cm_online!=15){
						console.log("CM UP")
						return this.fetchData()
					}
					else {
						console.log("CM DOWN")
						return this.checkcm()
					}
				})
			}, 5000)
		},

		applyFreq () {
			this.loading = true

			if ( val(this.cmFreq, 10000) == 2 ) {
				reportError(this.t('Number must be greater').cap)
				return
			}

			let requests = []

			requests.push(
				ws.call(RPC.cmDocsis.setFreq, {
					value: this.cmFreq
				}).then(({ dict }) => {
					if (dict.freqset === 'failed'){
						reportError(this.t('failed-to-set-frequency').cap)
					}
				})
			)

			if (requests.length) {
				Promise.all(requests).then(reportSuccess, reportError).finally(this.loading=false)
			}
		},
	}
}
</script>
