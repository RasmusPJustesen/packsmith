<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui';
import { refDebounced } from '@vueuse/core';
import moment from 'moment';
import semver from 'semver';

defineProps<Props>();

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
    loading: boolean;
    importStatus: string;
    targetMcVersion: string | null;
}

const globalFilter = ref('');

const columns: TableColumn<Mod>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        id: 'latestVersion',
        header: 'Latest version',
        meta: {
            class: {
                th: 'text-center',
                td: 'text-center',
            },
        },
        cell: ({ row }) => row.original.mcVersions.sort((a, b) => semver.rcompare(
                semver.coerce(a.version)!.version,
                semver.coerce(b.version)!.version,
            ))[0]?.version || 'N/A',
    },
    {
        id: 'actions',
        meta: {
            class: {
                th: 'text-right',
                td: 'text-right',
            },
        },
        cell: ({ row }) => row.getIsPinned()
        ? h(UButton, {
            color: 'success',
            variant: 'subtle',
            icon: 'i-lucide-badge-check',
            label: 'New version',
            to: row.original.url,
            target: '_blank',
        })
: null,
    },
];

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
        <div class="py-3.5 border-b border-accented">
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
        </div>

        <UTable
            v-model:global-filter="globalFilter"
            :get-row-id="(row: Mod) => String(row.id)"
            :data="mods"
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
                <NuxtLink
                    :to="row.original.url ?? undefined"
                    target="_blank"
                    class="text-primary hover:underline"
                >
                    {{ row.original.name }}
                </NuxtLink>
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
                <div class="p-4">
                    <span v-if="!selectedRow?.original.lastCheckedAt">Not checked yet.</span>
                    <span v-else>Last checked: {{ moment(selectedRow?.original.lastCheckedAt).format('HH:mm') }}</span>
                </div>
            </template>
        </UPopover>
    </div>
</template>
