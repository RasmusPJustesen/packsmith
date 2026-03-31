<script setup lang="ts">
const route = useRoute();
const error = route.query.error || 'An unexpected error occurred.';
</script>

<template>
    <div>
        <UAlert
            variant="subtle"
            color="error"
            title="Oh no!"
            :description="error as string"
            icon="i-lucide-terminal"
            class="mt-4"
        />
        <UButton
            label="Go to home"
            icon="i-lucide-arrow-left"
            class="mt-4"
            to="/"
        />
    </div>
</template>
