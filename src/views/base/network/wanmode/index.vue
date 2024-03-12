<template>
	<section class="section">
		<form :name='wanmodeForm.name' @submit.prevent v-loading="loading">
			<div class="table-responsive">
				<div class="table-title">
					{{ t('wanmode') }} 
				</div>
				<table class="table-setting-wide table-setting-checkbox-group">
					<tr>
						<td>
							<select class="form-select" name='wanmode' v-model='wanmodeForm.fields.wanmode'>
								<option v-for='item in wanModes' :value='item.value' :key='item.value'>
									{{ item.label }}
								</option>
							</select>

						</td>
					</tr>
				</table>
			</div>
			<div class="btn-area btn-setting-area">
				<button class="btn btn-secondary btn-administaion"
					@click='confirmModalShown = "wanmode"'>{{ t("save") }}
				</button>
			</div>
		</form>
		<c-confirm v-if='confirmModalShown === "wanmode"' @close='confirmModalShown = ""' @done='changewanmode'
			:type="confirmModalShown" :yeslabel='t("save").cap' :modallabel='t("wanmode").cap'
			:modalmsg='t("when-changing-wan-mode-factory-reset-is-performed").cap' />
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import cConfirm from './confirm-password-dialog'
import { fillObject, trackFields, reportSuccess, reportError, QSpinshow, QSpinhide } from '@/shared/functions'
import { MessageBox } from 'element-ui';

export default {
	components: {
		cConfirm
	},
	data() {
		return {
			loading: false,
			confirmModalShown: '',
			wanmodeForm: {
				name: 'wanmode',
				fields: {
					wanmode: '',
				},
			},
			wanModes: [
				{label: 'Router Only', value: '1'},
				{label: 'Bridge Only', value: '2'},
				{label: 'Router Controller', value: '17'},
				{label: 'Bridge Controller or Agent (Auto)', value: '18'},
				{label: 'Bridge Controller Only', value: '22'},
				{label: 'Bridge Agent Only', value: '26'}
			],
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.loading = true
			ws.call(API.network.wanmode.get).then(({ dict:data }) => {
				data.wanmode = data.wanmode.split('\n')[0]
				fillObject(this.wanmodeForm.fields, data)
				this.untrackFields = trackFields.call(this, 'wanmodeForm')
			})
			.catch(err => reportError(err))
			.then(() => this.loading = false)

		},
		async changewanmode() {
			this.confirmModalShown = ''
			ws.call(API.network.wanmode.set, this.wanmodeForm.fields)
			.then(() => {
				reportSuccess()
				this.$store.dispatch('setLastPage', '')
				this.$store.commit('SET_LOGGED_IN', false)
				this.$router.push({ name: 'login' })
				this.$router.push({name: 'login'})
			})
			.catch(err => reportError(err))
			.finally(() => this.loading = false)
		}
	}
}
</script>
