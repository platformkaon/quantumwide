<template>
	<section class="section">
		<div class="table-responsive">
			<table class="table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">
              {{ t(col.name).cap }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(row, rowIndex) in data' :key='rowIndex'>
            <td v-for='col in columns' :key='col.key'>
              <template>
                <div>
                  {{ cellVal(row[col.key]) }}
                </div>
              </template>
            </td>
          </tr>
        </tbody>
			</table>
		</div>
		<section></section>
	</section>
</template>

<script>
import { reportSuccess } from '@/shared/functions'
export default {
	props: {
    columns: Array,
    data: Array
	},
  methods: {
		copy_info(index) {
      navigator.clipboard.writeText(index)
      reportSuccess()
		},
    cellVal (cell) {
			if (typeof cell === 'object') {
				return cell.$value
			}
			return cell
		},
  }
}
</script>
