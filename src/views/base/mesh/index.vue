<template>
	<article class="article">
		<div class="wrap-content">
			<!-- class option : container / container-fluid / container-full -->
			<div class="container-fluid">
				<module-state></module-state>
				<section class="section">
					<b-button 
						:style="'margin-left: .5rem; margin-bottom: .5rem;'" 
						variant="outline-secondary" 
						:pressed="activeListIndex === item ? true : false" 
						v-for="(item, index) in filteredList" 
						:key="index" 
						@click="activeListIndex = item"
					>
						{{ t(item).cap  }}
					</b-button>
				</section>
				<fronthaul-page v-show="$buildOptions.meshFronthaulPage" v-if="activeListIndex === 'fronthaul'"></fronthaul-page>
				<backhaul-page v-show="$buildOptions.meshBackhaulPage" v-else-if="activeListIndex === 'backhaul'"></backhaul-page>
			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { API } from '@/shared/constants'

import ModuleState from "../../module-state"
import FronthaulPage from "./fronthaul/index"
import BackhaulPage from "./backhaul/index"

export default {
	components: {
		ModuleState,
		FronthaulPage,
		BackhaulPage,
	},
	data() {
		return {
			list: [
				'fronthaul',
				'backhaul'
			],
			activeListIndex: 'fronthaul',
			mesh: ""
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
				ws.call(API.multiap.wbdcfg)
			]).then(
				([
					{ dict: feature }
				]) => {
					this.mesh = feature.mesh
				}
			)
			return this.list.filter(item => {
				if(this.mesh != 3 )
					return false
				return this.$buildOptions[`mesh${item.charAt(0).toUpperCase() + item.slice(1)}Page`]
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

