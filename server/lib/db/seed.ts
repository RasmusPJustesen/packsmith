import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { mod, modpack } from './schema';

// Create a direct connection to the local database for seeding
const client = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:local.db',
});

const db = drizzle({ client, casing: 'snake_case' });

async function seed() {
    console.log('🌱 Starting database seed...');

    try {
        // Clear existing data
        console.log('🗑️  Deleting existing data...');
        await db.delete(mod);
        await db.delete(modpack);
        console.log('✅ Cleared all existing data');

        // Seed modpacks
        console.log('📦 Seeding modpacks...');
        const modpacks = await db.insert(modpack).values([
            {
                name: 'Vanilla Enhanced',
                description: 'A lightweight modpack that enhances vanilla Minecraft without changing the core experience.',
                provider: 'curseforge/*  */',
                providerId: 12345, // Example provider ID
                userId: 1, // Example user ID
            },
            {
                name: 'Tech Revolution',
                description: 'A technology-focused modpack featuring automation, engineering, and advanced machinery.',
                provider: 'curseforge/*  */',
                providerId: 12345, // Example provider ID
                userId: 1, // Example user ID
            },
            {
                name: 'Magic & Adventure',
                description: 'Explore mystical dimensions and master powerful spells in this magic-themed adventure pack.',
                provider: 'curseforge/*  */',
                providerId: 12345, // Example provider ID
                userId: 1, // Example user ID
            },
        ]).returning();

        console.log(`✅ Created ${modpacks.length} modpacks`);

        // Seed mods for each modpack
        console.log('🔧 Seeding mods...');
        const mods = await db.insert(mod).values([
            // Vanilla Enhanced mods
            {
                modpackId: modpacks[0].id,
                name: 'JEI (Just Enough Items)',
                url: 'https://www.curseforge.com/minecraft/mc-mods/jei',
                provider: 'CurseForge',
                providerId: 238222,
                currentMcVersionSupported: '1.20.1',
                latestMcVersionSupported: '1.20.1',
            },
            {
                modpackId: modpacks[0].id,
                name: 'Biomes O\' Plenty',
                url: 'https://www.curseforge.com/minecraft/mc-mods/biomes-o-plenty',
                provider: 'CurseForge',
                providerId: 220318,
                currentMcVersionSupported: '1.20.1',
                latestMcVersionSupported: '1.20.1',
            },
            {
                modpackId: modpacks[0].id,
                name: 'Optifine',
                provider: 'CurseForge',
                providerId: 456745,
                url: 'https://www.curseforge.com/minecraft/mc-mods/optifine',
                currentMcVersionSupported: '1.20.1',
                latestMcVersionSupported: '1.21.11',
            },

            // Tech Revolution mods
            {
                modpackId: modpacks[1].id,
                name: 'Mekanism',
                url: 'https://www.curseforge.com/minecraft/mc-mods/mekanism',
                provider: 'CurseForge',
                providerId: 268560,
                currentMcVersionSupported: '1.20.1',
                latestMcVersionSupported: '1.20.1',
            },
            {
                modpackId: modpacks[1].id,
                name: 'Applied Energistics 2',
                url: 'https://www.curseforge.com/minecraft/mc-mods/applied-energistics-2',
                provider: 'CurseForge',
                providerId: 223794,
                currentMcVersionSupported: '1.20.1',
                latestMcVersionSupported: '1.20.1',
            },
            {
                modpackId: modpacks[1].id,
                name: 'Thermal Expansion',
                url: 'https://www.curseforge.com/minecraft/mc-mods/thermal-expansion',
                provider: 'CurseForge',
                providerId: 69163,
                currentMcVersionSupported: '1.20.1',
                latestMcVersionSupported: '1.20.1',
            },

            // Magic & Adventure mods
            {
                modpackId: modpacks[2].id,
                name: 'Botania',
                url: 'https://www.curseforge.com/minecraft/mc-mods/botania',
                provider: 'CurseForge',
                providerId: 225643,
                currentMcVersionSupported: '1.20.1',
                latestMcVersionSupported: '1.20.1',
            },
            {
                modpackId: modpacks[2].id,
                name: 'Thaumcraft',
                url: 'https://www.curseforge.com/minecraft/mc-mods/thaumcraft',
                provider: 'CurseForge',
                providerId: 223628,
                currentMcVersionSupported: '1.12.2',
                latestMcVersionSupported: '1.12.2',
            },
            {
                modpackId: modpacks[2].id,
                name: 'Twilight Forest',
                url: 'https://www.curseforge.com/minecraft/mc-mods/the-twilight-forest',
                provider: 'CurseForge',
                providerId: 227083,
                currentMcVersionSupported: '1.20.1',
                latestMcVersionSupported: '1.20.1',
            },
        ]).returning();

        console.log(`✅ Created ${mods.length} mods`);
        console.log('🎉 Database seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

// Run the seed function
seed()
    .catch((error) => {
        console.error('Failed to seed database:', error);
        process.exit(1);
    })
    .finally(() => {
        console.log('👋 Seed script finished');
        client.close();
        process.exit(0);
    });
