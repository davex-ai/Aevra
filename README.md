<img width="166" height="182" alt="image" src="https://github.com/user-attachments/assets/11bda390-156c-4a8e-9333-2a93dbb493dc" />

# 🛍️ Aevra — Modern Mobile Commerce App

Aevra is a modern, mobile‑first e‑commerce application built with **Expo (React Native)** and **Firebase**, designed with clean UX, real‑world state management, and production‑ready architecture.

This project focuses on **practical engineering patterns**: auth‑aware navigation, persistent carts, scalable context design, and clean checkout → order flows.

---

## ✨ Features

### 🧭 Navigation & UX

* Expo Router with nested layouts
* Auth‑aware redirects (guest vs logged‑in users)
* No header flicker (layout‑level config)
* Clean, minimal UI

### 🛒 Shopping

* Browse products by category
* Featured sections on home
* Product details pages
* Wishlist support
* Persistent cart (survives reloads)

### 🔐 Authentication

* Firebase Authentication (Email & Password)
* Register / Login flows
* Guest browsing supported
* Protected routes only when necessary

### 💳 Checkout

* Editable shipping info (name, phone, address)
* Order summary & totals
* Loading state while placing order
* Cart clears **only after successful order**
* Automatic redirect to profile after checkout

### 👤 Profile

* Editable profile info
* Order history with status
* Order loading indicators
* Secure logout

### 📦 Orders

* Orders stored in Firestore
* User‑scoped order collections
* Real‑time friendly schema

---

## 🧠 Tech Stack

| Layer      | Tech                  |
| ---------- | --------------------- |
| Mobile     | Expo (React Native)   |
| Navigation | Expo Router           |
| Backend    | Firebase              |
| Auth       | Firebase Auth         |
| Database   | Firestore             |
| State      | React Context         |
| Storage    | AsyncStorage          |
| Styling    | Tailwind (NativeWind) |

---

## 📁 Project Structure

```
app/
 ├─ (tabs)/
 ├─ products/
 │   └─ [id].tsx
 ├─ category/
 │   ├─ _layout.tsx
 │   └─ [category].tsx
 ├─ cart.tsx
 ├─ checkout.tsx
 ├─ profile.tsx

context/
 ├─ AuthContext.tsx
 ├─ CartContext.tsx
 └─ WishlistContext.tsx

lib/
 └─ firebase.ts

components/
 ├─ ProductCard.tsx
 └─ CategorySection.tsx
```

---

## 🔑 Key Architecture Decisions

### ✅ Auth‑Safe Navigation

* No forced login for browsing
* Checkout & wishlist gated via `requireAuth`
* Redirects handled in layout/context — not pages

### ✅ Persistent State (Done Right)

* Cart & wishlist stored in AsyncStorage
* Storage keys scoped by `user.uid`
* No data wipes on hot reload

### ✅ Checkout Reliability

* Orders written **before** cart clears
* Loading indicators prevent double submission
* Graceful error handling

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/davex-ai/aevra.git
cd aevra
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
```

### 4. Run the app

```bash
npx expo start
```

---

## 🧪 What This Project Demonstrates

* Real‑world Expo Router usage
* Proper Firebase auth lifecycle handling
* Context‑based state management
* UX‑aware checkout flows
* Clean separation of concerns

This is **not tutorial code** — it’s a foundation you can scale.

---

## 📈 Future Improvements

* Payment integration (Stripe)
* Order detail pages
* Push notifications for order updates
* Admin dashboard
* Server‑side cart sync
  
---

## [Daveora](https://github.com/davex-ai)
