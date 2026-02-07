# nextjs-workshop

Presentation and supporting materials for my workshop "Build Your First Full-Stack App in Next.js"

Created and presented by Jeremie Bornais

## 📚 Slides & Materials

The presentation slides and guides are available in the `docs` directory:

- [View Slides (Markdown)](docs/slides.md)
- [View Slides (PDF)](docs/slides.pdf)
- [Complete Build Guide](docs/full_instructions.md) - Step-by-step instructions from project init to fully working app

## 🛠 Tech Stack

This project uses the modern Next.js stack:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database:** [SQLite](https://www.sqlite.org/) (via [LibSQL](https://docs.turso.tech/sdk/ts/quickstart))
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **UI Library:** [React 19](https://react.dev/)

## 🚀 Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Setup:**

    Copy `example.env` to `.env`:

    ```bash
    cp example.env .env
    ```

3.  **Run Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```text
├── actions/        # Server Actions (mutations)
├── app/            # Next.js App Router pages and layouts
├── components/     # React UI components
├── db/             # Database configuration and schema
├── docs/           # Workshop slides and documentation
└── public/         # Static assets
```

## 🌍 Deployment

### 1. Database (Turso)

Since this project uses LibSQL, the easiest way to deploy the database is with [Turso](https://turso.tech/).

1.  **Install Turso CLI**: Follow the [installation instructions](https://docs.turso.tech/cli/installation).

2.  **Create Database**:
    ```bash
    turso db create nextjs-workshop
    ```

3.  **Get Connection Details**:
    Get the Database URL:
    ```bash
    turso db show nextjs-workshop --url
    ```
    Get the Auth Token:
    ```bash
    turso db tokens create nextjs-workshop
    ```

4. **Push Schema to Turso**:
    Now that you have your credentials, you need to push your database schema to the new Turso database.

    Update your local `.env` file with the Turso URL and Token temporarily, then run the Drizzle migration:

    ```bash
    npx drizzle-kit push
    ```

### 2. Application (Vercel)

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com/new).

1.  **Push to GitHub**: Push your code to a GitHub repository.

2.  **Import Project**: Go to Vercel, click "Add New...", and select "Project". Import your GitHub repository.

3.  **Environment Variables**:
    In the Vercel project configuration, add the following Environment Variables:

    | Variable | Value |
    | :--- | :--- |
    | `DB_URL` | The **Database URL** from step 3 (starts with `libsql://`) |
    | `DB_AUTH_TOKEN` | The **Auth Token** from step 3 |

4.  **Deploy**: Click "Deploy". Your app should be live in a minute!

## Learn More

To learn more about the tools used in this workshop:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview) - type-safe SQL ORM.
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - utility-first CSS framework.
