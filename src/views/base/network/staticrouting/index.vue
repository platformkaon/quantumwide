<template>
	<section class="section">
		<staticroute-table
			:columns="columns"
			:data="rules"
			@edit='onRowEdit'
			@delete='onRowDelete'
			@add='openForm'>
		</staticroute-table>
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
import StaticrouteTable from './table.vue'
import RuleForm from './form.vue'

export default {
	components: {
		StaticrouteTable,
		RuleForm
	},
	data() {
		return {
			section: null,
			formShown: false,
			columns: [
				{ name: 'interface', key: 'interface', align: 'center' },
				{ name: 'target', key: 'target', align: 'center' },
				{ name: 'netmask', key: 'netmask', align: 'center' },
				{ name: 'gateway', key: 'gateway', align: 'center' },
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
			ws.call(API.network.staticrouting.get).then(({ dict }) => {
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
				ws.call(API.network.staticrouting.del, params)
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
