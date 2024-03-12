<template>
	<section class="section">
		<div class="table-title">{{ t('settings').cap }}</div>
		<div class="col-sm-4" style="float:none; text-align: center;">
			<div class="info-box">
				<b-icon icon="brightness-high" style="width: 100px; height: 120px;"></b-icon>
				<el-alert type="info" center :closable="false">
				</el-alert>

				<el-button-group>
					<el-button @click='on' round><strong>ON</strong></el-button>
					<el-button @click='off' round><strong>OFF</strong></el-button>
				</el-button-group>

			</div>
		</div>
		<form>
		</form>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC } from '@/shared/constants'
import { reportSuccess, reportError } from '@/shared/functions'
import { Loading } from 'element-ui';

export default {
	methods: {
		on() {
			const loading = Loading.service()
			ws.call(RPC.ledon).then(reportSuccess, reportError).finally(() => {
				loading.close()
			})
		},
		off() {
			const loading = Loading.service()
			ws.call(RPC.ledoff).then(reportSuccess, reportError).finally(() => {
				loading.close()
			})
		}
	}
}
</script>

<style>
.el-dropdown-link {
	cursor: pointer;
	color: #fff;
	margin-left: 20px;
}

.el-icon-arrow-down {
	font-size: 12px;
}
</style>