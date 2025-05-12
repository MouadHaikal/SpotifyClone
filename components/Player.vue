<template>
    <div class="absolute bottom-0 w-full h-18 flex items-center px-4">
        <div class="flex items-center space-x-3">
            <img
                v-if="currentTrack?.album?.images?.length"
                :src="currentTrack.album.images[0].url"
                alt="Cover"
                class="w-12 h-12 rounded"
            />
            <div
                v-else
                class="w-12 h-12 bg-neutral-800 rounded flex items-center justify-center text-gray-500 text-sm"
            >
                —
            </div>

            <div class="overflow-hidden">
                <p class="text-sm font-semibold truncate text-white">
                    {{ currentTrack?.name || 'Not playing' }}
                </p>
                <p class="text-xs text-gray-400 truncate">
                    {{ artistNames }}
                </p>
            </div>
        </div>

        <div class="flex-1 flex justify-center items-center space-x-2">
            <button @click="previousTrack" class="text-neutral-400 hover:text-white size-10 cursor-pointer flex items-center justify-center">
                <Icon name="streamline:button-previous-solid" class="size-4" />
            </button>

            <button @click="togglePlay" class="text-neutral-200 hover:text-white size-10 cursor-pointer flex items-center justify-center">
                <Icon v-if="isPlaying" name="zondicons:pause-solid" class="size-9" />
                <Icon v-else name="icon-park-solid:play" class="size-10" />
            </button>

            <button @click="nextTrack" class="text-neutral-400 hover:text-white size-10 cursor-pointer flex items-center justify-center">
                <Icon name="streamline:button-next-solid" class="size-4" />
            </button>
        </div>

        <div class="flex items-center space-x-2">
            <Icon name="cuida:volume-2-outline" class="size-5 text-neutral-300" />

            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="currentVolume"
                @change="setVolume(currentVolume)"
                class="w-24"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue'
    import { useSpotifyPlayer } from '~/composables/useSpotifyPlayer'

    const {
        initPlayer,
        player,
        currentTrack,
        isPlaying,
        nextTrack,
        previousTrack,
        currentVolume,
        setVolume
    } = useSpotifyPlayer()

    onMounted(() => {
        initPlayer()
    })

    const artistNames = computed(() =>
        currentTrack.value?.artists?.map((a: any) => a.name).join(', ') || ''
    )

    function togglePlay() {
        if (!player.value) return
        if (isPlaying.value) {
            player.value.pause()
        } else {
            player.value.resume()
        }
    }
</script>
