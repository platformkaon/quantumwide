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
						:key="index" @click="activeListIndex = item"
					>
						{{ t(item).cap  }}
					</b-button>
				</section>
				<advoption-page v-show="$buildOptions.advancedPage" v-if="activeListIndex === 'options'"></advoption-page>
				<voice-page v-show="$buildOptions.advancedVoicePage" v-else-if="activeListIndex === 'voice'"></voice-page>
				<ddns-page v-show="$buildOptions.advancedDdnsPage" v-else-if="activeListIndex === 'ddns'"></ddns-page>
				<macpassthrough-page v-show="$buildOptions.advancedMacpassPage" v-else-if="activeListIndex === 'macpass'"></macpassthrough-page>
				<ntp-page v-show="$buildOptions.advancedNtpPage" v-else-if="activeListIndex === 'ntp'"></ntp-page>
				<cwmp-page v-show="$buildOptions.advancedCwmpPage" v-else-if="activeListIndex === 'cwmp'"></cwmp-page>
				<portmirroring-page v-show="$buildOptions.advancedPortmirroringPage" v-else-if="activeListIndex === 'portmirroring'"></portmirroring-page>
				<packetcapture-page v-show="$buildOptions.advancedPacketcapturePage" v-else-if="activeListIndex === 'packetcapture'"></packetcapture-page>

			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { API } from '@/shared/constants'
import ModuleState from "../../module-state"
import AdvoptionPage from "./advancedoption/index"
import VoicePage from "./voice/index"
import DdnsPage from "./ddns/index"
import MacpassthroughPage from "./macpassthrough/index"
import NtpPage from "./ntp/index"
import CwmpPage from "./cwmp/index"
import PortmirroringPage from "./portmirroring/index"
import PacketcapturePage from "./packetcapture/index"

export default {
	components: {
		ModuleState,
		AdvoptionPage,
		VoicePage,
		DdnsPage,
		MacpassthroughPage,
		NtpPage,
		CwmpPage,
		PortmirroringPage,
		PacketcapturePage
	},
	data() {
		return {
			list: [
				'options',
				'voice',
				'ddns',
				'macpass',
				'ntp',
				'cwmp',
				'portmirroring',
				'packetcapture'
			],
			activeListIndex: 'options',
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
						if(this.$buildOptions.ar1840)
							this.activeListIndex = 'ntp'
						else
							this.activeListIndex = 'voice'
				}
			)
			.catch(err => reportError(err))

			return this.list.filter(item => {
				if ((item == 'options' || item == 'ddns' || item == 'macpass') && this.rtmode == 'bridge') {
					return false
				}
				return this.$buildOptions[`advanced${item.charAt(0).toUpperCase() + item.slice(1)}Page`]
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

