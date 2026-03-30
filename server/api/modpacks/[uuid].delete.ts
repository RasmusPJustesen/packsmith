import { removeModpackByUuid } from '~~/server/lib/db/queries/modpack';
import defineAuthenticatedEventHandler from '~~/server/utils/defined-authenticated-event-handlers';

export default defineAuthenticatedEventHandler(async (event) => {
    // await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate loading time
    const uuid = getRouterParam(event, 'uuid') as string;

    const deleted = await removeModpackByUuid(uuid, event.context.user.id);

    if (!deleted) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: 'Modpack not found',
        }));
    }

    return setResponseStatus(event, 204);
});
