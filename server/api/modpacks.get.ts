import db from '~~/server/lib/db';
import defineAuthenticatedEventHandler from '~~/server/utils/defined-authenticated-event-handlers';

export default defineAuthenticatedEventHandler(async (event) => {
    return await db.query.modpack.findMany({
        with: {
            mods: true,
        },
    });
});
