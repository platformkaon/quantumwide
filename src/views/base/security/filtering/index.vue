<template>
	<section class="section" v-loading="rulesLoading">
		<filter-table :columns="columns" :data="allRules" @edit='onRowEdit' @delete='onRowDelete' @add='openForm'>
		</filter-table>
		<filter-form v-if="formShown" :section='section' @close='closeForm($event)'></filter-form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { fillObject, reportError, trackFields, QSpinshow, QSpinhide } from '@/shared/functions'
import FilterTable from './table.vue'
import FilterForm from './form.vue'
import { Time } from 'iview'

export default {
	components: {
		FilterTable,
		FilterForm,
	},
	data() {
		return {
			rulesLoading: false,
			allRules: [],
			section: null,
			formShown: false,
			columns: [
				{ name: 'name', key: 'option_name', align: 'left' },
				{ name: 'source-ip', key: 'src_ip', align: 'center' },
				{ name: 'source-port', key: 'src_port', align: 'center' },
				{ name: 'destination-ip', key: 'dest_ip', align: 'center' },
				{ name: 'destination-port', key: 'dest_port', align: 'center' },
				{ name: 'protocol', key: 'proto', align: 'center' },
				{ name: 'actions', key: 'actions', align: 'center' }
			],
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.allRules = []
			this.rulesLoading = true
			ws.call(API.ipfilter.get).then(({ dict }) => {
				this.allRules = dict.list.map(item => ({
					session_name: item.session_name,
					option_name: item.option_name,
					src_ip: item.src_ip,
					src_port: item.src_port,
					dest_ip: item.dest_ip,
					dest_port: item.dest_port,
					direction: item.src ? 'in' : 'out',
					proto: item.proto
				}))
			})
			.catch(err => reportError(err))
			this.rulesLoading = false
		},
		deleteRule(rule) {
			QSpinshow()

			let params = {
				session_name: rule['session_name'],
			}

			if (confirm(this.t('are-you-sure-to-delete').cap)) {
				ws.call(API.porttrigger.del, params)
				.then(() => { 
					ws.call(API.commit)
				})
				.finally(() => {
					this.fetchData()
					QSpinhide()
				})
			}
			else {
				QSpinhide()
			}
		},

		onRowEdit(rowIndex) {
			this.openForm(this.allRules[rowIndex])
		},

		onRowDelete(rowIndex) {
			this.deleteRule(this.allRules[rowIndex])
		},

		openForm(rule) {
			this.section = rule ? rule : null
			this.formShown = true
		},
		closeForm(refresh) {
			if (refresh) {
				this.fetchData()
			}
			this.formShown = false
			window.scrollTo(0, 0)
		},
	}
}
</script>
