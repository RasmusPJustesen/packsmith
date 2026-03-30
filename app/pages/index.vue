<script setup lang="ts">
definePageMeta({
    layout: 'landing',
});

const search = ref('');

const { data, status, error, execute } = useFetch('/api/curseforge/search', {
    query: {
        query: search,
    },
    immediate: false,
    watch: false,
});
</script>

<template>
    <div>
        <NuxtLink :to="{ name: 'dashboard' }">Go to Dashboard</NuxtLink>

        <h1 class="text-2xl font-bold">Welcome to PackSmith</h1>

        <UInput v-model="search" />
        <UButton label="Search" @click="() => execute()" />

        <div v-if="status === 'pending'">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else-if="data">
            <pre>{{ data }}</pre>
        </div>
    </div>
</template>
