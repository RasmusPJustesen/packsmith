import type { InsertMod } from '../schema';

import { and, eq } from 'drizzle-orm';
import db from '..';
import { mod } from '../schema';

export function findPendingMods() {
    return db.query.mod.findMany({
        where: and(
            eq(mod.name, 'importing...'),
        ),
        limit: 10,
        with: {
            modpack: true,
        },
    });
}

export async function updateModById(updates: Partial<InsertMod>, id: number) {
    const [updated] = await db.update(mod).set(updates).where(
        eq(mod.id, id),
    ).returning();

    return updated;
}
