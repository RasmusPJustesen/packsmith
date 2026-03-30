import type { UserWithId } from '~~/server/lib/auth';

import { auth } from '~~/server/lib/auth';

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    event.context.user = session?.user as unknown as UserWithId;

    if (event.path.startsWith('/dashboard') || event.path.startsWith('/modpacks')) {
        if (!session?.user) {
            await sendRedirect(event, '/', 302);
        }
    }
});
