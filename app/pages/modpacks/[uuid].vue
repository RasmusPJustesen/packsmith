<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { RowPinningState } from '@tanstack/table-core';
import { refDebounced } from '@vueuse/core';
import moment from 'moment';

const route = useRoute();
const uuid = route.params.uuid as string;

const UButton = resolveComponent('UButton');

const toast = useToast();

const { data: modpack, status, error, refresh } = await useFetch(`/api/modpacks/${uuid}`);

if (!modpack.value || error.value) {
    createError({
        statusCode: 404,
        statusMessage: 'Modpack not found',
    });
    await navigateTo({ name: 'error' });
}

const loading = computed(() => status.value === 'pending' || (modpack.value && modpack.value.importStatus === 'pending'));
const disableAutoRefreshing = computed(() => ['idle', 'pending', 'error'].includes(modpack.value!.importStatus));
const mods = computed(() => modpack.value!.mods || []);

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

    let getModsInterval: ReturnType<typeof setInterval>;
    if (modpack.value && modpack.value.provider !== 'custom' && modpack.value.mods.length === 0) {
        getModsInterval = setInterval(() => {
            if (modpack.value!.mods.length !== 0) {
                clearInterval(getModsInterval);
            }

            refresh();
        }, 2000);
    }
});

type Mod = NonNullable<typeof mods.value>[number];

const columns: TableColumn<Mod>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'latestMcVersionSupported',
        header: 'Latest Version',
        cell: ({ row }) => {
            const current = row.original.currentMcVersionSupported as string;
            const latest = row.original.latestMcVersionSupported as string;

            if (current === latest) {
                return h('span', current);
            }

            return h('span', {
                class: 'text-primary font-bold',
            }, latest);
        },
    },
    {
        accessorKey: 'currentMcVersionSupported',
        header: 'Current Version',
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
const globalFilter = ref('');

const rowPinning = computed<RowPinningState>(() => {
    return {
        top: mods.value
            .filter(mod => mod.latestMcVersionSupported !== mod.currentMcVersionSupported)
            .map(mod => String(mod.id)),
        bottom: [],
    };
});

function onHover(_e: Event, row: TableRow<Mod> | null) {
    selectedRow.value = row;

    open.value = !!row;
}

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
</script>

<template>
    <div class="space-y-6">
        <UButton
            icon="i-lucide-arrow-left"
            label="Dashboard"
            variant="link"
            :to="{ name: 'dashboard' }"
        />
        <div class="flex items-center justify-between gap-4">
            <div>
                <h1 class="text-xl font-bold">{{ modpack?.name }}</h1>
                <p class="text-xs md:text-md text-muted">{{ modpack?.description }}</p>
            </div>
            <UButton
                variant="subtle"
                color="error"
                icon="i-lucide-trash-2"
                @click="deleteModpack"
            />
        </div>

        <div class="flex flex-col flex-1 w-full">

            <div class="flex justify-between gap-4 py-3.5 border-b border-accented">
                <UInput
                    v-model="globalFilter"
                    class="max-w-sm"
                    placeholder="Filter..."
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

            <UTable
                v-model:row-pinning="rowPinning"
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
                <template #loading>
                    <div v-if="modpack!.importStatus === 'pending'">
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

    </div>
</template>
