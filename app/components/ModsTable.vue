<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui';
import { refDebounced } from '@vueuse/core';
import moment from 'moment';
import semver from 'semver';

const props = defineProps<Props>();

const UButton = resolveComponent('UButton');

interface Mod {
    id: number;
    name: string;
    url?: string | null;
    lastCheckedAt?: string | number | null;
    mcVersions: Array<{ version: string }>;
}

interface Props {
    mods: Mod[];
    modpack: any;
    loading: boolean;
    importStatus: string;
    targetMcVersion: string | null;
}

const globalFilter = ref('');

const hasPendingMods = computed(() => {
    return props.mods.some(mod => mod.name === 'importing...');
});

const columns = computed<TableColumn<Mod>[]>(() => {
    const cols: TableColumn<Mod>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
    ];

    if (props.targetMcVersion && !hasPendingMods.value) {
        cols.push({
            accessorKey: 'compatible',
            header: 'Compatible',
            meta: {
                class: {
                    th: 'text-center',
                    td: 'text-center',
                },
            },
        });
    }

    return cols;
});

const sortedMods = computed(() => {
    if (!props.targetMcVersion || hasPendingMods.value) {
        return props.mods;
    }

    return [...props.mods].sort((a, b) => {
        const aCompatible = a.mcVersions.some(v => v.version === props.targetMcVersion);
        const bCompatible = b.mcVersions.some(v => v.version === props.targetMcVersion);

        // Error badges (incompatible) first
        if (!aCompatible && bCompatible) return -1;
        if (aCompatible && !bCompatible) return 1;
        return 0;
    });
});

const compatibleCount = computed(() => {
    if (!props.targetMcVersion || hasPendingMods.value) {
        return null;
    }

    return props.mods.filter(mod =>
        mod.mcVersions.some(v => v.version === props.targetMcVersion),
    ).length;
});

const incompatibleCount = computed(() => {
    if (!props.targetMcVersion || compatibleCount.value === null || hasPendingMods.value) {
        return null;
    }

    return props.mods.length - compatibleCount.value;
});

const importedModsCount = computed(() => {
    return props.mods.filter(mod => mod.name !== 'importing...').length;
});

const highestCommonMcVersion = computed(() => {
    if (props.mods.length === 0 || hasPendingMods.value) {
        return null;
    }

    // Get all versions from all mods
    const allVersionSets = props.mods.map(mod =>
        new Set(mod.mcVersions.map(v => v.version)),
    );

    if (allVersionSets.length === 0 || !allVersionSets[0]) {
        return null;
    }

    // Find versions that exist in ALL mods (intersection)
    const commonVersions = Array.from(allVersionSets[0]).filter(version =>
        allVersionSets.every(versionSet => versionSet.has(version)),
    );

    if (commonVersions.length === 0) {
        return null;
    }

    // Sort and return the highest version
    const sorted = commonVersions.sort((a, b) => {
        try {
            return semver.rcompare(
                semver.coerce(a)!.version,
                semver.coerce(b)!.version,
            );
        } catch {
            return 0;
        }
    });

    return sorted[0];
});

const anchor = ref({ x: 0, y: 0 });

const reference = computed(() => ({
    getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        left: anchor.value.x,
        right: anchor.value.x,
        top: anchor.value.y,
        bottom: anchor.value.y,
        ...anchor.value,
    }) as DOMRect,
}));

const open = ref(false);
const openDebounced = refDebounced(open, 10);
const selectedRow = ref<TableRow<Mod> | null>(null);

function onHover(_e: Event, row: TableRow<Mod> | null) {
    selectedRow.value = row;

    open.value = !!row;
}

defineShortcuts({
    escape: {
        usingInput: true,
        handler: () => globalFilter.value = '',
    },
});
</script>

<template>
    <div class="flex flex-col flex-1 w-full">
        <div class="py-3.5 border-b border-accented flex justify-between items-end gap-4">
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Filter..."
            >
                <template v-if="globalFilter?.length" #trailing>
                    <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-lucide-circle-x"
                        aria-label="Clear input"
                        @click="globalFilter = ''"
                    />
                </template>
            </UInput>
            <div v-if="hasPendingMods" class="flex gap-1 items-center text-sm">
                <UIcon name="i-lucide-loader" class="w-4 h-4 animate-spin" />
                <p>{{ importedModsCount }} of {{ mods.length }} mods imported</p>
            </div>
            <div v-else-if="compatibleCount !== null" class="flex flex-col items-end gap-3 text-sm">
                <p class="text-error flex items-center gap-1">
                    <UIcon name="i-lucide-x" class="w-4 h-4" />
                    {{ incompatibleCount }} mods
                </p>
                <p class="text-success flex items-center gap-1">
                    <UIcon name="i-lucide-check" class="w-4 h-4" />
                    {{ compatibleCount }} mods
                </p>
                <p class="text-secondary">
                    {{ mods.length }} mods
                </p>
                <p>
                    Highest possible mc version: <span class="font-bold">{{ highestCommonMcVersion ?? props.modpack.mcVersion }}</span>
                </p>
            </div>
        </div>

        <UTable
            v-model:global-filter="globalFilter"
            :get-row-id="(row: Mod) => String(row.id)"
            :data="sortedMods"
            :columns="columns"
            :loading="loading"
            loading-animation="elastic"
            class="flex-1"
            :ui="{
                tbody: '[&>tr]:data-pinned:bg-elevated/50',
            }"
            @pointermove="
                (ev: PointerEvent) => {
                    anchor.x = ev.clientX
                    anchor.y = ev.clientY
                }
            "
            @hover="onHover"
        >
            <template #name-cell="{ row }">
                <p v-if="!row.original.url">{{ row.original.name }}</p>
                <NuxtLink
                    v-else
                    :to="row.original.url"
                    target="_blank"
                    class="text-primary hover:underline"
                >
                    {{ row.original.name }}
                </NuxtLink>
            </template>
            <template #compatible-cell="{ row }">
                <UBadge
                    v-if="row.original.mcVersions.some(v => v.version === targetMcVersion)"
                    color="success"
                    variant="subtle"
                    icon="i-lucide-check"
                >
                    {{ targetMcVersion }}
                </UBadge>
                <UBadge
                    v-else
                    color="error"
                    variant="subtle"
                    icon="i-lucide-x"
                >
                    {{ row.original.mcVersions.sort((a, b) => semver.rcompare(
                        semver.coerce(a.version)!.version,
                        semver.coerce(b.version)!.version,
                    ))[0]?.version || 'N/A' }}
                </UBadge>
            </template>
            <template #loading>
                <div v-if="importStatus === 'pending'">
                    <span>Mods are being fetched. hold on</span>
                    <LoadingDots />
                </div>
            </template>
        </UTable>

        <UPopover
            :content="{ side: 'top', sideOffset: 16, updatePositionStrategy: 'always' }"
            :open="openDebounced"
            :reference="reference"
        >
            <template #content>
                <div class="p-4 flex flex-col gap-2 text-sm">
                    <span>ID: {{ selectedRow?.original.id }}</span>
                    <span>Provider ID: {{ selectedRow?.original.providerId }}</span>
                    <span v-if="!selectedRow?.original.lastCheckedAt">Not checked yet.</span>
                    <span v-else>Last checked: {{ moment(selectedRow?.original.lastCheckedAt).format('HH:mm') }}</span>
                </div>
            </template>
        </UPopover>
    </div>
</template>
