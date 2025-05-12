import { ref } from 'vue'
import { useAuthStore } from '~/stores/authStore'

const player = ref<any>(null)
const deviceId = ref<string | null>(null)
const isReady = ref(false)
const error = ref<string | null>(null)
const currentTrack = ref<any>(null)
const isPlaying = ref(false)
const currentVolume = ref(0.5)
let playerInitialized = false // Singleton flag

export function useSpotifyPlayer() {
    const authStore = useAuthStore()

    async function waitForSpotifySDK() {
        return new Promise<void>((resolve) => {
            if (window.Spotify) {
                resolve()
            } else {
                window.onSpotifyWebPlaybackSDKReady = () => {
                    resolve()
                }
            }
        })
    }

    async function transferPlaybackHere(device_id: string) {
        await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ device_ids: [device_id], play: false })
        })
    }

    async function initPlayer() {
        if (typeof window === 'undefined' || playerInitialized) return // Only init once
        await waitForSpotifySDK()
        if (player.value) return // Already created

        player.value = new window.Spotify.Player({
            name: 'Nuxt Spotify Player',
            getOAuthToken: (cb: any) => { cb(authStore.accessToken) },
            volume: currentVolume.value
        })
        playerInitialized = true // Set flag

        player.value.addListener('ready', async ({ device_id }: any) => {
            deviceId.value = device_id
            isReady.value = true
            console.log('Spotify Player is ready with device ID', device_id)
            await transferPlaybackHere(device_id)
            // Get initial volume
            const vol = await player.value.getVolume()
            currentVolume.value = vol
        })
        player.value.addListener('not_ready', () => {
            isReady.value = false
            console.log('Spotify Player is not ready')
        })
        player.value.addListener('initialization_error', ({ message }: any) => {
            error.value = message
        })
        player.value.addListener('authentication_error', ({ message }: any) => {
            error.value = message
        })
        player.value.addListener('account_error', ({ message }: any) => {
            error.value = message
        })
        player.value.addListener('player_state_changed', (state: any) => {
            if (state && state.track_window && state.track_window.current_track) {
                currentTrack.value = state.track_window.current_track
                isPlaying.value = !state.paused
            } else {
                currentTrack.value = null
                isPlaying.value = false
            }
        })
        await player.value.connect()
    }

    async function play(trackUri?: string, contextUri?: string, uris?: string[]) {
        if (!deviceId.value) return
        let body: any = {}
        if (contextUri) {
            body.context_uri = contextUri
            if (trackUri) body.offset = { uri: trackUri }
        } else if (uris) {
            body.uris = uris
        } else if (trackUri) {
            body.uris = [trackUri]
        }
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId.value}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }

    async function nextTrack() {
        if (player.value) await player.value.nextTrack()
    }
    async function previousTrack() {
        if (player.value) await player.value.previousTrack()
    }
    async function volumeUp() {
        if (player.value) {
            const state = await player.value.getVolume()
            await setVolume(Math.min(state + 0.1, 1))
        }
    }
    async function volumeDown() {
        if (player.value) {
            const state = await player.value.getVolume()
            await setVolume(Math.max(state - 0.1, 0))
        }
    }
    async function setVolume(vol: number) {
        if (player.value) {
            await player.value.setVolume(vol)
            currentVolume.value = vol
        }
    }
    async function seekTo(positionMs: number) {
        if (player.value) await player.value.seek(positionMs)
    }

    return {
        player,
        deviceId,
        isReady,
        error,
        currentTrack,
        isPlaying,
        currentVolume,
        initPlayer,
        play,
        nextTrack,
        previousTrack,
        volumeUp,
        volumeDown,
        setVolume,
        seekTo
    }
} 
