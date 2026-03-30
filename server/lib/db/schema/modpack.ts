import type z from 'zod';
import type { SelectMod } from './mod';

import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

import { DescriptionSchema, McVersionSchema, NameSchema, ProviderIdSchema, ProviderSchema, UrlSchema, UuidSchema } from '../../../../shared/zod-schemas';

// import { user } from './auth';
import { mod } from './mod';

export const modpack = sqliteTable('modpack', {
    id: int().primaryKey({ autoIncrement: true }),
    providerId: int(),
    provider: text(),
    uuid: text().notNull().unique().$default(() => crypto.randomUUID()),
    name: text().notNull(),
    description: text(),
    url: text(),
    mcVersion: text(),
    finalized: int().notNull().$default(() => 0),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),

    // relations
    // userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
}, t => [
    // unique().on(t.name, t.userId),
]);

export const modpackRelations = relations(modpack, ({ many, one }) => ({
    mods: many(mod),
    // user: one(user, {
    //    fields: [modpack.userId],
    //    references: [user.id],
    // }),
}));

export const InsertModpack = createInsertSchema(modpack, {
    provider: ProviderSchema,
    providerId: ProviderIdSchema,
    name: NameSchema,
    description: DescriptionSchema,
    url: UrlSchema,
    mcVersion: McVersionSchema,
}).omit({
    id: true,
    uuid: true,
    finalized: true,
    // userId: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertModpack = z.infer<typeof InsertModpack>;
export type SelectModpack = typeof modpack.$inferSelect;
export type SelectModpackWithMods = SelectModpack & {
    mods: SelectMod[];
};
