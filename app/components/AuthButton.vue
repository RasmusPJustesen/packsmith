<script setup lang="ts">
const { data: session } = await authClient.useSession(useFetch);
const user = computed(() => session.value?.user);

async function signIn() {
    await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
    });
}
</script>

<template>
    <div>
        <UButton
            v-if="!user"
            label="login"
            @click="signIn"
        />
        <UButton
            v-else
            label="Dashboard"
            :to="{ name: 'dashboard' }"
        />
    </div>
</template>
