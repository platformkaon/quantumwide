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
						name: 'hostname',
						key: '1'
					},
					{
						name: 'mac',
						key: '2'
					},
					{
						name: 'ip',
						key: '3'
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
			this.getCurrentlyConnectedDevices()
			.catch(err => reportError(err))
		},
		async getCurrentlyConnectedDevices () {
			this.loading = true

			const receive = []
			Promise.all([
				await ws.call(API.status.arp),
				await ws.call(API.status.dhcp)
			]).then(([
				{ dict: { arp } },
				{ dict: { dhcp } },
			]) => {
				let index = 0
				const arplines = arp.split('\n').slice(1, arp.split('\n').length - 1)
				arplines.forEach(item =>{
					let clientName = '*'
					const array = item.replace( /\s\s+/g, ' ' ).split(' ')
					if ( ( array.length===6) && ( array[2] === '0x2' ) && ( array[array.length - 1] === 'br-lan')) {
						const dhcplines = dhcp.split('\n').filter((line) => line.trim() !== '');
						dhcplines.forEach((client) => {
							const dhcparray = client.split(' ');
							const mac = dhcparray[1];
							if (mac.toUpperCase() === array[3].toUpperCase()) {
								clientName = dhcparray[3]
							}
						})

						receive.push([
								index=index+1,
								clientName,
								array[3],
								array[0]
							])
					}
				})
			})
			.finally(() => this.loading = false)
			this.devices.data = receive
		},
	},
}
</script>
