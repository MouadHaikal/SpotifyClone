import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: [
      '@nuxt/ui',
      '@nuxt/fonts',
      '@nuxt/icon',
      '@nuxt/image',
      'shadcn-nuxt',
      '@nuxtjs/color-mode',
      '@pinia/nuxt',
    ],
    colorMode: {
        classSuffix: '',       
        preference: 'dark',    
        fallback: 'dark',      
        storage: 'localStorage'
    },
    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: '',
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: './components/ui'
    },
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [ tailwindcss(), ],
    },
    runtimeConfig: {
        public: {
            spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
            spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI
        }
    },
    devServer: {
        host: '127.0.0.1',
        port: 3000
    },
    app: {
        head: {
            script: [
                {
                    src: 'https://sdk.scdn.co/spotify-player.js',
                    defer: true,
                },
            ],
        },
    },
});

