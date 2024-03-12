<template>
	<section class="section">
		<div class="module-tab">
			<ul class="tab-label-list tab-label-list-2">
				<!-- class option : none / active / disabled -->
				<li class="tab-label-item" v-for='tab in tabs' :class="{ 'active': currentTab === tab.id }"
					@click="currentTab = tab.id, currentType = tab.type" :key='tab.id'>
					<div v-if="tab.label_2 != null" class="tab-label">{{ t(tab.label) + " " + t(tab.label_2) }}</div>
					<div v-else class="tab-label">{{ t(tab.label) }}</div>
				</li>
			</ul>
			<form :name='mainWifiForm.name' @submit.prevent='save_bandsteering_easymesh()' v-loading="loading"
				v-if="currentType === 'global'">
				<ul class="tab-content">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="bsd">{{ t('wifi-5.0-bandsteering').cap
													}}</label>
												</th>
												<td>
													<div class="form-checkbox">
													 <input type="checkbox" id="bsd" name='bsd'
															class="checkbox" v-model='bandsteering' true-value='1'
															false-value='0'>
														<label class="label" for="bsd">checkbox label</label>
													</div>
												</td>
											</tr>
										</tbody>
									</b-card-text>
								</b-card>
							</table>
						</div>
					</li>
				</ul>
				<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
			</form>

			<form :name='mainWifiForm.name' @submit.prevent='save()' v-loading="loading" v-else>
				<ul class="tab-content" v-if="currentType === '5g'">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<div v-if="bandsteering_form">
								<p class="text-sm text-info">
									<strong>{{ t('bandsteering-error') }}</strong>
								</p>
								<br>
							</div>
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="main_wifi5G_enable">{{ t('wifi').cap }}
														{{ t('enable').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled="bandsteering_form" type="checkbox"
															id="main_wifi5G_enable" name='main_wifi5G_enable'
															class="checkbox" v-model='mainWifiForm.fields.disabled'
															true-value='0' false-value='1'>
														<label class="label" for="main_wifi5G_enable">checkbox label</label>
													</div>
												</td>
												<td rowspan="6">
													<div v-if='mainWifiForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(mainWifiForm.fields.encryption) === -1'
														v-html='qrCode'>
													</div>
													<div
														v-else-if='mainWifiForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(mainWifiForm.fields.encryption) !== -1'>
														<span class='u-type--warning u-spc-left--xlrg'>
															{{ t('qr-doesnt-support-wpa3').cap }}
														</span>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_5G_hidden">{{ t('wifi').cap }} {{
														t('hidden').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input type="checkbox" id="main_5G_hidden" name='main_5G_hidden'
															class="checkbox" v-model='mainWifiForm.fields.hidden'
															true-value='1' false-value='0'>
														<label class="label" for="main_5G_hidden">checkbox label</label>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_5G_id">{{ t('ssid').cap }}</label>
												</th>
												<td>
													<input type="text" class="form-control" name='main_5G_id'
														id="main_5G_id" v-model='mainWifiForm.fields.ssid'>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_5G_encryption">{{
														t('encryption').cap }}</label>
												</th>
												<td>
													<select class="form-select" v-model='mainWifiForm.fields.encryption'
														name='main_5G_encryption'>
														<option v-for='item in encryptionOptions' :value='item.value'
															:key='item.value'>
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="mainWifiForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_5G_algo">{{
														t('algo').cap }}</label>
												</th>
												<td>
													<select class="form-select" v-model='mainWifiForm.fields.algo'
														name='main_5G_algo'>
														<option v-for='item in algoOptions' :value='item.value' :key='item.value' v-if="checkAlgoOptions(item)">
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="mainWifiForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_5G_password">{{ t('password').cap
													}}</label>
												</th>
												<td>
													<div class="form-password-wrap" :class="{ 'type-view': !showPassword }">
														<input :type='showPassword ? "text" : "password"'
															class="form-control" id="main_5G_password" placeholder=""
															v-model='mainWifiForm.fields.key'>
														<span class="icon-view-passowrd"
															@click="togglePassword('new')"></span>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_5G_wps">{{ t('wps').cap
													}}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input type="checkbox" id="main_5G_wps" name='main_5G_wps'
															class="checkbox" v-model='mainWifiForm.fields.wps_pushbutton'
															true-value='1' false-value='0'>
														<label class="label" for="main_5G_wps">checkbox
															label</label>
													</div>
												</td>
											</tr>

											<tr>
												<th>

												</th>
												<td>
													<div class="btn-more" @click="btnMore = !btnMore"
														:class="{ 'active': btnMore }">
														<span></span>
														<span>{{ t('more-options').cap }}</span>
													</div>
												</td>
											</tr>

											<td colspan="2">
												<table class="table-setting table-setting-child"
													:class="{ 'active': btnMore }">
													<tr>
														<th>
															<label class="form-label" for="main_5G_channel">{{
																t('channel').cap }}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.channel'
																name='main_5G_channel'>
																<option value="auto" selected>{{ t('auto').cap }}</option>
																<option v-for="ch in channelsFiltered()" :key="ch.value"
																	:value="ch.value">
																	{{ ch.label }}
																</option>
															</select>
															<p v-if="mainwifideviceForm.fields.channel === 'auto'"
																id="real_channel">{{ t('current').cap }}: {{ realchannel }}
															</p>
															<p v-else class="text notes" id="real_channel">{{
																t('current').cap }}: {{ realchannel }}</p>
														</td>
													</tr>

													<tr>
														<th>
															<label class="form-label" for="main_5G_tx">{{ t('tx-power').cap
															}}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.txpower'
																name='main_5G_tx'>
																<option v-for='item in txpowerOptions' :value='item.value'
																	:key='item.value'>
																	{{ item.label }}
																</option>
															</select>
														</td>
													</tr>

													<tr>
														<th>
															<label class="form-label" for="main_5G_bandwidth">{{
																t('bandwidth').cap }}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.bandwidth'
																name='main_5G_bandwidth' @change="bandwidthChange">
																<option v-for="bw in bandwidthForMode()" :key="bw.value"
																	:value="bw.value">
																	{{ bw.label }}
																</option>
															</select>
														</td>
													</tr>

													<tr>
														<th>
															<label class="form-label" for="main_5G_802">{{
																t('802.11-mode').cap }}</label>
														</th>
														<td>
															<select class="form-select" v-model='mainwifideviceForm.mode'
																name='main_5G_802'>
																<option v-for='item in NetworkIsolated' :value='item.value'
																	:key='item.value'>
																	{{ item.label }}
																</option>
															</select>
														</td>
													</tr>
													<tr>
														<th>
															<label class="form-label" for="main_5G_maxassoc">{{
																t('maxassoc').cap }}</label>
														</th>
														<td>
															<input type="text" class="form-control" name='main_5G_maxassoc'
																id="main_5G_maxassoc"
																v-model='mainwifideviceForm.fields.maxassoc'>
														</td>
													</tr>
												</table>
											</td>
										</tbody>
									</b-card-text>
								</b-card>
							</table>
						</div> <!-- /.table-responsive -->
					</li>
				</ul>
				<ul class="tab-content" v-if="currentType === '2g'">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<div v-if="bandsteering_form">
								<p class="text-sm text-info">
									<strong>{{ t('bandsteering-error') }}</strong>
								</p>
								<br>
							</div>
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="main_wifi2G_enable">{{ t('wifi').cap }}
														{{ t('enable').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox"
															id="main_wifi2G_enable" name='main_wifi2G_enable'
															class="checkbox" v-model='mainWifiForm.fields.disabled'
															true-value='0' false-value='1'>
														<label class="label" for="main_wifi2G_enable">checkbox label</label>
													</div>
												</td>
												<td rowspan="6">
													<div v-if='mainWifiForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(mainWifiForm.fields.encryption) === -1'
														v-html='qrCode'>
													</div>
													<div
														v-else-if='mainWifiForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(mainWifiForm.fields.encryption) !== -1'>
														<span class='u-type--warning u-spc-left--xlrg'>
															{{ t('qr-doesnt-support-wpa3').cap }}
														</span>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_2G_hidden">{{ t('wifi').cap }} {{
														t('hidden').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox"
															id="main_2G_hidden" name='main_2G_hidden' class="checkbox"
															v-model='mainWifiForm.fields.hidden' true-value='1'
															false-value='0'>
														<label class="label" for="main_2G_hidden">checkbox label</label>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_2G_id">{{ t('ssid').cap }}</label>
												</th>
												<td>
													<input :disabled='bandsteering_form' type="text" class="form-control"
														name='main_2G_id' id="main_2G_id"
														v-model='mainWifiForm.fields.ssid'>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_2G_encryption">{{
														t('encryption').cap }}</label>
												</th>
												<td>
													<select :disabled='bandsteering_form' class="form-select"
														v-model='mainWifiForm.fields.encryption' name='main_2G_encryption'>
														<option v-for='item in encryptionOptions' :value='item.value'
															:key='item.value'>
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="mainWifiForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_2G_algo">{{
														t('algo').cap }}</label>
												</th>
												<td>
													<select class="form-select" v-model='mainWifiForm.fields.algo'
														name='main_2G_algo'>
														<option v-for='item in algoOptions' :value='item.value' :key='item.value' v-if="checkAlgoOptions(item)">
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="mainWifiForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_2G_password">{{ t('password').cap
													}}</label>
												</th>
												<td>
													<div class="form-password-wrap" :class="{ 'type-view': !showPassword }">
														<input :disabled='bandsteering_form'
															:type='showPassword ? "text" : "password"' class="form-control"
															id="main_2G_password" placeholder=""
															v-model='mainWifiForm.fields.key'>
														<span class="icon-view-passowrd"
															@click="togglePassword('new')"></span>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_2G_wps">{{ t('wps').cap
													}}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox"
															id="main_2G_wps" name='main_2G_wps' class="checkbox"
															v-model='mainWifiForm.fields.wps_pushbutton' true-value='1'
															false-value='0'>
														<label class="label" for="main_2G_wps">checkbox
															label</label>
													</div>
												</td>
											</tr>

											<tr>
												<th>

												</th>
												<td>
													<div class="btn-more" @click="btnMore = !btnMore"
														:class="{ 'active': btnMore }">
														<span></span>
														<span>{{ t('more-options').cap }}</span>
													</div>
												</td>
											</tr>

											<td colspan="2">
												<table class="table-setting table-setting-child"
													:class="{ 'active': btnMore }">
													<tr>
														<th>
															<label class="form-label" for="main_2G_channel">{{
																t('channel').cap }}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.channel'
																name='main_2G_channel'>
																<option value="auto" selected>{{ t('auto').cap }}</option>
																<option v-for="ch in channelsFiltered()" :key="ch.value"
																	:value="ch.value">
																	{{ ch.label }}
																</option>
															</select>
															<p v-if="mainwifideviceForm.fields.channel === 'auto'"
																id="real_channel">{{ t('current').cap }}: {{ realchannel }}
															</p>
															<p v-else class="text notes" id="real_channel">{{
																t('current').cap }}: {{ realchannel }}</p>
														</td>
													</tr>

													<tr>
														<th>
															<label class="form-label" for="main_2G_tx">{{ t('tx-power').cap
															}}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.txpower'
																name='main_2G_tx'>
																<option v-for='item in txpowerOptions' :value='item.value'
																	:key='item.value'>
																	{{ item.label }}
																</option>
															</select>
														</td>
													</tr>

													<tr>
														<th>
															<label class="form-label" for="main_2G_bandwidth">{{
																t('bandwidth').cap }}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.bandwidth'
																name='main_2G_bandwidth'>
																<option v-for="bw in bandwidthForMode()" :key="bw.value"
																	:value="bw.value">
																	{{ bw.label }}
																</option>
															</select>
														</td>
													</tr>

													<tr
														v-if="mainwifideviceForm.fields.bandwidth === '40MHz'">
														<th>
															<label class="form-label" for="main_2G_sideband">Side
																Band</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.nctrlsb'
																name='main_2G_sideband'>
																<option value="BelowControlChannel">{{ t('lower').cap }}
																</option>
																<option value="AboveControlChannel" selected>{{
																	t('upper').cap }}</option>
															</select>
														</td>
													</tr>

													<tr>
														<th>
															<label class="form-label" for="main_2G_802">{{
																t('802.11-mode').cap }}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.mode' name='main_2G_802'>
																<option v-for='item in NetworkIsolated2' :value='item.value'
																	:key='item.value'>
																	{{ item.label }}
																</option>
															</select>
														</td>
													</tr>
													<tr>
														<th>
															<label class="form-label" for="main_2G_maxassoc">{{
																t('maxassoc').cap }}</label>
														</th>
														<td>
															<input type="text"
																class="form-control" name='main_2G_maxassoc'
																id="main_2G_maxassoc"
																v-model='mainwifideviceForm.fields.maxassoc'>
														</td>
													</tr>
												</table>
											</td>
										</tbody>
									</b-card-text>
								</b-card>
							</table>
						</div> <!-- /.table-responsive -->
					</li>
				</ul>
				<ul class="teb-content" v-if="currentType === '6g'">
					<li class="tab-content-item active">
						<div class="table-responsive mt-4">
							<div v-if="bandsteering_form">
								<p class="text-sm text-info">
									<strong>{{ t('bandsteering-error') }}</strong>
								</p>
								<br>
							</div>
							<table class="table-setting">
								<b-card header-tag="header" footer-tag="footer">
									<b-card-text>
										<tbody>
											<tr>
												<th>
													<label class="form-label" for="main_wifi6G_enable">{{ t('wifi').cap }}
														{{ t('enable').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox"
															id="main_wifi6G_enable" name='main_wifi6G_enable'
															class="checkbox" v-model='mainWifiForm.fields.disabled'
															true-value='0' false-value='1'>
														<label class="label" for="main_wifi6G_enable">checkbox label</label>
													</div>
												</td>
												<td rowspan="6">
													<div v-if='mainWifiForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(mainWifiForm.fields.encryption) === -1'
														v-html='qrCode'>
													</div>
													<div
														v-else-if='mainWifiForm.fields.disabled == "0" && ["sae", "sae-mixed"].indexOf(mainWifiForm.fields.encryption) !== -1'>
														<span class='u-type--warning u-spc-left--xlrg'>
															{{ t('qr-doesnt-support-wpa3').cap }}
														</span>
													</div>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_6G_hidden">{{ t('wifi').cap }} {{
														t('hidden').cap }}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox" id="main_6G_hidden" name='main_6G_hidden'
															class="checkbox" v-model='mainWifiForm.fields.hidden'
															true-value='1' false-value='0'>
														<label class="label" for="main_6G_hidden">checkbox label</label>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_6G_id">{{ t('ssid').cap }}</label>
												</th>
												<td>
													<input :disabled='bandsteering_form' type="text" class="form-control" name='main_6G_id'
														id="main_6G_id" v-model='mainWifiForm.fields.ssid'>
												</td>
											</tr>

											<tr>
												<th>
													<label class="form-label" for="main_6G_encryption">{{
														t('encryption').cap }}</label>
												</th>
												<td>
													<select :disabled='bandsteering_form' class="form-select" v-model='mainWifiForm.fields.encryption'
														name='main_6G_encryption'>
														<option v-for='item in encryptionOptions6' :value='item.value'
															:key='item.value'>
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="mainWifiForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_6G_algo">{{
														t('algo').cap }}</label>
												</th>
												<td>
													<select class="form-select" v-model='mainWifiForm.fields.algo'
														name='main_6G_algo'>
														<option v-for='item in algoOptions' :value='item.value' :key='item.value' v-if="checkAlgoOptions(item)">
															{{ item.label }}
														</option>
													</select>
												</td>
											</tr>

											<tr v-if="mainWifiForm.fields.encryption !== 'none'">
												<th>
													<label class="form-label" for="main_6G_password">{{ t('password').cap
													}}</label>
												</th>
												<td>
													<div class="form-password-wrap" :class="{ 'type-view': !showPassword }">
														<input :disabled='bandsteering_form' :type='showPassword ? "text" : "password"'
															class="form-control" id="main_6G_password" placeholder=""
															v-model='mainWifiForm.fields.key'>
														<span class="icon-view-passowrd"
															@click="togglePassword('new')"></span>
													</div>
												</td>
											</tr>
											<tr>
												<th>
													<label class="form-label" for="main_6G_wps">{{ t('wps').cap
													}}</label>
												</th>
												<td>
													<div class="form-checkbox">
														<input :disabled='bandsteering_form' type="checkbox" id="main_6G_wps" name='main_6G_wps'
															class="checkbox" v-model='mainWifiForm.fields.wps_pushbutton'
															true-value='1' false-value='0'>
														<label class="label" for="main_6G_wps">checkbox
															label</label>
													</div>
												</td>
											</tr>

											<tr>
												<th>

												</th>
												<td>
													<div class="btn-more" @click="btnMore = !btnMore"
														:class="{ 'active': btnMore }">
														<span></span>
														<span>{{ t('more-options').cap }}</span>
													</div>
												</td>
											</tr>

											<td colspan="2">
												<table class="table-setting table-setting-child"
													:class="{ 'active': btnMore }">
													<tr>
														<th>
															<label class="form-label" for="main_6G_channel">{{
																t('channel').cap }}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.channel'
																name='main_6G_channel'>
																<option value="auto" selected>{{ t('auto').cap }}</option>
																<option v-for="ch in channelsFiltered()" :key="ch.value"
																	:value="ch.value">
																	{{ ch.label }}
																</option>
															</select>
															<p v-if="mainwifideviceForm.fields.channel === 'auto'"
																id="real_channel">{{ t('current').cap }}: {{ realchannel }}
															</p>
															<p v-else class="text notes" id="real_channel">{{
																t('current').cap }}: {{ realchannel }}</p>
														</td>
													</tr>

													<tr>
														<th>
															<label class="form-label" for="main_6G_tx">{{ t('tx-power').cap
															}}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.txpower'
																name='main_6G_tx'>
																<option v-for='item in txpowerOptions' :value='item.value'
																	:key='item.value'>
																	{{ item.label }}
																</option>
															</select>
														</td>
													</tr>

													<tr>
														<th>
															<label class="form-label" for="main_6G_bandwidth">{{
																t('bandwidth').cap }}</label>
														</th>
														<td>
															<select class="form-select"
																v-model='mainwifideviceForm.fields.bandwidth'
																name='main_6G_bandwidth' @change="bandwidthChange">
																<option v-for="bw in bandwidthForMode()" :key="bw.value"
																	:value="bw.value">
																	{{ bw.label }}
																</option>
															</select>
														</td>
													</tr>

													<tr>
														<th>
															<label class="form-label" for="main_6G_802">{{
																t('802.11-mode').cap }}</label>
														</th>
														<td>
															<select class="form-select" v-model='mainwifideviceForm.mode'
																name='main_6G_802'>
																<option v-for='item in NetworkIsolated' :value='item.value'
																	:key='item.value'>
																	{{ item.label }}
																</option>
															</select>
														</td>
													</tr>
													<tr>
														<th>
															<label class="form-label" for="main_6G_maxassoc">{{
																t('maxassoc').cap }}</label>
														</th>
														<td>
															<input type="text" class="form-control" name='main_6G_maxassoc'
																id="main_6G_maxassoc"
																v-model='mainwifideviceForm.fields.maxassoc'>
														</td>
													</tr>
												</table>
											</td>
										</tbody>
									</b-card-text>
								</b-card>
							</table>
						</div> <!-- /.table-responsive -->
					</li>
				</ul>
				<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
				</div>
				<br>
				<macfilter-table
					:columns="columns"
					:data="rules"
					@edit='onRowEdit'
					@delete='onRowDelete'
					@add='openForm'
				></macfilter-table>
				<rule-form
					v-if='formShown'
					:interface='currentTab'
					@close='closeForm($event)'>
				</rule-form>
			</form>
		</div>
	</section>
</template>

<script>
import ws from '@/shared/lib/ws'
import { apiRPC, API, RPC } from '@/shared/constants'
import { reportSuccess, reportNotice, reportError, fillObject, trackFields, isEmpty, QSpinTimer, QSpinshow, QSpinhide } from '@/shared/functions'
import Password from 'vue-password-strength-meter'
import Qrcode from 'qrcode-generator'
import str_length from '@/shared/validators/str-length.js'
import number from '@/shared/validators/number.js'
import { encrypt_aes256, decrypt_aes256 } from '@/shared/functions'
import validator from 'validator'
import MacfilterTable from './table.vue'
import RuleForm from './form.vue'

export default {
	props: {
		direct: {
			type: String,
			default: ''
		}
	},
	components: {
		Password,
		MacfilterTable,
		RuleForm,
	},
	data() {
		return {
			tabs: [],
			rules: [],
			ifname: '',
			name: '',
			columns: [
				{ name: 'number', key: 'number', align: 'center' },
				{ name: 'mac-address', key: 'mac', align: 'center' },
				{ name: 'actions', key: 'actions', align: 'center' }
			],
			formShown: false,
			currentTab: 'global',
			currentType: 'global',
			mainWifiForm: {
				name: 'iface-form',
				loading: false,
				fields: {
					name:'',
					ifname:'',
					ssid: '',
					isolate: '1',
					hidden: '0',
					encryption: 'none',
					algo: '',
					key: '',
					disabled: '',
					wps_pushbutton: ''
				}
			},
			mainwifideviceForm: {
				name: 'device-form',
				fields: {
					name: '',
					ifname:'',
					band:'',
					bandwidth: '',
					nctrlsb: '',
					txpower: '',
					channel: '',
					mode: '',
					maxassoc: '',
					disabled: ''
				},
				channel: [],
				mode: ''
			},
			chanspecs2g: {
				b20: [],
				b40: []
			},
			chanspecs5g: {
				b20: [],
				b40: [],
				b80: [],
				b160: []
			},
			chanspecs6g: {
				b20: [],
				b40: [],
				b80: [],
				b160: []
			},
			encryptionOptions: [
				{ label: 'WPA-PSK', value: 'psk' },
				{ label: 'WPA2-PSK', value: 'psk2' },
				{ label: 'WPA3-Personal', value:'sae' },
				{ label: 'WPA-WPA2', value: 'psk-mixed' },
				{ label: 'WPA2-WPA3', value: 'sae-mixed' },
				{ label: this.t('none').cap, value: 'none' }
			],
			encryptionOptions6: [
				{ label: 'WPA3 (SAE)', value: 'sae' },
			],
			algoOptions: [
				{ label: this.t('auto (tkip+aes)').cap, value: 'tkip+aes' },
				{ label: this.t('tkip').cap, value: 'tkip' },
				{ label: this.t('aes').cap, value: 'aes' },
			],
			txpowerOptions: [
				{ label: '25%', value: '25' },
				{ label: '50%', value: '50' },
				{ label: '75%', value: '75' },
				{ label: '100%', value: '100' },
			],
			NetworkIsolated2: [
				{ label: '802.11 b/g', value: '0' },
				{ label: '802.11 b/g/n', value: '1' },
				{ label: '802.11 ax', value: '3' }
			],
			NetworkIsolated: [
				{ label: '802.11 a/n/ac', value: '2' },
				{ label: ' 802.11 ax', value: '3' }
			],
			loading: false,
			showPassword: false,
			SpinTime: 0,
			fetchInterval: '',
			btnMore: false,
			qrCode: '',
			realchannel: '',
			bandsteering: '',
			bandsteering_form: false,
		}
	},
	beforeMount() {
		this.loadWiFi()
		if (this.$route.params.direct) {
			this.currentTab = 'global'
			this.currentType = 'global'
		}
	},
	mounted() {
		this.fetchData()
	},

	watch: {
		'currentTab'(radio) {
			if (radio) {
				this.loading = true
				this.fetchData()
			}
		}
	},

	methods: {
		checkAlgoOptions(item) {
			if(this.mainWifiForm.fields.encryption.includes("sae") && item.value.includes("tkip"))
				return false
			return true
		},
		togglePassword(field, e) {
			this.showPassword = !this.showPassword
		},
		loadWiFi() {
			this.tabs = [{ id: 'global', type: 'global', label: 'bandsteering', label_2: null }]

			ws.call(API.wireless.radio.get).then(({ dict }) => {
				dict.list.forEach(item => {
					if (item.band === "5g") {
						this.tabs.push({ id: item.name, type: '5g', label: 'main', label_2: '5ghz' })
						return false
					}
				})
				dict.list.forEach(item => {
					if (item.band === "2g") {
						this.tabs.push({ id: item.name, type: '2g', label: 'main', label_2: '2.4ghz' })
						return false
					}
				})
				dict.list.forEach(item => {
					if (item.band === "6g") {
						this.tabs.push({ id: item.name, type: '6g', label: 'main', label_2: '6ghz' })
						return false
					}
				})
			})

			ws.call(apiRPC("/wifi/radio/2g/chanspecs/all", "get", {})).then(({ dict }) => {
				if (dict.chanspecs) {
					fillObject(this.chanspecs2g, dict.chanspecs)
				}
			})
			ws.call(apiRPC("/wifi/radio/5g/chanspecs/all", "get", {})).then(({ dict }) => {
				if (dict.chanspecs) {
					fillObject(this.chanspecs5g, dict.chanspecs)
				}
			})
			ws.call(apiRPC("/wifi/radio/6g/chanspecs/all", "get", {})).then(({ dict }) => {
				if (dict.chanspecs) {
					fillObject(this.chanspecs6g, dict.chanspecs)
				}
			})
		},
		bandwidthChange() {
			let channel_list = []

			if (this.currentType === '2g') {
				if (this.mainwifideviceForm.fields.bandwidth == '20')
					channel_list = this.chanspecs2g.b20
				else if (this.mainwifideviceForm.fields.bandwidth == '40')
					channel_list = this.chanspecs2g.b40
			}
			else if (this.currentType === '5g') {
				if (this.mainwifideviceForm.fields.bandwidth === '20')
					channel_list = this.chanspecs5g.b20
				else if (this.mainwifideviceForm.fields.bandwidth == '40')
					channel_list = this.chanspecs5g.b40
				else if (this.mainwifideviceForm.fields.bandwidth == '80')
					channel_list = this.chanspecs5g.b80
				else if (this.mainwifideviceForm.fields.bandwidth == '160')
					channel_list = this.chanspecs5g.b160
			}
			else if (this.currentType === '6g') {
				if (this.mainwifideviceForm.fields.bandwidth == '20')
					channel_list = this.chanspecs6g.b20
				else if (this.mainwifideviceForm.fields.bandwidth == '40')
					channel_list = this.chanspecs6g.b40
				else if (this.mainwifideviceForm.fields.bandwidth == '80')
					channel_list = this.chanspecs6g.b80
				else if (this.mainwifideviceForm.fields.bandwidth == '160')
					channel_list = this.chanspecs6g.b160
			}

			this.mainwifideviceForm.channel = [];
			channel_list.forEach(item => {
				this.mainwifideviceForm.channel.push({ label: item, value: item })
			})

		},
		fetchData() {
			this.loading = true
			const requests = []

			const typeNumber = 7
			const errorCorrectionLevel = 'L'
			Qrcode.stringToBytes = Qrcode.stringToBytesFuncs['UTF-8']
			const qr = Qrcode(typeNumber, errorCorrectionLevel)
			this.mainWifiForm.loading = true

			requests[0] = ws.call(API.wireless.global.get).then(({ dict }) => {
				if (dict) {
					this.bandsteering = dict.bandsteer
					this.bandsteering == '1' ? (this.bandsteering_form = true) : (this.bandsteering_form = false)
					this.bandsteering_tmp = dict.bandsteer
				}
			})

			if (this.currentTab !== "global") {
				requests[1] = ws.call(apiRPC("/wifi/ssid/fronthaul/" + this.currentTab, "get", {})).then(({ dict: ssidResp }) => {
					if (ssidResp.list[0]) {
						fillObject(this.mainWifiForm.fields, ssidResp.list[0])
						if (this.mainWifiForm.fields.encryption === 'none') {
							qr.addData(`WIFI:T:nopass;S:${this.mainWifiForm.fields.ssid};;;`)
						}
						else {
							qr.addData(`WIFI:T:WPA;S:${this.mainWifiForm.fields.ssid};P:${this.mainWifiForm.fields.key};;`)
						}
						qr.make()

						this.qrCode = qr.createImgTag(4)

						this.rules = []
						var maclistArray = ssidResp.list[0].maclist.split(' ')
						if (maclistArray.length > 0 && maclistArray[0] !== '') {
							var objectsArray = maclistArray.map((mac, index) => {
								return {
									number: index+1,
									mac: mac
								}
							})
							this.rules.push(...objectsArray)
						}
					}
				})

				requests[2] = ws.call(apiRPC("/wifi/radio/" + this.currentTab, "get", {})).then(({ dict: deviceResp }) => {
					if (deviceResp) {
						fillObject(this.mainwifideviceForm.fields, deviceResp)
						this.realchannel = deviceResp.current_channel + '/' + deviceResp.current_bandwidth

						this.bandwidthChange()
						this.mainwifideviceForm.mode = this.mainwifideviceForm.fields.mode
					}
				})
			}

			// What if an error pops up? ... it only causes argument ... 
			//.catch(reportError)
			Promise.all(requests).catch(reportError).finally(() => this.loading = false)
		},
		async save_bandsteering_easymesh() {
			QSpinshow()
			let requests = []

			const ssidPromise = ws.call(apiRPC("/wifi/ssid/fronthaul/wl0", "get", {}))

			if (this.bandsteering_tmp !== this.bandsteering) {
				const bsParams = {
				bandsteer: this.bandsteering
				}
				requests.push(ws.call(API.wireless.global.set, bsParams))
			}

			if (this.bandsteering == '1') {
				reportNotice(this.t('warning-bandsteering').cap)
				await ssidPromise.then(({ dict: ssidResp }) => {
				const w2gParams = {
					encryption: ssidResp.list[0].encryption,
					ifname: "wl2",
					key: ssidResp.list[0].key,
					name: "default_wl2",
					ssid: ssidResp.list[0].ssid
				}
				requests.push(ws.call(API.wireless.ssid.set, w2gParams))

				const w6gParams = {
					ifname: "wl1",
					key: ssidResp.list[0].key,
					name: "default_wl1",
					ssid: ssidResp.list[0].ssid
				}

				requests.push(ws.call(API.wireless.ssid.set, w6gParams))
				})
			} else if (this.bandsteering == '0') {
				reportNotice(this.t('disabled-bandsteering').cap)
				await ssidPromise.then(({ dict: ssidResp }) => {
				const w2gParams = {
					ifname: "wl2",
					name: "fh0w2g",
					ssid: ssidResp.list[0].ssid + "_2.4GHz"
				}
				requests.push(ws.call(API.wireless.ssid.set, w2gParams))

				const w6gParams = {
					ifname: "wl1",
					name: "fh0w6g",
					ssid: ssidResp.list[0].ssid + "_6GHz"
				}

				requests.push(ws.call(API.wireless.ssid.set, w6gParams))
				})
			}

			requests.push(ws.call(API.wireless.commit))

			if (requests.length) {
				Promise.all(requests)
				.then(() => {})
				.catch(reportError)
				.finally(() => {
					QSpinTimer(15).finally(() => reportSuccess() & this.fetchData())
				})
			}
		},
		async save() {
			QSpinshow()
			let requests = []
			let blank_pattern = /[\s]/g;

			if (str_length(this.mainWifiForm.fields.ssid, 1, 32)) {
				reportError(this.t('err.validation.wifi-ssid-1').cap)
				return QSpinhide()
			}
			else if (blank_pattern.test(this.mainWifiForm.fields.ssid) == true) {
				reportError(this.t('ssid-space-alert').cap)
				return QSpinhide()
			}

			else if (str_length(this.mainWifiForm.fields.key, 8, 32)) {
				reportError(this.t('err.validation.wifi-pass-1').cap)
				return QSpinhide()
			}

			else if (number(this.mainwifideviceForm.fields.maxassoc, 1, 64)) {
				reportError(this.t('maxassoc').cap)
				return QSpinhide()
			}

			else if (blank_pattern.test(this.mainWifiForm.fields.key) == true) {
				reportError(this.t('password-blank-no').cap)
				return QSpinhide()
			}
			else if (!validator.isAscii(this.mainWifiForm.fields.key) || !validator.isAscii(this.mainWifiForm.fields.ssid)) {
				reportError(this.t('ssid').cap + ", " + this.t('password').cap + " : " + this.t('err.validation.wifi-pass-6').cap)
				return QSpinhide()
			}

			this.mainwifideviceForm.fields.mode = this.mainwifideviceForm.mode

			requests.push(
				ws.call(API.wireless.ssid.set, this.mainWifiForm.fields)
			)

			if (this.bandsteering == '1') {
				const w2gParams = {
					encryption: this.mainWifiForm.fields.encryption,
					ifname: "wl2",
					key: this.mainWifiForm.fields.key,
					name: "fh0w2g",
					ssid: this.mainWifiForm.fields.ssid
				}
				requests.push(ws.call(API.wireless.ssid.set, w2gParams))

				const w6gParams = {
					ifname: "wl1",
					key: this.mainWifiForm.fields.key,
					name: "fh0w6g",
					ssid: this.mainWifiForm.fields.ssid
				}

				requests.push(ws.call(API.wireless.ssid.set, w6gParams))
			}

			requests.push(
				ws.call(API.wireless.radio.set, this.mainwifideviceForm.fields)
			)

			requests.push(
				ws.call(API.wireless.commit)
			)

			if (requests.length) {
				Promise.all(requests).then(() => {
					
				}, reportError).finally(() => {
					QSpinTimer(15).finally(() => reportSuccess() & this.fetchData())
				})
			}
		},

		channelsFiltered() {
			return JSON.parse(JSON.stringify(this.mainwifideviceForm.channel))
		},

		bandwidthForMode() {
			if (this.mainwifideviceForm.mode == '0') {
				this.mainwifideviceForm.fields.bandwidth = '20'
			}

			let availableBandwidth = []

			if (this.mainwifideviceForm.mode == '0') {
				availableBandwidth.push({
					label: '20 MHz',
					value: '20'
				})
			}
			else if (this.mainwifideviceForm.mode == '1') {
				availableBandwidth.push({
					label: '20 MHz',
					value: '20'
				})
				availableBandwidth.push({
					label: 'Auto 20/40 MHz',
					value: '40'
				})
			}
			else if (this.mainwifideviceForm.mode == '2') {
				availableBandwidth.push({
					label: '20 MHz',
					value: '20'
				})
				availableBandwidth.push({
					label: 'Auto 20/40 MHz',
					value: '40'
				})
				availableBandwidth.push({
					label: 'Auto 20/40/80 MHz',
					value: '80'
				})
				availableBandwidth.push({
					label: 'Auto 20/40/80/160 MHz',
					value: '160'
				})
			}
			else if (this.mainwifideviceForm.mode == '3') {
				availableBandwidth.push({
					label: '20 MHz',
					value: '20'
				})
				availableBandwidth.push({
					label: 'Auto 20/40 MHz',
					value: '40'
				})
				if (this.currentType === '5g' || this.currentType === '6g') {
					availableBandwidth.push({
						label: 'Auto 20/40/80 MHz',
						value: '80'
					})
					availableBandwidth.push({
						label: 'Auto 20/40/80/160 MHz',
						value: '160'
					})
				}
			}

			if (!availableBandwidth || isEmpty(availableBandwidth)) return []
			else return JSON.parse(JSON.stringify(availableBandwidth))
		},
		onRowEdit(rowIndex) {
			this.openForm(this.rules[rowIndex])
		},
		onRowDelete(rowIndex) {
			this.deleteRule(this.rules[rowIndex])
		},
		deleteRule (rule) {
			QSpinshow()

			if (confirm(this.t('are-you-sure-to-delete').cap)) {
				const requests = []
				ws.call(apiRPC("/wifi/ssid/fronthaul/" + this.currentTab, "get", {})).then(({ dict: ssidResp }) => {
					if (ssidResp.list[0]) {
						console.log(ssidResp.list[0].maclist.replace(rule['mac'], '').trim())
						const fields = {
							name: ssidResp.list[0].name,
							ifname: ssidResp.list[0].ifname,
							maclist: ssidResp.list[0].maclist.replace(rule['mac'], '').trim()
						}
						requests.push(
							ws.call(API.wireless.ssid.set, fields)
						)
						Promise.all(requests)
						.then(() => { 
							ws.call(API.commit)
						})
						.finally(() => {
							this.closeForm(true)
							QSpinhide()
						}, reportError)
					}
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
