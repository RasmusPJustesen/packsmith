import db from '~~/server/lib/db';

export default defineEventHandler(async (event) => {
    return await db.query.modpack.findMany({
        with: {
            mods: true,
        },
    });
});
