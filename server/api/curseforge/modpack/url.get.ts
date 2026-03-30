export default defineEventHandler(async (event) => {
    const link = getQuery(event).link as string;

    // Extract the slug after /modpacks/ in the link
    // eslint-disable-next-line e18e/prefer-static-regex
    const slugMatch = link.match(/\/modpacks\/([^/]+)/);
    const slug = slugMatch ? slugMatch[1] : '';

    const gameId = 432; // Minecraft's game ID on CurseForge

    const modpack = await $fetch<{ data: Array<any> }>(`https://api.curseforge.com/v1/mods/search?gameId=${gameId}&slug=${slug}`, {
        headers: {
            'X-API-Key': process.env.CURSEFORGE_API_KEY || '', // TODO:: get the API KEY using env.ts
        },
    });

    if (!modpack || !modpack.data || modpack.data.length === 0) {
        throw createError({
            statusCode: 404,
            message: 'Modpack not found',
        });
    }

    // TODO:: handle the case where multiple modpacks are returned (shouldn't happen with unique slugs, but just in case)

    return modpack.data[0];
});
