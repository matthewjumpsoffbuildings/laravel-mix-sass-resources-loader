const mix = require('laravel-mix');

const ext = new class {
	register(...args) {
		if (!this.resources) this.resources = [];
		args.forEach(a => a instanceof Array ? this.resources.push.apply(this.resources, a) : this.resources.push(a));
	}
	dependencies() { return ['sass-resources-loader'] }

	webpackConfig(config) {
		const rules = config.module.rules.filter(rule =>
			((rule.test instanceof RegExp) && rule.test.test('asdf.scss'))
			|| (typeof (rule.test) === 'string' && /\.s[ac]ss$/.test(rule.test)));

		const ldr = { loader: 'sass-resources-loader', options: { resources: this.resources } };
		rules.forEach(rule => {
			if (rule.loaders) {
				rule.use = rule.loaders.map(loader => ({ loader }));
				delete rule.loaders;
			}
			rule.use.push(ldr)
		});

		// vue loader
		const rule = config.module.rules.find(rule => (rule.test instanceof RegExp && rule.test.test('asdf.vue')));
		['sass', 'scss'].forEach(st => {
			if (!rule.options.loaders[st])
				rule.options.loaders[st] = ['style-loader', 'css-loader', 'sass-loader', ldr];
			else rule.options.loaders[st].push(ldr);
		});
	}
}();

mix.extend('sassResources', ext);