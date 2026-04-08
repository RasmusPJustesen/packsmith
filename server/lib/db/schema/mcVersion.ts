import type z from 'zod';

import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { McVersionSchema, ModIdSchema, ModloaderSchema, ModpackIdSchema } from '../../../../shared/zod-schemas';
import { mod } from './mod';
import { modpack } from './modpack';

export const mcVersion = sqliteTable('mc_version', {
    id: int().primaryKey({ autoIncrement: true }),
    version: text().notNull(),
    modloader: text(),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),

    modId: int().references(() => mod.id, { onDelete: 'cascade' }),
    modpackId: int().references(() => modpack.id, { onDelete: 'cascade' }),
});

export const mcVersionRelations = relations(mcVersion, ({ one }) => ({
    mod: one(mod, {
        fields: [mcVersion.modId],
        references: [mod.id],
    }),
    modpack: one(modpack, {
        fields: [mcVersion.modpackId],
        references: [modpack.id],
    }),
}));

export const InsertMcVersion = createInsertSchema(mcVersion, {
    version: McVersionSchema,
    modloader: ModloaderSchema,
    modId: ModIdSchema,
    modpackId: ModpackIdSchema,
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertMcVersion = z.infer<typeof InsertMcVersion>;
export type SelectMcVersion = typeof mcVersion.$inferSelect;
