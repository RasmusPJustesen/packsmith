<script setup lang="ts">
const search = ref('');

const { data, status, error, execute, clear } = useFetch('/api/curseforge/search', {
    query: {
        query: search,
    },
    immediate: false,
    watch: false,
});
</script>

<template>
    <div>
        <div class="flex justify-center">
            <UInput v-model="search" />
            <UButton label="Search" @click="() => execute()" />
            <UButton
                v-if="data"
                icon="i-lucide-x"
                variant="subtle"
                @click="() => clear()"
            />
        </div>

        <div v-if="status === 'pending'">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else-if="data">
            <pre>{{ data }}</pre>
        </div>
    </div>
</template>
