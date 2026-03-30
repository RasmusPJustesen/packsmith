import db from '~~/server/lib/db';

export default defineEventHandler(async (event) => {
    // await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate loading time
    const uuid = getRouterParam(event, 'uuid') as string;
    const modpack = await db.query.modpack.findFirst({
        where: (modpack, { eq }) => eq(modpack.uuid, uuid),
        with: {
            mods: true,
        },
    });

    if (!modpack) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: 'modpack not found',
        }));
    }

    return modpack;
});
