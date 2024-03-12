<template>
	<!-- start : article section -->
	<article class="article">
		<div class="wrap-content">
			<!-- class option : container / container-fluid / container-full -->
			<div class="container-fluid">
				<!-- <module-state /> -->
				<section class="section">
					<br>
					<!-- <h3 class="section-title">{{ t("overview").str }}</h3> -->
					<div class="row dashboard-wrap">
						<div>
							<div class="row">
								<div class="col-sm-6">
									<div class="info-box model-image">

									</div>
								</div>
								<div class="col-sm-6">
									<div class="info-box network-info">
										<el-row :gutter="20">
											<el-col :span="24">
												<el-card shadow="always">
													<table class="network-info-table">
														<tr>
															<th>{{ t("status").cap }} {{ t("connected").cap }}</th>

															<td>
																<p>{{ connStatus ? t('online').cap : t('offline').cap }}
																	<i v-if="connStatus" class="el-icon-circle-check"
																		style="color: green"></i>
																	<i v-else class="el-icon-circle-close"
																		style="color: red"></i>
																</p>
															</td>
														</tr>
													</table>
												</el-card>
											</el-col>
										</el-row>
										<el-row :gutter="20" v-if="$buildOptions.voice">
											<el-col :span="24">
												<el-card shadow="always">
													<table class="network-info-table">
														<tr>
															<th>{{ t("status").cap }} {{ t("voip").cap }}</th>
															<td>
																<p>{{ t("line").cap }} 1 : {{ status_line1 ===
																	'Registered' ? t('online').cap : t('offline').cap }}
																	<i v-if="status_line1 === 'Registered'"
																		class="el-icon-circle-check"
																		style="color: green"></i>
																	<i v-else class="el-icon-circle-close"
																		style="color: red"></i>
																</p>

																<p>{{ t("line").cap }} 2 : {{ status_line2 ===
																	'Registered' ? t('online').cap : t('offline').cap }}
																	<i v-if="status_line2 === 'Registered'"
																		class="el-icon-circle-check"
																		style="color: green"></i>
																	<i v-else class="el-icon-circle-close"
																		style="color: red"></i>
																</p>
															</td>
														</tr>
													</table>
												</el-card>
											</el-col>
										</el-row>
									</div>
								</div>


								<div class="col-sm-6">
									<div class="info-box wi-fi">
										<!-- class option : null / alret-->
										<router-link :to="{ name: 'wifi' }"
											class="info-box-title info-box-title-state icon-more"
											:class="{ 'alret': wificheck }" tag="h5">
											<span>{{ t("wifi") }}</span>
										</router-link>
										<div class="info-detail-container">
											<div class="info-icon"
												:style='wificheck ? "background-position:-270px -90px" : ""'></div>
											<ul class="info-list">
												<li id="wirelessItem">
													<div v-if="mainWifiForm24.fields.name !== ''">
														<p class="label">{{ t("wifi-2.4-ghz") }} <i
																v-if="mainWifiForm24.fields.disabled == '0'"
																class="el-icon-circle-check" style="color: green"></i><i
																v-else class="el-icon-circle-close" style="color: red"></i>
														</p>
														<p class="data">
															<i class="data">{{ mainWifiForm24.fields.ssid }}</i>
															<i class="data">, {{ mainWifiForm24.fields.current_channel}}/{{ mainWifiForm24.fields.current_bandwidth}}</i>
														</p>
														<hr style="margin-top:0.3rem; margin-bottom:0.3rem;">
													</div>
													<div v-if="mainWifiForm5.fields.name !== ''">
														<p class="label">{{ t("wifi-5.0-ghz") }} <i
																v-if="mainWifiForm5.fields.disabled == '0'"
																class="el-icon-circle-check" style="color: green"></i><i
																v-else class="el-icon-circle-close" style="color: red"></i>
														</p>
														<p class="data">
															<i>{{ mainWifiForm5.fields.ssid }}</i>
															<i>, {{ mainWifiForm5.fields.current_channel}}/{{ mainWifiForm5.fields.current_bandwidth}}</i>
														</p>
														<hr style="margin-top:0.3rem; margin-bottom:0.3rem;">
													</div>
													<div v-if="mainWifiForm6.fields.name !== ''">
														<p class="label">{{ t("wifi-6.0-ghz") }} <i
																v-if="mainWifiForm6.fields.disabled == '0'"
																class="el-icon-circle-check" style="color: green"></i><i
																v-else class="el-icon-circle-close" style="color: red"></i>
														</p>
														<p class="data">
															<i>{{ mainWifiForm6.fields.ssid }}</i>
															<i>, {{ mainWifiForm6.fields.current_channel}}/{{ mainWifiForm6.fields.current_bandwidth}}</i>
														</p>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>

								<div class="col-sm-6" v-loading="loader.bandsteering">
									<div class="info-box band-steering ">
										<router-link :to="{ name: 'wifi', params: { direct: 'bandsteering' } }"
											class="info-box-title info-box-title-state icon-more"
											:class="{ 'alret': !bandsteering_form }" tag="h5">
											<span>{{ t("wifi-5.0-bandsteering") }}</span>
										</router-link>
										<div class="info-detail-container">
											<div class="info-icon"
												:style='bandsteering_form ? "background-position:-540px -0px" : ""'></div>
											<div class="check-box-group">
												<div>
													<div v-if="bandsteering_form">{{ t("active") }}</div>
													<div class="state" v-else>{{ t("inactive") }}</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="col-sm-6" v-loading="loader.easymesh">
									<div class="info-box easy-mesh">
										<router-link :to="{ name: 'mesh', params: { direct: 'easymesh' } }"
											class="info-box-title easy-mesh info-box-title-state icon-more"
											:class="{ 'alret': !easymesh }" tag="h5">
											<span>{{ t("easymesh") }}</span>
										</router-link>
										<div class="info-detail-container">
											<div class="info-icon"
												:style='easymesh ? "background-position:-180px -0px" : ""'></div>
											<ul class="info-list">	
												<li id="multiapItem">
													<div v-if="multiapBhSta.fields.ssid !== ''">
														<p class="label">{{ t("backhaul-sta") }}: </p>
														<p class="data">
															<i class="data">{{ multiapBhSta.fields.ssid }} </i>
														</p>
														<i v-if="multiapBhSta.fields.ssid !== ''" class="el-icon-circle-check" style="color: green"></i>
														<i v-else class="el-icon-circle-close" style="color: red"></i>
														<hr style="margin-top:0.2rem; margin-bottom:0.2rem;">
													</div>
													<div v-if="multiapFh2G.fields.ssid !== ''">
														<p class="label">{{ t("fh") + ' ' + t("2.4ghz") }}: </p>
														<p class="data">
															<i class="data">{{ multiapFh2G.fields.ssid }} </i>
														</p>
														<i v-if="multiapFh2G.fields.ssid !== ''" class="el-icon-circle-check" style="color: green"></i>
														<i v-else class="el-icon-circle-close" style="color: red"></i>
														<hr style="margin-top:0.2rem; margin-bottom:0.2rem;">
													</div>
													<div v-if="multiapFh5G.fields.ssid !== ''">
														<p class="label">{{ t("fh") + ' ' + t("5ghz") }}: </p>
														<p class="data">
															<i class="data">{{ multiapFh5G.fields.ssid }} </i>
														</p>
														<i v-if="multiapFh5G.fields.ssid !== ''" class="el-icon-circle-check" style="color: green"></i>
														<i v-else class="el-icon-circle-close" style="color: red"></i>
														<hr style="margin-top:0.2rem; margin-bottom:0.2rem;">
													</div>
													<div v-if="multiapFh6G.fields.ssid !== ''">
														<p class="label">{{ t("fh") + ' ' + t("6ghz") }}: </p>
														<p class="data">
															<i class="data">{{ multiapFh6G.fields.ssid }} </i>
														</p>
														<i v-if="multiapFh6G.fields.ssid !== ''" class="el-icon-circle-check" style="color: green"></i>
														<i v-else class="el-icon-circle-close" style="color: red"></i>
														<hr style="margin-top:0.2rem; margin-bottom:0.2rem;">
													</div>
													<div v-if="multiapBh.fields.ssid !== ''">
														<p class="label">{{ t("bh") }}: </p>
														<p class="data">
															<i class="data">{{ multiapBh.fields.ssid }} </i>
														</p>
														<i v-if="multiapBh.fields.ssid !== ''" class="el-icon-circle-check" style="color: green"></i>
														<i v-else class="el-icon-circle-close" style="color: red"></i>
														<hr style="margin-top:0.2rem; margin-bottom:0.2rem;">
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="col-sm-6" v-loading="loader.usb" v-if="$buildOptions.usb">
									<div class="info-box usb">
										<router-link :to="{ name: 'network-share' }"
											class="info-box-title info-box-title-state icon-more"
											:class="{ 'alret': fields_usb.usb.usbDevices >= 1 ? false : true }" tag="h5">
											<span>{{ t("usb") }}</span>
										</router-link>
										<div class="info-detail-container">
											<div class="info-icon"
												:style='fields_usb.usb.usbDevices ? "background-position:-90px -0px" : ""'>
											</div>
											<div class="check-box-group">
												<div>
													<i v-if='loader.usb' class="el-icon-loading"></i>
													<div v-if="fields_usb.usb.usbDevices">{{ t("plugged") }}</div>
													<div class="state" v-else>{{ t("unplugged") }}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div> <!-- /.container -->
		</div> <!-- /.wrap-content -->
	</article> <!-- /.article -->
	<!-- end : article section -->
</template>

<script>
import ws from "@/shared/lib/ws";
import { API, RPC } from "@/shared/constants";
import ModuleState from "../../module-state";
import { reportSuccess, reportError, fillObject, trackFields, QSpinshow, QSpinhide } from '@/shared/functions'

export default {
	components: {
		ModuleState
	},
	data() {
		return {
			wifi: {
				status24: 'inactive',
				status5: 'inactive',
				status6: 'inactive',
				tx24: '',
				tx5: '',
				tx6: ''
			},
			connStatus: false,
			ipv4: '',
			ipv6: '',
			ipv6na: '',
			status_line1: '',
			status_line2: '',
			mainWifiForm24: {
				fields: {
					name: '',
					ssid: '',
					current_channel: '',
					current_bandwidth: '',
					disabled: '',
					ifname: '',
					macaddr: ''
				}
			},
			mainWifiForm5: {
				fields: {
					name: '',
					ssid: '',
					current_channel: '',
					current_bandwidth: '',
					disabled: '',
					ifname: '',
					macaddr: ''
				}
			},
			mainWifiForm6: {
				fields: {
					name: '',
					ssid: '',
					current_channel: '',
					current_bandwidth: '',
					disabled: '',
					ifname: '',
					macaddr: ''
				}
			},
			multiapBhSta: {
				fields: {
					ssid: ''
				}
			},
			multiapFh5G: {
				fields: {
					ssid: '',
				}
			},
			multiapFh2G: {
				fields: {
					ssid: '',
				}
			},
			multiapFh6G: {
				fields: {
					ssid: '',
				}
			},
			multiapBh: {
				fields: {
					ssid: '',
				}
			},
			wificheck: true,
			fields_usb: {
				usb: {
					usbDevices: false
				},
			},
			loader: {
				security: true,
				devices: false,
				info: true,
				status: true,
				usb: false,
				bandsteering: false,
				easymesh: false
			},
			loadUsb: true,
			easymesh: false,
			bandsteering: '',
			bandsteering_form: false
		}
	},
	async mounted() {
		this.fetchData()
		this.fetchData_wifi_global()
		this.fetchData_multiap()
		if(this.$buildOptions.usb)
			this.fetchData_usb()
	},
	methods: {
		fetchData() {
			// status
			ws.call(API.wireless.radio.get).then(({ dict }) => {
				dict.list.forEach(item => {
					if (item.band === "6g") {
						this.wifi.status6 = item.disabled == '0' ? 'active' : 'inactive'
						fillObject(this.mainWifiForm6.fields, item)

					}
					else if (item.band === "5g") {
						this.wifi.status5 = item.disabled == '0' ? 'active' : 'inactive'
						fillObject(this.mainWifiForm5.fields, item)
					}
					else {
						this.wifi.status24 = item.disabled == '0' ? 'active' : 'inactive'
						fillObject(this.mainWifiForm24.fields, item)
					}
				})
				if ((this.mainWifiForm24.fields.disabled == '0') ||
					(this.mainWifiForm5.fields.disabled == '0') ||
					(this.mainWifiForm6.fields.disabled == '0')) {
					this.wificheck = false
				}

			}).catch(err => reportError(err))

			Promise.all([
				ws.call(API.feature)
			]).then(
				([
					{ dict: feature }
				]) => {
					if(feature.rtmode != 'bridge'){
						Promise.all([
							ws.call(API.status.wan),
							ws.call(API.status.wan6),
						]).then(([
							{ dict: wan },
							{ dict: wan6 },
						]) => {
							this.connStatus = wan.up || wan6.up
						})
					}
				}
			)

			if(this.$buildOptions.voice) {
				ws.call(API.voice.status).then(({ dict }) => {
					if(dict.line1)
						this.status_line1 = dict.line1.status.trim()
					if(dict.line2)
						this.status_line2 = dict.line2.status.trim()
				})
			}
		},
		fetchData_usb() {
			// usb
			this.loader.usb = true
			ws.call(API.usb.get).then(({ dict }) => {
				if (dict.blockdevices && dict.blockdevices.length != 0) {
					Object.values(dict.blockdevices)[0].children[0].mountpoint ? this.fields_usb.usb.usbDevices = true : this.fields_usb.usb.usbDevices = false
				}
				else {
					this.fields_usb.usb.usbDevices = false
				}
			}).finally(() => this.loader.usb = false)

			this.loader.status = true
		},
		fetchData_wifi_global() {
			// #if buildOptions.easyMesh
			this.loader.easymesh = true
			this.loader.bandsteering = true
			ws.call(API.wireless.global.get).then(({ dict }) => {
				if (dict.mesh == '1' || dict.mesh == '3' || dict.mesh == '2') 
					this.easymesh = '1'
				else
					this.easymesh = '0'
				this.bandsteering = dict.bandsteer
				this.easymesh === '0' ? this.easymesh = false : this.easymesh = true
				this.bandsteering == '1' ? (this.bandsteering_form = true) : (this.bandsteering_form = false)
			}).finally(() => {
				this.loader.easymesh = false
				this.loader.bandsteering = false
			})
			// #endif
		},
		fetchData_multiap() {
			// #if buildOptions.easyMesh
			this.loader.easymesh = true
			ws.call(API.multiap.info).then(({ dict }) => {
				if (dict.bhsta != "disabled") {
					this.multiapBhSta.fields.ssid=dict.bhsta
				}

				if (dict.fh0w5g != "disabled") {
					this.multiapFh5G.fields.ssid=dict.fh0w5g
				}
				if (dict.fh0w6g ) {
					this.multiapFh6G.fields.ssid=dict.fh0w6g
				}
				if (dict.fh0w2g) {
					this.multiapFh2G.fields.ssid=dict.fh0w2g
				}
				if (dict.bh) {
					this.multiapBh.fields.ssid=dict.bh
				}
				if (dict.mesh == '1' || dict.mesh == '3' || dict.mesh == '2') 
					this.easymesh = '1'
				else
					this.easymesh = '0'
				this.bandsteering = dict.bandsteer
				this.easymesh === '0' ? this.easymesh = false : this.easymesh = true
				this.bandsteering == '1' ? (this.bandsteering_form = true) : (this.bandsteering_form = false)
			}).finally(() => {
				this.loader.easymesh = false
				this.loader.bandsteering = false
			})
			// #endif
		}
	},
}
</script>
<style scoped>
.circleWPSenabled {
	display: inline-block;
	height: 15px;
	width: 15px;
	border-radius: 50%;
	margin-left: 5px;
	margin-bottom: -3px;
	background-color: #1fbb46;
}

.circleWPSdisabled {
	display: inline-block;
	height: 15px;
	width: 15px;
	border-radius: 50%;
	margin-left: 5px;
	margin-bottom: -3px;
	background-color: color(black a(0.2));
}

.usb_dashboard {
	border-bottom: 1px solid #e5e5e5;
	height: 25vh;
}

.green_txt {
	color: #1fbb46;
}

.el-row {
	margin-bottom: 5px;

	&:last-child {
		margin-bottom: 0;
	}
}

.el-col {
	border-radius: 4px;
}

.bg-purple-dark {
	background: #99a9bf;
}

.bg-purple {
	background: #d3dce6;
}

.bg-purple-light {
	background: #e5e9f2;
}

.grid-content {
	border-radius: 4px;
	min-height: 36px;
}

.row-bg {
	padding: 10px 0;
	background-color: #f9fafc;
}
</style>
