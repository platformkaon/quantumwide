<template>
	<section class="section">
		<recevie-table v-loading="loading"
			:columns="tableReceive.columns"
			:data='tableReceive.data'
		>
		</recevie-table>
		
		<transmit-table v-loading="loading"
			:columns="tableTransmit.columns"
			:data='tableTransmit.data'
		>
		</transmit-table>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import RecevieTable from './table.vue'
import TransmitTable from './table.vue'
import { API } from '@/shared/constants'
import { reportError } from '@/shared/functions'

export default {
	components: {
		RecevieTable,
		TransmitTable
	},
	data () {
		return {
			loading: false,
			tableReceive: {
				columns: [
					{
						name :'interface',
						key: '0'
					},
					{
						name :'bytes',
						key: '1'
					},
					{
						name :'packets',
						key: '2'
					},
					{
						name :'error',
						key: '3'
					},
					{
						name :'drop',
						key: '4'
					},
					{
						name :'fifo',
						key: '5'
					},
					{
						name :'frame',
						key: '6'
					},
					{
						name :'compressed',
						key: '7'
					},
					{
						name :'multicast',
						key: '8'
					},

				],
				data: []
			},
			tableTransmit: {
				columns: [
					{
						name :'interface',
						key: '0'
					},
					{
						name :'bytes',
						key: '1'
					},
					{
						name :'packets',
						key: '2'
					},
					{
						name :'error',
						key: '3'
					},
					{
						name :'drop',
						key: '4'
					},
					{
						name :'fifo',
						key: '5'
					},
					{
						name :'colls',
						key: '6'
					},
					{
						name :'compressed',
						key: '7'
					},
					{
						name :'multicast',
						key: '8'
					},

				],
				data: []
			}
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData () {
			this.loading = true
			ws.call(API.status.statistics).then(({ dict }) => {
				const lines = dict.statistics.trim().split("\n")
				lines.splice(0, 2)
				lines.sort((a, b) => {
					const itemA = a.split(":")[0].trim()
					const itemB = b.split(":")[0].trim()
					return itemA.localeCompare(itemB)
				})
				lines.forEach((line) => {
					const array = line.trim().replace( /\s\s+/g, ' ' ).split(' ')
					console.log(line)
					this.tableReceive.data.push([
							array[0].replace(':', ''),
							array[1],
							array[2],
							array[3],
							array[4],
							array[5],
							array[6],
							array[7],
							array[8],
					])

					this.tableTransmit.data.push([
							array[0].replace(':', ''),
							array[9],
							array[10],
							array[11],
							array[12],
							array[13],
							array[14],
							array[15],
							array[16],
					])
				})
			}).catch(reportError).finally(() => this.loading = false)
		}
	}
}
</script>