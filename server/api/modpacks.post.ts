import type { DrizzleError } from 'drizzle-orm';

import defineAuthenticatedEventHandler from '~~/server/utils/defined-authenticated-event-handlers';
import { findModpackByName, findUniqueUuid, insertModpack } from '../lib/db/queries/modpack';
import { InsertModpack } from '../lib/db/schema';
import sendZodError from '../utils/send-zod.error';

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertModpack.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const existingModpack = await findModpackByName(result.data, event.context.user.id);

    if (existingModpack) {
        return sendError(event, createError({
            statusCode: 409,
            message: 'A modpack with that name already exists',
        }));
    }

    const uuid = await findUniqueUuid(crypto.randomUUID(), event.context.user.id);

    try {
        const modpack = await insertModpack(result.data, uuid, event.context.user.id);

        if (modpack && modpack.importFileId) {
            // Trigger import in background - using internal server call
            $fetch(`/api/modpacks/${modpack.id}/import`, {
                method: 'POST',
                body: { fileId: modpack.importFileId },
                headers: {
                    // Pass authentication from the original request
                    ...event.node.req.headers,
                },
            });
        }

        return modpack;
    } catch (e) {
        const error = e as DrizzleError;
        console.error('INSERT ERROR: ', error.message);
        throw error;
    }
});
