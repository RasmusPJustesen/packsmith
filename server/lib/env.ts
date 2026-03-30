import { z } from 'zod';

import tryParseEnv from './try-parse-env';

const EnvSchema = z.object({
    NODE_ENV: z.string(),
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
    CURSEFORGE_API_KEY: z.string(),

    // TODO: Add these back in when we add auth back in
    /* BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(), */
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

export default EnvSchema.parse(process.env);
