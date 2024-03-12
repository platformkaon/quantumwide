<template>
	<tr>
		<th>
			<label class="form-label" for="restore">{{ t("restore") }}</label>
		</th>
		<td>
			<input type="text" class="form-control" id="restoreInput" placeholder="" :value="filename">
		</td>
		<td>
			<div class="btn-area">
				<input type="file" style="display:none" ref="input" :id='name' :accept='mimes' @change='emitUpdate'
					readonly />
				<button class="btn-icon btn-administaion btn-icon-file" v-if="fileSelected && !loading"
					@click.prevent='remove'>{{ t('remove').cap }}</button>
				<button class="btn-icon btn-administaion btn-icon-file" v-else @click="selectFile">File</button>
				<button class="btn btn-secondary btn-administaion" @click="emitModal">{{ t("restore") }}</button>
			</div>
		</td>
	</tr>
</template>

<script>
export default {
	props: {
		name: {
			required: true,
			type: String
		},
		label: [String, Number],
		mimes: String,
		actionLabel: String,
		loading: Boolean,
		required: Boolean,
		buttonText: { type: String },
		hideUploadButton: { type: Boolean, default: false }
	},
	data() {
		return {
			fileSelected: false,
			filename: '',
		}
	},
	methods: {
		remove() {
			this.$refs.input.value = ''
			this.emitUpdate()
			this.$emit('remove', this.name)
		},
		emitUpdate() {
			const file = this.$refs.input.files[0]

			this.filename = file ? file.name : ''
			this.fileSelected = Boolean(file)
			this.$emit('update', this.name, this.$refs.input.files[0])
		},
		emitAction() {
			this.$emit('action', this.name, this.$refs.input.files[0])
		},
		selectFile() {
			this.$refs.input.click();
		},
		emitModal() {
			if (!this.filename) return
			this.$emit('modal')
		}
	}
}
</script>

