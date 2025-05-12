import { useAuthStore } from '~/stores/authStore'

export const useAuth = () => {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    const generateRandomString = (length: number) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let str = ''
        for (let i = 0; i < length; i++) {
            str += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        return str
    }

    const generateCodeChallenge = async (verifier: string) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(verifier)
        const digest = await window.crypto.subtle.digest('SHA-256', data)
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
    }

    // Start the login process
    const login = async () => {
        try {
            const codeVerifier = generateRandomString(128)
            const codeChallenge = await generateCodeChallenge(codeVerifier)

            // Store code verifier for later use (only in browser)
            if (import.meta.client) { // process.client
                localStorage.setItem('code_verifier', codeVerifier)
            }

            // // Log the configuration for debugging
            // console.log('Client ID:', config.public.spotifyClientId)
            // console.log('Redirect URI:', config.public.spotifyRedirectUri)

            const params = new URLSearchParams({
                response_type: 'code',
                client_id: config.public.spotifyClientId,
                scope: [
                    'user-read-private',
                    'user-read-email',
                    'user-read-playback-state',
                    'user-modify-playback-state',
                    'user-read-currently-playing',
                    'playlist-read-private',
                    'playlist-modify-private',
                    'playlist-modify-public',
                    'user-read-recently-played',
                    'user-top-read',
                    'playlist-read-collaborative',
                    'streaming',
                    'user-read-playback-state'
                ].join(' '),
                code_challenge_method: 'S256',
                code_challenge: codeChallenge,
                redirect_uri: config.public.spotifyRedirectUri,
                show_dialog: 'true' // Force showing the login dialog
            })

            const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
            // console.log('Auth URL:', authUrl)

            window.location.href = authUrl
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    // Handle the callback from Spotify
    const handleCallback = async (code: string) => {
        // process.client
        if (!import.meta.client) return false

        const codeVerifier = localStorage.getItem('code_verifier')
        if (!codeVerifier) throw new Error('No code verifier found')

        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: config.public.spotifyRedirectUri,
                    client_id: config.public.spotifyClientId,
                    code_verifier: codeVerifier,
                }),
            })

            const data = await response.json()
            if (data.access_token) {
                authStore.setTokens(data.access_token, data.refresh_token, data.expires_in)
                await fetchUserProfile()
                return true
            }
            return false
        } catch (error) {
            console.error('Error during callback:', error)
            return false
        }
    }

    // Fetch user profile after successful login
    const fetchUserProfile = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            })
            const user = await response.json()
            authStore.setUser(user)
        } catch (error) {
            console.error('Error fetching user profile:', error)
        }
    }

    return {
        login,
        handleCallback,
        fetchUserProfile
    }
} 
