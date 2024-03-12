<template>
	<!--section class="content-section"-->
	<div class="container" v-loading="loading">
		<!-- start : aside section -->
		<!-- class option : none / active -->
		<!--aside class="aside" -->
		<div class="layout layout--split">
			<aside @click='closeSidebar' class="aside layout--split__sidebar" :class="{'is-active': sidebarOpen}">
				<div class="links-menu main-menu collapsed">
					<ul class="nav-site">
						<router-link style="text-transform : uppercase;" :to="{name: 'home'}" tag="li" active-class="active">{{ t("overview") }}</router-link>
					</ul>
					<ul class="nav-aside" v-show="$route.name !== 'connectedDevice'">
						<router-link v-show="$buildOptions.statusPage" style="text-transform : uppercase;" :to="{name: 'status'}" tag="li" active-class="active">{{ t("status")}}</router-link>
						<router-link v-show="$buildOptions.wirelessPage" style="text-transform : uppercase;" :to="{name: 'wifi'}" tag="li" active-class="active">{{ t("wireless-settings") }}</router-link>
						<router-link v-show="pages.mesh" style="text-transform : uppercase;" :to="{name: 'mesh'}" tag="li" active-class="active" :class="{ 'ar2340': $buildOptions.ar2340 }" > {{ t("mesh") }}</router-link>
						<router-link v-show="$buildOptions.networkPage" style="text-transform : uppercase;" :to="{name: 'network'}" tag="li" active-class="active" :class="{ 'ar2340': $buildOptions.ar2340 }">{{ t("network") }}</router-link>
						<router-link v-show="$buildOptions.sharePage" style="text-transform : uppercase;" :to="{name: 'network-share'}" tag="li" active-class="active" :class="{ 'ar2340': $buildOptions.ar2340 }">{{ t("network-shares") }}</router-link>
						<router-link v-show="pages.nat"	style="text-transform : uppercase;" :to="{name: 'nat'}" tag="li" active-class="active" :class="{ 'ar2340': $buildOptions.ar2340 }">{{ t("nat") }}</router-link>
						<router-link v-show="pages.advanced" style="text-transform : uppercase;" :to="{name: 'advanced'}" tag="li" active-class="active" :class="{ 'ar2340': $buildOptions.ar2340 }">{{ t("advanced") }}</router-link>
						<router-link v-show="pages.security" style="text-transform : uppercase;" :to="{name: 'security'}" tag="li" active-class="active" :class="{ 'ar2340': $buildOptions.ar2340 }">{{ t("security") }}</router-link>
						<router-link v-show="pages.administration" style="text-transform : uppercase;" :to="{name: 'administration'}" tag="li" active-class="active" :class="{ 'ar2340': $buildOptions.ar2340 }">{{ t("administration") }}</router-link>
					</ul>
					<div class="btn-close btn-close-white"></div>
				</div>
			</aside>
			<div class="layout--split__content">
			<section>
				<router-view></router-view>
			</section>
			</div>
		</div>
		<div @click='closeSidebar' class="overlay overlay--nav" :class="{'overlay--visible': sidebarOpen}"></div>
		<!-- end : aside section -->
	</div>
</template>

<script>
import ws from "@/shared/lib/ws"
import { RPC, API } from "@/shared/constants"
import { mapState } from 'vuex'

export default {
	data() {
		return {
			board: {
				board_name: "",
				hostname: "",
				kernel: "",
				architecture: "",
				model: "",
				release: {
					description: "",
					distribution: "",
					revision: "",
					target: "",
					version: "",
				},
			},
			rtmode: "",
			mesh: "",
			authlv: "",
			pages: {
				mesh: false,
				nat: false,
				advanced: false,
				security: false,
				administration: false
			},
			loading: false
		}
	},
	computed: mapState({
		sidebarOpen: ({ status }) => status.sidebar.open,
	}),
	methods: {
		closeSidebar (event) {
			const parent = event.target.parentNode
			if (
				parent.classList.contains('has--sublinks') ||
				(parent.parentNode && parent.parentNode.classList.contains('has--sublinks'))
			) {
				return
			}
			this.$store.commit('SET_STATUS', {path: 'sidebar.open', val: false})
		},
	},
	mounted() {
		this.loading = true
		Promise.all([
			ws.call(RPC.system.board),
			ws.call(API.feature)
		]).then(
			([
				{ dict: board },
				{ dict: feature }
			]) => {
				this.board = board
				this.rtmode = feature.rtmode
				this.mesh = feature.mesh
				this.authlv = feature.authlv

				this.pages.mesh = this.$buildOptions.meshPage && this.mesh != '0'
				this.pages.nat = this.$buildOptions.natPage && this.rtmode == 'router'
				this.pages.advanced = this.$buildOptions.advancedPage && this.authlv != 'user'
				this.pages.security = this.$buildOptions.securityPage && this.authlv != 'user'
				this.pages.administration =  this.$buildOptions.adminPage && this.authlv != 'user'
			}
		)
		.finally(() => this.loading = false)
	}
}
</script>
<style>
.router-link-active {
	color: #0e7ae6
}
</style>
