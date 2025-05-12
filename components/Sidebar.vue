<template>
    <section class="w-full py-4 px-5">
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

    <ScrollArea class="w-full px-5 mt-2">
        <div class="flex justify-between items-center">
            <Icon name="iconamoon:search-light" class="size-4 text-neutral-300 cursor-pointer" />

            <div class="flex items-center gap-2">
                <span class="text-sm text-neutral-300 cursor-pointer">Recents</span>

                <Icon name="icon-park-outline:sort-one" class="size-5 text-neutral-300 cursor-pointer" />
            </div>
        </div>
    </ScrollArea>
</template>
