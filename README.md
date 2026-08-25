# 🛍️ TRIZENMART — Enterprise E-Commerce Storefront & Management Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![License](https://img.shields.io/badge/License-MIT-emerald.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![React](https://img.shields.io/badge/React-19.0-cyan.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-teal.svg)
![Vercel](https://img.shields.io/badge/Hosting-Vercel_Free-black.svg)
![Database](https://img.shields.io/badge/Database-Zero_Monthly_Cost-green.svg)

> **"Shop smarter. Shop with TRIZENMART"** — A high-performance, mobile-first e-commerce storefront tailored for modern retail, Cash on Delivery (COD), direct 1-click WhatsApp order confirmation, multi-layered security vault, and zero-cost cloud hosting.

---

## 📑 Table of Contents

1. [Project Overview & Key Features](#-project-overview--key-features)
2. [Folder Structure & Clean Architecture](#-folder-structure--clean-architecture)
3. [Security Architecture & Vault Safeguards](#-security-architecture--vault-safeguards)
4. [Step-by-Step Hosting on Vercel (100% Free)](#-step-by-step-hosting-on-vercel-100-free)
5. [Free Database Options & Setup Guide](#-free-database-options--setup-guide)
   - [Option 1: Built-in Zero-Cost Local & JSON Snapshot Engine (Active)](#option-1-built-in-zero-cost-local--json-snapshot-engine-active)
   - [Option 2: Google Firebase Firestore (Spark Free Plan)](#option-2-google-firebase-firestore-spark-free-plan)
   - [Option 3: Supabase PostgreSQL (Free Tier)](#option-3-supabase-postgresql-free-tier)
   - [Option 4: Neon Serverless Postgres](#option-4-neon-serverless-postgres)
6. [Admin Management & Default Credentials](#-admin-management--default-credentials)
7. [WhatsApp Order Notification Engine](#-whatsapp-order-notification-engine)
8. [Local Development & Build Commands](#-local-development--build-commands)
9. [Custom Domain Setup](#-custom-domain-setup)
10. [Environment Variables](#-environment-variables)

---

## 🌟 Project Overview & Key Features

- 📱 **Mobile-First Responsive Layout**: Built with Tailwind CSS v4, smooth tactile motion transitions, responsive drawers, and high-contrast typography.
- 🇵🇰 **Cash on Delivery (COD) & Pakistan Logistics Ready**: Integrated city selection (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Multan, Quetta, Sialkot, Gujranwala), automated shipping fee calculation, and free delivery thresholds.
- 📲 **1-Click WhatsApp Ordering**: Instant formatted order slip generator that forwards full order details, customer addresses, notes, and item breakdowns directly to the store manager's WhatsApp.
- 🔐 **Hardened Admin Security Vault**: PIN-gated admin console with rate-limiting, brute-force lockout timers, auto-locking idle sessions, and emergency master recovery PIN.
- 💾 **100% Free Database Storage**: Local persistence layer with 1-click full JSON database backup exports and instant drag-and-drop restore.
- ⚡ **Zero-Cost Vercel Global Edge Hosting**: Pre-configured `vercel.json` with SPA routing fallbacks and enterprise HTTP security headers.
- 📊 **Comprehensive Analytics & Order Ledger**: Filter orders by status (*Pending, Confirmed, Shipped, Delivered, Cancelled*), track courier tracking IDs, and manage product inventory.

---

## 🏛️ Folder Structure & Clean Architecture

The codebase follows the **Clean Modular Architecture** pattern (inspired by modern solution labs and fintech repositories), keeping business logic, security policies, storage services, UI components, and configuration decoupled and maintainable:

```
TRIZENMART/
├── .env.example                  # Environment variable blueprint
├── .gitignore                    # Git exclusions
├── index.html                    # Single Page Application HTML root
├── metadata.json                 # AI Studio & applet metadata configuration
├── package.json                  # Dependencies, scripts, and build metadata
├── tsconfig.json                 # TypeScript strict compilation rules
├── vercel.json                   # Vercel deployment, SPA rewrites & security headers
├── vite.config.ts                # Vite build bundler configuration
│
├── src/
│   ├── main.tsx                  # React DOM application mount
│   ├── App.tsx                   # Master view router & layout orchestrator
│   ├── index.css                 # Global styling & Tailwind CSS imports
│   │
│   ├── config/                   # Centralized Application Configuration
│   │   ├── constants.ts          # App constants, storage keys & security limits
│   │   └── env.ts                # Safe environment variable accessor
│   │
│   ├── lib/                      # Core Utility Libraries & Helpers
│   │   ├── sanitizer.ts          # XSS sanitization, phone cleansing & input filters
│   │   └── crypto.ts             # SHA-256 checksum validator & secure ID generator
│   │
│   ├── services/                 # Business Logic & Infrastructure Services
│   │   ├── storage.service.ts    # Resilient typed local storage wrapper
│   │   ├── security.service.ts   # Rate-limiting, brute-force & PIN validator
│   │   ├── database.service.ts   # JSON snapshot exporter, validator & DB engine
│   │   └── notification.service.ts # WhatsApp order message formatter & URLs
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   └── useDebounce.ts        # Input debouncing hook for search/filters
│   │
│   ├── context/                  # Global Application State Management
│   │   └── StoreContext.tsx      # Unified state provider (cart, orders, products, vault)
│   │
│   ├── types/                    # Shared TypeScript Definitions & Interfaces
│   │   └── index.ts              # Product, Order, Settings, Security & Log models
│   │
│   ├── data/                     # Seed & Default Data
│   │   └── mockData.ts           # Initial Pakistani market products & categories
│   │
│   ├── utils/                    # Formatting & Presentation Helpers
│   │   └── helpers.ts            # Price currency formatters, date & order IDs
│   │
│   └── components/               # UI Component Hierarchy
│       ├── Header.tsx            # Top navigation bar, search, wishlist & cart triggers
│       ├── Footer.tsx            # Multi-column footer, trust badges & links
│       ├── HeroBanner.tsx        # Promotional sliders & high-impact banners
│       ├── CategoryList.tsx      # Category chip selectors & filter carousels
│       ├── ProductCard.tsx       # Product display card with quick add & wishlist
│       ├── ProductDetailModal.tsx# Fast product overview popup
│       ├── ProductDetailView.tsx # Comprehensive product page with specs & reviews
│       ├── ProductListingView.tsx# Search & category filtered catalog
│       ├── CartDrawer.tsx        # Sliding cart drawer with free delivery progress
│       ├── CheckoutView.tsx      # Multi-step checkout with COD & WhatsApp options
│       ├── OrderSuccessView.tsx  # Post-purchase receipt with 1-click WhatsApp slip
│       ├── OrderTrackingView.tsx # Customer order & courier tracking portal
│       ├── SavedItemsView.tsx    # Wishlist & favorite product organizer
│       ├── CompareModal.tsx      # Side-by-side product feature comparison
│       ├── CompareFloatingBar.tsx# Floating comparison dock
│       ├── WhatsAppFloatingButton.tsx # Direct customer support bubble
│       ├── Toast.tsx             # Interactive floating alerts & feedback
│       ├── Skeleton.tsx          # Loading state place-holders
│       ├── StaticPages.tsx       # About, Contact, Privacy & Refund policies
│       ├── AdminDashboard.tsx    # Master admin dashboard container
│       └── admin/                # Specialized Admin Sub-Modules
│           ├── AdminLoginGate.tsx        # Security vault login screen with PIN
│           ├── AdminSecurityTab.tsx      # Credential rotation & audit logs
│           └── AdminDatabaseHostingTab.tsx# Free DB management & Vercel hub
```

---

## 🔒 Security Architecture & Vault Safeguards

TRIZENMART implements defense-in-depth protection across both the client-side state and edge deployment layers:

```
┌─────────────────────────────────────────────────────────────┐
│                 TRIZENMART SECURITY SHIELD                  │
├──────────────────────────────┬──────────────────────────────┤
│       Admin Vault Gate       │      Edge Security (Vercel)  │
│  - 4-Digit Owner PIN (7860)  │  - X-Frame-Options: SAMEORIGIN│
│  - Emergency Master (9988)   │  - X-Content-Type: nosniff   │
│  - Brute-Force Lockout (60s) │  - X-XSS-Protection: 1; mode=block
│  - Auto Inactivity Timeout   │  - Referrer-Policy: strict   │
├──────────────────────────────┼──────────────────────────────┤
│      Data & Input Shield     │     Real-Time Audit Trail    │
│  - XSS Entity Sanitization   │  - Logins & Failed Attempts  │
│  - SHA-256 Backup Checksums  │  - Credential Modifications  │
│  - Zero Cleartext Secrets    │  - Database Reset Audit Logs │
└──────────────────────────────┴──────────────────────────────┘
```

1. **Multi-Layer Admin Authentication**:
   - **Daily Quick PIN**: Default `7860` for day-to-day administrative operations.
   - **Emergency Master Recovery PIN**: Default `9988` for resetting credentials or authorizing factory wipes.
   - **Alphanumeric Password**: Default `admin@trizen786` for password managers.
2. **Brute-Force Rate Limiting**: Consecutive invalid login attempts trigger an escalating lockdown countdown (e.g. 5 failed attempts = 60-second lock).
3. **Session Inactivity Lock**: Console automatically locks after configurable idle periods (15, 30, 60, or 120 minutes).
4. **Input Sanitization**: All user inputs (checkout fields, searches, notes) are sanitized in `src/lib/sanitizer.ts` to neutralize Cross-Site Scripting (XSS) attacks.
5. **Real-Time Audit Ledger**: Chronological log of all administrative actions with severity tagging (`info`, `warning`, `security`).

---

## 🚀 Step-by-Step Hosting on Vercel (100% Free)

Vercel provides a permanent **Hobby Free Tier** with zero monthly hosting costs, global edge CDN, unlimited automated HTTPS SSL certificates, and 100 GB monthly bandwidth.

### Method 1: Continuous Deployment via GitHub (Recommended)

1. **Create a GitHub Repository**:
   - Push this project to your GitHub account:
     ```bash
     git init
     git add .
     git commit -m "Initial commit: TRIZENMART Storefront"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/trizenmart.git
     git push -u origin main
     ```

2. **Connect to Vercel**:
   - Log in to [Vercel](https://vercel.com) (sign in with your GitHub account).
   - Click **"Add New..."** → **"Project"**.
   - Select your `trizenmart` repository and click **Import**.

3. **Configure Project Settings**:
   - **Framework Preset**: Select `Vite`.
   - **Root Directory**: `./` (leave default).
   - **Build Command**: `npm run build` (or `vite build`).
   - **Output Directory**: `dist`.
   - **Install Command**: `npm install`.

4. **Click "Deploy"**:
   - Vercel will build and deploy your store in **~25 seconds**.
   - You will receive a live URL like `https://trizenmart.vercel.app`.

---

### Method 2: One-Line Vercel CLI Deployment

Deploy directly from your terminal in 30 seconds:

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm i -g vercel

# 2. Build and deploy to production
npm run build && vercel --prod
```

Follow the interactive terminal prompts:
- *Set up and deploy?* → **Y**
- *Which scope?* → Select your personal Vercel account
- *Link to existing project?* → **N**
- *What's your project's name?* → `trizenmart`
- *In which directory is your code located?* → `./`

---

### Method 3: Deploying Exported ZIP File

If you downloaded the code as a ZIP from AI Studio:
1. Unzip the folder on your computer.
2. Open terminal in the unzipped directory.
3. Run `npx vercel` and follow the on-screen prompts.

---

## 🗄️ Free Database Options & Setup Guide

TRIZENMART provides flexible, zero-cost database options depending on whether you prefer instant offline operation or cloud-synced multi-device access:

---

### Option 1: Built-in Zero-Cost Local & JSON Snapshot Engine (Active by Default)

**Cost**: `$0.00 / month forever` | **Setup Time**: `0 seconds`

- **How It Works**: All products, orders, categories, promo codes, store settings, and security logs are automatically stored in the browser's persistent storage.
- **1-Click Backup**: Navigate to **Admin Dashboard → Free Database & Vercel Hosting** and click **"Download Backup (JSON)"**. A timestamped file like `trizenmart_backup_2026-08-25.json` is generated with SHA-256 integrity checksums.
- **1-Click Restore**: Click **"Restore / Import Data"**, upload your backup JSON file, and all store records will be immediately restored.

---

### Option 2: MongoDB Atlas Cloud (Free M0 Cluster)

**Cost**: `$0.00 / month forever` | **Limits**: `512MB free storage, automated backups, global cluster`

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database) and sign up for a free account.
2. Create a free **M0 Cluster** (Shared free tier).
3. Under **Security → Database Access**, create a database user and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere, required for cloud edge hosting like Vercel).
5. Click **Connect** → **Drivers (Node.js)** and copy your connection string:
   ```env
   MONGODB_URI="mongodb+srv://shancompany322_db_user:YOUR_PASSWORD@cluster0.kbzjed9.mongodb.net/trizenmart?retryWrites=true&w=majority"
   ```
6. Paste the connection URI into your `.env` file (and in **Vercel Settings → Environment Variables** when deploying).

---

### Option 3: Google Firebase Firestore (Spark Free Plan)

**Cost**: `$0.00 / month forever` | **Limits**: `50,000 reads/day, 20,000 writes/day, 1GB storage`

If you want live multi-device syncing between multiple computers or staff members:

1. **Create Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click **"Add project"** → Name it `trizenmart-store`.
   - Choose the free **Spark Plan** ($0/month).

2. **Enable Firestore Database**:
   - In the left sidebar, click **Build** → **Firestore Database**.
   - Click **"Create database"** → Select **Production mode** → Choose your nearest region (e.g. `asia-south1` or `us-central1`).

3. **Configure Firestore Security Rules**:
   - Go to the **Rules** tab and paste the following rules:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         // Allow public read for products, categories, and settings
         match /products/{docId} {
           allow read: if true;
           allow write: if request.auth != null;
         }
         match /settings/{docId} {
           allow read: if true;
           allow write: if request.auth != null;
         }
         // Customers can create orders, admin can read/update
         match /orders/{docId} {
           allow create: if true;
           allow read, update: if request.auth != null;
         }
       }
     }
     ```

4. **Get Web App Config**:
   - Click **Project Settings (⚙️)** → **General** → Under *Your apps*, click **Web (</>)**.
   - Copy your Firebase config object and place the values in your `.env`:
     ```env
     VITE_FIREBASE_API_KEY=AIzaSy...
     VITE_FIREBASE_AUTH_DOMAIN=trizenmart-store.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=trizenmart-store
     VITE_FIREBASE_STORAGE_BUCKET=trizenmart-store.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=...
     VITE_FIREBASE_APP_ID=...
     ```

---

### Option 3: Supabase PostgreSQL (Free Tier)

**Cost**: `$0.00 / month forever` | **Limits**: `500MB database, 50,000 monthly active users`

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **"New Project"** → Set project name `trizenmart` and generate a secure database password.
3. In the **SQL Editor**, execute the schema initialization:
   ```sql
   -- Products Table
   CREATE TABLE products (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     price NUMERIC NOT NULL,
     original_price NUMERIC,
     image TEXT NOT NULL,
     category TEXT NOT NULL,
     rating NUMERIC DEFAULT 5.0,
     reviews_count INT DEFAULT 0,
     in_stock BOOLEAN DEFAULT true,
     badge TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Orders Table
   CREATE TABLE orders (
     id TEXT PRIMARY KEY,
     customer_name TEXT NOT NULL,
     customer_phone TEXT NOT NULL,
     shipping_address TEXT NOT NULL,
     city TEXT NOT NULL,
     total_amount NUMERIC NOT NULL,
     payment_method TEXT DEFAULT 'cod',
     status TEXT DEFAULT 'pending',
     items JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```
4. Copy your `Project URL` and `anon public key` from **Project Settings → API** into your `.env`.

---

### Option 4: Neon Serverless Postgres

**Cost**: `$0.00 / month forever` | **Limits**: `0.5 GB storage, unlimited branching`

1. Visit [neon.tech](https://neon.tech) and sign up for the free tier.
2. Create a database called `trizenmart_db`.
3. Copy the standard connection string (`postgres://user:password@ep-xyz.neon.tech/trizenmart_db`) for backend or serverless edge usage.

---

## 🔑 Admin Management & Default Credentials

| Privilege Level | Credential Field | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Store Owner PIN** | Admin PIN | `7860` | Daily access to orders, products & settings |
| **Master Recovery** | Master Security PIN | `9988` | Critical overrides, credential changes & DB reset |
| **Password** | Admin Password | `admin@trizen786` | Alternative alphanumeric passphrase |

> 💡 **How to Change Credentials**:
> 1. Open **Admin Dashboard** (Lock icon in header or footer).
> 2. Unlock using PIN `7860`.
> 3. Click the **"Security & Access Control"** tab.
> 4. Enter your new custom PIN or password and click **"Save Security Configuration"**.
> 5. Confirm the update with your current PIN or Master PIN.

---

## 💬 WhatsApp Order Notification Engine

When a customer completes checkout on TRIZENMART:
1. An order ID (e.g. `#TRZ-84920`) is generated and logged in the database.
2. The user sees the **Order Confirmation Screen** with a green **"Send Order Slip via WhatsApp"** button.
3. Clicking the button opens WhatsApp pre-filled with an organized invoice:

```text
🛍️ NEW ORDER PLACED - TRIZENMART
━━━━━━━━━━━━━━━━━━━━
📦 Order ID: #TRZ-84920
👤 Customer: Muhammad Ali
📞 Phone: +92 300 9876543
📍 Address: House 42, Street 5, Gulberg III, Lahore

🛒 Order Summary:
• Ultra-Fast Wireless Power Bank 20000mAh (x1) - Rs. 3,899
• TWS Wireless Gaming Earbuds with ANC (x1) - Rs. 2,999

💳 Payment Method: Cash on Delivery (COD)
💰 Total Payable: Rs. 6,898
━━━━━━━━━━━━━━━━━━━━
💬 Note: Please call before delivery.

Thank you for choosing TRIZENMART!
```

---

## 💻 Local Development & Build Commands

Ensure you have **Node.js (v18+)** installed:

```bash
# 1. Install project dependencies
npm install

# 2. Run local development server (binds to http://localhost:3000)
npm run dev

# 3. Validate TypeScript syntax & type checks
npm run lint

# 4. Compile optimized production build to /dist
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 🌐 Custom Domain Setup

You can link your own domain (e.g. `trizenmart.pk` or `trizenmart.com`) to Vercel for **100% free**:

1. In your **Vercel Dashboard**, open your `trizenmart` project.
2. Go to **Settings** → **Domains**.
3. Enter your domain name (e.g. `trizenmart.pk`) and click **Add**.
4. In your domain registrar (GoDaddy, Namecheap, PKNIC, Nayatel, etc.), add the following DNS records:
   - **Type A**: `@` pointing to `76.76.21.21`
   - **Type CNAME**: `www` pointing to `cname.vercel-dns.com`
5. Vercel will automatically verify DNS propagation and issue a free SSL certificate within minutes.

---

## ⚙️ Environment Variables

Copy `.env.example` to create your local `.env`:

```env
# MongoDB Atlas Database URI (Cloud Database Free Tier)
MONGODB_URI="mongodb+srv://shancompany322_db_user:YOUR_PASSWORD@cluster0.kbzjed9.mongodb.net/trizenmart?retryWrites=true&w=majority"

# Optional Application URL (auto-detected on Vercel)
VITE_APP_URL="https://trizenmart.vercel.app"

# Optional Cloud Database Connectors (if migrating from local storage)
# VITE_FIREBASE_API_KEY=""
# VITE_FIREBASE_PROJECT_ID=""
# VITE_SUPABASE_URL=""
# VITE_SUPABASE_ANON_KEY=""
```

---

## 📄 License & Ownership

Built with ❤️ for high-growth modern commerce. Distributed under the **MIT License**. Free for commercial and personal usage.
