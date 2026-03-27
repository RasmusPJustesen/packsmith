/* eslint-disable style/no-tabs */
// @ts-check
import antfu from '@antfu/eslint-config';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(antfu(
	{
		type: 'app',
		gitignore: true,
		stylistic: {
			indent: 4,
			quotes: 'single',
			semi: true,
		},
		ignores: ['.pnpm-store/**', '.github/workflows/**', '**/*.yaml', '**/migrations/*'],
	},
	{
		rules: {
			'ts/no-redeclare': 'off',
			'vue/block-order': [
				'error',
				{
					order: ['script', 'script[setup]', 'template', 'style'],
				},
			],
			'no-console': ['warn'],
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
			],
			'vue/max-attributes-per-line': [
				'error',
				{
					singleline: 2,
					multiline: 1,
				},
			],
			'vue/multiline-html-element-content-newline': 'off',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/html-indent': ['error', 4],
			'max-len': 'off',

			'unicorn/prefer-number-properties': 'off',
			'node/prefer-global/process': 'off',
			'vue/custom-event-name-casing': 'off',

			// Let Vue handle template indentation, avoid conflicts
			'style/indent': 'off',

			'antfu/if-newline': 'off',
			'curly': ['error', 'multi-line'],
			'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'style/nonblock-statement-body-position': 'off',
			'vue/html-self-closing': ['error', {
				html: {
					void: 'never',
					normal: 'never',
					component: 'always',
				},
				svg: 'always',
				math: 'always',
			}],
		},
	},
));
