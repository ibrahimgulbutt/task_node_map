# Architecture Documentation

## Overview

Node Mind is a hybrid mobile application built using the **Next.js** framework, wrapped with **Capacitor** for native mobile capabilities. It leverages **Ionic** for UI components to ensure a native look and feel, and **Tailwind CSS** for utility-first styling.

## Directory Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── analytics/       # Analytics dashboard
│   ├── focus/           # Focus timer feature
│   ├── maps/            # Mind map list view
│   ├── mindmap/         # Individual mind map editor (React Flow)
│   ├── settings/        # App settings
│   ├── layout.tsx       # Root layout with Ionic setup
│   └── page.tsx         # Home/Dashboard page
├── components/          # Reusable UI components
│   ├── AppShell.tsx     # Main app wrapper (IonApp, IonRouterOutlet)
│   ├── BottomNav.tsx    # Bottom navigation bar
│   ├── MindMapNode.tsx  # Custom node component for React Flow
│   └── ...
├── store/               # State management
│   └── useStore.ts      # Central Zustand store
├── lib/                 # Utility functions
├── types/               # TypeScript interfaces
└── ...
```

## State Management (Zustand)

The application uses a centralized store pattern implemented with **Zustand**. The store is persisted to `localStorage` using the `persist` middleware, ensuring user data survives app restarts.

### Store Slices

1.  **Tasks Slice**
    *   Manages the list of tasks.
    *   Actions: `addTask`, `toggleTask`, `deleteTask`, `updateTask`.
    *   Data Model: `Task` (id, title, description, completed, priority, date).

2.  **Maps Slice**
    *   Manages the collection of mind maps.
    *   Actions: `addMap`, `deleteMap`, `updateMap`.
    *   Data Model: `MindMap` (id, title, description, createdAt).

3.  **Nodes & Edges Slice**
    *   Manages the content of mind maps (nodes and connections).
    *   Uses `React Flow` data structures (`Node`, `Edge`).
    *   Actions: `onNodesChange`, `onEdgesChange`, `addNode`, `addEdge`.

4.  **Focus Slice**
    *   Manages focus sessions and timer history.
    *   Actions: `addSession`.
    *   Data Model: `FocusSession` (id, duration, date, completed).

## Key Technologies & Decisions

### Next.js + Ionic
We use Next.js for its robust routing and build system. However, since Next.js uses its own router, and Ionic uses `IonReactRouter`, we have a custom integration in `AppShell.tsx` and `ClientIonicSetup.tsx` to ensure smooth transitions and navigation state management within a Capacitor environment.

### React Flow
The core mind mapping feature is built on React Flow. We use custom node types (`MindMapNode`) to provide a tailored editing experience that fits the app's aesthetic.

### Capacitor
The app is configured as a Capacitor project.
*   `capacitor.config.ts`: Configuration for app ID, name, and web directory (`out`).
*   **Android Build:** The `android` folder contains the native Android project. We use the Gradle wrapper for building the APK.

## Data Persistence
Data is currently stored locally on the device using `localStorage` via Zustand's persistence. There is no backend server; the app is "local-first".

## Styling System
*   **Tailwind CSS:** Used for layout, spacing, typography, and colors.
*   **Ionic Components:** Used for interactive elements (Modals, Buttons, Inputs, DateTime) to ensure accessibility and platform-standard behavior.
*   **CSS Variables:** Ionic's CSS variables are overridden in `globals.css` to customize the theme (e.g., dark mode colors).
