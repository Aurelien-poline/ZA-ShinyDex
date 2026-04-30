# 🌟 Legends ZA Shiny Dex

A professional-grade collection manager and **Hyperspace Tracker** designed for the release of *Pokémon Legends: Z-A*. This interactive web application helps you track your progress towards a complete Shiny and Shalpha living dex.

## ✨ Features

*   **🌍 Fully Multilingual**: Support for **English**, **Japanese**, and **French** with real-time switching.
*   **🔍 Advanced Search**: Strict precision search for exact matches with a fuzzy fallback for typos. Search works across all languages simultaneously.
*   **📊 Hyperspace Dashboard**: A dedicated real-time tracker for every Hyperspace zone (Levels 1★ to 5★), showing exactly how many Shiny and Shalpha specimens are still missing.
*   **🔒 Official Logic**: 
    *   **Shiny-Locked**: Legendary and Mythical Pokémon are permanently locked with a security icon.
    *   **Alpha-Locked**: Specimens only available in "Special 5" zones have Shalpha status disabled automatically.
*   **⚡ High Performance**: Built with Next.js 16 and Prisma for instant updates and sleek animations.
*   **🎨 Dynamic Sprites**: Pokémon sprites automatically switch to their Shiny versions when marked as caught.

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Database**: PostgreSQL via Prisma 6
*   **Containerization**: Docker & Docker Compose
*   **Styling**: Tailwind CSS
*   **Data**: PokéAPI (Official types, names, and IDs)

## 🚀 Getting Started

### Prerequisites
*   Node.js 22+
*   npm
*   Docker & Docker Compose

### Installation
1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shinydex"
    ```
4.  **Start the Database**:
    Launch the PostgreSQL container using Docker Compose:
    ```bash
    docker compose up -d
    ```
5.  **Setup the database**:
    This will apply migrations and seed the initial 390 Pokémon.
    ```bash
    npm run setup
    ```

### Development
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🐳 Docker Integration

The project includes a `docker-compose.yml` file to quickly spin up a PostgreSQL instance:

*   **Image**: `postgres:15-alpine`
*   **Default Port**: `5432`
*   **Credentials**: Defined in `docker-compose.yml` (default `postgres`/`postgres`)
*   **Persistence**: Data is persisted in a Docker volume named `postgres_data`.

To stop the database:
```bash
docker compose down
```

## 📂 Project Structure

*   `src/app/`: Next.js pages and API routes.
*   `src/lib/`: Database configuration and translation engine.
*   `prisma/`: Database schema and seed data.
*   `public/`: Assets and official sigils.

---
*Good luck with your hunt in the Hyperspaces of Luminous City!*
