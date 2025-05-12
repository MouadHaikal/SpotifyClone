<template>
    <Header />

    <div class="w-full flex fixed overflow-hidden">
        <ScrollArea class="h-[calc(100vh-8.5rem)] w-[21rem]  bg-dark-gray rounded-md ml-2 relative">
            <Sidebar />
        </ScrollArea>

        <ScrollArea class="grow h-[calc(100vh-8.5rem)] rounded-md mx-2 bg-dark-gray">
            <slot />
        </ScrollArea>

        <section class="h-[calc(100vh-8.5rem)] w-[21rem]  bg-dark-gray rounded-md mr-2" >
            <NowPlayingCard />
        </section>
    </div>

    <Player />
</template>
