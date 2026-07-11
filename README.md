# Interactive Glassmorphic Docs App

[![Live Demo](https://img.shields.io/badge/demo-live-emerald.svg)](https://docs-ten-pi.vercel.app/)

**Live Demo**: [docs-ten-pi.vercel.app](https://docs-ten-pi.vercel.app/)

A premium, interactive drag-and-drop document card manager built with React, Vite, Tailwind CSS, and Framer Motion. 

This application provides a playful, high-fidelity user experience featuring fully-persisted CRUD operations, tag customization, search, sorting, markdown formatting, backup export/import, and smooth animations.

---

## ✨ Features

- **📂 Free-Form Drag & Drop**: Drag document cards anywhere across your screen. Boundary boxes are handled globally to prevent clipping at screen borders.
- **🛠️ CRUD Operations**: Create new cards, edit descriptions, toggle tag displays, customize tag labels, and choose status icons.
- **❌ In-Card Deletion**: Delete documents instantly by clicking the cross badge in the card's footer. Cards animate out using Framer Motion exits.
- **🎨 5 Presets of Tag Colors**: Style tag bars and top-lit card spotlight highlights in 5 premium HSL colors: Green (Emerald), Blue (Sky), Red (Rose), Yellow (Amber), and Purple (Violet).
- **🔍 Real-Time Search**: Search for keywords inside document descriptions in real time.
- **🏷️ Tag Color Filtering**: Filter documents to show only cards matching specific tag colors.
- **🔽 Custom Sort Dropdown**: Sort cards by **Newest First**, **Oldest First**, **A-Z**, or **Z-A**. Features a custom-designed glassmorphic select list with springs and select indicator dots.
- **📥 Backup & Restore (JSON)**:
  - **Export**: Download a backup JSON file containing all card states.
  - **Import**: Restore backup files instantly via an upload picker.
- **✍️ Inline Markdown Support**: Format card descriptions using basic markdown shortcuts:
  - `**bold text**` renders bold text.
  - `*italic text*` renders italicized text.
  - Lines starting with `- ` render as bullet lists.
- **🔔 Animated Toast Alerts**: Sleek spring-loaded notifications slide in at the top-right corner to report document creation, updates, deletions, and backup actions.
- **💾 LocalStorage Persistence**: Card states, additions, edits, and deletions persist across page reloads.

---

## 🛠️ Tech Stack

- **Core**: React 19.x, JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: React Icons (Lucide & FontAwesome presets)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (version 18+ recommended) installed.

### Installation

1. Clone or download the repository.
2. Open terminal in the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

To compile a highly optimized production bundle:
```bash
npm run build
```
This builds static assets inside the `dist` folder.
