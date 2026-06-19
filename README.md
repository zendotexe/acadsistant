# Acadsistant — Academic Planner & Timetable Web Workspace

A high-fidelity, high-performance, and responsive academic planner, automatic timetable, and student productivity workspace built using **TypeScript**, **React**, and **Vite** with **Tailwind CSS**. Optimized for speed, offline-first local persistence, and seamless web deployment.

Live Production URL: **[https://acadsistant.vercel.app/](https://acadsistant.vercel.app/)**

---

## 🎨 Crafted Features & Enhancements

- **Durable Local Backup Hub**: Robust local JSON import/export routines integrated directly into layout settings to backup and restore classes, tasks, and agendas flawlessly without database requirements or accounts.
- **Dynamic Time Marker Grid**: Real-time calendar visual timeline tracking the current hour across active day columns for maximum status-tracking precision.
- **Aesthetic Custom Modals**: Custom-styled and animated study/break phase modal dialogues replacing default web alerts.
- **Durable Web Mode**: Highly performant React structure fully ready for static file hosting platforms.

---

## ⚡ Vercel Deployment & Configuration

Acadsistant is designed to compile cleanly and deploy to **Vercel** with zero custom configuration:

1. **Framework Preset**: Vercel automatically detects **Vite**.
2. **Build Command**: `npm run build` (runs `vite build` to generate optimized production assets).
3. **Output Directory**: `dist` (Vercel automatically serves the pre-packaged build from this folder).
4. **Deploying Updates**: Simply push commits to your linked GitHub repository, and Vercel will trigger a production redeploy instantly.

---

## 🚀 Local Installation & Run

To run and test the codebase locally on your machine:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the local development server**:
   ```bash
   npm run dev
   ```
3. **Open the web application**: Navigating to `http://localhost:3000` inside your web browser of choice allows you to test the applet immediately with full local-storage save persistence.

---

## 📁 File Structure Overview

- `/src` - The cohesive modular frontend application codebase.
  - `/src/components` - Elegant layout views for Calendar, Dashboard, Focus Timer, Reminders, Alarms, and Tasks.
- `package.json` - Web NPM dependencies and production bundler configurations.
- `vite.config.ts` - Lightning-fast bundling and developer server routing.
- `README.md` - (This document) Step-by-step local testing and deployment instructions.

