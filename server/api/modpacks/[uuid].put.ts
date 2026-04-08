import { findModpackByUuid, updateModpackById } from '~~/server/lib/db/queries/modpack';
import { InsertModpack } from '~~/server/lib/db/schema';
import defineAuthenticatedEventHandler from '~~/server/utils/defined-authenticated-event-handlers';

export default defineAuthenticatedEventHandler(async (event) => {
    const uuid = getRouterParam(event, 'uuid') as string;
    const result = await readValidatedBody(event, InsertModpack.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const exitingModpack = await findModpackByUuid(uuid, event.context.user.id);

    if (!exitingModpack) {
        return sendError(event, createError({
            statusCode: 404,
            message: 'Modpack not found',
        }));
    }

    return await updateModpackById(result.data, exitingModpack.id);
});
