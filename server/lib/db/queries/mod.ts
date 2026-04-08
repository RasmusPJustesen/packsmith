import type { InsertMod } from '../schema';

import { and, eq } from 'drizzle-orm';
import db from '..';
import { mod } from '../schema';

export function findPendingMods(limit: number = 10) {
    return db.query.mod.findMany({
        where: and(
            eq(mod.name, 'importing...'),
        ),
        limit,
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

export async function insertMod(insertable: InsertMod) {
    const [created] = await db.insert(mod).values(insertable).returning();

    return created;
}
