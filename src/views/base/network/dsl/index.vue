<template>
	<section class="section">
		<div class="module-tab">
			<ul class="tab-label-list tab-label-list-2">
				<!-- class option : none / active / disabled -->
				<li class="tab-label-item" v-for='tab in tabs' :class="{ 'active': currentTab === tab.id }"
					@click="currentTab = tab.id, currentType = tab.type" :key='tab.id'>
					<div class="tab-label">{{ t(tab.label) }}</div>
				</li>
			</ul>
			<form :name='dslForm.name' @submit.prevent='save()' v-loading="loading"
				v-if="currentType == 'line'">
				<div class="table-responsive">
					<table class="table-setting-wide">
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">{{ t('select-modulation').cap }}</div>
								</h6>
							</template>
							<b-card-text>
								<tbody>
									<tr v-for="(value, key) in dslForm.fields.selectModulation" :key="key">
										<th>
											<label class="form-label" :for="key">{{ t(key).cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" :id="key" class="checkbox" :name="key"
													v-model="dslForm.fields.selectModulation[key]"
													true-value='1' 
													false-value='0'>
												<label class="label" :for="key">{{ `Checkbox label ${key}` }}</label>
											</div>
										</td>
									</tr>
								</tbody>
							</b-card-text>
						</b-card>
						<br>
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">{{ t('select-vdsl-profile').cap }}</div>
								</h6>
							</template>
							<b-card-text>
								<tbody>
									<tr v-for="(value, key) in dslForm.fields.selectVdslProfile" :key="key">
										<th>
											<label class="form-label" :for="key">{{ t(key).cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" :id="key" class="checkbox" :name="key"
													v-model="dslForm.fields.selectVdslProfile[key]"
													true-value='1' 
													false-value='0'>
												<label class="label" :for="key">{{ `Checkbox label ${key}` }}</label>
											</div>
										</td>
									</tr>
								</tbody>
							</b-card-text>
						</b-card>
						<br>
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">{{ t('select-phone-line-pair').cap }}</div>
								</h6>
							</template>
							<b-card-text>
								<tbody>
									<tr>
										<th>
											<label class="form-label" for="inner">{{ t("inner").cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" class="checkbox" id="inner" name="inner"
													:checked="dslForm.fields.selectPhoneLinePair.pair === 'inner'"
                									@change="updatePair('inner', $event)">
												<label class="label" for="inner"></label>
											</div>
										</td>
									</tr>
									<tr>
										<th>
											<label class="form-label" for="outter">{{ t("outter").cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" class="checkbox" id="outter" name="outter"
													:checked="dslForm.fields.selectPhoneLinePair.pair === 'outter'"
                									@change="updatePair('outter')">
												<label class="label" for="outter"></label>
											</div>
										</td>
									</tr>
								</tbody>
							</b-card-text>
						</b-card>
						<br>
						<b-card header-tag="header" footer-tag="footer">
							<template #header>
								<h6 class="mb-0">
									<div class="table-title">{{ t('capability').cap }}</div>
								</h6>
							</template>
							<b-card-text>
								<tbody>
									<tr v-for="(value, key) in dslForm.fields.capability" :key="key">
										<th>
											<label class="form-label" :for="key">{{ t(key).cap }}</label>
										</th>
										<td>
											<div class="form-checkbox">
												<input type="checkbox" :id="key" class="checkbox" :name="key"
													v-model="dslForm.fields.capability[key]"
													true-value='1' 
													false-value='0'>
												<label class="label" :for="key">{{ `Checkbox label ${key}` }}</label>
											</div>
										</td>
									</tr>
								</tbody>
							</b-card-text>
						</b-card>
					</table>
				</div>

				<div class="btn-area btn-setting-area">
						<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
			</form>

			<form :name='dslForm.name' @submit.prevent='save()' v-loading="loading"
				v-else-if="currentType == 'ptm'">
				<ptm-table
					:columns="columns"
					:data="rules"
					@edit='onRowEdit'
					@delete='onRowDelete'
					@add='openForm'>
				</ptm-table>
				<ptm-form
					v-if='formShown'
					:section='section'
					@close='closeForm($event)'>
				</ptm-form>
			</form>
		</div>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { reportError, fillObject, reportSuccess, trackFields, getSubObject, QSpinshow, QSpinhide} from '@/shared/functions'
import PtmTable from './table.vue'
import PtmForm from './form.vue'

export default{
	components: {
		PtmTable,
		PtmForm
	},
	data() {
		return {
			tabs:[
				{ id: 'line', type: 'line', label: 'line'},
				{ id: 'ptm', type: 'ptm', label: 'ptm-interface'},
			],
			currentTab: 'line',
			currentType: 'line',
			dslForm : {
				name: 'dslForm',
				fields: {
					selectModulation: {
						gdmt: "0",
						glite: "0",
						t1413: "0",
						adsl2: "0",
						adsl2p: "0",
						annexl: "0",
						annexm: "0",
						vdsl2: "0",
					},
					selectVdslProfile: {
						'8a': "0",
						'8b': "0",
						'8c': "0",
						'8d': "0",
						'12a': "0",
						'12b': "0",
						'17a': "0",
						'30a': "0",
						us0: "0",
					},
					selectPhoneLinePair: {
						pair: "inner"
					},
					capability: {
						sra: "0",
						bitswap: "0"
					}
				}
			},
			loading: false,
			section: null,
			formShown: false,
			columns: 
			[
				{ name: 'interface', key: 'device', align: 'center' },
				{ name: 'dsl-latency', key: 'portid', align: 'center' },
				{ name: 'ptm-priority', key: 'priority', align: 'center' },
				{ name: 'actions', key: 'actions', align: 'center' },
			],
			rules: []
		}
	},
	mounted () {
		this.fetchData()
	},
	watch: {
		'currentTab'() {
			this.loading = true
			this.fetchData()
		}
	},
	methods: {
		onRowEdit(rowIndex) {
			this.openForm(this.rules[rowIndex])
		},
		onRowDelete(rowIndex) {
			this.deleteRule(this.rules[rowIndex])
		},
		updatePair(value) {
			if (this.dslForm.fields.selectPhoneLinePair.pair === value && value === "inner") {
				this.dslForm.fields.selectPhoneLinePair.pair = "outter"
			}
			else if (this.dslForm.fields.selectPhoneLinePair.pair === value && value === "outter") {
				this.dslForm.fields.selectPhoneLinePair.pair = "inner"
			} else {
				this.dslForm.fields.selectPhoneLinePair.pair = value
			}
		},
		fetchData () {	
			this.loading = true
			if(this.currentTab == 'line') {
				ws.call(API.network.dsl.line.get).then(({ dict }) => {
					const modeArray = dict.mode.split(' ')
					const profileArray = dict.profile.split(' ')

					modeArray.forEach(item => {
						this.dslForm.fields.selectModulation[item] = "1"
					})

					profileArray.forEach(item => {
						this.dslForm.fields.selectVdslProfile[item] = "1"
					})

					fillObject(this.dslForm.fields.selectPhoneLinePair, dict)
					fillObject(this.dslForm.fields.capability, dict)
				})
				.catch(err => reportError(err))
			}
			else if(this.currentTab == 'ptm') {
				ws.call(API.network.dsl.ptm.get).then(({ dict }) => {
					this.rules = dict.list
				})
				.catch(err => reportError(err))
			}
			this.loading = false
		},
		async save () {
			this.loading = true
			let requests = []

			if(this.currentTab == 'line') {
				const mode = Object.keys(this.dslForm.fields.selectModulation).filter(key => this.dslForm.fields.selectModulation[key] === "1").join(" ")
				const profile = Object.keys(this.dslForm.fields.selectVdslProfile).filter(key => this.dslForm.fields.selectVdslProfile[key] === "1").join(" ")
				const fields = {
					mode:mode,
					profile:profile,
					...this.dslForm.fields.selectPhoneLinePair,
					...this.dslForm.fields.capability,
				}
				requests.push(ws.call(API.network.dsl.line.put, fields))
			}
			else if(this.currentTab == 'ptm') {
			}

			Promise.all(requests)
			.then(() => {
				ws.call(API.commit)
			})
			.finally(() => {
				this.loading = false
				reportSuccess()
			})
		},
		deleteRule (rule) {
			QSpinshow()

			let params = {
				session_name: rule['session_name'],
			}

			if (confirm(this.t('are-you-sure-to-delete').cap)) {
				ws.call(API.network.dsl.ptm.del, params)
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
		openForm (rule) {
			this.section = rule ? rule.session_name : null
			this.formShown = true
		},
		closeForm (refresh) {
			if (refresh) {
				this.fetchData()
			}
			this.formShown = false
			window.scrollTo(0, 0)
		}
	}
}
</script>