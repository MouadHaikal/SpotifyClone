<template>
    <section v-if="user" class="w-full h-[calc(100vh-8.5rem)] gradientBg">

        <div class="w-full flex justify-start items-center py-4 px-12 gap-3">
            <div class="bg-neutral-200 text-background px-3 py-1.5 rounded-full text-sm cursor-pointer">
                All
            </div>

            <div class="bg-neutral-200/10 text-neutral-200 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-neutral-200/15 transition-all duration-100 ease-out">
                Music
            </div>

            <div class="bg-neutral-200/10 text-neutral-200 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-neutral-200/15 transition-all duration-100 ease-out">
                Podcasts
            </div>
        </div>



        <div class="w-full mt-20 text-center">
            Search for anything
        </div>

        <Button @click="handleLogout">
            Logout
        </Button>

    </section>

    <div v-else class="w-full mt-40 flex justify-center items-center">
        <button
            class="bg-spotify-green rounded-full text-neutral-950 font-bold text-xl px-6 py-3
            cursor-pointer hover:scale-[103%] transition-all ease-in duration-100 hover:bg-green-500"
            @click="handleLogin"
        >
            Connect to Spotify
        </button>
    </div>
</template>

<script setup>
    const { login } = useAuth();
    const authStore = useAuthStore();

    const user = computed(() => authStore.user);
    

    definePageMeta({
        colorMode: 'dark',
    });

    const handleLogin = async () => {
        await login();
    }

    const handleLogout = () => {
        authStore.logout()
    }
</script>


<style scoped>
    .gradientBg{
        background: #262626;
        background: linear-gradient(180deg, rgba(38, 38, 38, 1) 0%, rgba(20, 20, 20, 1) 25%, rgba(15, 15, 15, 1) 100%);
    }
</style>
