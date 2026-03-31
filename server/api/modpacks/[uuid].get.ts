import db from '~~/server/lib/db';
import { findModpackByUuid } from '~~/server/lib/db/queries/modpack';
import defineAuthenticatedEventHandler from '~~/server/utils/defined-authenticated-event-handlers';

export default defineAuthenticatedEventHandler(async (event) => {
    // await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate loading time
    const uuid = getRouterParam(event, 'uuid') as string;
    const modpack = await findModpackByUuid(uuid, event.context.user.id);

    if (!modpack) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: 'modpack not found',
        }));
    }

    return modpack;
});
