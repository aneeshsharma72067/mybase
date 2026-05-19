# MyBase

MyBase is a comprehensive, centralized personal dashboard application designed to help you organize your life, track your progress, and maintain focus across multiple domains. Built with modern web technologies, it provides a unified interface to manage your daily activities, finances, goals, and more.

## Key Features

- **Dashboard:** A central hub providing an overview of your current state, including quick stats, progress, and pending items.
- **Health Tracking:** Monitor your physical and mental well-being with activity heatmaps, habit tracking, and sleep cycles.
- **Thoughts & Reflection:** A dedicated space for capturing thoughts, insights, and maintaining consistency in your reflection practice.
- **Goals & Quests:** Track long-term ambitions and daily milestones with a goal-oriented progress interface.
- **Todo Manager:** Efficiently manage your daily tasks, to-dos, and productivity momentum.
- **Bookmark Management:** Organize your digital resources and bookmarks in one place.
- **Password Vault:** Securely store and manage your credentials with built-in generation capabilities.
- **Income & Finance:** Manage your financial health, track transactions, and visualize income sustainability.
- **Settings & Personalization:** Tailor the application to your preferences.

## Technology Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **State Management:** Zustand
- **Routing:** React Router v7
- **Styling:** TailwindCSS
- **Visualization:** Recharts
- **Icons:** Lucide React
- **Utilities:** date-fns, immer, uuid

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aneeshsharma72067/mybase.git
   cd mybase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- **Linting:** `npm run lint`
- **Building:** `npm run build`
- **Previewing:** `npm run preview`

## Project Structure

The project is organized into modular components and stores for each functional domain:

- `src/components`: Reusable UI components organized by module.
- `src/pages`: Top-level routing components for each feature.
- `src/store`: Zustand stores for global application state.
- `src/types`: TypeScript definitions for domain models.
- `src/lib`: Shared utility functions.
