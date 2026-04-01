<script setup lang="ts">
const { data: modpacks, refresh } = await useFetch('/api/modpacks', {
    transform: data => data.map(modpack => ({
        ...modpack,
        modsWithUpdates: modpack.mods ? modpack.mods.filter(mod => mod.currentMcVersionSupported !== mod.latestMcVersionSupported).length : 0,
    })),
});

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
    <div class="space-y-4">
        <div class="flex justify-end items-center">
            <SlideoverAddModpack @added="refresh" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UPageCard
                v-for="modpack in modpacks"
                :key="modpack.id"
                :to="{ name: 'modpacks-uuid', params: { uuid: modpack.uuid } }"
                variant="soft"
                :title="modpack.name"
                :description="modpack.description ?? undefined"
                :ui="{ footer: 'w-full' }"
            >
                <template #footer>
                    <div class="flex items-center justify-center gap-2">
                        <UButton
                            v-if="modpack.importStatus === 'pending'"
                            variant="subtle"
                            loading
                            label="importing mods..."
                        />
                        <UButton
                            v-else-if="modpack.modsWithUpdates > 0"
                            variant="subtle"
                            icon="i-lucide-badge-alert"
                            :label="`${String(modpack.modsWithUpdates)} mods`"
                        />
                    </div>
                </template>
            </UPageCard>
        </div>

        <DevOnly>
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
        </DevOnly>
    </div>
</template>
