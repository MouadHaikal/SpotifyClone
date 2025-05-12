<template>
    <section class="w-full py-4 px-5 absolute top-0 bg-dark-gray z-10 rounded-md">
        <div class="flex justify-between items-center">
            <h1 class="font-bold text-white text-[0.92rem]">
                Your Library
            </h1>

            <div class="flex items-center gap-4">
                <button class="bg-neutral-800 rounded-full flex justify-center items-center pl-2.5 pr-3.5 py-1 cursor-pointer">
                    <Icon name="mdi-light:plus" class="size-6 text-neutral-400" />
                    <span class="font-bold text-sm">Create</span>
                </button>

                <Icon name="majesticons:maximize" class="size-4 text-neutral-400 cursor-pointer hover:text-white" />
            </div>
        </div>
    </section>


    <div v-if="authStore.user" class="w-full mt-2 px-2">
        <div class="flex justify-between items-center mb-4 mx-3 mt-16">
            <Icon name="iconamoon:search-light" class="size-4 text-neutral-300 cursor-pointer" />

            <div class="flex items-center gap-2">
                <span class="text-sm text-neutral-300 cursor-pointer">Recents</span>

                <Icon name="icon-park-outline:sort-one" class="size-5 text-neutral-300 cursor-pointer" />
            </div>
        </div>

        <div v-for="(playlist, index) in playlists" :key="index"
            class="w-full h-14 cursor-pointer hover:bg-neutral-800 rounded-sm flex justify-start items-center px-3"
        >
            <img :src="playlist.images[0].url" class="size-11 rounded-sm" />

            <div class="flex flex-col justify-between text-[0.95rem] items-start h-10 ml-3">
                <h1 class="">
                    {{ playlist.name }}
                </h1>

                <h2 class="text-neutral-400 text-[0.8rem]">
                    Playlist•{{ authStore.user.display_name }}
                </h2>

            </div>
        </div>

        <div v-if="!playlists.length" class="flex w-full h-12 justify-center items-center mt-10">
            <button @click="fetchPlaylists" 
                class="font-bold text-neutral-300 bg-neutral-800 px-5 py-2 rounded-full cursor-pointer hover:scale-105 
                transition-all duration-100 ease-out hover:text-neutral-100">
                Load Library
            </button>
        </div>
    </div>
</template>

<script setup>
    import { useAuthStore } from '~/stores/authStore'
    const authStore = useAuthStore()

    const playlists = ref([]);

    async function fetchPlaylists() {
        if (authStore.isTokenExpired) {
            await authStore.refreshAccessToken();
        }

        try {
            const res = await fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`
                }
            })
            const data = await res.json()
            console.log('Fetched playlists:', data)
            playlists.value = data.items || []
        } catch (e) {
            console.error('Error fetching playlists:', e)
        } 
    }

    onMounted(async () => {
        await fetchPlaylists();
    });
</script>
