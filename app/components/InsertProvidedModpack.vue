<script setup lang="ts">
import type { FetchError } from 'ofetch';

const emit = defineEmits<{
    (e: 'added'): void;
    (e: 'fetched'): void;
    (e: 'cancel'): void;
}>();

const toast = useToast();

const form = reactive({
    url: '',
});

const input = useTemplateRef('input');

const { data: modpack, status, error, execute, clear } = useFetch<CurseForgeModpack>(() => `/api/curseforge/modpack/url?link=${encodeURIComponent(form.url)}`, {
    immediate: false,
    watch: false,
});

watch(() => form.url, (newUrl) => {
    // Basic validation to check if the URL is in a valid format
    // eslint-disable-next-line e18e/prefer-static-regex, regexp/no-unused-capturing-group
    const urlPattern = /^(https?:\/\/)?(www\.)?curseforge\.com\/minecraft\/modpacks\/[a-zA-Z0-9\-]+\/?$/;
    const isValid = urlPattern.test(newUrl);

    if (isValid) {
        execute();
        emit('fetched');
    } else {
        clear();
        emit('cancel');
    }
});

async function clearForm() {
    form.url = '';
    clear();
    await nextTick(() => {
        input.value?.inputRef?.focus();
    });
}

async function handleSubmit() {
    if (!modpack.value) return;

    const modloader = modpack.value.latestFiles[0]?.sortableGameVersions.find((gv: CurseForgeSortableGameVersion) => gv.gameVersion === '')?.gameVersionName;
    const mcVersion = modpack.value.latestFiles[0]?.sortableGameVersions.find((gv: CurseForgeSortableGameVersion) => gv.gameVersion !== '')?.gameVersion;

    try {
        const response = await $fetch('/api/modpacks', {
            method: 'POST',
            body: {
                provider: 'curseforge',
                providerId: modpack.value.id,
                name: modpack.value.name,
                url: form.url,
                description: modpack.value.summary,
                mcVersion: mcVersion || 'unknown',
                modloader: modloader || 'unknown',
                importFileId: modpack.value.mainFileId || null,
            },
        });

        toast.add({
            title: 'Modpack added',
            description: `${modpack.value.name} has been added to your dashboard.`,
        });

        emit('added');

        clearForm();

        navigateTo({ name: 'modpacks-uuid', params: { uuid: response.uuid } });
    } catch (e) {
        const error = e as FetchError;
        console.error('Failed to add modpack:', error);

        if (error.statusCode === 409) {
            toast.add({
                title: 'Modpack already exists',
                description: 'This modpack has already been added to your dashboard.',
                color: 'warning',
            });
        }
    }
}
</script>

<template>
    <UForm class="space-y-4" @submit="handleSubmit">
        <UFormField label="Modpack URL">
            <UInput
                ref="input"
                v-model="form.url"
                placeholder="https://www.curseforge.com/minecraft/modpacks/awesome-modpack"
                class="w-full"
                autofocus
                size="lg"
                :disabled="!!modpack || status === 'pending'"
            />

            <template #hint>
                <DevOnly>
                    <UButton
                        icon="i-lucide-asterisk"
                        variant="subtle"
                        size="xs"
                        @click="form.url = 'https://www.curseforge.com/minecraft/modpacks/gears-grimoires'"
                    />
                </DevOnly>
            </template>
        </UFormField>

        <USkeleton v-if="status === 'pending'" class="h-24" />
        <div v-else-if="modpack" class="space-y-2">
            <p class="text-center">Is this the pack you wanted?</p>
            <div class="p-2 flex items-center gap-4 border border-accented rounded-lg">
                <img :src="modpack.logo.thumbnailUrl" class="size-12">
                <div class="max-w-xs">
                    <p class="truncate font-bold">{{ modpack.name }}</p>
                    <p class="truncate text-sm text-muted">{{ modpack.summary }}</p>
                    <p class="truncate text-sm text-muted">Authors: {{ modpack.authors.map(author => author.name).join(', ') }}</p>
                </div>
            </div>
            <div class="flex gap-4">
                <UButton
                    variant="subtle"
                    color="error"
                    icon="i-lucide-x"
                    type="button"
                    block
                    @click="clearForm()"
                />

                <UButton
                    variant="subtle"
                    color="success"
                    icon="i-lucide-plus"
                    type="submit"
                    block
                />
            </div>
        </div>
    </UForm>
</template>
