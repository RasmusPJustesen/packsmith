import { findPendingMods, updateModById } from '~~/server/lib/db/queries/mod';
import { updateModpackById } from '~~/server/lib/db/queries/modpack';
import env from '~~/server/lib/env';

export default defineEventHandler(async (event) => {
    const mods = await findPendingMods();

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

            // Update modpack import_processed
            await updateModpackById({
                importProcessed: (modpack.importProcessed ?? 0) + 1,
                ...(modpack.importProcessed + 1 === modpack.importTotal
                    ? { importStatus: 'success' }
                    : {}),
            }, modpack.id); // TODO:: BUG make sure importProcessed is not overwritten by concurrent updates - maybe move this logic to a separate function that calculates the new importStatus based on the number of processed mods?

            // Process the result here
        } catch (error) {
            console.error(`Failed to fetch mod ${mod.providerId}:`, error);
            throw error;
        }
    }

    return setResponseStatus(event, 204);
});
