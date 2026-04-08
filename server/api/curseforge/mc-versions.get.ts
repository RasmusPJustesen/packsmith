import env from '~~/server/lib/env';

export default defineEventHandler(async (event) => {
    return await $fetch<{ data: Array<any> }>(`https://api.curseforge.com/v1/minecraft/version`, {
        headers: {
            'X-API-Key': env.CURSEFORGE_API_KEY,
        },
    });
});
