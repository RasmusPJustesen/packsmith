<template>
    <div>
        <UHeader>
            <template #left>
                <NuxtLink to="/">
                    <AppLogo class="w-auto h-6 shrink-0" />
                </NuxtLink>
            </template>

            <template #right>
                <UColorModeButton />
            </template>
        </UHeader>

        <UMain class="p-4">
            <UContainer>
                <slot></slot>
            </UContainer>
        </UMain>

        <USeparator icon="i-simple-icons-nuxtdotjs" />

        <UFooter>
            <template #left>
                <p class="text-sm text-muted">
                    Built by Justegaard • © {{ new Date().getFullYear() }}
                </p>
            </template>

            <template #right>
                <UButton
                    to="https://github.com/RasmusPJustesen/packsmith"
                    target="_blank"
                    icon="i-simple-icons-github"
                    aria-label="GitHub"
                    color="neutral"
                    variant="ghost"
                />
            </template>
        </UFooter>
    </div>
</template>
