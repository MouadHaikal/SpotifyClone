<template>
    <div class="min-h-screen flex items-center justify-center bg-dark-gray">
        <div class="bg-dark-gray p-6 text-center w-full max-w-xs">
            <div v-if="loading" class="space-y-2">
                <div class="mx-auto animate-spin size-10 border-2 border-spotify-green border-t-transparent rounded-full"></div>
                <p class="text-neutral-400 font-bold text-lg">Completing login</p>
            </div>

            <div v-else-if="error" class="space-y-2">
                <p class="text-red-500">{{ error }}</p>
                <NuxtLink
                    to="/"
                    class="inline-block mt-2 text-green-500 hover:underline"
                >
                    Return to Login
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const route = useRoute()
    const router = useRouter()
    const { handleCallback } = useAuth()

    const loading = ref(true)
    const error = ref('')

    onMounted(async () => {
        const code = route.query.code as string
        const routeError = route.query.error as string

        if (routeError) {
            loading.value = false
            error.value = 'Authentication failed. Please try again.'
            return
        }

        if (!code) {
            loading.value = false
            error.value = 'No authorization code received.'
            return
        }

        try {
            const success = await handleCallback(code)
            if (success) {
                router.push('/')
            } else {
                error.value = 'Failed to complete authentication.'
            }
        } catch (e) {
            error.value = 'An error occurred during authentication.'
        } finally {
            loading.value = false
        }
    })
</script> 
