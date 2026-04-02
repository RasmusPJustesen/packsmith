import { findPendingMods, updateModById } from '~~/server/lib/db/queries/mod';
import { updateModpackById } from '~~/server/lib/db/queries/modpack';
import env from '~~/server/lib/env';

export default defineEventHandler(async (event) => {
    const mods = await findPendingMods();

    const pendingModpacks = [];

    for (const mod of mods) {
        try {
            const result = await $fetch<any>(`https://api.curseforge.com/v1/mods/${mod.providerId}`, {
                headers: {
                    'X-API-Key': env.CURSEFORGE_API_KEY,
                },
            });

            if (!result || !result.data) {
                console.warn(`No data found for mod ${mod.providerId}`);
                continue;
            }

            const modData = {
                name: result.data.name as string,
                url: result.data.links.websiteUrl as string,
                currentMcVersionSupported: mod.modpack.mcVersion as string,
                latestMcVersionSupported: result.data.latestFilesIndexes[0].gameVersion as string,
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
