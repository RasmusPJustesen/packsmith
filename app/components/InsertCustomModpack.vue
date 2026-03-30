<script setup lang="ts">
import type { FetchError } from 'ofetch';

const emit = defineEmits<{
    (e: 'added'): void;
    (e: 'cancel'): void;
}>();

const toast = useToast();

const form = reactive({
    name: '',
    mcVersion: '',
    description: '',
});

async function handleSubmit() {
    try {
        const response = await $fetch('/api/modpacks', {
            method: 'POST',
            body: {
                provider: 'custom',
                providerId: null,
                name: form.name,
                description: form.description,
                mcVersion: form.mcVersion,
                url: null,
            },
        });

        toast.add({
            title: 'Modpack added',
            description: `${response.name} has been added to your dashboard.`,
        });

        emit('added');

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
        <UFormField label="Name">
            <UInput
                v-model="form.name"
                placeholder="My Custom Modpack"
                class="w-full"
                size="lg"
            />
        </UFormField>

        <UFormField label="Minecraft version">
            <UInput
                v-model="form.mcVersion"
                placeholder="fx. 1.21.11"
                class="w-full"
                size="lg"
            />
        </UFormField>

        <UFormField label="Description">
            <UTextarea
                v-model="form.description"
                placeholder="A brief description of your modpack"
                class="w-full"
                size="lg"
            />
        </UFormField>

        <UButton
            variant="subtle"
            icon="i-lucide-plus"
            label="Create"
            type="submit"
            block
        />

        <UButton
            variant="subtle"
            color="error"
            label="Back"
            type="button"
            block
            @click="$emit('cancel')"
        />
    </UForm>
</template>
