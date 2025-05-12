<template>
    <div v-if="user">
        logged in as: {{ user.display_name }}
        <br>
        email: {{ user.email }}

        <Button @click="handleLogout">
            Logout
        </Button>

    </div>

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
