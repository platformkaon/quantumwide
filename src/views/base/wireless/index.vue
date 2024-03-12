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
				<main-page v-show="$buildOptions.wirelessMainPage" v-if="activeListIndex === 'main'"></main-page>
				<guest-page v-show="$buildOptions.wirelessGuestPage" v-else-if="activeListIndex === 'guest'"></guest-page>
				<wps-page v-show="$buildOptions.wirelessWpsPage" v-else-if="activeListIndex === 'wps'"></wps-page>
			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { API } from '@/shared/constants'

import ModuleState from "../../module-state"
import MainPage from "./main/index"
import GuestPage from "./guest/index"
import WpsPage from "./wps/index"

export default {
	components: {
		ModuleState,
		MainPage,
		GuestPage,
		WpsPage
	},
	data() {
		return {
			list: [
				'main',
				'guest',
				'wps'
			],
			activeListIndex: 'main',
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
				ws.call(API.feature)
			]).then(
				([
					{ dict: feature }
				]) => {
					this.mesh = feature.mesh
				}
			)
			return this.list.filter(item => {
				return this.$buildOptions[`wireless${item.charAt(0).toUpperCase() + item.slice(1)}Page`]
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

