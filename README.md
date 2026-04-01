# CivicLens Platform - How To Use Guide

CivicLens is a civic issue reporting and management platform designed with a split architecture (React Frontend and MCP/Express Backend) to enable efficient community issue tracking.

Here is a step-by-step simple guide to run and use CivicLens locally.

## 1. Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## 2. Setup Instructions

The project features a split architecture:
- the main folder is the **Frontend**
- the `mcp-server` folder is the **Backend (Database & API)**

### A. Start the Backend
1. Open a terminal and navigate to the `mcp-server` directory:
   ```bash
   cd mcp-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```
   *The server will start on port 3001 and automatically seed initial data in the SQLite database.*

### B. Start the Frontend
1. Open a **new** terminal window and navigate to the project root:
   ```bash
   cd CivicLens-main
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
   *The app will start running at `http://localhost:5173`.*

## 3. How to Use the App

Once both servers are running, access the frontend at `http://localhost:5173` in your browser.

- **Map Dashboard:** The home screen features a live map showing civic issues around the city. Pins correspond to issues (colors correspond to severity: Red for High, Green for Low). Tap any pin to pop-up details.
- **Report an Issue:** Click the green **`+`** button (bottom right) to open the submission form. You can select the category, severity, and add visual evidence. Submitting will create a post live on the Map and in the Admin Ledger.
- **The Digital Ledger (Admin):** Click the shield icon in the bottom navigation bar to open the Admin Dashboard. From here you can oversee all reports, track their resolution status, and update an issue's status from "Pending" to "Resolved" to accurately reflect what is occurring.

## 4. Configuration
If you would like to enable actual Google Maps or AI features, you can add your API keys to the system:
- Add a `.env` file to the root of the project.
- Input the environment variables (e.g., `VITE_GOOGLE_MAPS_KEY`, `VITE_OPENAI_API_KEY`).
- Wait for the server to adapt configuration.
