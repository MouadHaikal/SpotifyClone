<template>
    <div class="px-6">
        <div v-if="loading" class="w-full mt-30 font-bold text-lg text-neutral-400 text-center animate-pulse"> Searching... </div>
        <div v-else-if="error" class="w-full pt-16 text-center"> <span class="text-red-400 font-medium">{{ error }}</span></div>

        <div v-else>
            <div class="w-full flex justify-start items-center py-3 gap-3">
                <div class="bg-neutral-200 text-background px-3 py-1.5 rounded-full text-sm cursor-pointer">
                    All
                </div>

                <div class="bg-neutral-200/10 text-neutral-200 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-neutral-200/15 transition-all duration-100 ease-out">
                    Artists
                </div>

                <div class="bg-neutral-200/10 text-neutral-200 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-neutral-200/15 transition-all duration-100 ease-out">
                    Songs
                </div>

                <div class="bg-neutral-200/10 text-neutral-200 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-neutral-200/15 transition-all duration-100 ease-out">
                    Albums
                </div>

                <div class="bg-neutral-200/10 text-neutral-200 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-neutral-200/15 transition-all duration-100 ease-out">
                    Playlists
                </div>
            </div>

            <section class="mt-5 mb-6 flex justify-between items-center h-72 gap-4">
                <div class="flex-1/2 group">
                    <h2 class="text-xl font-bold text-white mb-2">Top result</h2>

                    <div v-if="artists.length > 0" 
                        class="bg-neutral-900 hover:bg-neutral-800 transition-colors duration-200 ease-out p-5 rounded-md cursor-pointer
                              relative pb-7" @click="selectArtist(artists[0])"
                    >
                        <div class="flex flex-col items-start text-left">
                            <img 
                                :src="artists[0].images && artists[0].images.length > 0 ? artists[0].images[0].url : '/default-artist.png'" 
                                alt="Artist" 
                                class="size-22 rounded-full iobject-cover shadow-lg mb-4" 
                            />

                            <h3 class="text-white font-bold text-3xl mb-1">{{ artists[0].name }}</h3>
                            <p class="text-neutral-400 text-sm">Artist</p>
                        </div>

                        <div 
                            class="size-12 bg-spotify-green rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex 
                                   items-center justify-center shadow-lg shadow-dark-gray absolute right-5 bottom-3 group-hover:-translate-y-2 hover:bg-green-600">
                            <Icon name="mdi:play" class="size-7 text-background" />
                        </div>

                    </div>
                </div>

                <div v-if="tracks.length > 0" class="flex-1/2 rounded-md">
                    <h2 class="text-xl font-bold text-white mb-2">Songs</h2>

                    <div class="rounded-md w-full h-full flex flex-col justify-between items-center">
                        <div v-for="(track, index) in tracks.slice(0, 4)" :key="`track-${index}`" class="text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer rounded-md w-full h-13 flex items-center justify-between" @click="selectTrack(track)">
                            <div class="flex items-center rounded-md px-2">
                                <img 
                                    :src="track.album.images && track.album.images.length > 0 ? track.album.images[track.album.images.length - 1].url : '/default-album.png'" 
                                    alt="Track" 
                                    class="size-9 rounded-md mr-3" 
                                />

                                <div>
                                    <p class="text-white">{{ track.name }}</p>
                                    <p class="text-sm text-neutral-400">{{ track.artists.map(artist => artist.name).join(', ') }}</p>
                                </div>
                            </div>

                            <div class="py-3 px-4 text-neutral-400 text-right text-sm">{{ formatDuration(track.duration_ms) }}</div>
                        </div>
                    </div>
                </div>
            </section>

            <div v-if="artists.length > 0" class="my-8">
                <h2 class="text-xl font-bold text-white mb-4">Artists</h2>

                <div class="flex justify-between items-center">
                    <div v-for="(artist, index) in artists" :key="`artist-${index}`" class="hover:bg-neutral-900 transition-colors p-2 rounded-md cursor-pointer w-40 flex flex-col items-center" @click="selectArtist(artist)">
                        <img 
                            :src="artist.images && artist.images.length > 0 ? artist.images[0].url : '/default-artist.png'" 
                            alt="Artist" 
                            class="size-33 rounded-full object-cover shadow-lg mb-3" 
                        />

                        <h3 class="text-white font-medium text-base truncate w-full">{{ artist.name }}</h3>
                        <p class="text-neutral-400 w-full text-sm">Artist</p>
                    </div>
                </div>
            </div>

            <div v-if="albums.length > 0" class="my-12">
                <h2 class="text-xl font-bold text-white mb-4">Albums</h2>

                <div class="flex justify-between items-center">
                    <div v-for="(album, index) in albums" :key="`album-${index}`" class="hover:bg-neutral-900 transition-colors p-2 rounded-md cursor-pointer w-40 flex flex-col items-center" @click="selectAlbum(album)">
                        <img 
                            :src="album.images && album.images.length > 0 ? album.images[0].url : '/default-album.png'" 
                            alt="Album" 
                            class="size-33 rounded-md object-cover shadow-lg mb-3" 
                        />

                        <h3 class="text-white font-medium text-base truncate w-full">{{ album.name }}</h3>
                        <p class="text-neutral-400 w-full text-sm">{{ album.artists.map(artist => artist.name).join(', ') }}</p>
                    </div>
                </div>
            </div>

            <div v-if="playlists.length > 0" class="my-12">
                <h2 class="text-xl font-bold text-white mb-4">Playlists</h2>

                <div class="flex justify-start items-center">
                    <div v-for="(playlist, index) in filteredPlaylists" :key="`playlist-${index}`" class="hover:bg-neutral-900 transition-colors p-2 rounded-md cursor-pointer w-40 flex flex-col items-center" @click="selectPlaylist(playlist)">
                        <img 
                            :src="playlist.images && playlist.images.length > 0 ? playlist.images[0].url : '/default-playlist.png'" 
                            alt="Playlist" 
                            class="size-33 rounded-md object-cover shadow-lg mb-3" 
                        />

                        <h3 class="text-white font-medium text-base truncate w-full">{{ playlist.name }}</h3>
                        <p class="text-neutral-400 w-full text-sm">By {{ playlist.owner.display_name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useSpotifyPlayer } from '~/composables/useSpotifyPlayer'
    import { useRoute } from 'vue-router';

    const { initPlayer, play } = useSpotifyPlayer()

    const route = useRoute();
    const query = route.params.query;

    import { useAuthStore } from '~/stores/authStore';
    const authStore = useAuthStore();

    const loading = ref(true);
    const error = ref('');
    const tracks = ref([]);
    const artists = ref([]);
    const albums = ref([]);
    const playlists = ref([]);

    const filteredPlaylists = computed(() => 
        playlists.value.filter(pl => pl !== null)
    )

    // Format the duration from milliseconds to MM:SS
    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    onMounted(async () => {
        if (!query) return;

        loading.value = true;
        error.value = '';
        tracks.value = [];
        artists.value = [];
        albums.value = [];
        playlists.value = [];

        try {
            if (authStore.isTokenExpired) {
                await authStore.refreshAccessToken();
            }

            const res = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album,playlist&limit=5`,
                {
                    headers: {
                        Authorization: `Bearer ${authStore.accessToken}`
                    }
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || 'Failed to fetch search results');
            }

            const data = await res.json();
            tracks.value = data.tracks?.items || [];
            artists.value = data.artists?.items || [];
            albums.value = data.albums?.items || [];
            playlists.value = data.playlists?.items || [];
        } catch (e) {
            error.value = e.message || 'Failed to fetch search results.';
            console.error('Search error:', e);
        } finally {
            loading.value = false;
        }

        initPlayer();
    });

    function selectTrack(track) {
        play(track.uri)
    }

    function selectArtist(artist) {
        play(undefined, artist.uwri)    // plays the artist context
    }

    function selectAlbum(album) {
        play(undefined, album.uri)     // plays the album context
    }

    function selectPlaylist(playlist) {
        play(undefined, playlist.uri)  // plays the playlist context
    }
</script>
