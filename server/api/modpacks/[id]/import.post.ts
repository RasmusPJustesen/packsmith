import { Buffer } from 'node:buffer';
import AdmZip from 'adm-zip';
import { eq } from 'drizzle-orm';
import db from '~~/server/lib/db';
import { insertMod } from '~~/server/lib/db/queries/mod';
import { updateModpackById } from '~~/server/lib/db/queries/modpack';
import { mod, modpack } from '~~/server/lib/db/schema';
import env from '~~/server/lib/env';
import defineAuthenticatedEventHandler from '~~/server/utils/defined-authenticated-event-handlers';

interface ManifestFile {
    projectID: number;
    fileID: number;
    required: boolean;
}

interface Manifest {
    files: ManifestFile[];
}

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await readBody(event);
    const modpackId = Number(event.context.params?.id);

    if (!modpackId || Number.isNaN(modpackId)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid modpack ID',
        });
    }

    const result = await $fetch<{ data: CurseForgeFile[] }>('https://api.curseforge.com/v1/mods/files', {
        method: 'POST',
        body: {
            fileIds: [body.fileId],
        },
        headers: {
            'X-API-Key': env.CURSEFORGE_API_KEY,
        },
    });

    if (!result || !result.data || result.data.length === 0) {
        throw createError({
            statusCode: 404,
            message: 'File not found on CurseForge',
        });
    }

    const fileData = result.data[0];

    if (!fileData) {
        throw createError({
            statusCode: 400,
            message: 'Invalid file data from CurseForge',
        });
    }

    const downloadUrl = fileData.downloadUrl;

    if (!downloadUrl) {
        throw createError({
            statusCode: 400,
            message: 'File does not have a download URL',
        });
    }

    const response = await fetch(downloadUrl);
    if (!response.ok) {
        throw createError({
            statusCode: 400,
            message: 'Failed to download the file',
        });
    }
    const buffer = Buffer.from(await response.arrayBuffer());

    let manifest: Manifest;
    try {
        const zip = new AdmZip(buffer);
        const manifestEntry = zip.getEntry('manifest.json');

        if (!manifestEntry) {
            throw createError({
                statusCode: 400,
                message: 'manifest.json not found in the zip file',
            });
        }

        const manifestContent = zip.readAsText(manifestEntry);
        manifest = JSON.parse(manifestContent);
    } catch (err) {
        throw createError({
            statusCode: 400,
            message: 'Failed to extract or parse manifest.json from the zip file',
        });
    }

    if (!manifest.files || !Array.isArray(manifest.files)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid manifest.json: files array not found',
        });
    }

    // Mass insert mods
    const modsToInsert = manifest.files.map(file => ({
        providerId: file.projectID,
        provider: 'curseforge',
        name: 'importing...',
        modpackId,
    }));

    if (modsToInsert.length > 0) {
        await Promise.all(modsToInsert.map(modData => insertMod(modData)));
    }

    const importStatusChanges = {
        importTotal: modsToInsert.length,
        importStatus: 'pending',
    };

    // Update modpack status
    await updateModpackById(importStatusChanges, modpackId);

    return {
        success: true,
        modsImported: modsToInsert.length,
    };
});
