<script setup lang="ts">
const emit = defineEmits<{
    (e: 'added'): void;
}>();

const model = defineModel<boolean>('open');

const custom = ref(false);
const modpackSuggestion = ref(false);

function handleClose() {
    model.value = false;
    custom.value = false;
    modpackSuggestion.value = false;
    emit('added');
}
</script>

<template>
    <USlideover
        v-model:open="model"
        title="Add Modpack"
        description="Paste the url to a public modpack"
    >
        <UButton icon="i-lucide-plus" />

        <template #body>
            <div class="space-y-4">
                <template v-if="!custom">
                    <InsertProvidedModpack
                        v-if="!custom"
                        @added="handleClose"
                        @fetched="modpackSuggestion = true"
                        @cancel="modpackSuggestion = false"
                    />

                    <template v-if="!modpackSuggestion">
                        <USeparator label="or" />
                        <UButton
                            label="Add Custom Modpack"
                            variant="subtle"
                            block
                            @click="custom = true"
                        />
                    </template>
                </template>
                <template v-else>
                    <InsertCustomModpack @added="handleClose" @cancel="custom = false" />
                </template>
            </div>
        </template>
    </USlideover>
</template>
