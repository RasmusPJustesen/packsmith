<script setup lang="ts">
async function signOut() {
        await authClient.signOut({
        });
        navigateTo('/');
    }

onMounted(() => signOut());
</script>

<template>
    <div class="space-y-4">
        <USkeleton class="w-full h-10 mb-4" />
        <USkeleton class="w-full h-10 mb-4" />
    </div>
</template>
