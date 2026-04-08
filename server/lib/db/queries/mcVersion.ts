import type { InsertMcVersion } from '../schema';

import db from '..';
import { mcVersion } from '../schema';

export async function insertMcVersion(insertable: InsertMcVersion) {
    const [created] = await db.insert(mcVersion).values(insertable).returning();

    return created;
}

export async function insertMcVersions(insertables: InsertMcVersion[]) {
    if (insertables.length === 0) return [];

    return await db.insert(mcVersion).values(insertables).returning();
}
