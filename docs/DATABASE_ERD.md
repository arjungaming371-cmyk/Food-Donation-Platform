# 🗄️ FoodBridge — Database Design & Entity Relationship Diagram (ERD)

**Problem Statement:** HACK-P197 (Food Donation & Redistribution Platform)  
**ORM:** Prisma ORM 5.22.0  
**Supported Databases:** PostgreSQL (Production) / SQLite (`dev.db` for zero-friction local and edge evaluation)

---

## 📊 Entity Relationship Diagram (Mermaid ERD)

```mermaid
erDiagram
    User ||--o| DonorProfile : "has"
    User ||--o| OrganizationProfile : "has"
    User ||--o{ FoodListing : "creates"
    User ||--o{ DonationRequest : "submits"
    User ||--o{ Notification : "receives"
    User ||--o{ Report : "files"
    User ||--o{ AdminAuditLog : "executes"
    User ||--o{ DonationStatusHistory : "triggers"

    FoodListing ||--o{ DonationRequest : "receives"
    FoodListing ||--o{ DonationStatusHistory : "tracks"
    FoodListing ||--o{ Report : "flagged_by"

    DonationRequest ||--o{ DonationStatusHistory : "logs"

    User {
        string id PK
        string email UK
        string password
        string name
        string role "DONOR | RECIPIENT | ADMIN"
        string phone
        string address
        string city
        float latitude
        float longitude
        boolean isSuspended
        datetime createdAt
    }

    DonorProfile {
        string id PK
        string userId FK
        string businessName
        string businessType "Restaurant | Hotel | Caterer | Grocery"
        string fssaiNumber
        boolean verified
        boolean safetyPledgeAccepted
    }

    OrganizationProfile {
        string id PK
        string userId FK
        string orgName
        string orgType "NGO | Shelter | Orphanage"
        int estimatedPeopleServed
        string serviceArea
        boolean verified
    }

    FoodListing {
        string id PK
        string donorId FK
        string title
        string category "Cooked Meals | Bakery | Produce | Dairy"
        float totalQuantity
        float availableQuantity
        string unit "kg | packets"
        string dietaryType "VEG | NON_VEG | VEGAN"
        datetime cookedOrPreparedAt
        datetime expiryOrBestBefore
        string storageCondition
        boolean donorDeclarationConfirmed
        string status "AVAILABLE | RESERVED | COMPLETED"
        float latitude
        float longitude
    }

    DonationRequest {
        string id PK
        string listingId FK
        string recipientId FK
        float requestedQuantity
        string status "PENDING | ACCEPTED | COMPLETED"
        string pickupVerificationCode "6-Digit PIN & Dynamic QR"
        boolean donorConfirmedHandover
        boolean recipientConfirmedPickup
    }

    DonationStatusHistory {
        string id PK
        string listingId FK
        string requestId FK
        string actorId FK
        string actorRole
        string previousStatus
        string newStatus
        string note
        datetime createdAt
    }

    Report {
        string id PK
        string reporterId FK
        string listingId FK
        string reason "Expired | Incorrect Info | Unsafe"
        string status "PENDING | RESOLVED"
    }

    AdminAuditLog {
        string id PK
        string adminId FK
        string action "REMOVE_LISTING | SUSPEND_USER"
        string targetType
        string targetId
        datetime createdAt
    }
```

---

## 🔐 Key Data Integrity Features
1. **Cascade Deletions & Referential Integrity:** Cascade constraints safeguard relational consistency across profiles, notifications, and transactions.
2. **ACID Transaction Safeguards:** Quantity locks and dual-party confirmation states operate under Prisma atomic transactions.
3. **Audit Immutability:** `DonationStatusHistory` records are append-only to preserve a verifiable chain of custody for food safety audits.
