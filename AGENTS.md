# AI Agent Guide for `nextjs-workshop`

This document provides context and guidelines for AI agents working on this codebase.

## Project Overview
This represents a "Build Your First Full-Stack App in Next.js" workshop demo. It is a simple Full-Stack application allowing users to view and submit ratings.

## Tech Stack & versions
- **Next.js:** 16.1.6 (App Router)
- **React:** 19.2.3
- **TypeScript:** v5
- **Tailwind CSS:** v4 (configured via `postcss.config.mjs` and imported in `app/globals.css`)
- **Database:** SQLite (LibSQL client)
- **ORM:** Drizzle ORM v0.45.1

## Architecture Patterns

### App Router
- The project uses the Next.js **App Router** (`app/` directory).
- `page.tsx` is the main entry point.
- `layout.tsx` handles the global shell (HTML/Body structure).

### Data Fetching
- Data fetching should be done directly in Server Components using `drizzle-orm`.
- **Example:** `await db.select().from(ratings)` inside `app/page.tsx`.

### Mutations (Server Actions)
- Mutations are handled via **Server Actions**.
- Located in `actions/index.ts`.
- Components invoke these actions via `form` `action` prop or event handlers.
- **Note:** Ensure `revalidatePath` is called after mutations to update the UI.

### Database
- **Configuration:** `db/index.ts` sets up the LibSQL client and Drizzle instance.
- **Schema:** `db/schema.ts` defines the tables.
    - **Table `ratings`**:
        - `id`: int (primary key, auto increment)
        - `name`: text (not null)
        - `rating`: int (not null)
        - `comment`: text (optional)

### Styling
- Tailwind CSS v4 is used.
- Class names are used directly on elements.
- Global styles are in `app/globals.css`.

## Common Tasks

### Adding a new Database Field
1.  Edit `db/schema.ts` to add the field.
2.  Run `npx drizzle-kit push` (or generate migration) to update the DB.
3.  Update UI components to display/input the new field.

### Adding a new Feature
1.  Define data requirements in `db/schema.ts`.
2.  Create/Update Server Actions in `actions/index.ts`.
3.  Create UI in `components/` or a new page in `app/`.

## Key Files
- `drizzle.config.ts`: Configuration for Drizzle Kit.
- `next.config.ts`: Next.js configuration.
- `actions/index.ts`: Business logic & DB writes.
- `db/schema.ts`: Database definition.
