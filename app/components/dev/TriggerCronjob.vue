<script setup lang="ts">
const { status, execute } = await useFetch('/api/curseforge/mods/import', {
    method: 'GET',
    immediate: false,
});

const toast = useToast();

watch(status, (newStatus) => {
    if (newStatus === 'success') {
        toast.add({
            color: 'success',
            title: 'Cronjob executed successfully',
        });
    } else if (newStatus === 'error') {
        toast.add({
            color: 'error',
            title: 'Cronjob execution failed',
        });
    }
});
</script>

<template>
    <UTooltip text="Trigger cronjob manually" :delay-duration="0">
        <UButton
            class="ml-4"
            icon="i-lucide-database-backup"
            variant="subtle"
            color="secondary"
            :loading="status === 'pending'"
            @click="() => execute()"
        />
    </UTooltip>
</template>
