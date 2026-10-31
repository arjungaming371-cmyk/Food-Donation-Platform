# 🏗️ FoodBridge — System Architecture Diagram & Technical Design

**Problem Statement:** HACK-P197 (Food Donation & Redistribution Platform)  
**System Name:** FoodBridge  
**Architecture Pattern:** Clean Layered App Router Architecture (Client Layer, Service/Route Layer, ORM Layer, Database Layer)

---

## 🏛️ High-Level System Architecture Flow

```mermaid
flowchart TD
    subgraph Client_Layer ["Client Layer (Next.js 14 / React 18)"]
        UI_Donor["Donor Dashboard & Creation Form"]
        UI_NGO["NGO Discovery & Smart Match Map"]
        UI_Admin["Admin Moderation & Audit Console"]
        UI_Demo["Interactive Auto-Demo with Female Voiceover"]
    end

    subgraph Security_Gate ["Security & Authentication Middleware"]
        JWT["JWT Auth & Role Gatekeeper"]
        Bcrypt["bcrypt Password Hash Verification"]
        FSSAI["Mandatory FSSAI Safety Pledge Enforcer"]
    end

    subgraph Route_Layer ["API Route Handlers (Next.js App Router)"]
        AuthRoute["/api/auth/* (Login, Register, Demo)"]
        ListRoute["/api/listings/* (CRUD, Safety Checks)"]
        ReqRoute["/api/requests/* (ACID Locks, QR Pin)"]
        MatchEngine["lib/matching.ts (Deterministic 4-Factor)"]
        ImpactEngine["lib/impact.ts (Kg, Meals, CO2e)"]
        AdminRoute["/api/admin/* (Moderation, Audit)"]
    end

    subgraph Data_Layer ["Persistence & Concurrency Layer"]
        Prisma["Prisma ORM with ACID Transactions"]
        DB[("PostgreSQL / SQLite Storage Engine")]
        AuditLedger[("Immutable DonationStatusHistory Log")]
    end

    UI_Donor --> Security_Gate
    UI_NGO --> Security_Gate
    UI_Admin --> Security_Gate
    UI_Demo --> Security_Gate

    Security_Gate --> Route_Layer

    ListRoute --> Prisma
    ReqRoute --> Prisma
    AdminRoute --> Prisma
    AuthRoute --> Prisma

    Prisma --> DB
    Prisma --> AuditLedger
```

---

## 🔄 End-to-End Concurrency & Verification Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Donor as Restaurant Donor
    participant System as FoodBridge Backend
    actor NGO as Recipient NGO
    participant DB as Prisma Database

    Donor->>System: 1. POST /api/listings (Signed Safety Pledge)
    System->>DB: 2. Insert FoodListing (Status: AVAILABLE)
    NGO->>System: 3. Discover listing via 4-Factor Smart Match Engine
    NGO->>System: 4. POST /api/requests (Request 10 kg of 15 kg)
    Donor->>System: 5. PATCH /api/requests/:id/status (ACCEPTED)
    Note over System,DB: ACID Transaction: Lock 10 kg, decrement available to 5 kg
    System->>DB: 6. Update inventory + Generate 6-Digit PIN & Dynamic QR
    NGO->>Donor: 7. Driver arrives at kitchen loading dock
    NGO->>System: 8. Submit Handover PIN (849201) / Scan Dynamic QR
    Donor->>System: 9. Confirm Physical Custody Handover
    System->>DB: 10. Mark COMPLETED + Increment Meals & CO2e Averted
    System->>DB: 11. Append immutable status record in DonationStatusHistory
```

---

## 🛡️ Key Architectural Guarantees
1. **Zero Double-Booking Guarantee:** All quantity reservations execute inside `prisma.$transaction()` isolation blocks.
2. **Food Safety Gate:** Listings without an explicit `donorDeclarationAccepted: true` flag are rejected at the schema validation boundary.
3. **Auditable Custody Chain:** Every state transition permanently records the timestamp, actor ID, actor role, and previous/new status in the database.
