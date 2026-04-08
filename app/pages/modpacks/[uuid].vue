<script setup lang="ts">
let getModsInterval: ReturnType<typeof setInterval>;

const toast = useToast();
const route = useRoute();
const uuid = route.params.uuid as string;

const { data: modpack, status, error, refresh } = await useFetch(`/api/modpacks/${uuid}`);
const { data: mcVersions, status: mcVersionsStatus, execute } = await useLazyFetch('/api/curseforge/mc-versions', {
    method: 'GET',
    immediate: false,
    transform: res => res.data.map((version: any) => ({
        label: version.versionString,
        value: version.versionString,
    })),
});

if (!modpack.value || error.value) {
    createError({
        statusCode: 404,
        statusMessage: 'Modpack not found',
    });
    await navigateTo({ name: 'error' });
}

const loading = computed(() => status.value === 'pending' || (modpack.value ? modpack.value.importStatus === 'pending' : false));
const disableAutoRefreshing = computed(() => !modpack.value ? true : ['idle', 'pending', 'error'].includes(modpack.value.importStatus));
const mods = computed(() => modpack.value!.mods.filter(mod => mod.url?.includes('mc-mods')));
const pendingMods = computed(() => modpack.value!.mods.filter(mod => mod.name === 'importing...'));

const targetMcVersion = ref<string | null>(modpack.value?.targetMcVersion || null);

const currentTime = ref(new Date());
const timeUntilNextCheck = computed(() => {
    const minutes = currentTime.value.getMinutes();
    const seconds = currentTime.value.getSeconds();

    if (minutes === 59) {
        const secondsLeft = 60 - seconds;
        return `${secondsLeft}s`;
    } else {
        const minutesLeft = 60 - minutes;
        return `${minutesLeft}m`;
    }
});

onMounted(() => {
    setInterval(() => {
        currentTime.value = new Date();
    }, 1000);

    if (modpack.value && modpack.value.provider !== 'custom') {
        if (mods.value.length === 0 || pendingMods.value.length > 0) {
            getModsInterval = setInterval(() => {
                if (mods.value.length > 0 && pendingMods.value.length === 0) {
                    clearInterval(getModsInterval);
                }

                refresh();
            }, 1000 * 5); // Every 5 seconds
        }
    }
});

onUnmounted(() => {
    clearInterval(getModsInterval);
});

async function deleteModpack() {
    try {
        await $fetch(`/api/modpacks/${uuid}`, {
            method: 'DELETE',
        });

        toast.add({
            title: 'Modpack deleted',
            description: 'The modpack has been deleted successfully.',
            color: 'success',
        });

        navigateTo({ name: 'dashboard' });
    } catch (error) {
        toast.add({
            title: 'Error',
            description: 'An error occurred while deleting the modpack.',
            color: 'error',
        });
    }
}

function onOpen() {
    if (!mcVersions.value?.length) {
        execute();
    }
}

async function handleModpackUpdate(mcVersion: string) {
    try {
        await $fetch(`/api/modpacks/${uuid}`, {
            method: 'PUT',
            body: {
                providerId: modpack.value!.providerId,
                provider: modpack.value!.provider,
                name: modpack.value!.name,
                description: modpack.value!.description,
                url: modpack.value!.url,
                mcVersion: modpack.value!.mcVersion,
                modloader: modpack.value!.modloader,
                importFileId: modpack.value!.importFileId,
                targetMcVersion: mcVersion,
            },
        });
    } catch (error) {
        toast.add({
            title: 'Error',
            description: 'An error occurred while updating the modpack.',
            color: 'error',
        });
    }
}
</script>

<template>
    <div class="space-y-6">
        <UButton
            icon="i-lucide-arrow-left"
            label="Dashboard"
            variant="link"
            :to="{ name: 'dashboard' }"
        />
        <div class="flex items-start justify-between gap-4">
            <div class="space-y-2">
                <div class="space-x-2">
                    <UBadge
                        v-if="modpack!.provider"
                        color="secondary"
                        size="sm"
                        :label="modpack!.provider"
                        variant="subtle"
                    />
                    <UBadge
                        v-if="modpack!.mcVersion"
                        color="info"
                        size="sm"
                        :label="modpack!.mcVersion"
                        variant="subtle"
                    />
                </div>
                <div>
                    <h1 class="text-xl font-bold">{{ modpack!.name }}</h1>
                    <p class="text-xs md:text-md text-muted">{{ modpack!.description }}</p>
                </div>
            </div>
            <UButton
                variant="subtle"
                color="error"
                icon="i-lucide-trash-2"
                @click="deleteModpack"
            />
        </div>

        <div class="flex justify-end gap-4 py-3.5">
            <USelectMenu
                v-model="targetMcVersion"
                :items="mcVersions"
                :loading="mcVersionsStatus === 'pending'"
                placeholder="Target Minecraft version"
                value-key="value"
                virtualize
                @update:open="onOpen"
                @update:model-value="handleModpackUpdate"
            />
            <UButton
                class="group"
                icon="i-lucide-refresh-cw"
                variant="subtle"
                :disabled="disableAutoRefreshing"
                :loading="status === 'pending'"
                @click="() => refresh()"
            >
                <div class="flex gap-1">
                    <span class="hidden md:inline">Check</span>
                    <span class="group-disabled:hidden">({{ timeUntilNextCheck }})</span>
                </div>
            </UButton>
        </div>

        <ModsTable
            :mods="mods"
            :modpack="modpack"
            :loading="loading"
            :import-status="modpack!.importStatus"
            :target-mc-version="targetMcVersion"
        />
    </div>
</template>
