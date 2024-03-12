<template>
	<section class="section">
			<form
				v-loading="loading"
				:name='macPassthroughForm.name'
				@submit.prevent='save()'>
				<div class="table-responsive">
						<div class="table-title">{{ t('settings').cap }}</div>
						<table class="table-setting-wide">
								<tbody>
										<tr>
												<th>
														<label class="form-label" for="macaddr">{{ t("mac-address").cap }}</label>
												</th>
												<td>
														<input type="text" class="form-control" name="macaddr" id="macaddr" v-model='macPassthroughForm.fields.mac'>
												</td>
										</tr>
								</tbody>
						</table>
				</div> 
				<div class="btn-area btn-setting-area">
						<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
				<br><strong>{{ t('applied-mac') }}</strong> <br>
				<div v-for='p in macPassthroughForm.appliedMac' :key="p">
					<ul v-if="p.length != 0">
						{{ p }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type='button' @click='removeMac(p)' class='btn btn--ghost'>{{ t('remove').cap }}</button>
					</ul>
				</div>
			</form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC } from '@/shared/constants'
import { reportSuccess, reportError } from '@/shared/functions'
import { Component, Vue } from "vue-property-decorator";
import val_mac from '@/shared/validators/mac.js'

@Component({
	components: {
	}
})
export default class macPassthrough extends Vue {
	macPassthroughForm = {
		name: 'mac-passthrough-form',
		fields: {
			mac: ''
		},
		appliedMac: []
	}
	data (){
		return{
			loading: false
		}
	}
	mounted () {
		this.fetchData()
	}
	fetchData () {
		this.loading = true
		ws.call(RPC.macpt.get).then(({ dict }) => {
			this.macPassthroughForm.appliedMac = dict.result.mac_passthrough.mac.split(' ')
		}, reportError).finally(()=>this.loading=false)
	}
	save () {
		this.loading = true

		if(val_mac(this.macPassthroughForm.fields.mac)){
			reportError(this.t('invaild-address').cap)
			this.loading = false
			return
		}

		if (this.macPassthroughForm.fields.mac) {
			ws.call(RPC.macpt.add, {mac: this.macPassthroughForm.fields.mac}).then(() => {
				this.fetchData()
			}).catch(reportError).finally(() => {
				reportSuccess()
				this.loading=false
			})
		}
	}
	removeMac(deleteMac) {
		this.loading = true
		ws.call(RPC.macpt.delete, {mac: deleteMac}).then(() => {
			this.fetchData()
		}).catch(reportError).finally(() => {
			reportSuccess()
			this.loading = false
		})
	}
}
</script>
