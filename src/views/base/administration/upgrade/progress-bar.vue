<template>
	<tr>
		<th></th>
		<td>
			<div class="upload-bar-wrap">
				<span class="progress-bar"></span>
			</div>
		</td>
		<td></td>
	</tr>
</template>
<script>
export default {
	props: ['progress'],
	computed: {
		progressbar() {
			return document.querySelector(".progress-bar")
		}
	},
	watch: {
		'progress'() {
			this.progressbar.style.width = `${Math.round(this.progress)}%`
		}
	}
}
</script>

