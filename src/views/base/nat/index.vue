<template>
	<article class="article">
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
			<port-forwarding v-show="$buildOptions.natPortforwardingPage" v-if="activeListIndex === 'portforwarding'"></port-forwarding>
			<port-triggering v-show="$buildOptions.natPortTriggerPage &&
				authlv != 'user'"
				v-else-if="activeListIndex === 'portTrigger'"></port-triggering>
			<dmz-index v-show="$buildOptions.natDmzPage &&
				authlv != 'user'"
				v-else-if="activeListIndex === 'dmz'"></dmz-index>
			<nat-loopback v-show="$buildOptions.natLoopbackPage &&
				authlv != 'user'"
				v-else-if="activeListIndex === 'loopback'"></nat-loopback>
		</div> <!-- /.container -->
	</article> <!-- /.article -->
</template>

<script>
import ModuleState from "../../module-state"
import PortForwarding from "./port-forwarding/index"
import PortTriggering from "./port-triggering/index"
import DmzIndex from './dmz/index'
import NatLoopback from './natloopback/index'
import ws from "@/shared/lib/ws"
import { API } from "@/shared/constants"

export default {
	components: {
		ModuleState,
		PortForwarding,
		PortTriggering,
		DmzIndex,
		NatLoopback
	},
	data() {
		return {
			list: [
				'portforwarding',
				'portTrigger',
				'dmz',
				'loopback'
			],
			activeListIndex: 'portforwarding',
			authlv: ""
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
					this.authlv = feature.authlv
				}
			)

			return this.list.filter(item => {
				if(item != "portforwarding" &&
					this.authlv == 'user')
					return false
				return this.$buildOptions[`nat${item.charAt(0).toUpperCase() + item.slice(1)}Page`]
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

