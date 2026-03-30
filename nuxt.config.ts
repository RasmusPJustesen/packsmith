import './server/lib/env';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui',
    ],

    devtools: {
        enabled: true,
    },

    css: ['~/assets/css/main.css'],

    routeRules: {
        '/': { prerender: true },
    },

    compatibilityDate: '2025-01-15',

    eslint: {
        config: {
            standalone: false,
        },
    },

    vite: {
        optimizeDeps: {
            include: [
                '@vueuse/core',
                'moment',
            ],
        },
    },

    imports: {
        dirs: [
            '../shared/types',
            '../shared/utils',
            '../shared/constants',
            '../shared/zod-schemas',
        ],
    },
});
