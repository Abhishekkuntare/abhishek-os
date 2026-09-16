# 🖥️ Abhishek OS

### A browser-based developer workstation, interactive portfolio & personal operating system

**Abhishek OS** is an interactive, Windows/macOS-inspired web operating system built to transform a traditional developer portfolio into a complete desktop experience.

Instead of navigating through a conventional portfolio website, visitors can interact with a virtual desktop containing applications, windows, a taskbar, Start Menu, file explorer, developer tools, games, AI-powered features, media applications, and portfolio content.

> **Live Demo:** https://abhishek-os-seven.vercel.app/
> **GitHub:** https://github.com/Abhishekkuntare/abhishek-os

---

## ✨ Overview

Abhishek OS is designed as a **developer workstation inside the browser**.

The project combines:

* 💻 Interactive desktop environment
* 🪟 Window management system
* 📁 File Explorer / virtual file system
* 🚀 Start Menu and application launcher
* 🔎 Spotlight / universal search
* 🌐 Abhishek Browser
* 🤖 AI-powered developer assistant
* 🧑‍💻 Developer tools
* 📺 YouTube-style media application
* 🎮 Abhishek Store with installable games
* 📝 Notes, Writer and productivity applications
* 📊 Portfolio and developer profile
* ⚙️ Settings and personalization
* 🔔 Notifications
* 🖥️ Terminal / code execution experience
* 🔐 Authentication and admin capabilities
* ☁️ Supabase-powered data layer
* 🚀 Vercel deployment

The goal is to demonstrate not only frontend development skills, but also **system design, application architecture, API integration, state management, backend development, UX engineering, authentication, persistence and deployment**.

---

# 🚀 Live Application

### 🌐 Abhishek OS

**https://abhishek-os-seven.vercel.app/**

The application runs directly in the browser and is designed to behave like a desktop operating system.

Users can open applications, move and resize windows, interact with the taskbar, search applications, customize the desktop and explore the developer's portfolio through an operating-system interface.

---

# 🎯 Project Goals

The project was created with several goals:

### 1. Build more than a traditional portfolio

Instead of:

```text
Home
About
Skills
Projects
Experience
Contact
```

Abhishek OS presents the same information through an interactive desktop environment.

### 2. Demonstrate real-world engineering

The project demonstrates:

* Component architecture
* State management
* API integration
* Backend development
* Database integration
* Authentication
* Responsive UI
* Error handling
* Persistent application state
* Lazy loading
* Application lifecycle management
* Deployment

### 3. Create an extensible operating-system architecture

Applications are designed to behave like independent modules.

This makes it possible to add future applications without rebuilding the entire desktop.

---

# 🖥️ Core Experience

## Desktop Environment

The desktop provides the main operating-system workspace.

Features include:

* Desktop icons
* Draggable applications
* Application launching
* Context menu
* Desktop sorting
* Icon arrangement
* Wallpaper
* Window management
* Notifications
* Taskbar
* Start Menu
* System controls
* Application shortcuts

Desktop preferences are persisted so the environment can remember user configuration.

---

# 🪟 Window Management

Applications run inside managed windows rather than navigating away from the desktop.

Supported interactions include:

* Open
* Close
* Minimize
* Maximize
* Restore
* Move
* Resize
* Focus
* Bring to front
* Multiple simultaneous windows
* Window layering

The architecture allows multiple applications to run independently inside the same desktop session.

---

# 🚀 Start Menu

The Start Menu acts as the central application launcher.

It provides access to:

* Installed applications
* System applications
* Games
* Developer tools
* Portfolio applications
* Settings
* Search

Applications installed through the Abhishek Store can automatically become available through the launcher.

---

# 🔎 Spotlight / Universal Search

Abhishek OS includes a universal search experience designed to search across the operating system.

Search can be used for:

* Applications
* Games
* Portfolio projects
* Files
* Settings
* Commands
* Developer tools

The architecture is designed so additional searchable entities can be added later.

---

# 📁 File Explorer

The virtual File Explorer provides a familiar filesystem-like experience inside the browser.

Planned / supported concepts include:

* Folders
* Files
* Navigation
* File metadata
* Virtual filesystem
* Recent files
* Quick access
* Search
* Application integration

The filesystem is intentionally virtualized for browser safety rather than pretending the website has unrestricted access to the user's operating-system filesystem.

---

# 🌐 Abhishek Browser

Abhishek OS includes a browser-inspired application designed specifically for the workstation.

Features include:

* Tabs
* Address/search bar
* Back / Forward
* Reload
* Search
* Bookmarks
* History
* Downloads interface
* Private browsing session
* Find in page
* Zoom
* Fullscreen
* External navigation

The application uses official web APIs and safe embedding approaches where supported.

Websites that prevent iframe embedding are handled through an external-navigation fallback rather than attempting to bypass their security policies.

---

# 🤖 AI Developer Assistant

Abhishek OS includes AI capabilities designed around development and portfolio interaction.

Potential use cases include:

* Ask questions about Abhishek's portfolio
* Explain projects
* Explain technologies
* Developer assistance
* Code generation
* Code explanation
* Debugging assistance
* Natural-language system commands
* Portfolio Q&A
* AI-powered search

The backend is designed to keep provider API keys server-side.

---

# 🧑‍💻 Developer Workstation

Abhishek OS is designed to feel like a developer workstation rather than a static portfolio.

Developer-oriented applications include concepts such as:

### Terminal

A simulated terminal interface for interacting with the workstation.

### Code Editor

A VS Code-inspired development environment.

### API Tester

A developer tool for testing APIs and inspecting responses.

### Code Execution

The backend supports controlled execution workflows for supported programming languages.

The execution layer is isolated from the browser application.

---

# 📺 Media Center

Abhishek OS includes media-focused applications.

The YouTube-style application supports architecture for:

* Search
* Trending videos
* Video metadata
* Categories
* Pagination
* Video playback
* Channel information
* Embedded playback

The YouTube Data API is accessed through the backend so the API key is not exposed to browser JavaScript.

---

# 🎮 Abhishek Store

The **Abhishek Store** is the central marketplace for applications and games.

Games are **not installed on the desktop by default**.

Instead:

```text
Abhishek Store
       ↓
     Install
       ↓
 Installation Manager
       ↓
 Application Registry
       ↓
 Desktop Shortcut
       ↓
 Start Menu
       ↓
 Games Center
       ↓
 Launch Game
```

This makes the operating system behave more like a real desktop platform.

---

# 🎮 Games

The planned game library contains:

| #  | Game           | Genre    |
| -- | -------------- | -------- |
| 01 | Neon Snake     | Arcade   |
| 02 | 2048           | Puzzle   |
| 03 | Minesweeper    | Strategy |
| 04 | Block Puzzle   | Puzzle   |
| 05 | Memory Match   | Memory   |
| 06 | Flappy Pixel   | Arcade   |
| 07 | Breakout       | Arcade   |
| 08 | Tic-Tac-Toe    | Board    |
| 09 | Chess          | Strategy |
| 10 | Word Challenge | Word     |

The games are designed as independent application modules.

---

# 📦 Application Installation System

Installing a game or application should register it with the operating system.

For example:

```text
Store
  ↓
Install
  ↓
Download
  ↓
Verify
  ↓
Install
  ↓
Register App
  ↓
Create Shortcut
  ↓
Installed
```

After installation, the application can appear in:

* Desktop
* Start Menu
* Spotlight
* Games Center
* Application Registry

Dock pinning remains a separate action rather than automatically pinning every installed application.

---

# 🗑️ Uninstall System

Applications can be uninstalled from the operating system.

Uninstalling removes the application's installed state and associated registrations.

The system distinguishes between:

### Remove from Desktop

Removes only the desktop shortcut.

### Uninstall

Removes the application installation and its operating-system registrations.

This separation mirrors the behavior of modern desktop operating systems.

---

# 💾 Game Data

Installation state and game data are treated separately.

Game data can include:

* High scores
* Achievements
* Statistics
* Game settings
* Match history
* Progress
* Preferences

This allows users to uninstall and optionally preserve their data before reinstalling the application.

---

# 🏆 Achievements & Statistics

The game architecture is designed to support:

* Achievements
* High scores
* Win/loss records
* Streaks
* Personal bests
* Match history
* Progress tracking
* Game-specific statistics

---

# ⚙️ Settings

The operating system includes personalization and system settings.

Examples include:

* Wallpaper
* Desktop layout
* Icon visibility
* Icon arrangement
* Appearance
* System preferences
* Application settings
* Notifications
* Audio
* Accessibility

User preferences can be persisted locally where appropriate.

---

# 🔔 Notification System

The OS includes a centralized notification experience.

Notifications can be generated by:

* Applications
* Store installations
* Games
* System events
* AI operations
* Errors
* Updates

Example:

```text
Abhishek Store

Game Installed

Tic-Tac-Toe has been successfully installed.
```

---

# 🔐 Authentication & Admin

The project is designed to support protected administrative functionality.

Admin capabilities can include:

* Project management
* Portfolio content management
* Certifications
* Experience
* Profile information
* Application configuration
* Content CRUD operations

Protected functionality should be enforced using authentication and server/database authorization rather than frontend-only checks.

---

# 🗄️ Supabase Integration

Supabase can be used as the application's persistent backend layer.

Potential data domains include:

* Projects
* Certifications
* Contact messages
* User/application state
* Administrative content

The architecture supports database-backed portfolio management instead of hardcoding every portfolio entry inside React components.

---

# 🔒 Security

Security is an important part of the project architecture.

### Environment variables

Secrets should never be hardcoded into frontend source code.

Example:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

YOUTUBE_API_KEY=
GEMINI_API_KEY=
```

Browser-exposed variables should contain only values intended for client-side use.

Server-only secrets such as:

```text
GEMINI_API_KEY
YOUTUBE_API_KEY
```

must remain on the server.

### Additional security principles

* Protected admin routes
* Database authorization
* Input validation
* API validation
* Error boundaries
* Safe API proxying
* No arbitrary code execution from untrusted sources
* No attempts to bypass browser security policies

---

# 🏗️ Architecture

A simplified architecture looks like this:

```text
                     ┌─────────────────────┐
                     │     Abhishek OS     │
                     │    Browser Client   │
                     └──────────┬──────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
        Desktop System      Applications       Games
              │                 │                 │
              ▼                 ▼                 ▼
       Window Manager      App Registry      Game Registry
              │                 │                 │
              └─────────────────┼─────────────────┘
                                │
                                ▼
                         Application Services
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
             Backend        Supabase        External APIs
                │               │               │
        ┌───────┼───────┐       │       ┌───────┴────────┐
        │       │       │       │       │                │
       AI    YouTube   Execute  │    YouTube          Gemini
                                │
                                ▼
                            PostgreSQL
```

---

# 🧩 Application Architecture

Applications are designed to be modular.

Conceptually:

```text
src/
├── apps/
│   ├── Browser/
│   ├── FileExplorer/
│   ├── Settings/
│   ├── Store/
│   ├── GamesCenter/
│   ├── Terminal/
│   ├── YouTube/
│   └── ...
│
├── games/
│   ├── snake/
│   ├── 2048/
│   ├── minesweeper/
│   ├── block-puzzle/
│   ├── memory-match/
│   ├── flappy-pixel/
│   ├── breakout/
│   ├── tic-tac-toe/
│   ├── chess/
│   └── word-challenge/
│
├── components/
├── contexts/
├── hooks/
├── services/
├── types/
└── ...
```

The exact directory structure may evolve as the project grows.

---

# 🧠 Core Services

The operating system can centralize important functionality through services such as:

```text
App Registry
Install Manager
Game Data Manager
Achievement Manager
Audio Manager
Notification Manager
Window Manager
Search Manager
Virtual File System
```

This avoids duplicating installation, registration and persistence logic across individual applications.

---

# ⚡ Performance

Performance is treated as a first-class requirement.

Techniques include:

* Lazy-loaded applications
* Dynamic imports
* Component-level code splitting
* Minimal initial JavaScript
* Efficient state updates
* Memoization where useful
* Virtualized lists where required
* Image optimization
* API caching
* Request deduplication
* Error isolation

Games should not load their full engines simply because they are listed in the Store.

The game engine should load when the game is actually opened.

---

# 📱 Responsive Design

Although Abhishek OS is primarily designed for desktop browsers, applications should degrade gracefully on smaller screens.

Responsive behavior includes:

* Mobile layouts
* Tablet layouts
* Touch interactions
* Keyboard controls
* Responsive windows
* Adaptive navigation
* Fullscreen application modes

---

# ♿ Accessibility

The project aims to provide an accessible application experience through:

* Keyboard navigation
* Focus management
* Semantic controls
* Accessible labels
* Visible focus states
* Reduced-motion support
* Screen-reader-friendly interactions
* Sufficient contrast
* Touch-friendly controls

---

# 🧪 Error Handling

Individual applications should not be able to crash the entire operating system.

The architecture uses isolated error boundaries and defensive application loading.

Conceptually:

```text
Abhishek OS
│
├── Browser      ✅
├── File Explorer ✅
├── Store         ❌ Error
├── Terminal      ✅
└── Settings      ✅
```

If one application fails, the rest of the desktop should remain usable.

---

# 🌐 Backend

The repository contains a backend server alongside the Vite frontend.

The backend is responsible for operations that should not be performed directly in browser code, including:

* AI API calls
* YouTube API access
* Code execution workflows
* Server-side validation
* Protected API operations

The repository currently contains `server.ts` and a `server/` directory for backend functionality.

---

# 📁 Repository Structure

The repository currently contains major areas such as:

```text
abhishek-os/
│
├── public/
│
├── server/
│   └── routes/
│
├── src/
│
├── .gitignore
├── README.md
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
├── bun.lock
├── server.ts
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── render.yaml
```

The public GitHub repository currently has separate `src`, `server`, and `public` areas plus Vite/TypeScript and deployment configuration.

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide Icons
* Modern browser APIs

## Backend

* Node.js
* Express
* TypeScript

## Database / Backend Services

* Supabase
* PostgreSQL

## AI

* Google Gemini API

## Video / Media

* YouTube Data API
* YouTube embedded playback

## Deployment

* Vercel
* Render-compatible backend configuration

---

# 🚀 Getting Started

## Prerequisites

Install:

* Node.js 18+
* npm

Optional:

* Bun

---

## 1. Clone the repository

```bash
git clone https://github.com/Abhishekkuntare/abhishek-os.git
cd abhishek-os
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create an environment file appropriate for your local setup.

Example:

```env
SERVER_PORT=8787

GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

CLIENT_ORIGIN=http://localhost:3000
```

### Important

Never commit real API keys or secrets to GitHub.

Use:

```text
.env
.env.local
```

and make sure they are included in `.gitignore`.

---

# ▶️ Run the Application

Start the frontend development server:

```bash
npm run dev
```

If the project uses a separate backend process, start the backend according to the server configuration.

A typical development setup is:

```text
Frontend
http://localhost:3000

Backend
http://localhost:8787
```

The frontend can communicate with the backend through `/api/*` routes.

---

# 🔌 API Architecture

Example API structure:

```text
/api/health

/api/ai

/api/execute

/api/youtube/search
/api/youtube/trending
/api/youtube/video
```

API keys remain server-side whenever the external provider requires a secret credential.

---

# 📺 YouTube API

The YouTube application can communicate through backend routes such as:

```text
GET /api/youtube/search
GET /api/youtube/trending
GET /api/youtube/video
```

The frontend should not directly expose:

```text
YOUTUBE_API_KEY
```

The server acts as the API boundary.

---

# 🤖 AI API

AI requests follow the general pattern:

```text
Browser
   ↓
/api/ai
   ↓
Backend
   ↓
Gemini API
   ↓
Backend
   ↓
Browser
```

This prevents provider secrets from being embedded into the client bundle.

---

# 🗃️ Development vs Production

The project distinguishes between local development and production deployment.

### Development

```text
localhost:3000
      ↓
localhost:8787
      ↓
External APIs / Supabase
```

### Production

```text
Vercel
  ↓
Abhishek OS
  ↓
Production APIs
  ↓
Supabase / AI / YouTube
```

---

# ☁️ Deployment

The current project is deployed publicly at:

**https://abhishek-os-seven.vercel.app/**

The GitHub repository also contains deployment configuration including `vercel.json` and `render.yaml`.

Before production deployment, configure all required environment variables in the deployment platform.

---

# 🧑‍💻 Development Philosophy

Abhishek OS follows several principles:

### Modular

Applications should remain independent and replaceable.

### Persistent

User preferences should survive reloads where appropriate.

### Safe

Secrets stay server-side and browser security boundaries are respected.

### Extensible

New applications should be installable without rewriting the OS.

### Performant

Heavy features should be lazy-loaded.

### Accessible

Keyboard, touch and accessibility support should be considered from the beginning.

### Resilient

A failed application should not bring down the entire desktop.

---

# 🗺️ Roadmap

## Desktop

* [x] Desktop environment
* [x] Application windows
* [x] Taskbar
* [x] Start Menu
* [x] Context menu
* [x] Desktop personalization
* [ ] Multiple virtual desktops
* [ ] Mission Control
* [ ] Advanced window snapping

## Applications

* [x] Portfolio applications
* [x] Settings
* [x] File Explorer
* [x] Browser
* [x] Store architecture
* [x] Games Center
* [ ] Advanced Terminal
* [ ] Activity Monitor
* [ ] Clipboard Manager
* [ ] Preview
* [ ] Notes
* [ ] Writer
* [ ] Spreadsheet
* [ ] PDF Viewer

## AI

* [x] AI backend integration
* [ ] Portfolio RAG
* [ ] AI system assistant
* [ ] Voice commands
* [ ] Natural-language application control
* [ ] AI developer workspace

## Store

* [x] Store concept
* [x] Application registry architecture
* [x] Installation lifecycle
* [ ] Full application marketplace
* [ ] Application updates
* [ ] Version management
* [ ] Application uninstall manager

## Games

* [ ] Neon Snake
* [ ] 2048
* [ ] Minesweeper
* [ ] Block Puzzle
* [ ] Memory Match
* [ ] Flappy Pixel
* [ ] Breakout
* [ ] Tic-Tac-Toe
* [ ] Chess
* [ ] Word Challenge

## Platform

* [ ] PWA installation
* [ ] Offline mode
* [ ] Service worker caching
* [ ] Feature flags
* [ ] Analytics
* [ ] Error monitoring
* [ ] Automated testing
* [ ] CI/CD
* [ ] Performance dashboard
* [ ] Security dashboard

---

# 🎨 Design Direction

The visual language combines ideas from modern desktop operating systems with a developer-focused workstation.

The design emphasizes:

* Glassmorphism
* Depth
* Blur
* Smooth transitions
* Micro-interactions
* Responsive layouts
* Keyboard-first workflows
* Clean typography
* Modern iconography
* Layered windows
* Contextual menus
* System-level animations

The goal is to make the interface feel like a **real operating environment**, not simply a webpage styled like a desktop.

---

# 🧩 Why This Project?

Traditional portfolios mainly demonstrate:

```text
HTML
CSS
JavaScript
React
Projects
```

Abhishek OS attempts to demonstrate a broader engineering skill set:

```text
Frontend Engineering
        +
UI/UX Engineering
        +
Backend Engineering
        +
API Design
        +
Authentication
        +
Database Architecture
        +
State Management
        +
Performance
        +
Security
        +
AI Integration
        +
Application Architecture
        +
Deployment
```

It is intended to serve as both a portfolio and an ongoing engineering experiment.

---

# 👨‍💻 About the Developer

**Abhishek Kuntare**

Frontend-focused Full Stack Developer working with:

* React.js
* Next.js
* TypeScript
* JavaScript
* Node.js
* Express.js
* REST APIs
* Supabase
* AI APIs
* Modern web application architecture

Abhishek OS is one of the projects used to demonstrate these skills through an interactive application rather than a conventional portfolio page.

---

# 🔗 Links

### 🌐 Live Application

https://abhishek-os-seven.vercel.app/

### 💻 GitHub Repository

https://github.com/Abhishekkuntare/abhishek-os

---

# 🤝 Contributing

Contributions, suggestions and ideas are welcome.

For significant changes:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Make your changes
4. Test the application
5. Commit your changes

```bash
git commit -m "feat: add amazing feature"
```

6. Push the branch

```bash
git push origin feature/amazing-feature
```

7. Open a Pull Request

---

# 📄 License

Add your preferred open-source license before publishing the project as an open-source contribution project.

For example:

```text
MIT License
```

---

# ⭐ Support

If you find Abhishek OS interesting, consider starring the repository and sharing feedback.

The project is continuously evolving into a larger browser-based developer workstation.

---

<div align="center">

### 🖥️ Abhishek OS

**Your browser. Your desktop. Your portfolio.**

Built with ❤️ by **Abhishek Kuntare**

[Live Demo](https://abhishek-os-seven.vercel.app/) • [GitHub](https://github.com/Abhishekkuntare/abhishek-os)

</div>
