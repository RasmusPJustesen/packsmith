<script setup lang="ts">
const { data: modpacks, status, error, refresh } = await useFetch('/api/modpacks', {
    transform: data => data.map(modpack => ({
        ...modpack,
        modsWithUpdates: modpack.mods.filter(mod => mod.currentMcVersionSupported !== mod.latestMcVersionSupported).length,
    })),
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
                            v-if="modpack.finalized === 0"
                            variant="subtle"
                            loading
                            label="mods"
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
    </div>
</template>
