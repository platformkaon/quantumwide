<template>
	<article class="article">
		<div class="wrap-content">
			<div class="container-fluid">
				<module-state></module-state>
				<section class="section">
					<b-button 
						:style="'margin-left: .5rem; margin-bottom: .5rem;'" 
						variant="outline-secondary" 
						:pressed="activeListIndex === item ? true : false" 
						v-for="(item, index) in filteredList" 
						:key="index" @click="activeListIndex = item"
					>
						{{ t(item).cap  }}
					</b-button>
				</section>
				<filtering-page v-show="$buildOptions.securityIpfilterPage" v-if="activeListIndex === 'ipfilter'"></filtering-page>
				<macfiltering-page v-show="$buildOptions.securityMacfilterPage" v-else-if="activeListIndex === 'macfilter'"></macfiltering-page>
				<portfiltering-page v-show="$buildOptions.securityPortfilterPage" v-else-if="activeListIndex === 'portfilter'"></portfiltering-page>
				<upnp-page v-show="$buildOptions.securityUpnpPage" v-else-if="activeListIndex === 'upnp'"></upnp-page>
				<parental-page v-show="$buildOptions.securityParentalcontrolPage" v-else-if="activeListIndex === 'parentalcontrol'"></parental-page>
				<access-page v-show="$buildOptions.securityAccesscontrolPage" v-else-if="activeListIndex === 'accesscontrol'"></access-page>
			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { API } from '@/shared/constants'

import ModuleState from "../../module-state"
import FilteringPage from "./filtering/index"
import MacfilteringPage from "./filtering/macindex"
import PortfilteringPage from "./filtering/portindex"
import ParentalPage from "./parental/index"
import AccessPage from "./access-control/index"
import UpnpPage from "./upnp/index"

export default {
	components: {
		ModuleState,
		FilteringPage,
		MacfilteringPage,
		PortfilteringPage,
		ParentalPage,
		AccessPage,
		UpnpPage
	},
	data() {
		return {
			list: [
				'ipfilter',
				'macfilter',
				'portfilter',
				'upnp',
				'parentalcontrol',
				'accesscontrol'
			],
			activeListIndex: 'ipfilter',
			rtmode: ''
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

					if(this.rtmode == 'bridge')
						this.activeListIndex = 'accesscontrol'
				}
			)
			return this.list.filter(item => {
				if (item != 'accesscontrol' && this.rtmode == 'bridge') {
					return false
				}
				return this.$buildOptions[`security${item.charAt(0).toUpperCase() + item.slice(1)}Page`]
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

