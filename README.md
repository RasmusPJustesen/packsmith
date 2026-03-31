# PackSmith - Minecraft modpack update tracker

## Setup

You need to have Turso CLI installed for the local backend to work.
https://docs.turso.tech/cli/installation

Make sure to install dependencies:

```bash
pnpm install
```

### Backend setup

To initialize the backend:

```bash
pnpm dev:db 
or
pnpm dev

pnpm drizzle-kit migrate
```

HINT: use `pnpm drizzle-kit studio` to view you database.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```
NOTE: `pnpm dev` has been update to run `pnpm dev` & `pnpm dev:db` concurrently

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```
