const path = require('path')
const PostCompile = require('post-compile-webpack-plugin')
const buildOptions = {}

const defaultConfig = {
	session: true,
	idleTimer: 5 * 60 * 1000,
	serverAddress: ''
}
let CONFIG = defaultConfig



try {
	CONFIG = Object.assign(defaultConfig, require('./config.js'))
}
catch (e) {}

const CUSTOM_VENDOR = require('./env.json')
process.env.VENDOR = CUSTOM_VENDOR.VENDOR
process.env.THEME = CUSTOM_VENDOR.THEME

if(process.env.VENDOR=='kaon'){
	process.env.VUE_APP_TITLE = 'Kaon'
} else {
	process.env.VUE_APP_TITLE = 'Kaon'
}

try {
	const features = require(`./manifest/manifest.json`)
	Object.keys(features).forEach(feat => buildOptions[feat] = true)
}
catch (e) {
	throw new Error("unable to read manifest file")
}

if(buildOptions.lansideconnect == true){
	process.env.LAN = 1
}
else {
	process.env.LAN = null
}

module.exports = {
	lintOnSave: false,
	devServer: {
		overlay: false
	},
	productionSourceMap: false,
	transpileDependencies:['iview'],
	chainWebpack: config => {
		config.resolve.alias
			.set('components', path.resolve(__dirname, 'src/shared/components'))

		config
			.plugin('define')
			.tap(args => {
				args[0]['process.env'] = {
					...args[0]['process.env'],
					THEME: JSON.stringify('kaon'),
					VENDOR: JSON.stringify(process.env.VENDOR),
					LAN: JSON.stringify(process.env.LAN)
				}
				args[0]['BUILD_OPTIONS'] = JSON.stringify(buildOptions)
				args[0]['CONFIG'] = JSON.stringify(CONFIG)
				return args
			})

		config.module
			.rule('js')
			.use('ifdef-loader')
			.loader('ifdef-loader')
			.options({buildOptions})

		if (process.env.NODE_ENV === 'production') {
			config
				.plugin('postcompile')
				.use(PostCompile, [copyFavicons])
		}
		else {
			config.plugins.delete('preload')
			config.plugins.delete('prefetch')
			config.devtool('eval-source-map')
		}

		config.module.rule('vue').uses.delete('cache-loader')
		config.module.rule('js').uses.delete('cache-loader')
	},
	css: {
		loaderOptions: {
			less: {
				javascriptEnabled: true
			}
		}
	}
}

function copyFavicons () {
	const copyDir = require('copy-dir')

	let favicons;

	if(process.env.VENDOR==='kaon'){
		favicons = path.resolve(__dirname, `src/images/kaon/favicons`)
	} else {
		favicons = path.resolve(__dirname, `src/images/kaon/favicons`)
	}


	copyDir.sync(favicons, path.resolve(__dirname, 'dist'), {}, err => {
		if (err) {
			console.log('ERROR copying favicons', err)
		}
	})
}
