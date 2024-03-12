<template>
	<section class="section" v-loading="loading">
		<div class="table-responsive">
			<table class="table-setting">
				<tbody>
					<f-file name='manualUpdate' label='' mimes='' :loading='upgradeAction.loading'
						:action-label='upgradeAction.label' @action='upgradeAction.func' @remove='cancelUpload'
						ref='uploader'>
					</f-file>
					<progress-bar v-if="uploadingFirmware" :progress="uploadingProgress" />
				</tbody>
			</table>
		</div>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import cConfirm from './confirm-password-dialog'
import fFile from './firm-file'
import progressBar from './progress-bar'
import { reportSuccess, reportError, QSpinTimer } from '@/shared/functions'
import axios from 'axios'

export default {
	components: {
		cConfirm,
		fFile,
		progressBar
	},
	data() {
		return {
			confirmModalShown: '',
			backup: null,
			uploadingBackup: false,
			creatingBackup: false,
			restoringBackup: false,
			downloadingBackup: false,
			configBlob: null,
			errorUpload: false,
			backupLink: null,
			backupValue: "",
			preserveConfig: true,
			firmware: null,
			uploadingFirmware: false,
			uploadingProgress: 0,
			installingFirmware: 0,
			installInterval: null,
			loading: false
		}
	},
	watch: {
		'errorUpload'() {
			if (this.errorUpload) {
				this.uploadingFirmware = false
				this.uploadingProgress = 0
				this.installingFirmware = 0
				this.firmware = null
				this.errorUpload = false
				this.$refs.uploader.remove()
				clearInterval(this.installInterval)
				this.loading = false
			}
		}
	},
	methods: {
		getBase64(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result.replace(/^data:.+;base64,/, ''));
				reader.onerror = error => reject(error);
			})
		},
		chunkSubstr(str, size) {
			const numChunks = Math.ceil(str.length / size)
			const chunks = new Array(numChunks)
			for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
				chunks[i] = str.substr(o, size)
			}
			return chunks
		},
		async uploadFirmware(f, file) {
			let append = false
			this.firmware = file
			this.uploadingFirmware = true
			this.uploadingProgress = 0
			this.getBase64(file).then(async data => {
				let requests = []
				try {
					var fd = new FormData()

					fd.append('sessionid', this.$store.getters.sid())
					fd.append('filename', '/tmp/firmware.img')
					fd.append('filedata', file)

					const response = await axios.post('/cgi-bin/cgi-upload', fd, {
						headers: { 'Content-Type': 'multipart/form-data' },
						onUploadProgress: progressEvent => {
							const progress = (progressEvent.loaded / progressEvent.total) * 100
							this.uploadingProgress = progress
						},
					})
				} catch (error) {
					file.state = 'aborted'
				}
			}).catch(e => {
				reportError(e)
				this.errorUpload = true
			}).finally(() => {
				this.uploadingFirmware = false
			})
		},
		cancelUpload() {
			this.uploadingFirmware = false
			this.uploadingProgress = 0
			this.uploadingBackup = false
			this.backup = null
			this.firmware = null
		},
		installFirmware() {
			const params = {
				file: '/tmp/firmware.img'
			}
			ws.call(API.firmware.install, params).then(({ dict }) => {
				if (dict.code !== 0) {
					reportError(this.t('img-check-fail').cap)
					this.errorUpload = true
					return
				}
			}).catch(e => {
				reportError(e)
				return
			})

			QSpinTimer(120, "Upgrade in progress...").finally(() => {
				reportSuccess()
				this.$store.dispatch('clearSession')
			})
		},
	},
	computed: {
		upgradeAction() {
			if (this.uploadingFirmware) {
				return {
					label: this.t('processing-file').cap,
					func: () => { },
					loading: true
				}
			}
			else if (this.installingFirmware) {
				return {
					label: this.t('installing').cap,
					func: () => { },
					loading: true
				}
			}
			else if (this.firmware) {
				return {
					label: this.t('install').cap,
					func: () => {
						this.installFirmware()
					}
				}
			}
			else {
				return {
					label: this.t('upload').cap,
					func: this.uploadFirmware,
					loading: false
				}
			}
		},
	},
	mounted() {
		Promise.all([
			ws.call(API.feature)
		])
		.catch(err => reportError(err))
	},
}
</script>

