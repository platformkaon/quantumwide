<template>
	<section class="section">
		<filter-table v-loading="loading"
			:columns="devices.columns"
			:data='devices.data'
		>
		</filter-table>
	</section>
</template>
<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import FilterTable from './table.vue'
import { reportError } from '@/shared/functions'

export default {
	props: {
		response: String,
	},
	components: {
		FilterTable
	},
	data () {
		return {
			devices: {
				columns: [
					{
						name :'number',
						key: '0'
					},
					{
						name: 'ip',
						key: '1'
					},
					{
						name: 'hw-type',
						key: '2'
					},
					{
						name: 'flags',
						key: '3'
					},
					{
						name: 'hw-address',
						key: '4'
					},
					{
						name: 'mask',
						key: '5'
					},
					{
						name: 'device',
						key: '6'
					},
				],
				data: [],
			},
			loading : false,
		}
	},
	mounted () {
		this.fetchData()
	},
	beforeRouteLeave(to, from, next) {
		clearInterval(this.fetchInterval)
		next();
	},
	methods: {
		fetchData () {
			this.loading = true
			const receive = []
			Promise.all([
				ws.call(API.status.arp)
			]).then(([
				{ dict: { arp } },
			]) => {
				let index = 0
				const arplines = arp.split('\n').slice(1, arp.split('\n').length - 1)
				arplines.forEach(item =>{
					const array = item.replace( /\s\s+/g, ' ' ).split(' ')
					receive.push([
							index=index+1,
							array[0],
							array[1],
							array[2],
							array[3],
							array[4],
							array[5],
						])
				})
			})
			.catch(err => reportError(err))
			.finally(() => this.loading = false)

			this.devices.data = receive
		},
	},
}
</script>
