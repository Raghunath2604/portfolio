<div align="center">

# 🌐 Raghunathareddy GR — Cinematic Engineering Portfolio

**AI/ML Engineer | MLOps Specialist | Cloud Infrastructure**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-raghunath--portfolio--beta.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://raghunath-portfolio-beta.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.184.0-049EF4?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.0-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[**Explore Live Demo »**](https://raghunath-portfolio-beta.vercel.app) · [**Report Issue**](https://github.com/Raghunath2604/portfolio/issues) · [**Connect on LinkedIn**](https://www.linkedin.com/in/raghunathareddy-gr-30a964341)

---

</div>

## 📌 Overview

This repository houses the source code for the personal cinematic engineering portfolio of **Raghunathareddy GR**. Designed to showcase production-grade machine learning systems, cloud architectures, and MLOps pipelines, the website combines high-performance web engineering with interactive 3D WebGL visuals, bespoke GSAP micro-animations, and an integrated AI chatbot assistant.

### 🚀 Highlights

- **🎬 Cinematic Experience**: Smooth, deterministic GSAP timeline scroll transitions, custom cursor physics, and animated screen pre-loaders.
- **✨ 3D Visual Computing**: Interactive Three.js particle dynamics, camera parallax, and custom GLSL WebGL shaders preserving video aspect ratios across viewports.
- **🤖 Embedded AI Assistant ("Micky")**: A context-grounded conversational agent powered by Google Gemini (`gemini-flash-latest`), providing instant answers about projects, technical skills, and publications without hallucinations.
- **⚡ Next.js 16 & React 19 Architecture**: Built on Next.js Turbopack with App Router, full Server-Side Rendering (SSR) / Static Site Generation (SSG), and zero cascading render warnings.
- **🎨 Modular Styling**: CSS Modules paired with global design token variables and Tailwind CSS for maintainability and layout isolation.
- **🔍 SEO & Social Ready**: Dynamic OpenGraph image generation via `@vercel/og`, structured JSON-LD Person schema, automated `sitemap.xml`, and `robots.txt`.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16.2.6](https://nextjs.org/) (Turbopack) | App Router, SSR, Static Site Generation, Edge Routes |
| **UI Library** | [React 19.2.4](https://react.dev/) | React Server Components, `useSyncExternalStore` hooks |
| **3D & Graphics** | [Three.js](https://threejs.org/) & WebGL (GLSL) | Interactive particle layers, orthographic canvas, video shaders |
| **Motion & Physics**| [GSAP 3.15](https://greensock.com/gsap/) (ScrollTrigger) | Multi-stage section pinning, staggered entrance choreography |
| **Artificial Intelligence** | [Google Gemini API](https://ai.google.dev/) | Conversational assistant with portfolio profile context grounding |
| **Styling** | Vanilla CSS Modules + [Tailwind CSS 4](https://tailwindcss.com/) | Scoped component styling with zero styling leakage |
| **Deployment** | [Vercel](https://vercel.com/) | Edge network, automatic CI/CD deployment, serverless functions |

---

## 📁 Repository Structure

```plaintext
raghunath-portfolio/
├── app/
│   ├── api/chat/
│   │   └── route.js           # Server-side Gemini API conversational endpoint
│   ├── opengraph-image.jsx    # Dynamic Edge OpenGraph card generator
│   ├── globals.css            # Design token system & global CSS resets
│   ├── layout.js              # HTML root layout & Schema.org JSON-LD
│   ├── page.js                # Core scroll controller & section orchestrator
│   ├── robots.js              # Search engine crawler configuration
│   └── sitemap.js             # Automated sitemap generation
├── components/
│   ├── sections/              # Page sections (VideoIntro, Hero, About, Projects, Experience, Footer)
│   ├── three/                 # Three.js canvas modules (CinematicLayer, HeroBackground, WorkExpParticles)
│   └── ui/                    # UI primitives (MickyChat, Navbar, Cursor, ScreenLoader, Button)
├── data/
│   ├── profile.json           # Single source of truth for bio, skills, projects, and contact info
│   └── content.json           # Interface strings, headers, and badge copies
├── lib/
│   ├── gsap.js                # SSR-safe GSAP and ScrollTrigger initialization
│   ├── siteConfig.js          # Canonical base URL and deployment constants
│   └── utils.js               # Tailwind / clsx class merging utilities
├── public/
│   ├── assets/                # Optimized video footage and compressed project screenshots
│   └── favicons/              # Web app manifests and icons
├── styles/                    # Scoped CSS modules for UI components and sections
├── .env.local.example         # Template for environment configuration
└── next.config.mjs            # Turbopack and React compiler configuration
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: `v18.18+` or `v20+` (tested on Node `v24.11`)
- **npm**: `v9+` or `v10+`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Raghunath2604/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file from the example template:
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Google Gemini API key to enable the portfolio assistant:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Obtain a free key at [Google AI Studio](https://aistudio.google.com/apikey))*

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Quality Checks

Run the following scripts before creating a pull request or deploying:

```bash
# Static analysis and linting (configured with ESLint 9)
npm run lint

# Production build and bundle optimization (Turbopack)
npm run build

# Preview production build locally
npm run start
```

---

## 🚢 Deployment (Vercel)

The portfolio is optimized for zero-config deployment on [Vercel](https://vercel.com/).

### Method 1: Automatic Deployment via Git (Recommended)
1. Push your changes to the `main` branch:
   ```bash
   git push origin main
   ```
2. Vercel automatically detects Next.js, builds the project with Turbopack, and deploys to production.

### Method 2: Manual CLI Deployment
```bash
# Login to Vercel
npx vercel login

# Deploy to production
npx vercel --prod
```

> [!IMPORTANT]
> **Environment Variables on Vercel**:
> Ensure that `GEMINI_API_KEY` is added under **Project Settings → Environment Variables** on your Vercel Dashboard so that the Micky AI chatbot endpoint functions in production.

---

## ⚙️ Content Customization

All personal information is decoupled from the UI code:

- **Update Bio & Skills**: Edit `data/profile.json` to modify skills, work experience, statistics, social profiles, and certifications.
- **Update Projects**: Add or modify entries in `data/profile.json` under `projects`. The UI dynamically adapts image ratios, tech tags, and external links.
- **Change Assets**: Place new photos or videos into `public/assets/` and update references in `data/profile.json` or component files.

---

## 👤 Author

**Raghunathareddy GR**
- **Website**: [raghunath-portfolio-beta.vercel.app](https://raghunath-portfolio-beta.vercel.app)
- **GitHub**: [@Raghunath2604](https://github.com/Raghunath2604)
- **LinkedIn**: [Raghunathareddy GR](https://www.linkedin.com/in/raghunathareddy-gr-30a964341)
- **Email**: [raghunathareddygr94@gmail.com](mailto:raghunathareddygr94@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use it as inspiration for your own portfolio.
