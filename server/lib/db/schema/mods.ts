import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { modpacks as modpack } from './modpacks';

export const mod = sqliteTable('mods', {
    id: int().primaryKey({ autoIncrement: true }),
    curseforgeId: int(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    currentMcVersionSupported: text(),
    latestMcVersionSupported: text(),
    lastCheckedAt: int(),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),

    modpackId: int().notNull().references(() => modpack.id, { onDelete: 'cascade' }),
});
