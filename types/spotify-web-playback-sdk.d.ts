export {}

declare global {
    interface Window {
        Spotify: typeof Spotify;                     // the SDK constructor
        onSpotifyWebPlaybackSDKReady: () => void;     // the ready callback
    }
}
