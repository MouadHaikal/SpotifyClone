<template>
    <section class="w-full h-14 flex relative justify-center items-center mb-0.5">

        <div class="w-[31rem] h-11 flex justify-between items-center gap-2">
            <NuxtLink to="/" class="bg-neutral-900 size-11 rounded-full flex justify-center items-center">
                <Icon name="material-symbols:home-rounded" class="size-7 cursor-pointer" />
            </NuxtLink>

            <div class="bg-neutral-900 grow h-full rounded-3xl relative flex items-center">
                <Icon name="iconoir:search" class="size-6 text-muted-foreground absolute left-3 top-2.5"/> 

                <input id="search" type="text" placeholder="What do you want to play?" 
                    class="ml-11 h-full w-3/4 focus:outline-none"    
                />

                <span class="absolute right-12 text-2xl text-neutral-600">|</span>

                <Icon name="heroicons:wallet" class="size-6 text-neutral-300 absolute right-3.5 top-2.5 cursor-pointer"/> 
            </div>
        </div>

        <Icon name="mdi:spotify" class="size-10 absolute left-5" />

        <div v-if="user" class="absolute right-4 flex justify-between items-center gap-5">
            <Icon name="iconoir:bell" class="size-[4.5] text-neutral-300 hover:text-white cursor-pointer hover:scale-110" />

            <Icon name="formkit:people" class="size-[4.5] text-neutral-300 hover:text-white cursor-pointer hover:scale-110" />

            <Avatar class="size-10 cursor-pointer border-[6px] border-neutral-800 ml-1">
                <AvatarImage v-if="user.images && user.images.length" :src="user.images[0].url" alt="profile picture" />
                <AvatarFallback>{{ user.display_name.slice(0,2).toUpperCase() }}</AvatarFallback>
            </Avatar>
        </div>

    </section>
</template>

<script setup lang="ts">
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

    import { useAuthStore } from '~/stores/authStore'

    const authStore = useAuthStore();

    const user = computed(() => authStore.user);
</script>
