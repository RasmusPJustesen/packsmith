import type { InsertModpack } from '../schema';

import { and, eq } from 'drizzle-orm';

import db from '..';
import { modpack } from '../schema';

export async function findUniqueUuid(uuid: string, userId: number) {
    let existing = !!(await findModpackByUuid(uuid, userId));

    while (existing) {
        const uuid = crypto.randomUUID();
        existing = !!(await findModpackByUuid(uuid, userId));
        if (!existing) {
            return uuid;
        }
    }
    return uuid;
}

export async function findModpackByName(existing: InsertModpack, userId: number) {
    return db.query.modpack.findFirst({
        where: and(
            eq(modpack.name, existing.name),
            eq(modpack.userId, userId),
        ),
    });
}

export async function insertModpack(insertable: InsertModpack, uuid: string, userId: number) {
    const [created] = await db.insert(modpack).values({
        ...insertable,
        uuid,
        finalized: insertable.provider === 'custom' ? 1 : 0,
        userId,
    }).returning();

    return created;
}

export async function removeModpackByUuid(
    uuid: string,
    userId: number,
) {
    const [removed] = await db.delete(modpack).where(
        and(
            eq(modpack.uuid, uuid),
            eq(modpack.userId, userId),
        ),
    ).returning();
    return removed;
}

export async function findModpackByUuid(uuid: string, userId: number) {
    return db.query.modpack.findFirst({
        where: and(
            eq(modpack.uuid, uuid),
            eq(modpack.userId, userId),
        ),
    });
}

export async function findModpacks(userId: number) {
    return db.query.modpack.findMany({
        where: eq(modpack.userId, userId),
    });
}
