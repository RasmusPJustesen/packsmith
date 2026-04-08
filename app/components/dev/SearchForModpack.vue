<script setup lang="ts">
const search = ref('');
const type = ref('4471');

const { data, status, error, execute, clear } = useFetch('/api/curseforge/search', {
    query: {
        query: search,
        classId: type,
    },
    immediate: false,
    watch: false,
});

const types = computed(() => {
    return [
        { label: 'Modpacks', value: '4471' },
        { label: 'Mods', value: '6' },
    ];
});
</script>

<template>
    <div>
        <div class="flex justify-center">
            <UFieldGroup>
                <UInput v-model="search" />
                <USelect v-model="type" :items="types" />
                <UButton label="Search" @click="() => execute()" />
                <UButton
                    v-if="data"
                    icon="i-lucide-x"
                    variant="subtle"
                    @click="() => clear()"
                />
            </UFieldGroup>
        </div>

        <div v-if="status === 'pending'">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else-if="data">
            <pre>{{ data }}</pre>
        </div>
    </div>
</template>
