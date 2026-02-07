# Campus Cravings: Complete Build Guide

Build a full-stack meal rating app with Next.js, React, Drizzle ORM, and SQLite. This guide takes you from zero to a fully working application.

## Prerequisites

- A modern version of Node.js and npm installed

## Step 1: Initialize the Project

Create a new Next.js project with the minimal template:

```bash
npx create-next-app@latest --empty --yes campus cravings
cd campus-cravings
npm run dev
```

This creates a fresh Next.js 16 project with the App Router. You should see the dev server running on `http://localhost:3000`.

## Step 2: Install Dependencies

Install the required packages for database management, authentication tokens, and environment variables:

```bash
npm install drizzle-orm @libsql/client dotenv
npm install -D drizzle-kit
```

**What these do:**
- `drizzle-orm` - TypeScript ORM for database queries
- `@libsql/client` - SQLite client with full-stack support
- `dotenv` - Load environment variables from `.env`
- `drizzle-kit` - CLI tool for schema management and migrations

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory with your database URL and authentication token:

```bash
DB_URL=file:local.db
DB_AUTH_TOKEN=supersecrettoken
```

**Note:** The `DB_URL=file:local.db` creates a local SQLite database file. In production, you'd use a remote database URL. The `DB_AUTH_TOKEN` is required by the LibSQL client for authentication, even for local files. You can use any string for local development.

## Step 4: Define the Database Schema

Create `db/schema.ts` to define your data structure. This describes the `ratings` table:

```ts
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ratings = sqliteTable("ratings", {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    rating: int("rating").notNull(),
    comment: text("comment"),
});
```

**Schema breakdown:**
- `id` - Auto-incrementing primary key
- `name` - Meal name (required)
- `rating` - Rating out of 5 (required)
- `comment` - Optional user comment

## Step 5: Initialize the Database Client

Create `db/index.ts` to set up the Drizzle ORM instance and LibSQL client:

```ts
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

config({ path: ".env" });

const client = createClient({
    url: process.env.DB_URL!,
    authToken: process.env.DB_AUTH_TOKEN!,
});

export const db = drizzle(client);
```

This file exports the `db` instance which you'll use throughout your app to query the database.

## Step 6: Configure Drizzle Kit

Create `drizzle.config.ts` for schema management and migrations:

```ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./migrations",
    dialect: "turso",
    dbCredentials: {
        url: process.env.DB_URL!,
        authToken: process.env.DB_AUTH_TOKEN!,
    },
});
```

## Step 7: Create the Database

Push your schema to create the database file and tables:

```bash
npx drizzle-kit push
```

**What happens:** This command creates the `local.db` file and the `ratings` table based on your schema.

## Step 8: Style with Tailwind CSS v4

Update `app/globals.css` with Tailwind styles for your app:

```css
@import "tailwindcss";

@layer base {
    body {
        @apply bg-gradient-to-b from-orange-50 to-amber-50 text-gray-800;
    }

    main {
        @apply max-w-2xl mx-auto p-6 sm:p-8;
    }

    h1 {
        @apply text-4xl sm:text-5xl font-bold text-orange-600 mb-8 text-center;
    }

    h2 {
        @apply text-2xl font-semibold text-orange-700 mb-6 mt-0;
    }

    h3 {
        @apply text-xl font-semibold text-gray-900 mb-2;
    }

    form {
        @apply bg-white rounded-xl shadow-md p-6 mb-12 border border-orange-100;
    }

    form div {
        @apply mb-4;
    }

    label {
        @apply block text-sm font-semibold text-gray-700 mb-2;
    }

    input,
    select,
    textarea {
        @apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 transition-all;
    }

    textarea {
        @apply resize min-h-24;
    }

    button {
        @apply px-6 py-2 rounded-lg font-semibold transition-all;
    }

    form button {
        @apply w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 active:scale-95 shadow-md;
    }

    button:not(form button) {
        @apply bg-red-500 text-white hover:bg-red-600 active:scale-95 text-sm;
    }

    /* Rating cards container */
    main > div:last-child {
        @apply bg-white rounded-xl shadow-md p-6 border border-orange-100;
    }

    main > div:last-child > div {
        @apply mb-6 p-4 border-l-4 border-orange-400 bg-orange-50 rounded hover:shadow-md transition-shadow;
    }

    main > div:last-child > div:last-child {
        @apply mb-0;
    }

    main > div:last-child p {
        @apply text-gray-600 mb-4 italic;
    }

    main > div:last-child button {
        @apply mt-2;
    }
}
```

## Step 9: Create Server Actions

Create `actions/index.ts` to handle form submissions and deletions on the server:

```ts
"use server";

import { db } from "@/db";
import { ratings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addRating(formData: FormData) {
    const name = formData.get("name") as string;
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;

    await db.insert(ratings).values({
        name,
        rating,
        comment,
    });

    revalidatePath("/");
}

export async function deleteRating(id: number) {
    await db.delete(ratings).where(eq(ratings.id, id));
    revalidatePath("/");
}
```

**How it works:**
- `addRating()` - Inserts a new rating into the database and revalidates the page
- `deleteRating()` - Removes a rating by ID and revalidates the page
- `revalidatePath()` - Tells Next.js to refresh the page cache after mutations

## Step 10: Create the Rating Form Component

Create `components/RatingForm.tsx` - a Client Component for the form:

```tsx
"use client";

import { addRating } from "@/actions";

export default function RatingForm() {
    return (
        <form action={addRating}>
            <h2>Rate a Meal</h2>
            <div>
                <label>Meal Name</label>
                <input name="name" placeholder="Spicy Tofu" required />
            </div>
            <div>
                <label>Rating</label>
                <select name="rating">
                    {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>
                            {num} Stars
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Comments</label>
                <textarea name="comment" placeholder="It was great..." />
            </div>
            <button type="submit">Submit Rating</button>
        </form>
    );
}
```

**Note:** The `"use client"` directive makes this a Client Component. The `action={addRating}` prop connects the form to the server action.

## Step 11: Create the Delete Button Component

Create `components/DeleteButton.tsx` - a reusable Delete button:

```tsx
"use client";

import { deleteRating } from "@/actions";

export default function DeleteButton({ id }: { id: number }) {
    return (
        <button onClick={() => deleteRating(id)}>Delete</button>
    );
}
```

## Step 12: Build the Home Page

Create `app/page.tsx` - the main Server Component that fetches and displays all ratings:

```tsx
import { db } from "@/db";
import { ratings } from "@/db/schema";
import { desc } from "drizzle-orm";
import RatingForm from "@/components/RatingForm";
import DeleteButton from "@/components/DeleteButton";

export default async function Home() {
    const allRatings = await db.select().from(ratings).orderBy(desc(ratings.id));

    return (
        <main>
            <h1>Campus Cravings 🍔</h1>
            <RatingForm />
            <div>
                <h2>Recent Reviews</h2>

                {allRatings.length === 0 && <p>No ratings yet. Be the first!</p>}

                {allRatings.map((rating) => (
                    <div key={rating.id}>
                        <h3>{rating.name}</h3>
                        <div>{rating.rating}/5</div>
                        <p>{rating.comment}</p>
                        <DeleteButton id={rating.id} />
                    </div>
                ))}
            </div>
        </main>
    );
}
```

**Key features:**
- `async` function for server-side data fetching
- `orderBy(desc(ratings.id))` shows newest ratings first
- Empty state message if no ratings exist
- Dynamic rendering of rating cards with delete buttons

## Running the App

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` and you should see:
- A form to submit meal ratings
- A section displaying all previously submitted ratings
- Delete buttons to remove ratings

## Project Structure

```
.
├── app/
│   ├── globals.css      # Tailwind styles
│   ├── layout.tsx       # Root layout (auto-generated)
│   └── page.tsx         # Home page
├── components/
│   ├── RatingForm.tsx   # Form for new ratings
│   └── DeleteButton.tsx # Delete action button
├── db/
│   ├── index.ts         # Drizzle client
│   └── schema.ts        # Database schema
├── actions/
│   └── index.ts         # Server actions
├── .env                 # Environment variables
├── drizzle.config.ts    # Drizzle configuration
└── package.json         # Dependencies
```

## Next Steps

Once you have the basic app working, you can extend it with:
- **Search/Filter** - Add filtering by rating or meal name
- **Edit functionality** - Allow users to update existing ratings
- **User authentication** - Track who submitted each rating
- **Analytics** - Show average ratings, popular meals, etc.
- **Database backups** - Set up schema migrations with Drizzle Kit

## Troubleshooting

**Database file not created:**
- Ensure `.env` exists in the root directory
- Run `npx drizzle-kit push` again

**Form submissions not working:**
- Check that `DB_URL` and `DB_AUTH_TOKEN` are set in `.env`
- Ensure the `ratings` table exists in the database

**Styles not applying:**
- Verify `app/globals.css` is imported in your layout
- Tailwind CSS v4 is configured via `postcss.config.mjs`
