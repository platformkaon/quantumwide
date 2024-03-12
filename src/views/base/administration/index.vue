<template>
	<article class="article">
		<div class="wrap-content">
			<!-- class option : container / container-fluid / container-full -->
			<div class="container-fluid">
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

				<modifyid-page v-show="$buildOptions.adminUserPage"  v-if="activeListIndex === 'user'"></modifyid-page>
				<modifypd-page v-show="$buildOptions.adminPasswordPage"  v-if="activeListIndex === 'password'"></modifypd-page>
				<backup-page v-show="$buildOptions.adminBackupPage" v-else-if="activeListIndex === 'backup'"></backup-page>
				<diagnostics-page v-show="$buildOptions.adminDiagnosticsPage" v-else-if="activeListIndex === 'diagnostics'"></diagnostics-page>
				<reboot-page v-show="$buildOptions.adminRebootPage" v-else-if="activeListIndex === 'reboot'"></reboot-page>
				<factory-page v-show="$buildOptions.adminResetPage" v-else-if="activeListIndex === 'reset'"></factory-page>
				<upgrade-page v-show="$buildOptions.adminUpgradePage" v-else-if="activeListIndex === 'upgrade'"></upgrade-page>
				<syslog-page v-show="$buildOptions.adminSyslogPage" v-else-if="activeListIndex === 'syslog'"></syslog-page>
				<led-page v-show="$buildOptions.adminLedPage" v-else-if="activeListIndex === 'led'"></led-page>

			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
</template>

<script>
import ModifyidPage from "./modifyid/index"
import ModifypdPage from "./modifypd/index"
import BackupPage from "./backup/index"
import RebootPage from "./reboot/index"
import FactoryPage from "./factory/index"
import UpgradePage from "./upgrade/index"
import DiagnosticsPage from "./diagnostics/index"
import SyslogPage from "./syslog/index"
import LedPage from "./led/index"

export default {
	components: {
		ModifyidPage,
		ModifypdPage,
		BackupPage,
		RebootPage,
		UpgradePage,
		DiagnosticsPage,
		SyslogPage,
		LedPage,
		FactoryPage
	},
	data() {
		return {
			list: [
				'user',
				'password',
				'backup',
				'diagnostics',
				'reboot',
				'reset',
				'upgrade',
				'syslog',
				'led'
			],
			activeListIndex: 'password',
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
				return this.$buildOptions[`admin${item.charAt(0).toUpperCase() + item.slice(1)}Page`]
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

