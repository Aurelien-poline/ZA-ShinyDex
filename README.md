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
*   **Database**: SQLite via Prisma 6
*   **Styling**: Tailwind CSS
*   **Data**: PokéAPI (Official types, names, and IDs)

## 🚀 Getting Started

### Prerequisites
*   Node.js 22+
*   npm

### Installation
1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup the database**:
    This will create the SQLite database, apply migrations, and seed the initial 390 Pokémon with their official multilingual names and locations.
    ```bash
    npm run setup
    ```

### Development
Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

*   `src/app/`: Next.js pages and API routes.
*   `src/lib/`: Database configuration and translation engine.
*   `prisma/`: Database schema and seed data.
*   `public/`: Assets and official sigils.

---
*Good luck with your hunt in the Hyperspaces of Luminous City!*
