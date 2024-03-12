<template>
	<section class="section">
		<div class="table-responsive">
			<table class="table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">
              {{ t(col.name) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='(row, rowIndex) in data' :key='rowIndex'>
            <td v-for='col in columns' :key='col.key'>
              <template v-if="col.key === 'enabled'">
                <span class="iconset icon-green-check" v-if="cellVal(row[col.key]) == 1">좋음</span>
                <span v-else></span>
              </template>
              <template v-else-if="col.key === 'actions'">
                <div class="d-flex">
                  <button type="button" class="iconset icon-edit" @click="$emit('edit', rowIndex)">{{ t('edit').cap }}</button>
                  <button type="button" class="iconset icon-trash" @click="$emit('delete', rowIndex)">{{ t('delete').cap }}</button>
                </div>
              </template>
              <template v-else>
                <div v-if="col.key==='2'">
                  {{ cellVal(row[col.key]) }}
                </div>
                <div v-else-if="col.key==='3'">
                  {{ cellVal(row[col.key]) }}
                </div>
                <div v-else>
                  {{ cellVal(row[col.key]) }}
                </div>
                <!-- <div @click="copy_info(row)">
                  {{ cellVal(row[col.key]) }}
                  <i class="el-icon-copy-document"></i>
                </div> -->
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
