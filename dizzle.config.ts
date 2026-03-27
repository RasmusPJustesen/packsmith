import { defineConfig } from 'drizzle-kit';
import env from './server/lib/env';

import 'dotenv/config';

export default defineConfig({
    out: './server/lib/db/migrations',
    schema: './server/lib/db/schema/index.ts',
    casing: 'snake_case',
    dialect: 'turso',
    dbCredentials: {
        url: env.TURSO_DATABASE_URL,
        authToken: env.NODE_ENV === 'development' ? undefined : env.TURSO_AUTH_TOKEN,
    },
});
