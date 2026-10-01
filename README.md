# <p align="center"><img src="public/brand/healthpod-logo.jpeg" alt="HealthPod BD Logo" width="220" /><br><strong>HealthPod BD</strong></p>

<p align="center">
  <strong>Smart, self-service health check booths for Bangladesh — powered by a Google Gemini AI Legal Advisor.</strong><br>
  <em>Next Venture · Business Law (LAW 4151 / 2106) · United International University</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2-61dafb?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Google%20Gemini-3.5%20Flash-4285F4?logo=google" alt="Gemini 3.5 Flash" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?logo=tailwind-css" alt="Tailwind CSS 4.1" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" alt="Vercel" />
</p>

---

## 🌟 Overview

**HealthPod BD** is an innovative business concept and companion platform created for the **UIU Business Law Competition (Summer 2026)**. 

The project envisions self-service health monitoring booths placed in busy Bangladeshi public transit hubs, shopping centers, and universities (for rapid blood pressure, blood glucose, and SpO₂ readings). Accompanying the business story is a **live AI Legal Advisor** designed for competition judges to test how five fundamental Bangladeshi commercial laws govern the company's formation, contracts, equipment crisis, and banking disputes.

---

## 📸 Visual Showcase

### 🤖 Live AI Legal Advisor in Action
The chatbot delivers structured, educationally grounded legal analyses under Bangladesh law, complete with official statutory citations:

<p align="center">
  <img src="public/screenshots/chatbot-preview.png" alt="HealthPod BD Chatbot Desktop Preview" width="850" />
</p>

### 📱 Responsive Mobile Experience & 🏁 Scannable QR Code
Designed mobile-first so competition judges and booth visitors can scan the physical X-banner QR code and immediately test the live advisor directly on their smartphones:

<table align="center" border="0">
  <tr>
    <td align="center" valign="middle">
      <img src="public/screenshots/chatbot-mobile.png" alt="HealthPod BD Chatbot Mobile Preview" width="310" /><br><br>
      <strong>📱 Mobile Advisor Interface</strong>
    </td>
    <td align="center" valign="middle" width="50">&nbsp;</td>
    <td align="center" valign="middle">
      <img src="public/brand/HealthPodBD_Scannable_QR.png" alt="HealthPod BD Scannable QR Code" width="280" /><br><br>
      <strong>📲 Scan with your Phone Camera</strong><br>
      <em>Official Competition X-Banner QR Code</em>
    </td>
  </tr>
</table>

---

## ⚖️ One Story, Five Laws: The Legal Framework

The core competition challenge integrates five distinct Bangladeshi business statutes into a single, cohesive timeline:

```mermaid
flowchart TD
    subgraph Act1["ACT 01: THE RISE"]
        A["Companies Act 1994<br><b>§§ 5, 24</b><br>HealthPod plans incorporation as Private Ltd. Company"] --> B["Partnership Act 1932<br><b>§§ 4, 18-19, 25</b><br>Equipment purchased from fictional Supplier Partnership"]
        B --> C["Contract Act 1872<br><b>§§ 10, 37</b><br>Formal supply agreement signed by both partners"]
    end

    subgraph Act2["ACT 02: THE CRISIS"]
        C --> D["Sale of Goods Act 1930<br><b>§§ 12-16, 41-42</b><br>8 of 20 kits fail agreed specifications upon inspection"]
        D --> E["Settlement Negotiation<br>Supplier signs refund agreement for BDT 200,000"]
        E --> F["Negotiable Instruments Act 1881<br><b>§§ 138, 140, 141</b><br>Supplier's refund cheque dishonoured for insufficient funds"]
    end

    subgraph Resolution["THE RESOLUTION"]
        F --> G["Legal Firefight Defense<br>Distinguish civil contract remedies from cheque penal proceedings"]
    end

    style Act1 fill:#f0f7fb,stroke:#075b96,stroke-width:2px
    style Act2 fill:#fdf4f2,stroke:#d9534f,stroke-width:2px
    style Resolution fill:#eef7f0,stroke:#279d3a,stroke-width:2px
```

---

## 🏗️ System Architecture

The chatbot is built with zero-downtime reliability in mind, gracefully operating with or without external database dependencies:

```mermaid
sequenceDiagram
    autonumber
    actor Judge as User / Judge
    participant UI as Advisor UI (React 19)
    participant API as /api/chat (Next.js Node.js)
    participant Limiter as In-Memory / MongoDB Limiter
    participant KB as Legal Knowledge Base
    participant Gemini as Google Gemini AI

    Judge->>UI: Submits question (English, বাংলা, or Banglish)
    UI->>API: POST /api/chat { message, language, history }
    API->>Limiter: Check rate limit (Sliding window bucket)
    Limiter-->>API: Allowed (or 429 Retry-After)
    API->>KB: Load curated statutory knowledge
    KB-->>API: Curated legal articles & Bangladesh statutes
    API->>Gemini: generateContent(gemini-3.5-flash-lite + System Prompt)
    Gemini-->>API: Structured JSON { answer, sourceIds }
    API->>API: Map sourceIds to verified bdlaws.minlaw.gov.bd links
    API-->>UI: Return 200 { answer, sources }
    UI-->>Judge: Render response bubble with interactive legal citations
```

---

## 🚀 Key Features

- **🌐 Trilingual Support:** Accepts and responds fluently in **English**, **বাংলা script**, or **Banglish** (`Auto`, `en`, `bn`, `banglish`).
- **🛡️ Statutory Citation Verification:** Strictly grounds legal claims in curated provisions from the official [Bangladesh Laws](https://bdlaws.minlaw.gov.bd) repository. If the model references unsupported citations, the response safely falls back.
- **⚡ Resilient Model Architecture:** Configured with Google Gemini 3.5 series (`gemini-3.5-flash-lite`), featuring automatic model fallback to avoid demand-spike interruptions.
- **🔒 Privacy First & Educational Restraint:** Strictly educational—does not diagnose medical readings or guarantee court outcomes. Messages stay in session memory.
- **📱 Fluid & Adaptive Design:** Custom health-tech theme built with Tailwind CSS, supporting desktop, tablet, and mobile viewports with fluid typography.

---

## 🛠️ Getting Started Locally

### Prerequisites
- **Node.js**: `v22.x` (or later)
- **npm**: `v10.x` (or later)
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repository
```bash
git clone https://github.com/SadatSKD/HealthPod-BD.git
cd HealthPod-BD
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```
```
*(See `.env.example` for additional optional configurations including MongoDB and YouTube embed links).*

### 4. Run the development server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## ☁️ Deployment to Vercel

1. Import the repository `SadatSKD/HealthPod-BD` on [Vercel](https://vercel.com).
2. Set the framework to **Next.js**.
3. Add the following Environment Variables in the Vercel dashboard:
   - `GEMINI_API_KEY`: `Your Gemini API Key`
   - `GEMINI_MODEL`: `gemini-3.5-flash-lite`
   - `TRUST_PROXY_HEADERS`: `true`
   - `RATE_LIMIT_SECRET`: `Any secure random string`
4. Click **Deploy**.

---

## 👥 The Next Venture Team

<table align="center">
  <tr>
    <td align="center" width="25%">
      <img src="public/team/shifa-akter-mim.jpg" width="120" style="border-radius:50%" alt="Shifa Akter Mim"/><br>
      <strong>Shifa Akter Mim</strong><br>
      <code>111221166</code>
    </td>
    <td align="center" width="25%">
      <img src="public/team/asif-hossain.jpg" width="120" style="border-radius:50%" alt="Asif Hossain"/><br>
      <strong>Asif Hossain</strong><br>
      <code>111221086</code>
    </td>
    <td align="center" width="25%">
      <img src="public/team/tanzir-ahsan-shakib.jpg" width="120" style="border-radius:50%" alt="Tanzir Ahsan Shakib"/><br>
      <strong>Tanzir Ahsan Shakib</strong><br>
      <code>1112230189</code>
    </td>
    <td align="center" width="25%">
      <img src="public/team/md-nahidul-islam.jpg" width="120" style="border-radius:50%" alt="Md. Nahidul Islam"/><br>
      <strong>Md. Nahidul Islam</strong><br>
      <code>1112230203</code>
    </td>
  </tr>
</table>

---

## 📜 Academic Attribution

- **Course:** Business Law (LAW 4151 / 2106)
- **Section:** B
- **Institution:** United International University (UIU)
- **Term:** Summer 2026
