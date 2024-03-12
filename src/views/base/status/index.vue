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

				<dashboard-page v-show="$buildOptions.statusDashboardPage" v-if="activeListIndex === 'dashboard'"></dashboard-page>
				<arp-page v-show="$buildOptions.statusArpPage" v-else-if="activeListIndex === 'arp'"></arp-page>
				<software-page v-show="$buildOptions.statusSoftwarePage" v-else-if="activeListIndex === 'software'"></software-page>
				<rfconnection-page v-show="$buildOptions.statusRfconnectionPage" v-else-if="activeListIndex === 'rfconnection'"></rfconnection-page>
				<ipconnection-page v-show="$buildOptions.statusIpconnectionPage" v-else-if="activeListIndex === 'ipconnection'"></ipconnection-page>
				<mta-page v-show="$buildOptions.mtaPage" v-else-if="activeListIndex === 'mta'"></mta-page>
				<connectdevice-page v-show="$buildOptions.statusDevicesPage" v-else-if="activeListIndex === 'devices'"></connectdevice-page>
				<statistics-page  v-show="$buildOptions.statusStatisticsPage" v-else-if="activeListIndex === 'statistics'"></statistics-page>
				<topology-page  v-show="$buildOptions.statusTopologyPage" v-else-if="activeListIndex === 'topology'"></topology-page>
			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ws from "@/shared/lib/ws"
import { API } from "@/shared/constants"

import ModuleState from "../../module-state"
import RfconnectionPage from "./rf-connection/index"
import MtaPage from "./mta/index"
import ArpPage from "./arp/index"
import SoftwarePage from "./software/index"
import IpconnectionPage from "./ip-connection/index"
import ConnectdevicePage from "./device/index"
import StatisticsPage from "./statistics/index"
import TopologyPage from "../../connectedDevice/topology-form.vue"
import DashboardPage from "../dashboard/index.vue"

export default {
	components: {
		ModuleState,
		MtaPage,
		RfconnectionPage,
		ArpPage,
		SoftwarePage,
		IpconnectionPage,
		ConnectdevicePage,
		StatisticsPage,
		TopologyPage,
		DashboardPage
	},
	data() {
		return {
			list: [
				'rfconnection',
				'mta',
				'dashboard',
				'arp',
				'software',
				'ipconnection',
				'devices',
				'statistics',
				'topology'
			],
			mesh: "",
			activeListIndex: 'dashboard',
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
				if (item === 'topology' && this.mesh != '3') {
					return false
				}
				return this.$buildOptions[`status${item.charAt(0).toUpperCase() + item.slice(1)}Page`]
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

