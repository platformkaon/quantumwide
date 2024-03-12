<template>
	<article class="article">
		<div class="wrap-content">
			<div class="container-fluid">
				<module-state></module-state>
				<section class="section">
					<b-button :style="'margin-left: .5rem; margin-bottom: .5rem;'" 
						variant="outline-secondary" 
						:pressed="activeListIndex === item ? true : false" 
						v-for="(item, index) in filteredList" 
						:key="index" 
						@click="activeListIndex = item"
					>
						{{ t(item).cap  }}
					</b-button>
				</section>

				<basic-page v-show="$buildOptions.networkBasicsettingsPage" v-if="activeListIndex === 'basicsettings'"></basic-page>
				<landhcp-page v-show="$buildOptions.networkLanPage" v-if="activeListIndex === 'lan'"></landhcp-page>
				<staticrouting-page v-show="$buildOptions.networkStaticroutingPage" v-if="activeListIndex === 'staticrouting'"></staticrouting-page>
				<dns-page v-show="$buildOptions.networkDnsPage" v-else-if="activeListIndex === 'dns'"></dns-page>
				<wanconfig-page v-show="$buildOptions.networkWanPage" v-else-if="activeListIndex === 'wan'"></wanconfig-page>
				<mode-page v-show="$buildOptions.networkModePage" v-else-if="activeListIndex === 'mode'"></mode-page>
				<wanmode-page v-show="$buildOptions.networkWanmodePage" v-else-if="activeListIndex === 'wanmode'"></wanmode-page>
				<dsl-page v-show="$buildOptions.networkDslPage" v-else-if="activeListIndex === 'dsl'"></dsl-page>

			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { API } from '@/shared/constants'

import ModuleState from "../../module-state"
import BasicPage from "./basic/index"
import modePage from "./mode/index"
import LandhcpPage from "./landhcp/index"
import StaticroutingPage from "./staticrouting/index"
import DnsPage from "./dnsv4/index"
import wanconfigPage from "./wanconfig/index"
import wanmodePage from "./wanmode/index"
import dslPage from "./dsl/index"

export default {
	components: {
		ModuleState,
		BasicPage,
		modePage,
		LandhcpPage,
		StaticroutingPage,
		DnsPage,
		wanconfigPage,
		wanmodePage,
		dslPage
	},
	data() {
		return {
			list: [
				'basicsettings',
				'mode',
				'lan',
				'staticrouting',
				'dns',
				'wan',
				'wanmode',
				'dsl'
			],
			activeListIndex: 'lan',
			rtmode: '',
			authlv: ''
		}
	},
	beforeMount() {
		let last_active_tab = this.$store.getters.lastSubPage()

		if (this.list.includes(last_active_tab)) {
			this.activeListIndex = this.$store.getters.lastSubPage()
		}
	},
	destroyed(){
		this.$store.dispatch('setLastSubPage', '')
	},
	computed: {
		filteredList() {
			Promise.all([
				ws.call(API.feature)
			]).then(
				([
					{ dict: feature }
				]) => {
					this.rtmode = feature.rtmode
					this.authlv = feature.authlv

					if(this.rtmode == 'bridge')
						this.activeListIndex = 'wanmode'
				}
			)
			return this.list.filter(item => {
				if (item == 'wanmode' && this.authlv != 'root') {
					return false
				}
				if (item != 'wanmode' && this.rtmode == 'bridge') {
					return false
				}
				if (item != 'lan' && this.authlv == 'user') {
					return false
				}
				return this.$buildOptions[`network${item.charAt(0).toUpperCase() + item.slice(1)}Page`]
			})
		}
	},
	watch: {
		activeListIndex(newValue) {
			if (this.filteredList.includes(newValue)) {
				this.$store.dispatch('setLastSubPage', newValue)
			}
		}
	},
}
</script>

