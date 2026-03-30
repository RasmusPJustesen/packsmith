import type { InsertModpack } from '../schema';

import { and, eq } from 'drizzle-orm';

import db from '..';
import { modpack } from '../schema';

export async function findUniqueUuid(uuid: string) {
    let existing = !!(await findModpackByUuid(uuid));

    while (existing) {
        const uuid = crypto.randomUUID();
        existing = !!(await findModpackByUuid(uuid));
        if (!existing) {
            return uuid;
        }
    }
    return uuid;
}

export async function findModpackByName(existing: InsertModpack /* userId: number */) {
    return db.query.modpack.findFirst({
        where: and(
            eq(modpack.name, existing.name),
            // eq(modpack.userId, userId),
        ),
    });
}

export async function insertModpack(insertable: InsertModpack, uuid: string /* userId: number */) {
    const [created] = await db.insert(modpack).values({
        ...insertable,
        uuid,
        // userId,
    }).returning();

    return created;
}

export async function findModpackByUuid(uuid: string) {
    return db.query.modpack.findFirst({
        where: eq(modpack.uuid, uuid),
    });
}
