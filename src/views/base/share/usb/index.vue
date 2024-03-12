<template>
	<!-- start : article section -->
	<article class="article">
			<div class="wrap-content">
					<!-- class option : container / container-fluid / container-full -->
					<div class="container-fluid">
							<section class="section">
								<el-alert
									v-if="remount_alert&&step==3"
									title="If one USB is un-plugged, you will need to re-mount(STEP 2) it."
									type="info"
									center
									show-icon>
								</el-alert>
								<br>
								<el-steps :active="step" align-center style="text-transform : uppercase;" finish-status="success">
									<el-step :title="this.t('step').cap+' '+'1'" :description="this.t('plugged').cap"></el-step>
									<el-step :title="this.t('step').cap+' '+'2'" :description="this.t('usb-mount').cap"></el-step>
									<el-step :title="this.t('step').cap+' '+'3'" :description="this.t('done').cap"></el-step>
								</el-steps>
								<br>
								<div v-if="step==0" class="col-sm-4" style="float:none; margin:0 auto;" v-loading="loader.usb||loader.usb_toggle">
									<div class="info-box" style="text-align: center;">
										<b-icon animation="fade" icon="folder" style="width: 120px; height: 120px;"></b-icon>
										<el-alert
											:title="this.t('step').cap+' '+'1'"
											type="info"
											:description="this.t('connect-usb').cap"
											show-icon
											center
											:closable="false">
										</el-alert>
									</div>
								</div>

								<div v-if="step==1" class="col-sm-4" style="float:none; margin:0 auto; text-align: center;" v-loading="loader.usb||loader.usb_toggle">
									<div class="info-box-kaon-warning">
										<b-icon animation="cylon" icon="folder-plus" style="width: 120px; height: 120px;"></b-icon>
										<el-alert
											:title="this.t('step').cap+' '+'2'"
											type="warning"
											:description="this.t('click-mount-button').cap"
											show-icon
											center
											:closable="false">
										</el-alert>

										<el-button type="warning" round style="text-transform : uppercase;"
											@click='toggleUsb(fields_usb.usb.usbDevices, false)'>
											{{ t('mount').cap }}
										</el-button>

									</div>
								</div>

								<div v-if="step==3" class="col-sm-4" style="float:none; margin:0 auto;" v-loading="loader.usb||loader.usb_toggle">
									<div class="info-box-kaon-success" style="text-align: center;">
										<b-icon icon="folder-check" style="width: 120px; height: 120px;"></b-icon>
										<el-alert
											:title="this.t('step').cap+' '+'3'"
											type="success"
											:description="this.t('success').cap"
											show-icon
											center
											:closable="false">
										</el-alert>
									</div>
								</div>
							</section>
					</div> <!-- /.container -->
			</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
	<!-- end : article section -->
</template>

<script>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { reportError, reportSuccess } from '@/shared/functions'

export default {
	data () {
		return {
			fields_usb: {
				usb: {
					usbDevices: []
				},
			},
			usbInterval: null,

			loader: {
				security: true,
				devices: false,
				info: true,
				status: true,
				usb: false,
				usb_toggle: false
			},
			step: 0,
			loadUsb: true,
			find: [],
			remount_alert: false
		}
	},
	mounted () {
		this.fetchData()
	},
	methods: {
		fetchData () {
			this.loader.usb = true
			this.usbInterval = setInterval(() => {
				if (this.loadUsb) {
					this.loadUsb = false
					ws.call(API.usb.get).then(({ dict }) => {
						if (dict.blockdevices && dict.blockdevices.length != 0) {
							this.step=1
							this.fields_usb.usb.usbDevices = dict.blockdevices.filter(item => !item.name.startsWith("mtd") && !item.name.startsWith("ubi"))
							this.fields_usb.usb.usbDevices.forEach(mount_block => {
								mount_block.children[0].mountpoint ? this.find.push('1') : this.find.push('0')
							})
							this.fields_usb.usb.usbDevices.length > 1 ? this.remount_alert = true : this.remount_alert = false
						}
						else {
							this.step=0
						}
					}).finally(() => {
						if(this.find.length > 0){
							if ( this.find.find(el=>el === '0') ) {
								this.step=1
							}
							else {
								this.step=3
							}
						}

						this.find=[]
						this.loader.usb = false
						this.loadUsb = true
					})
				}
			}, 3000)

			this.loader.status = true
		},

		toggleUsb (name, mounted) {
			this.loader.usb_toggle = true
			let requests = []

			let params = {
				device: '',
				fs_type: ''
			}

			if (!mounted) {
				name.forEach(block => {
					params.device = block.children[0].name
					params.fs_type = block.children[0].fstype
					requests.push(ws.call(RPC.usb.mount, params))
				});
			}

			if (requests.length) {
				Promise.all(requests).catch(reportError).finally(() => {
					this.loader.usb_toggle = false
					this.step=3
					reportSuccess()
				})
			}
		}
	},
	destroyed () {
		if (this.usbInterval) {
			clearInterval(this.usbInterval)
		}
	}
}
</script>
<style>
.usb_dashboard {
	border-bottom: 1px solid #e5e5e5;
	height: 25vh;
}
</style>
