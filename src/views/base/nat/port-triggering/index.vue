<template>
	<section class="section">
		<port-table 
			:columns="columns" 
			:data="rules" 
			@edit='onRowEdit' 
			@delete='onRowDelete'
			@add='openForm'>
		</port-table>
		<rule-form 
			v-if='formShown' 
			:section='section' 
			@close='closeForm($event)'>
		</rule-form>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { reportError, reportSuccess, QSpinshow, QSpinhide } from '@/shared/functions'
import PortTable from './table.vue'
import RuleForm from './form.vue'

export default {
	components: {
		PortTable,
		RuleForm
	},
	data() {
		return {
			loading: false,
			rules: [],
			section: null,
			formShown: false,
			columns: [
				{ name: 'name', key: 'option_name', align: 'left' },
				{ name: 'trigger-port-start', key: 'trigger_port_start', align: 'center' },
				{ name: 'trigger-port-end', key: 'trigger_port_end', align: 'center' },
				{ name: 'open-port-start', key: 'open_port_start', align: 'center' },
				{ name: 'open-port-end', key: 'open_port_end', align: 'center' },
				{ name: 'protocol', key: 'proto', align: 'center' },
				{ name: 'interface', key: 'dest', align: 'center' },
				{ name: 'actions', key: 'actions', align: 'center' },
			]
		}
	},
	mounted() {
		this.fetchData()
	},
	methods: {
		onRowEdit(rowIndex) {
			this.openForm(this.rules[rowIndex])
		},
		onRowDelete(rowIdx) {
			this.deleteRule(this.rules[rowIdx])
		},
		fetchData() {
			this.loading = true
			this.rules = []
			ws.call(API.porttrigger.get).then(({ dict }) => {
				dict.list.forEach(item => {
					const open_port = item.dest_port.split(':')
 					const trigger_port = item.src_dport.split(':')

					const open_port_start = parseInt(open_port[0])
					const open_port_end = parseInt(open_port[1])

					const trigger_port_start = parseInt(trigger_port[0])
					const trigger_port_end = parseInt(trigger_port[1])
					this.rules.push({
						session_name: item.session_name,
						option_name: item.option_name,
						trigger_port_start,
						trigger_port_end,
						open_port_start,
						open_port_end,
						proto: item.proto,
						dest: item.dest
					})
				})
			})
			.catch(err => reportError(err))
			this.loading = false

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
		}
	}
}
</script>
