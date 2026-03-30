import type z from 'zod';

import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { NameSchema, ProviderIdSchema, ProviderSchema } from '../../../../shared/zod-schemas';

import { modpack } from './modpack';

export const mod = sqliteTable('mod', {
    id: int().primaryKey({ autoIncrement: true }),
    providerId: int(),
    provider: text(),
    name: text().notNull(),
    url: text(),
    currentMcVersionSupported: text(),
    latestMcVersionSupported: text(),
    lastCheckedAt: int(),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),

    // relations
    modpackId: int().notNull().references(() => modpack.id, { onDelete: 'cascade' }),
});

export const modRelations = relations(mod, ({ one }) => ({
    modpack: one(modpack, {
        fields: [mod.modpackId],
        references: [modpack.id],
    }),
}));

export const InsertMod = createInsertSchema(mod, {
    name: NameSchema,
    provider: ProviderSchema,
    providerId: ProviderIdSchema,
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertMod = z.infer<typeof InsertMod>;
export type SelectMod = typeof mod.$inferSelect;
