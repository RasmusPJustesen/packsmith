import type { User } from 'better-auth';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import db from './db/index';
import env from './env';

export type UserWithId = Omit<User, 'id'> & {
    id: number;
};

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'sqlite',
    }),
    advanced: {
        database: {
            generateId: false,
        },
    },
    socialProviders: {
        google: {
            prompt: 'select_account',
            clientId: env.GOOGLE_CLIENT_ID as string,
            clientSecret: env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});
