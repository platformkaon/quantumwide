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
						<router-link v-show="$buildOptions.demoPage" style="text-transform : uppercase;" :to="{name: 'demo'}" tag="li" active-class="active">{{ t("demo")}}</router-link>
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
	}
}
</script>
<style>
.router-link-active {
	color: #0e7ae6
}
</style>
