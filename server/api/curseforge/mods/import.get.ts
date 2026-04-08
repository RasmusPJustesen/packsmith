import { insertMcVersions } from '~~/server/lib/db/queries/mcVersion';
import { findPendingMods, updateModById } from '~~/server/lib/db/queries/mod';
import { updateModpackById } from '~~/server/lib/db/queries/modpack';
import env from '~~/server/lib/env';

export default defineEventHandler(async (event) => {
    const mods = await findPendingMods(10);

    const pendingModpacks = [];

    for (const mod of mods) {
        try {
            const result = await $fetch<{ data: CurseForgeMod }>(`https://api.curseforge.com/v1/mods/${mod.providerId}`, {
                headers: {
                    'X-API-Key': env.CURSEFORGE_API_KEY,
                },
            });

            if (!result || !result.data) {
                console.warn(`No data found for curseforge mod with providerId (${mod.providerId})`);
                continue;
            }

            const modData = {
                name: result.data.name,
                url: result.data.links.websiteUrl,
                lastCheckedAt: Date.now(),
            };

            const modpack = mod.modpack;

            await updateModById(modData, mod.id);

            // Track modpack updates
            const existingModpackIndex = pendingModpacks.findIndex(pm => pm.id === modpack.id);
            if (existingModpackIndex !== -1) {
                // Update existing modpack in array
                pendingModpacks[existingModpackIndex].importProcessed += 1;
            } else {
                // Add new modpack to array
                pendingModpacks.push({
                    id: modpack.id,
                    importProcessed: modpack.importProcessed + 1,
                    importTotal: modpack.importTotal,
                });
            }

            const files = await $fetch<{ data: any }>(`https://api.curseforge.com/v1/mods/${mod.providerId}/files`, {
                headers: {
                    'X-API-Key': env.CURSEFORGE_API_KEY,
                },
            });

            if (!files || !files.data) {
                console.warn(`No files found for curseforge mod with providerId (${mod.providerId})`);
                continue;
            }

            const modpackModloader = modpack.modloader;
            const modloaderFiles = files.data.filter((file: any) => file.gameVersions.includes(modpackModloader));
            const modMcVersions = [] as string[];

            for (const file of modloaderFiles) {
                const mcVersions = file.sortableGameVersions.filter((sgv: any) => sgv.gameVersion !== '').map((sgv: any) => sgv.gameVersion);
                for (const mcVersion of mcVersions) {
                    if (!modMcVersions.includes(mcVersion)) {
                        modMcVersions.push(mcVersion);
                    }
                }
            }

            const mcVersionsToInsert = modMcVersions.map(modMcVersion => ({
                version: modMcVersion,
                modloader: modpackModloader,
                modId: mod.id,
                modpackId: modpack.id,
            }));

            // Batch insert all mc versions at once to avoid database lock
            await insertMcVersions(mcVersionsToInsert);
        } catch (error) {
            console.error(`Failed to fetch mod ${mod.providerId}:`, error);
            throw error;
        }
    }

    // Update all affected modpacks
    for (const pendingModpack of pendingModpacks) {
        const updates: any = {
            importProcessed: pendingModpack.importProcessed,
        };

        // If all mods are processed, mark as success
        if (pendingModpack.importProcessed === pendingModpack.importTotal) {
            updates.importStatus = 'success';
        }

        await updateModpackById(updates, pendingModpack.id);
    }

    return setResponseStatus(event, 204);
});
