/* eslint-disable no-dupe-keys */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { t } from '@/shared/functions'
import store from './store'
import Login from './views/Login.vue'
import Base from './views/Base.vue'
import NotFound from './views/NotFound.vue'

Vue.use(VueRouter)

function getComponent (c) {
	if (process.env.NODE_ENV !== 'production' && c.substr(-4) !== '.vue') {
		throw new Error(`cannot load ${c}, you might have missed .vue extension`)
	}

	return () => import(
		/* webpackInclude: /index\.vue$/ */
		/* webpackChunkName: "[request]" */
		`./views/${c}`
	)
}

function allowSuperuserOnly (to, from, next) {
	const username = store.getters.user()[0]
	return next(
		username != null &&
		username === 'admin' ||
		username === 'root'
	)
}

export const baseChildren = [
	{
		redirect: '/home/demo',
		path: '/home',
		name: 'home',
		component:getComponent('home/index.vue'),
	},
/// #if buildOptions.__UNUSED
	{
		path: '/connectedDevice',
		name: 'connectedDevice',
		component: getComponent('connectedDevice/index.vue'),
		title: () => t(store, 'connectedDevice').cap,
	},
	{
		path: '/application',
		name: 'application',
		component: getComponent('application/index.vue'),
		title: () => t(store, 'application').cap,
	},
	{
		path: '/diagnostics',
		name: 'diagnostics',
		component: getComponent('base/diagnostics/index.vue'),
		title: () => t(store, 'diagnostics').cap,
	},
/// #endif
]

export const routes = [
	{
		path: '/',
		name: 'base',
		component: Base,
		children: baseChildren
	},
	{
		path: '/login',
		name: 'login',
		component: Login
	},
	{
		path: '*',
		name: 'not-found',
		component: Login
	}
]


let Router
Router = new VueRouter({routes: routes})

// initial page load
let init = true

Router.beforeEach((to, from, next) => {
	// redirect to login, if not logged in
	if (!init && to.name != 'login' && !store.state.user.loggedIn) {
		init = false
		// store.dispatch('removeUserToken')
		store.dispatch('removeUserName')
		next({replace: true, name: 'login'})
		return
	}

	/// #if buildOptions.quickInstallWizard
	const isDefaultPassword = sessionStorage.getItem('isDefaultPassword') !== 'false'
	if (isDefaultPassword && to.name !== 'administration' && to.name !== 'login') {
		next('administration')
		return
	}
	/// #endif

	if (to.path === '/') {
		next({replace: true, name: 'home'})
		return
	}
	init = false
	next()
})

Router.afterEach(to => {
	// lastPage used for redirecting
	// after login
	if (to.name !== 'login' && to.name !== 'not-found' && to.path !== '/') {
		store.dispatch('setLastPage', to.path)
	}
})

export default Router
