# Academic Planner & Timetable Web Workspace

A high-fidelity, high-performance, and responsive academic planner and timetable workspace built using **TypeScript**, **React**, and **Vite** with **Tailwind CSS**. Optimized for speed, offline-first local persistence, and instant deployment.

---

## 🎨 Crafted Features & Enhancements
- **Durable Local Backup Hub**: Integrated robust local JSON import/export routines directly into the layout settings to backup and restore classes, tasks, and agendas flawlessly without database accounts.
- **Dynamic Time Marker Grid**: Real-time calendar visual timeline tracking the current hour across active day columns for maximum tracking precision.
- **Aesthetic Custom Modals**: Replaced disruptive default browser alert scripts with animated, beautifully styled study/break phase modal dialogues.
- **Durable Web Mode**: Highly performant React structure fully ready for one-click deployment (e.g., on Vercel, Netlify, or standard web).

---

## 🚀 Local Installation & Initialization

Open your computer's terminal, change directory to this project folder, and run:

```bash
# 1. Install all required dependencies
npm install

# 2. Start the developer server
npm run dev
```

Navigate to `http://localhost:3000` inside your web browser of choice to interact with and test the applet immediately!

---

## 📁 File Structure Overview

- `/src` - The cohesive modular frontend application codebase.
  - `/src/components` - Elegant layout views for Calendar, Dashboard, Focus Timer, Reminders, Alarms, and Tasks.
- `package.json` - Simple Web NPM dependencies and production build configurations.
- `vite.config.ts` - Lightning-fast bundling and developer server configurations.
- `README.md` - (This document) Step-by-step local testing instructions.
