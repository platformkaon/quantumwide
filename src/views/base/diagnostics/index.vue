<template>
	<article class="article">
		<div class="wrap-content">
			<div class="container-fluid">
				<module-state></module-state>
				<section class="section">
					<div class="table-title">{{ t('ping-setting') }}</div>
					<table class="table-setting-wide">
						<tbody>
							<tr>
								<th>
									<label class="form-label" for="target">{{ t("target").cap }}</label>
								</th>
								<td>
									<input type="text" class="form-control" id="target" placeholder=""
										v-model="pingForm.fields.target">
								</td>
							</tr>
							<tr>
								<th>
									<label class="form-label" for="ping">{{ t("ping-size").cap }}</label>
								</th>
								<td>
									<input type="text" class="form-control" id="ping" placeholder=""
										v-model="pingForm.fields.size">
								</td>
							</tr>
							<tr>
								<th>
									<label class="form-label" for="amount">{{ t("no-of-pings").cap }}</label>
								</th>
								<td>
									<input type="text" class="form-control" id="amount" placeholder=""
										v-model="pingForm.fields.no">
								</td>
							</tr>
						</tbody>
					</table>

					<br>
					<div class="table-title">{{ t('test-result') }}</div>
					<div class="btn-area btn-setting-area">
						<button style="text-transform : uppercase;" class="btn btn-secondary" @click="save"
							type="button">{{ t('start') }}</button>
						<button style="text-transform : uppercase;" class="btn btn-secondary" @click="abortTest"
							type="button">{{ t("stop") }}</button>
						<button style="text-transform : uppercase;" class="btn btn-secondary" @click="clearResult"
							type="button">{{ t("clear") }}</button>
					</div>

					<br>
					<div class="table-title">{{ t('result') }}</div>
					<textarea class="kaon-textarea" v-model="pingForm.result">
										</textarea>
				</section>
			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ModuleState from "../../module-state"
import ws from '@/shared/lib/ws'
import { RPC } from '@/shared/constants'
import { reportSuccess, reportError, trackFields } from '@/shared/functions'

export default {
	components: {
		ModuleState
	},
	mounted() {
		this.$nextTick(() => {
			document.body.className = 'full-page';
		})
		this.fetchData()
	},
	data() {
		return {
			pingForm: {
				name: "pingForm",
				loading: false,
				fields: {
					target: "",
					size: 64,
					no: 3
				},
				result: "",
				pid: "",
				interval: null,
				stop_result_flog: 0,
			}
		}
	},
	mounted() {
		this.untrackFields = trackFields.call(this, this.pingForm.name)
	},
	methods: {
		fetchData() {
		},
		async save() {
			if (await this.$store.getters.hasError(this.pingForm.name)) {
				this.$store.commit('ACTIVATE_ERRORS', { group: this.pingForm.name })
				return
			}

			this.clearResult()

			this.pingForm.loading = true
			this.pingForm.stop_result_flog == 0

			ws.call(RPC.pingStart, this.$store.getters.nonEmptyFieldsValues(this.pingForm.name)).then((dict) => {
				if (dict.dict.result.pid !== "") {
					this.pingForm.pid = dict.dict.result.pid
					this.startPingResultHandler()
					reportSuccess()
				}
			})
				.catch(err => reportError(err))
				.then(() => {
					this.pingForm.loading = false
				})
		},
		startPingResultHandler() {
			if (!this.pingForm.interval) {
				this.pingForm.interval = setInterval(() => {
					this.pingResult()
				}, 1000)
			}
		},
		stopPingResultHandler() {
			if (this.pingForm.interval) {
				clearInterval(this.pingForm.interval)
				this.pingForm.interval = null
			}
		},
		pingResult() {
			const params = {
				pid: this.pingForm.pid
			}

			ws.call(RPC.pingStatus, params).then((dict) => {
				if (dict.dict.result.status === "completed" && this.pingForm.stop_result_flog == 1) {
					this.pingForm.pid = ''
					this.stopPingResultHandler()
				}
			})

			ws.call(RPC.pingResult).then((dict) => {
				this.pingForm.result = dict.dict.data
				if (dict.dict.data.indexOf("round-trip") != -1) {
					this.pingForm.stop_result_flog = 1;
				}
			})
				.catch(err => reportError(err))
		},
		abortTest() {
			this.pingForm.loading = true
			const params = {
				message: {
					pid: this.pingForm.pid
				}
			}
			ws.call(RPC.pingStop, params).then((dict) => {
				if (dict.dict.result == "ok") {
					this.pingForm.pid = ''
					reportSuccess()
				}
			})
				.catch(err => reportError(err))
				.then(() => {
					this.stopPingResultHandler()
					this.pingForm.loading = false
				})
		},
		clearResult() {
			this.pingForm.result = ''
		}
	},
	destroyed() {
		this.stopPingResultHandler()
		if (this.pingForm.pid !== '') this.abortTest()
	}
}
</script>

<style>
.kaon-textarea {
	min-height: 180px;
	min-width: 70%;
}</style>
