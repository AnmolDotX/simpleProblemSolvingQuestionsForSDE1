# SDE 1 Frontend Interview Prep Guide 🚀

The ultimate resource mapping out high-frequency front-end interview questions targeting **SDE 1 roles at top tier tech companies**. This project helps front-end engineers efficiently practice Core JS, React, System Design, and specific Data Structures heavily focused on the UI domain.

## Overview

This repository hosts a ready-to-deploy, optimized Next.js app containing comprehensive cheat sheets and actionable code patterns organized by standard technical interview rounds.

It splits the preparation content into two focused areas:

- **Round 1:** DSA & Problem Solving specifically tailored for the Front-End (Strings, Arrays, Sliding Window, Traversing the DOM).
- **Round 2:** Core Frontend (JavaScript nuances, React internals, System Design concepts, and Browser Web APIs).

## Key Features

- **Topic Segregation:** Deep dive into specific topics with organized tabs and beautifully styled collapsible card elements.
- **Local Progress Tracking:** The app contains a built-in "todo-list" functionality. Click the task circles on the left side of any question card to mark it as **completed**. Your completion progress is saved securely in your browser's `localStorage`.
- **Zero-Config Deployment:** Ready to be immediately deployed to Vercel/Netlify for quick access anywhere you like.
- **Fast, Responsive & SEO Ready:** Built entirely with Next.js (App Router), styled naturally for the browser with strong SEO metatags.

## Getting Started

1. Clone this repository
2. Install the necessary dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to launch the web client and begin preparing!

## Content Index

### SDE 1 Round 1 - Problem Solving (DSA for Front-End)

This section tests a developer's ability to operate safely in standard data sets and DOM environments:

- **Arrays & Strings:** Two Sum, Valid Palindrome, Container With Most Water
- **Sliding Window:** Longest Substring Without Repeating Characters
- **Frontend Specific DSA:** Working directly with Object Flattenings, deeply nested arrays, and algorithmic ways to step dynamically up and down the DOM Tree (BFS/DFS).

### SDE 1 Round 2 - Core Frontend

This section puts theoretical architecture to the test:

- **JavaScript Deep Dive:** Hoisting, Closures, Execution Context, the Event Loop, Polyfills, Promises.
- **React In-Depth:** Virtual DOM, React Hooks dependency mechanisms, Performance metrics (`React.memo`, `useCallback`), Component state behavior patterns.
- **Browser & Web APIs:** The Critical Rendering Path, Worker threading, Application state & security considerations (XSS, CSRF, LocalStorage VS. SessionStorage).
- **SSR / Next.js:** Definitions of CSR vs SSR vs SSG vs ISR capabilities, React Server Components.
- **Frontend System Design:** Building an Autocomplete Component, Pagination vs Infinite Scroll structures, Payments implementations.

## Stack & Architecture

- **Framework:** Next.js 15 (App Router mode).
- **TypeScript:** Fully typed component files and data interfaces.
- **Styles:** Tailwind CSS alongside inline object-based overrides to define card properties.

Good luck with your interviews, have fun and keep building!
