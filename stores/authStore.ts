import { defineStore } from 'pinia'

interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    expiresAt: number | null
    user: any | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        user: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        isTokenExpired: (state) => {
            if (!state.expiresAt) return true
            return Date.now() >= state.expiresAt
        }
    },

    actions: {
        setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
            this.accessToken = accessToken
            this.refreshToken = refreshToken
            this.expiresAt = Date.now() + expiresIn * 1000

            // Store in localStorage for persistence (only in browser)
            if (import.meta.client) { // process.client
                localStorage.setItem('spotify_access_token', accessToken)
                localStorage.setItem('spotify_refresh_token', refreshToken)
                localStorage.setItem('spotify_expires_at', this.expiresAt.toString())
            }
        },

        setUser(user: any) {
            this.user = user
            if (import.meta.client) {
                localStorage.setItem('spotify_user', JSON.stringify(user))
            }
        },

        async refreshAccessToken() {
            if (!this.refreshToken) return false

            try {
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        grant_type: 'refresh_token',
                        refresh_token: this.refreshToken,
                        client_id: useRuntimeConfig().public.spotifyClientId,
                    }),
                })

                const data = await response.json()
                if (data.access_token) {
                    this.setTokens(data.access_token, this.refreshToken, data.expires_in)
                    return true
                }
                return false
            } catch (error) {
                console.error('Error refreshing token:', error)
                return false
            }
        },

        logout() {
            this.accessToken = null
            this.refreshToken = null
            this.expiresAt = null
            this.user = null

            if (import.meta.client) {
                localStorage.removeItem('spotify_access_token')
                localStorage.removeItem('spotify_refresh_token')
                localStorage.removeItem('spotify_expires_at')
                localStorage.removeItem('spotify_user')
            }
        },

        initializeFromStorage() {
            if (!import.meta.client) return

            const accessToken = localStorage.getItem('spotify_access_token')
            const refreshToken = localStorage.getItem('spotify_refresh_token')
            const expiresAt = localStorage.getItem('spotify_expires_at')
            const user = localStorage.getItem('spotify_user')

            if (accessToken && refreshToken && expiresAt) {
                this.accessToken = accessToken
                this.refreshToken = refreshToken
                this.expiresAt = parseInt(expiresAt)
                if (user) {
                    this.user = JSON.parse(user)
                }
            }
        }
    }
}) 
