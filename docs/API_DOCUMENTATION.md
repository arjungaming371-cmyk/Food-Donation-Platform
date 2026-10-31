# 📚 FoodBridge REST API Documentation & Postman Collection

**Project:** FoodBridge (HACK-P197 Food Donation & Redistribution Platform)  
**Base URL (Production):** `https://food-donation-platform-blond.vercel.app/api`  
**Base URL (Local):** `http://localhost:3000/api`  
**Authentication Scheme:** HTTP-Only JWT Cookie (`token`) or `Authorization: Bearer <token>`

---

## 🔐 1. Authentication Endpoints

### 1.1 Register User
- **Method:** `POST`
- **Route:** `/api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "Paradise Biryani Food Court",
  "email": "donor@example.com",
  "password": "Password123!",
  "role": "DONOR",
  "phone": "+91 98490 12345",
  "address": "MG Road, Secunderabad, Telangana",
  "latitude": 17.4411,
  "longitude": 78.4983,
  "organizationType": "RESTAURANT"
}
```
- **Response (`201 Created`):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "usr_abc123",
    "name": "Paradise Biryani Food Court",
    "email": "donor@example.com",
    "role": "DONOR"
  }
}
```

### 1.2 Login User
- **Method:** `POST`
- **Route:** `/api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "donor@example.com",
  "password": "Password123!"
}
```
- **Response (`200 OK`):**
Sets HTTP-Only cookie `token` and returns:
```json
{
  "message": "Login successful",
  "user": {
    "id": "usr_abc123",
    "name": "Paradise Biryani Food Court",
    "email": "donor@example.com",
    "role": "DONOR"
  }
}
```

### 1.3 Quick 1-Click Demo Login (Judges & Evaluators)
- **Method:** `POST`
- **Route:** `/api/auth/demo-login`
- **Access:** Public
- **Request Body:**
```json
{
  "role": "DONOR" // "DONOR" | "RECIPIENT" | "ADMIN"
}
```
- **Response (`200 OK`):**
Returns JWT session for pre-seeded judging persona (`donor@example.com`, `recipient@example.com`, or `admin@example.com`).

### 1.4 Get Current User Profile
- **Method:** `GET`
- **Route:** `/api/auth/me`
- **Access:** Authenticated (Any Role)

---

## 🍲 2. Food Listings Endpoints

### 2.1 List All Available Food Listings
- **Method:** `GET`
- **Route:** `/api/listings`
- **Query Parameters:**
  - `status`: `AVAILABLE` | `RESERVED` | `COMPLETED`
  - `category`: `Cooked Meals` | `Bakery` | `Produce` | `Packaged`
  - `dietaryType`: `VEG` | `NON_VEG` | `VEGAN`
  - `search`: Food name or description keyword
  - `lat`, `lng`: Recipient coordinates for Haversine distance calculation
- **Response (`200 OK`):**
Array of listing objects including calculated distance, expiry window, and donor location.

### 2.2 Create Food Listing
- **Method:** `POST`
- **Route:** `/api/listings`
- **Access:** Authenticated (`DONOR` only)
- **Request Body:**
```json
{
  "title": "Vegetable Dum Biryani",
  "description": "Freshly prepared basmati rice biryani with garden vegetables and cottage cheese.",
  "category": "Cooked Meals",
  "totalQuantity": 15,
  "unit": "kg",
  "dietaryType": "VEG",
  "allergens": "Dairy (Ghee & Paneer)",
  "storageCondition": "Hot / Insulated (> 60°C)",
  "handlingInstructions": "Keep insulated until serving. Consume within 4 hours.",
  "pickupAddress": "MG Road, Secunderabad",
  "pickupStartTime": "2026-10-31T12:00:00.000Z",
  "pickupEndTime": "2026-10-31T16:00:00.000Z",
  "cookedOrPreparedAt": "2026-10-31T11:00:00.000Z",
  "expiryOrBestBefore": "2026-10-31T16:00:00.000Z",
  "donorDeclarationAccepted": true
}
```

### 2.3 Get Listing Details by ID
- **Method:** `GET`
- **Route:** `/api/listings/:id`
- **Access:** Public / Authenticated

---

## 🤝 3. Donation Request & Handover Endpoints

### 3.1 Create Donation Request
- **Method:** `POST`
- **Route:** `/api/requests`
- **Access:** Authenticated (`RECIPIENT` only)
- **Request Body:**
```json
{
  "listingId": "lst_biryani_15kg",
  "requestedQuantity": 10,
  "note": "For distributing to 25 families at Gandhi Hospital community shelter."
}
```

### 3.2 Update Request Status (ACID Transaction)
- **Method:** `PATCH`
- **Route:** `/api/requests/:id/status`
- **Access:** Authenticated (`DONOR` or `RECIPIENT`)
- **Actions:**
  - `status`: `ACCEPTED` | `REJECTED` | `CANCELLED` | `PICKED_UP` | `COMPLETED`
  - `verificationCode`: 6-digit PIN for pickup verification
- **Atomic Concurrency Guarantee:** When accepted, listing inventory is automatically locked and deducted in a single atomic database transaction.

### 3.3 Dynamic Pickup QR Code
- **Method:** `GET`
- **Route:** `/api/requests/:id/qrcode`
- **Access:** Authenticated (`DONOR` or `RECIPIENT`)
- **Response (`200 OK`):**
Returns base64 data URI of QR code carrying encrypted verification token.

---

## 📊 4. Impact & Administration Endpoints

### 4.1 Live Platform Impact Metrics
- **Method:** `GET`
- **Route:** `/api/impact`
- **Access:** Public
- **Response (`200 OK`):**
```json
{
  "totalKgSaved": 430,
  "totalMealsRescued": 1075,
  "co2EmissionsAvoidedKg": 1075,
  "participatingOrgsCount": 8,
  "activeDonorsCount": 5
}
```

### 4.2 Admin Governance & Statistics
- **Method:** `GET`
- **Route:** `/api/admin/stats`
- **Access:** Authenticated (`ADMIN` role strictly enforced)
- **Response (`200 OK`):**
Aggregated user growth, pending reports, active listings, and audit trail events.

### 4.3 Report Suspicious or Spoiled Listing
- **Method:** `POST`
- **Route:** `/api/reports`
- **Access:** Authenticated (Any Role)
```json
{
  "listingId": "lst_xyz",
  "reason": "EXPIRED_FOOD",
  "details": "Preparation timestamp does not match storage reality."
}
```
