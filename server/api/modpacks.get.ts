import db from '~~/server/lib/db';
import defineAuthenticatedEventHandler from '~~/server/utils/defined-authenticated-event-handlers';
import { findModpacks } from '../lib/db/queries/modpack';

export default defineAuthenticatedEventHandler(async (event) => {
    return await findModpacks(event.context.user.id);
});
