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
import { RPC, API, apiRPC } from '@/shared/constants'
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
			columns: 
			[
				{ name: 'description', key: 'desc', align: 'left' },
				{ name: 'service-type', key: 'stype', align: 'center' },
				{ name: 'protocol', key: 'ipver', align: 'center' },
				{ name: 'gateway', key: 'defaultroute', align: 'center' },
				{ name: 'vlan', key: 'vid', align: 'center' },
				{ name: 'igmp-proxy', key: 'igmp', align: 'center' },
				{ name: 'actions', key: 'actions', align: 'center' },
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
			ws.call(apiRPC("/wan/interface/table", "get", {})).then(({ dict }) => {
				this.rules = dict.list
			})
			.catch(err => reportError(err))
		},
		deleteRule (rule) {
			QSpinshow()

			let params = {
				name: rule['name'],
			}

			if (confirm(this.t('are-you-sure-to-delete').cap)) {
				console.log(params)
				ws.call(API.wan.del, params)
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
			this.section = rule ? rule.name : null
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
