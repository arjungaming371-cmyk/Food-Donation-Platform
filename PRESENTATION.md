# 🏆 FoodBridge — Hackathon Presentation Pitch Deck (HACK-P197)

> **Student Hackathon — Backend Web Development**  
> **Problem Statement ID:** HACK-P197 (Food Donation & Redistribution Platform)  
> **Product Name:** FoodBridge  
> **Tagline:** *"Good Food. Zero Waste. Better Tomorrow."*

---

## 📑 Slide Outline for Final Evaluation

### Slide 1: Title & Team Information
- **Project Title:** FoodBridge: Intelligent Urban Food Surplus Redistribution Platform
- **Problem Statement ID:** HACK-P197
- **Submission Track:** Backend Web Development
- **Team Composition (4 Members, Same Section):**
  - **Member 1 (Team Leader):** Full-Stack & System Architecture
  - **Member 2:** Backend API, Prisma ORM & Database Transactions
  - **Member 3:** Smart Matching Algorithms & QR Handover Engine
  - **Member 4:** UI/UX Design, Testing & QA Automation
- **Target City & Demo Hub:** Hyderabad, Telangana, India

---

### Slide 2: The Urban Food Waste Paradox
- **The Problem:** 
  - Every day in urban centers like Hyderabad, metric tons of high-grade, freshly cooked surplus food from wedding banquets, hotel buffets, caterers, and bakeries are discarded into municipal landfills.
  - Landfilled food generates potent methane emissions, accelerating urban environmental degradation.
  - Concurrently, orphanages, homeless shelters, and charity relief kitchens struggle daily with procurement costs and nutritious meal shortages.
- **Root Cause of the Failure:**
  - Lack of real-time coordination
  - Lack of transparent trust verification
  - Risk of double-booking and food safety liability
  - Absence of secure handover verification protocols.

---

### Slide 3: Our Solution — FoodBridge
- A resilient, mission-critical full-stack platform connecting commercial food donors with verified recipient NGOs in real time.
- **Core Pillars:**
  1. **Speed & Freshness:** Automated dispatch within the safe consumption window.
  2. **Zero Concurrency Conflict:** Database ACID transactions guarantee zero double-booking and prevent inventory overdrafts.
  3. **Dual-Key QR Verification:** Guaranteed physical handover confirmation.
  4. **Strict Safety Compliance:** Mandatory donor pledges adhering to FSSAI guidelines.

---

### Slide 4: System Architecture & Technology Stack
```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 14 App Router                     │
│        (React 18, TypeScript, Tailwind CSS, Lucide)         │
├─────────────────────────────────────────────────────────────┤
│   Public Discovery  │  Donor Portal  │  NGO Portal  │ Admin │
├─────────────────────────────────────────────────────────────┤
│                      API Route Handlers                     │
│ (Auth, Listings, Requests, Status History, Reports, Impact) │
├─────────────────────────────────────────────────────────────┤
│              Prisma ORM (ACID Transactions)                 │
├─────────────────────────────────────────────────────────────┤
│               PostgreSQL / SQLite Database                  │
│  (Users, Profiles, Listings, Requests, History, Audit Logs) │
└─────────────────────────────────────────────────────────────┘
```
- **Security:** HTTP-Only JWT cookies, bcrypt salt rounds, server-side role gatekeepers.
- **Portability:** Database operates cleanly on SQLite (`dev.db`) or PostgreSQL.

---

### Slide 5: Standout Innovation #1 — Smart NGO–Food Matching Algorithm
Instead of passive scrolling, FoodBridge automatically scores listings for every registered NGO using a transparent multi-factor algorithm:
$$\text{Match Score} = (0.35 \times S_{\text{dist}}) + (0.30 \times S_{\text{cap}}) + (0.20 \times S_{\text{time}}) + (0.15 \times S_{\text{diet}})$$

1. **Proximity ($S_{\text{dist}}$, 35%):** Haversine GPS distance between donor kitchen and NGO hub.
2. **Capacity Fit ($S_{\text{cap}}$, 30%):** Compares batch size (in 400g meal equivalents) against the NGO's beneficiary headcount.
3. **Time Window Urgency ($S_{\text{time}}$, 20%):** Hours remaining before the food safety threshold expires.
4. **Dietary & Storage Compatibility ($S_{\text{diet}}$, 15%):** Vegetarian / Vegan classification and temperature holding requirements.

---

### Slide 6: Standout Innovation #2 — Dynamic QR-Based Pickup Verification
- Eliminates fake delivery claims, disputed quantities, and unauthorized collection:
  1. Once a donor accepts a request, the system generates an encrypted 6-digit PIN and dynamic QR code.
  2. The NGO collection van driver arrives at the kitchen dispatch dock.
  3. The donor or NGO scans the QR code or enters the PIN.
  4. Both parties verify physical handover simultaneously; the status moves to `COMPLETED` and is logged in the immutable audit ledger.

---

### Slide 7: Standout Innovation #3 — Real-Time Impact Ledger
- Real-time conversion equations:
  - **Meal Equivalents Rescued:** $\frac{\text{Total Rescued Food (g)}}{400\text{ g}}$
  - **Greenhouse Emissions Averted:** $\text{Rescued Food (kg)} \times 2.5\text{ kg CO}_2\text{e}$
- Transparent dashboard shows total kilograms saved, meals served to vulnerable populations, and active donor/NGO partners across Hyderabad.

---

### Slide 8: Food Safety & Governance Protocols
- **Mandatory Donor Preparation Pledge:**
  > *"I confirm that the food information, preparation time, storage details, and handling instructions provided are accurate to the best of my knowledge, and I will follow applicable local food-safety requirements."*
- **Statutory Notice:** Visible on all pages stating FoodBridge does not certify food safety; recipients must inspect sensory condition before distribution.
- **Temperature Guidelines:**
  - Hot food holding: $> 60^\circ\text{C}$ (max 4-hour redistribution window)
  - Chilled/dairy items: $< 5^\circ\text{C}$
  - Ambient bakery items: Dry, pest-free sealed transport.

---

### Slide 9: Complete 3-Minute Live Judge Demonstration Script

| Time | Live Action | On-Screen Demonstration |
| :--- | :--- | :--- |
| **0:00–0:30** | **Problem & Value** | Showcase Home landing page, live impact counter (1,050+ meals rescued), and interactive Hyderabad redistribution map. |
| **0:30–1:00** | **Donor Experience** | Click `Donor Demo`. Create listing for 15 kg of surplus Vegetable Biryani, check safety declaration, publish to marketplace. |
| **1:00–1:30** | **Smart NGO Discovery** | Click `NGO Demo`. Open Food Discovery. Point out the 94% Smart Match badge and category filters. |
| **1:30–2:00** | **Reservation & Lock** | Request 10 kg with note. Switch to Donor view, click Accept. Show that available stock automatically updates from 15 kg to 5 kg. |
| **2:00–2:30** | **QR Handover Verification** | In NGO view, click "Show QR Code". In Donor view, enter the 6-digit PIN to confirm collection. Transaction moves to `COMPLETED`. |
| **2:30–3:00** | **Impact & Admin** | Show updated metrics on Impact Dashboard. Switch to Admin view to show audit trails and resolved moderation reports. |

---

### Slide 10: Robustness, Reliability & Testing Results
- **Automated Test Suite Results (100% Pass Rate):**
  - `AUTH`: Password hashing, token security, role boundaries
  - `DONATION`: Safety pledge validation, positive quantity constraints
  - `WORKFLOW`: Full reservation lifecycle, concurrency race condition prevention, double-booking prevention, PIN verification
  - `ADMIN`: User suspension, listing takedown, audit logging.
- **Production Build:** Next.js 14 App Router, 36 static and dynamic routes compiled cleanly.

---

### Slide 11: Scalability & Future Roadmap
1. **IoT Temperature Logging:** Bluetooth/NFC sensors in transport coolers logging real-time thermal curves.
2. **Volunteer Micro-Logistics:** Integration with bike courier volunteers for small-batch bakery pick-ups.
3. **Predictive Surplus AI:** Machine learning models forecasting daily buffet surplus for hotels based on reservations and weather.

---

### Slide 12: Conclusion & Q&A
- **FoodBridge:** *"Good Food. Zero Waste. Better Tomorrow."*
- **Problem Statement:** HACK-P197
- **Demo Link:** http://localhost:3000
- **Team Leader Form Ready:** Submitted ahead of the 31 October 2026 6:00 PM deadline!
