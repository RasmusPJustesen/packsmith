<template>
    <span class="inline-flex gap-0.4">
        <span
            class="inline-block"
            :style="{
                animation: 'totsi 1s infinite ease-in-out',
                animationDelay: '0ms',
            }"
        >.</span>
        <span
            class="inline-block"
            :style="{
                animation: 'totsi 1s infinite ease-in-out',
                animationDelay: '200ms',
            }"
        >.</span>
        <span
            class="inline-block"
            :style="{
                animation: 'totsi 1s infinite ease-in-out',
                animationDelay: '400ms',
            }"
        >.</span>
    </span>
</template>

<style>
@keyframes totsi {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.1;
    }
}
</style>
