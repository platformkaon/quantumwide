<template>
	<section class="section">
		<form :name='demoform.name' :actions='false' @submit.prevent='demosave'>
			<div class="table-responsive">
				<div class="table-title">
					DEMO
				</div>
				<table class="table-setting-wide">
					<tbody>
						<tr>
							<th>
								<label class="form-label" for="demo">demo checkbox</label>
							</th>
							<td>
								<div class="form-checkbox">
									<input type="checkbox" class="checkbox" id="demo_checkbox" v-model='demoform.fields.checkbox'>
									<label class="label" for="demo_checkbox">checkbox label</label>
								</div>
							</td>
						</tr>
						<tr>
							<th>
								<label class="form-label" for="demo">demo selectbox</label>
							</th>
							<td>
								<select class="form-select" name='demoselect' v-model='demoform.fields.selectbox'>
									<option v-for='item in demoselectlist' :value='item.value' :key='item.value'>
											{{ item.label }}
									</option>
								</select>
							</td>
						</tr>
						<tr>
							<th>
								<label class="form-label" for="demo">demo text</label>
							</th>
							<td>
								<!-- class option : none / type-view -->
								<div class="form-label" :class="'type-view'">
									<input type="text" class="form-control" id="text" v-model='demoform.fields.text'>
								</div>
							</td>
						</tr>
						<tr>
							<th>
								<label class="form-label" for="demo">demo password</label>
							</th>
							<td>
								<!-- class option : none / type-view -->
								<div class="form-password-wrap" :class='showPassword ? "" : "type-view"'>
									<input :type='showPassword.demo ? "text" : "password"' class="form-control" id="password" v-model='demoform.fields.password'>
									<span class="icon-view-passowrd" @click="togglePassword('demo')"></span>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div> <!-- /.table-responsive -->
			<div class="btn-area btn-setting-area">
					<button class="btn btn-secondary" type="submit">demo button</button>
			</div>
		</form>
	</section>
</template>
<script>

export default {
	components: {
	},
	data () {
		return {
			demoform: {
				name: 'demo',
				fields: {
					checkbox: true,
					selectbox: '1',
					text: 'demotext',
					password: 'demopassword'
				}
			},
			demoselectlist: [
				{label: 'demo option 1', value: '1'},
				{label: 'demo option 2', value: '2'},
				{label: 'demo option 3', value: '3'},
			],
			showPassword: {
				demo: false
			}
		}
	},
	methods: {
		demosave() {

		},
		togglePassword(field) {
			this.showPassword[field] = !this.showPassword[field]
		}
	}
}
</script>
