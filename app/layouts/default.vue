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
                <UButton
                    variant="soft"
                    label="sign out"
                    :to="{ name: 'signout' }"
                />
            </template>
        </UHeader>

        <UMain class="py-3 md:p-4">
            <UContainer>
                <slot></slot>
            </UContainer>
        </UMain>
    </div>
</template>
