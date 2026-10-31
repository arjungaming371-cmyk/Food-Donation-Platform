# 🍲 FoodBridge — Zero Waste Food Donation & Redistribution Platform

> **Problem Statement: HACK-P197 — Food Donation Platform**  
> *"Good Food. Zero Waste. Better Tomorrow."*  
> **Finalist Submission for Student Hackathon — Backend Web Development**

---

## 🌟 Executive Summary

In metropolitan hubs like Hyderabad, metric tons of safe, freshly prepared surplus meals and perishable goods are discarded daily by hotels, restaurants, banquets, and bakeries. Concurrently, orphanages, homeless shelters, and charity kitchens struggle daily to secure meal provisions.

**FoodBridge** bridges this gap with an enterprise-grade, full-stack food redistribution platform featuring:
- **Deterministic Smart NGO–Food Matching Engine** (Haversine distance, capacity ratio, pickup window, dietary filters)
- **Dynamic QR-Based Pickup Verification** (Encrypted 6-digit PIN and QR dual-party handover confirmation)
- **ACID Database Transactions** (Strict concurrency control, anti-double-booking, non-negative quantity guarantees)
- **Live Impact Ledger** (Real-time calculation of kg rescued, 400g meal equivalents, and CO2 emissions averted)
- **Strict Food Safety Governance** (Mandatory donor preparation declarations, allergen tagging, storage condition specs, and admin audit logging)
- **Multilingual Support** (English, Telugu `తెలుగు`, Hindi `हिन्दी`)

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Next.js Route Handlers & Server Actions, Node.js v24 |
| **Database & ORM** | Prisma ORM 5.22, PostgreSQL / SQLite (Out-of-the-box portable `dev.db`) |
| **Authentication** | Secure JWT Sessions, HTTP-Only Cookies, Role-Based Access Control, Bcrypt Password Hashing |
| **Features** | Dynamic QR Generation (`qrcode`), Haversine Geospatial Discovery, In-App Notifications |
| **Testing** | Node.js Test Runner (`node --test`), Unit, Integration, and E2E Workflow Tests |

---

## 🔑 Demo Credentials (For Hackathon Judges)

FoodBridge includes a **1-Click Demo Evaluation Switcher** pinned to the top of the header for instant access without manual login. Alternatively, you can use these seeded credentials:

| Role | Organization / Name | Email | Password | Coordinates |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | FoodBridge System Admin | `admin@foodbridge.org` | `admin123` | Madhapur, Hyderabad |
| **Donor 1** | Paradise Biryani Restaurant | `donor1@foodbridge.org` | `demo123` | Secunderabad (17.44° N, 78.50° E) |
| **Donor 2** | Bawarchi Catering Services | `donor2@foodbridge.org` | `demo123` | RTC X Roads (17.40° N, 78.50° E) |
| **Donor 3** | Green Leaf Organic Grocers | `donor3@foodbridge.org` | `demo123` | Banjara Hills (17.42° N, 78.44° E) |
| **Donor 4** | Taj Krishna Banquets | `donor4@foodbridge.org` | `demo123` | Banjara Hills (17.42° N, 78.45° E) |
| **Donor 5** | Minerva Grand Bakery & Meals| `donor5@foodbridge.org` | `demo123` | SD Road (17.44° N, 78.50° E) |
| **NGO 1** | Hope Community Foundation | `hope@ngo.org` | `demo123` | Musheerabad (250 beneficiaries) |
| **NGO 2** | Helping Hands Humanity | `helpinghands@ngo.org` | `demo123` | Mehdipatnam (180 beneficiaries) |
| **NGO 3** | Annapurna Food Support Center| `annapurna@ngo.org` | `demo123` | Ameerpet (320 beneficiaries) |

---

## 🚀 Quick Start Guide

### 1. Clone & Install
```bash
git clone <repository-url>
cd "New folder (2)"
npm install
```

### 2. Environment Setup
The repository comes configured with `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="foodbridge-super-secret-jwt-key-hackathon-2026"
NEXT_PUBLIC_APP_NAME="FoodBridge"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
*(To use PostgreSQL instead of SQLite, simply change `DATABASE_URL` to your Postgres connection string and set `provider = "postgresql"` in `prisma/schema.prisma`)*.

### 3. Database Sync & Seed
```bash
npx prisma db push
npm run seed
```
This populates 1 Admin, 5 Donors, 3 Recipient NGOs, 10 realistic food listings with Hyderabad coordinates, sample requests in multiple states, notifications, and reports.

### 4. Run Automated Test Suite
```bash
npm test
```
Runs 7 comprehensive test suites validating:
- Authentication & password hashing
- Role authorization
- Non-negative listing constraints
- Full E2E reservation workflow with concurrency locking
- Dual-party PIN & QR verification
- Admin moderation & audit logging

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Standout Innovations

### 1. Smart NGO–Food Matching Algorithm
Computes a transparent 0–100% compatibility score based on 4 explainable factors:
- **Proximity (35%)**: Haversine distance between donor and NGO coordinates in Hyderabad.
- **Capacity Fit (30%)**: Batch size converted to meal-equivalents against the NGO's beneficiary count.
- **Collection Window (20%)**: Hours remaining before food safety threshold is reached.
- **Dietary & Handling (15%)**: Vegetarian/Vegan classification and temperature storage compatibility.

### 2. Dynamic QR-Based Pickup Verification
When an NGO's request is accepted:
1. An encrypted 6-digit PIN and dynamic QR code are generated.
2. The NGO driver presents the QR code or PIN at the donor's dispatch counter.
3. The donor verifies the code, instantly confirming physical custody handover and marking the status `COMPLETED`.

### 3. Live Impact Ledger
Converts all completed redistributions into social and environmental metrics:
- 1 standard meal equivalent = 400g (0.4 kg)
- Landfill greenhouse emission factor: 2.5 kg CO2e avoided per 1 kg food rescued.

### 4. Food Safety & Regulatory Compliance
- Mandatory donor preparation declaration per listing.
- Clear statutory notice: *"FoodBridge does not certify food safety. Donors are responsible for accurate food information and compliance with applicable food-safety requirements. Recipient organizations should assess food condition before accepting or distributing it."*
- FSSAI temperature holding specifications: Hot food > 60°C, Chilled food < 5°C.

---

## ⏱️ 3-Minute Hackathon Demo Script

| Time | Demonstration Step | Actions to Perform |
| :--- | :--- | :--- |
| **0:00–0:30** | **Problem Statement** | Open Home page. Point out Hyderabad live impact ticker and interactive redistribution map. |
| **0:30–1:00** | **Donor Creates Listing** | Click "Donor Demo". Go to "Create Listing". Fill 15 kg Vegetable Rice, set prep time, check Mandatory Safety Declaration, click Publish. |
| **1:00–1:30** | **NGO Discovers Food** | Click "NGO Demo". Navigate to "Discover Food". Show the Smart Match score (e.g. 94% Match) and filter by Vegetarian. |
| **1:30–2:00** | **Request & Acceptance** | Click "Request", enter 10 kg with note. Switch to Donor view and click "Accept Request". Available stock locks immediately to 5 kg. |
| **2:00–2:30** | **QR Pickup Handover** | In NGO view, open "Show QR Code". Show 6-digit PIN. In Donor view, enter the PIN to verify handover. Request instantly updates to `COMPLETED`. |
| **2:30–3:00** | **Impact & Admin Moderation** | Visit Impact Dashboard to view updated kg and meal counts. Switch to Admin view to inspect audit trail and reports queue. |

---

## 👥 Hackathon Submission Information
- **Problem Statement ID:** HACK-P197
- **Submission Track:** Backend Web Development
- **City & Demo Hub:** Hyderabad, Telangana, India
- **Deliverables:** Working Prototype, GitHub Repository, Project Presentation (PPT), Automated Tests.
