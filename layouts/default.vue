<template>
    <Header />

    <div class="w-full flex fixed overflow-hidden">
        <section class="h-[calc(100vh-8.5rem)] w-[21rem]  bg-dark-gray rounded-md ml-2" >
            <Sidebar />
        </section>

        <ScrollArea class="grow h-[calc(100vh-8.5rem)] rounded-md mx-2 gradientBg">
            <slot />
        </ScrollArea>

        <section class="h-[calc(100vh-8.5rem)] w-[21rem]  bg-dark-gray rounded-md mr-2" >
            <NowPlayingCard />
        </section>
    </div>

    <Player />
</template>


<style scoped>
    .gradientBg{
        background: #262626;
        background: linear-gradient(180deg, rgba(38, 38, 38, 1) 0%, rgba(20, 20, 20, 1) 25%, rgba(15, 15, 15, 1) 100%);
    }
</style>
