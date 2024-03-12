<template>
	<section class="section">
		<div class="table-responsive">
			<table class="table-setting mt-4">
				<tbody>
					<tr>
						<th>
							<label class="form-label" for="factory">{{ t("reset").cap }}</label>
						</th>
						<th>
							<div class="btn-area">
								<button v-if="isProduction === 'kaon'" class="btn btn-secondary btn-administaion"
									@click='confirmModalShown = "factory-reset"'>{{ t("yes") }}</button>
								<button v-else class="btn btn-secondary btn-administaion"
									@click='confirmModalShown = "factory"'>{{ t("yes") }}</button>
							</div>
						</th>
					</tr>
				</tbody>
			</table>
			<table class="table-setting mt-4">
				<tbody>
					<tr>
						<th>
							<label class="form-label" for="factory">{{ t("mode-reset").cap }}</label>
						</th>
						<th>
							<div class="btn-area">
								<button class="btn btn-secondary btn-administaion"
									@click='confirmModalShown = "mode-reset"'>{{ t("yes") }}</button>
							</div>
						</th>
					</tr>
				</tbody>
			</table>
		</div> <!-- /.table-responsive -->
		<c-confirm v-if='confirmModalShown === "factory"' @close='confirmModalShown = ""' @done='factoryReset'
			:type="confirmModalShown" :yeslabel='t("reset").cap' :modallabel='t("reset").cap'
			:modalmsg='t("factory-reset-message").cap' />
		<c-confirm v-if='confirmModalShown === "factory-reset"' @close='confirmModalShown = ""' @done='factoryReset'
			:type="confirmModalShown" :yeslabel='t("reset").cap' :modallabel='t("reset").cap'
			:modalmsg='t("are-you-sure-to-factory-reset").cap' />
		<c-confirm v-if='confirmModalShown === "mode-reset"' @close='confirmModalShown = ""' @done='modeRest'
			:type="confirmModalShown" :yeslabel='t("mode-reset").cap' :modallabel='t("mode-reset").cap'
			:modalmsg='t("are-you-sure-to-mode-reset").cap' />
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import cConfirm from './confirm-password-dialog'
import { reportSuccess, reportError } from '@/shared/functions'
export default {
	components: {
		cConfirm
	},
	data() {
		return {
			isProduction: process.env.VENDOR,
			confirmModalShown: ''
		}
	},
	mounted() {
		Promise.all([
			ws.call(API.feature)
		])
		.catch(err => reportError(err))
	},
	methods: {
		reboot() {
			this.confirmModalShown = ''
			ws.call(API.reboot).then(reportSuccess, reportError).finally(() => {
				this.$store.dispatch('setLastPage', '')
				this.$store.commit('SET_LOGGED_IN', false)
				this.$router.push({ name: 'login' })
			})
		},
		factoryReset() {
			// Spin.show({
			// 	render: h => {
			// 		return h('div', `${this.t('resetting').cap}...`)
			// 	}
			// })
			this.confirmModalShown = ''
			ws.call(API.reset).then(reportSuccess, reportError).finally(() => {
				this.$store.dispatch('setLastPage', '')
				this.$store.commit('SET_LOGGED_IN', false)
				this.$router.push({ name: 'login' })
			})
		},
		modeRest() {
			// Spin.show({
			// 	render: h => {
			// 		return h('div', `${this.t('resetting').cap}...`)
			// 	}
			// })
			this.confirmModalShown = ''
			ws.call(API.modereset).then(reportSuccess, reportError).finally(() => {
				this.$store.dispatch('setLastPage', '')
				this.$store.commit('SET_LOGGED_IN', false)
				this.$router.push({ name: 'login' })
			})
		},
	}
}
</script>

