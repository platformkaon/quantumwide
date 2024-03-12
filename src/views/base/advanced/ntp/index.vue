<template>
	<section class="section">
		<form :name='ntpForm.name' @submit.prevent='save()' v-loading="ntpForm.loader">
			<div class="table-responsive">
				<table class="table-setting-wide">
					<b-card header-tag="header" footer-tag="footer">
						<template #header>
							<h6 class="mb-0">
								<div class="table-title">{{ t('settings').cap }}</div>
							</h6>
						</template>
						<b-card-text>
							<tbody>
								<tr>
									<th>
										<label class="form-label" for="provider">{{ t("timezone").cap }}</label>
									</th>
									<td>
										<select class="form-select" v-model='ntpForm.fields.timezone'>
											<option v-for='item in timezoneOptions' :value='item.$index' :key='item.$index'>
												{{ item.label }}
											</option>
										</select>
									</td>
								</tr>

								<tr>
									<th>
										<label class="form-label" for="main_2G_wps">{{ t("enable-ntp-server").cap }}</label>
									</th>
									<td>
										<div class="form-checkbox">
											<input type="checkbox" id="main_2G_wps" name='main_2G_wps' class="checkbox"
												v-model='ntpForm.fields.enable_server'
												:true-value='uciConfiguration.enabledTrueValue'
												:false-value='uciConfiguration.enabledFalseValue'>
											<label class="label" for="main_2G_wps">checkbox label</label>
										</div>
									</td>
								</tr>

								<tr>
									<th>
									</th>
									<td>
										<p class="text-sm text-info">
											<strong>
												{{ t('current-time').cap }} : {{ ntpForm.date }}
											</strong>
										</p>
									</td>
								</tr>

								<tr>
									<th>
										<label class="form-label" for="jk">{{ t("1st-ntp-time-server").cap }}</label>
									</th>
									<td>
										<input type="text" class="form-control" name='main_2G_id' id="main_2G_id"
											v-model='ntpForm.temp_fields.server[0]'>
									</td>
								</tr>

								<tr>
									<th>
										<label class="form-label" for="jk">{{ t("2nd-ntp-time-server").cap }}</label>
									</th>
									<td>
										<input type="text" class="form-control" name='main_2G_id' id="main_2G_id"
											v-model='ntpForm.temp_fields.server[1]'>
									</td>
								</tr>
							</tbody>
						</b-card-text>
					</b-card>
				</table>
			</div>
			<div class="btn-area btn-setting-area">
				<button class="btn btn-secondary" type="submit">{{ t('save').cap }}</button>
			</div>
		</form>
	</section>
</template>
<script lang='ts'>
import ws from '@/shared/lib/ws'
import { RPC, API } from '@/shared/constants'
import { Component, Vue } from 'vue-property-decorator';
import { UciSystemSystem, UciSystemTimeserver } from '@/shared/lib/uci/system';
import { take } from '@/shared/lib/utils';
import { UciSectionEnabled } from '@/shared/lib/uci';
import { indexify, reportError, reportSuccess } from '@/shared/functions';

@Component({
	components: {
	}
})
export default class NtpConfig extends Vue {
	uciConfiguration = {
		enabledTrueValue: UciSectionEnabled.ENABLED,
		enabledFalseValue: UciSectionEnabled.DISABLED,
	}

	ntpForm = {
		name: 'ntp-config-form',
		fields: {
			enable_server: false,
			server: [],
			timezone: 0,
		},
		temp_fields: {
			server: ['']
		},
		date: '',
		Interval: '',
		loader: false
	}

	systemConfig: UciSystemSystem = {}
	timeserver: UciSystemTimeserver = {}

	timezoneOptions = []

	mounted() {
		this.load()
	}

	async load() {
		await this.$store.dispatch('system/loadSystemConfig')
        this.timezoneOptions = await (import(/* webpackChunkName: "timezones.json" */ '@/shared/timezones.json')
                        .then(({ default: jsonArray }) => indexify(jsonArray)))
	
		//this.ntpForm.loader = true
		ws.call(API.ntp.get).then((response: { dict: any }) => {
			const { dict } = response;

            this.systemConfig = this.$store.getters['system/getSystemSection']
            this.timeserver = this.$store.getters['system/getTimeserverSection']

			var ntp_timeserver = []

			if (dict.server != null)
			{
				ntp_timeserver = dict.server.split(" ")
			}

			for(let i = 0; i < 2; i++)
			{
				if((ntp_timeserver[i] == 'undefined') || (ntp_timeserver[i] == "(null)"))
				{
					this.ntpForm.temp_fields.server[i] = '';
				}
				else
				{
					this.ntpForm.temp_fields.server[i] = ntp_timeserver[i]
				}
			}
			
                this.$set(
                        this.ntpForm,
                        'fields',
                        {...take(this.timeserver, 'enable_server', 'server')})
		
				const regex = /(\d{2}:\d{2}:\d{2})/;
				const match = dict.date.match(regex);
				if (match)
					this.ntpForm.date = match[1];
				else
					this.ntpForm.date = "NOT Found time"; 

                const system = this.systemConfig
                this.timezoneOptions.some(item => {
                        // 2nd part of OR is for first boot after flash
                        // @ts-ignore-next-line
    					if ((item.zonename === system.zonename && item.code === system.timezone) || (item.zonename === 'UTC' && item.zonename === system.timezone)) {
                                // @ts-ignore-next-line
                                this.$set( this.ntpForm, 'fields', {...this.ntpForm.fields, timezone: item.$index })
                                return true
                        }
                })
		});
	}

	get loading(): boolean {
		return this.$store.getters['system/getSystemLoading']
	}

	async save() {
		this.ntpForm.loader = true

		let requests = []		

		if (this.ntpForm.fields.enable_server)
		{
			for (let i = 0; i < 2; i++)
			{
				if ((this.ntpForm.temp_fields.server[i] == "") || (this.ntpForm.temp_fields.server[i] == "undefined"))
				{
					this.ntpForm.loader = false
					reportError(this.t('NO NTP SERVER Please check again.').cap)
					return
				}
			}
		}

		const timezoe_option : any = this.timezoneOptions[this.ntpForm.fields.timezone];
		console.log(timezoe_option.zonename)
		console.log(timezoe_option.timezone)
		console.log(timezoe_option.code)

		const params = {
		timezone : timezoe_option.code,
		zonename : timezoe_option.zonename,
		enable_server : this.ntpForm.fields.enable_server,
		server : this.ntpForm.temp_fields.server[0] + ' ' + this.ntpForm.temp_fields.server[1]
		}
		requests.push(ws.call(API.ntp.put, params))
		
        //requests.push(ws.call(API.commit))
		this.ntpForm.loader = false
		reportSuccess()
	}
	
	destroyed() {
		// @ts-ignore-next-line
		if (this.Interval) {
			// @ts-ignore-next-line
			clearInterval(this.Interval)
		}
	}
}

</script>