import env from '~~/server/lib/env';

export default defineEventHandler(async (event) => {
    const query = getQuery(event).query as string;

    const classId = getQuery(event).classId as string || '4471'; // Default to modpacks if not provided
    const gameId = 432; // Minecraft's game ID on CurseForge
    const slug = query.replace(/\s+/g, '-').toLowerCase(); // Convert query to slug format

    const results = await $fetch<{ data: Array<any> }>(`https://api.curseforge.com/v1/mods/search?gameId=${gameId}&classId=${classId}&slug=${slug}`, {
        headers: {
            'X-API-Key': env.CURSEFORGE_API_KEY,
        },
    });

    return results.data || [];
});
