<template>
	<section class="section">
		<div class="module-tab">
				<ul class="tab-label-list tab-label-list-2">
						<!-- class option : none / active / disabled -->
						<li class="tab-label-item" v-for='tab in tabs' :class="{'active': currentTab === tab.id}" @click="currentTab= tab.id" :key='tab.id'>
								<div class="tab-label">{{ t(tab.label).cap}}</div>
						</li>
				</ul>
				<br>
<!-- 
				<el-tabs v-model="currentTab" @tab-click="handleClick">
						<el-tab-pane :label='this.t("information").cap' name='information'></el-tab-pane>
						<el-tab-pane :label='this.t("pin-management").cap' name="pin-management"></el-tab-pane>
						<el-tab-pane :label='this.t("apn").cap' name="apn"></el-tab-pane>
				</el-tabs> -->

		<form
			:name='ltebackcup.name'>
			<div class="table-responsive">

					<table class="table-setting-wide" v-if="currentTab==='information'">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">
										{{t('information').cap}}
									</div>
								</h6>
							</template>
							<b-card-text>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="doc">{{ t('connection-status').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="doc"><strong>{{ this.ltebackcup.fields.reg_state || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="hw">{{ t('ip-address').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="hw"><strong>{{ this.ltebackcup.fields.ipv4_addr || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="software">{{ t('uptime').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="software"><strong>{{ this.ltebackcup.fields.uptime || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="cable">{{ t('signal-level-rssi').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="cable"><strong>{{ this.ltebackcup.fields.rssi || 'n/a'}}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="cm">{{ t('trapic-down-up').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="cm"><strong>{{this.ltebackcup.fields.traffic_rx||'n/a'}}, {{this.ltebackcup.fields.traffic_tx||'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="cm">{{ t('internet-avail').cap}}</label>
											</th>
											<td>
													<label class="form-label" for="cm"><strong>{{ this.ltebackcup.fields.internet || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="cm">{{ t('dongle-vendor').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="cm"><strong>{{ this.ltebackcup.fields.vendor || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="cm">{{ t('dongle-type').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="cm"><strong>{{ this.ltebackcup.fields.type || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="cm">{{ t('dongle-sw-version').cap }}</label>
											</th>
											<td>
													<label class="form-label" for="cm"><strong>{{ this.ltebackcup.fields.sw_version || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							</b-card-text>
						</b-card>
					</table>

					<table class="table-setting-wide" v-if="currentTab==='pin-management'">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">
										{{ t('settings').cap}}
									</div>
								</h6>
							</template>
							<b-card-text>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="cm">{{ t('pin-status') }}</label>
											</th>
											<td>
													<label class="form-label" for="cm"><strong>{{ this.ltebackcup.fields.sw_version || 'n/a' }}</strong></label>
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="port">{{ t('current-pin').cap }}</label>
											</th>
											<td>
													<input placeholder="" type="text" class="form-control" name='port' id="port">
											</td>
									</tr>
									<tr>
											<th>
											</th>
											<td>
												<p class="text-sm text-info">
													<strong>{{ t('attempt-left').cap }} : n/a</strong>
												</p>
											</td>
									</tr>
							</tbody>
							</b-card-text>
						</b-card>
							<p class="text-sm text-info">
								<strong>{{ t('warning-lte-before-save')}}</strong>
							</p>
							<div class="btn-area btn-setting-area">
								<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
							</div>
					</table>

					<table class="table-setting-wide" v-if="currentTab==='apn'">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">
										{{ t('settings').cap}}
									</div>
								</h6>
							</template>
							<b-card-text>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="port">{{ t('apn').cap }}</label>
											</th>
											<td>
													<input placeholder="" type="text" class="form-control" name='port' id="port" v-model="this.ltebackcup.fields.apn">
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="port">{{ t('autentication').cap }}</label>
											</th>
											<td>
													<input placeholder="" type="text" class="form-control" name='port' id="port">
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="port">{{ t('username').cap }}</label>
											</th>
											<td>
													<input placeholder="" type="text" class="form-control" name='port' id="port">
											</td>
									</tr>
							</tbody>
							<tbody>
									<tr>
											<th>
													<label class="form-label" for="port">{{ t('password').cap }}</label>
											</th>
											<td>
													<input placeholder="" type="text" class="form-control" name='port' id="port">
											</td>
									</tr>
							</tbody>
							</b-card-text>
						</b-card>
							<p class="text-sm text-info">
								<strong>{{ t('warning-lte-before-save')}}</strong>
							</p>
							<div class="btn-area btn-setting-area">
								<button class="btn btn-secondary" @submit.prevent='save()' type="submit">{{ t('save').cap }}</button>
							</div>
					</table>
			</div>
		</form>
		</div>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC } from '@/shared/constants'
import { fillObject } from '@/shared/functions'

export default {
	data () {
		return {
			tabs: [
				{id: 'information', label:'information'},
				{id: 'pin-management', label:'pin-management'},
				{id: 'apn', label:'apn'}
			],
			currentTab: 'information',
			ltebackcup: {
				name : 'lte_backup',
				fields: {
					apn : '',
					internet : '',
					ipv4_addr : '',
					reg_state : '',
					rssi : '',
					sw_version : '',
					traffic_rx : '',
					traffic_tx : '',
					uptime : '',
					vendor : '',
					wan_ifname : '',
					type : ''
				}
			},
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData(){
			ws.call(RPC.ltedongle.get).then(({dict}) => {
				fillObject(this.ltebackcup.fields, dict.result)
				console.log('------------------------------------');
				console.log(this.ltebackcup.fields);
				console.log('------------------------------------');
			})
		},
		handleClick(tab, event) {
			this.currentTab=tab.name
		}
	}
}
</script>
