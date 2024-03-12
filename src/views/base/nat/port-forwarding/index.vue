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
import { reportError, QSpinshow, QSpinhide }  from '@/shared/functions'
import PortTable from './table.vue'
import RuleForm from './form.vue'

export default {
	components: {
		PortTable,
		RuleForm
	},
	data() {
		return {
			section: null,
			formShown: false,
			blackListRules: ['spectrum_analyzer'],
			columns: process.env.VENDOR!=='kaon' ?
			[
				{ name: '', key: 'enabled', align: 'center' },
				{ name: 'name', key: 'name', align: 'left' },
				{ name: 'network-zones', key: 'src', align: 'center' },
				{ name: 'source-ip', key: 'src_ip', align: 'center' },
				{ name: 'external-port', key: 'src_dport', align: 'center' },
				{ name: 'ip-address', key: 'dest_ip', align: 'center' },
				{ name: 'port', key: 'dest_port', align: 'center' },
				{ name: 'protocol', key: 'proto', align: 'center' },
				{ name: 'actions', key: 'actions', align: 'center' },
			]
			:
			[
				{ name: 'name', key: 'option_name', align: 'left' },
				{ name: 'ip-address', key: 'dest_ip', align: 'center' },
				{ name: 'protocol', key: 'proto', align: 'center' },
				{ name: 'internal-port', key: 'dest_port', align: 'center' },
				{ name: 'external-port', key: 'src_dport', align: 'center' },
				{ key: 'actions', align: 'center' },
			],
			rules: []
		}
	},
	mounted() {
		this.fetchData()
	},
	computed: {
	},
	methods: {
		onRowEdit(rowIndex) {
			this.openForm(this.rules[rowIndex])
		},
		onRowDelete(rowIndex) {
			this.deleteRule(this.rules[rowIndex])
		},
		fetchData () {
			ws.call(API.portforward.get).then(({ dict }) => {
				this.rules = dict.list
			})
			.catch(err => reportError(err))
		},
		deleteRule (rule) {
			QSpinshow()

			let params = {
				session_name: rule['session_name'],
			}

			if (confirm(this.t('are-you-sure-to-delete').cap)) {
				ws.call(API.portforward.del, params)
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
		openForm (rule) {
			this.section = rule ? rule : null
			this.formShown = true
		},
		closeForm (refresh) {
			if (refresh) {
				this.fetchData()
			}
			this.formShown = false
			window.scrollTo(0, 0)
		}
	}	
}
</script>
