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
						{{ t(item).cap }}
					</b-button>
				</section>

				<usb-page v-show="$buildOptions.shareUsbPage" v-if="activeListIndex === 'usb'"></usb-page>
				<samba-page v-show="$buildOptions.shareSambaPage" v-else-if="activeListIndex === 'samba'"></samba-page>
				<dlna-page v-show="$buildOptions.shareMinidlnaPage" v-else-if="activeListIndex === 'minidlna'"></dlna-page>
				<ltebackup-page v-show="$buildOptions.shareLtePage" v-else-if="activeListIndex === 'lte'"></ltebackup-page>

			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ModuleState from "../../module-state"
import UsbPage from "./usb/index"
import SambaPage from "./samba/index"
import DlnaPage from "./minidlna/index"
import LtebackupPage from "./ltebackup/index"

export default {
	components: {
		ModuleState,
		UsbPage,
		SambaPage,
		DlnaPage,
		LtebackupPage
	},
	data() {
		return {
			list: [
				'usb',
				'samba',
				'minidlna',
				/// #if buildOptions.magyarRequest
				'lte'
				/// #endif
			],
			activeListIndex: 'usb'
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
			return this.list.filter(item => {
				return this.$buildOptions[`share${item.charAt(0).toUpperCase() + item.slice(1)}Page`]
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

