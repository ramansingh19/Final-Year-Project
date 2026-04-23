# 🧭 Travel Planner — Smart City Travel Guide

> "Everything you need to explore a new place — nearby, affordable, and trusted."

A full-stack travel guide web application that helps budget and first-time travelers discover nearby places, hotels, local food, and travel options — all in one platform.


📁 **GitHub:** [ramansingh19/Final-Year-Project](https://github.com/ramansingh19/Final-Year-Project)

---

## 🚩 Problem Statement

When people travel to a new city or state, they face multiple challenges:

- ❌ Not knowing what famous places are nearby (within 10–20 km)
- ❌ Difficulty finding the best hotel based on price and facilities
- ❌ No quick way to discover local famous food
- ❌ Confusion about the cheapest and best travel options
- ❌ Having to use too many different apps with no single trusted platform

**Travel Planner = ONE destination for all travel answers.**

---

## 🎯 Target Users

- 🎒 Students & budget travelers
- 👨‍👩‍👧 Families
- 🧍 Solo travelers
- 🏙️ First-time city visitors
- 📋 People visiting for exams, jobs, or events

> **Initial Focus:** Budget travelers and first-time visitors

---

## ✨ Features

### 🏠 Landing Page
- Search by City / State
- Use My Location (geolocation)

### 🏙️ City Overview Page
- Famous highlights (Culture, Forts, Food, etc.)
- Best time to visit
- Average daily budget estimate
- Quick navigation to Places, Hotels, Food & Travel

### 📍 Nearby Places (10–20 km Logic)
- Filter by Distance: `0–5 km` | `5–10 km` | `10–20 km`
- Filter by Type: Temple | Nature | Market | Fort
- Filter by Time Required: 1–2 hrs | Half Day | Full Day
- Each card shows: Photo, Distance, Why Famous, Entry Fee, Best Time, Google Maps link

### 🏨 Hotels (Budget-Friendly Focus)
- Filter by Budget: `₹500–1000` | `₹1000–3000` | `₹3000+`
- Filter by Facilities: AC, Wi-Fi, Family Friendly, Near Bus/Station
- Cards show: Price/night, Facilities, Distance from center, Rating, "Best for Budget" tag

### 🍽️ Famous Food Section
- City-specific famous dishes with price ranges
- Restaurant listings with: Veg/Non-Veg, Avg cost per person, Distance, Best meal time

### 🚌 Travel Options
- Bus (cheapest) | Train | Cab | Local transport
- Shows price range, time required, and "Best Option" recommendation

### 💰 Smart Budget Planner *(Unique Feature)*
User inputs Days + Budget + City → Get:
- Where to go
- Where to stay
- What to eat
- **Total estimated cost breakdown**

### 🔐 Admin Panel
- Secure admin login (JWT + bcrypt)
- Role-based access control (`isAuth`, `isAdmin` middleware)
- Manage Cities, Places, Hotels, Food & Restaurants
- Review moderation (Approve / Delete)
- User management (Block users)
- Analytics dashboard (Total users, Most visited city, Top hotel, Popular food)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js / Next.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **APIs** | Google Places API, Google Maps & Distance API |
| **Auth** | JWT, bcrypt |
| **Deployment** | Vercel (Frontend) |
| **Future APIs** | OYO / Booking.com, Travel booking APIs |

---

## 📁 Project Structure

```
Final-Year-Project/
├── client/                  # React/Next.js Frontend
│   ├── pages/
│   │   ├── index.jsx        # Landing page
│   │   ├── city/[id].jsx    # City overview
│   │   ├── places.jsx       # Nearby places
│   │   ├── hotels.jsx       # Hotels listing
│   │   ├── food.jsx         # Food section
│   │   └── travel.jsx       # Travel options
│   └── components/
├── server/                  # Node.js + Express Backend
│   ├── models/              # MongoDB schemas
│   │   ├── City.js
│   │   ├── Place.js
│   │   ├── Hotel.js
│   │   ├── Food.js
│   │   └── User.js
│   ├── routes/
│   │   ├── public/          # User-facing APIs
│   │   └── admin/           # Admin-only APIs
│   ├── middleware/
│   │   ├── isAuth.js
│   │   └── isAdmin.js
│   └── index.js
└── README.md
```

---

## 🔌 API Endpoints


---

## 🗄️ Database Schema (Key Fields)

```js
// City
{ name, famousFor, bestTime, avgBudget, status: ['active','inactive','pending'] }

// Place
{ name, category, distance, entryFee, openTime, latitude, longitude, cityId, status }

// Hotel
{ name, pricePerNight, facilities, distanceFromCenter, rating, isVerified, bestForBudget }

// Food
{ dish, restaurant, priceRange, isVeg, avgCostPerPerson, distance, bestTime }
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Maps API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/ramansingh19/Final-Year-Project.git
cd Final-Year-Project

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```



### Run the App

```bash
# Start backend
cd server
npm run dev

# Start frontend (new terminal)
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📅 Development Plan (7 Days)

| Day | Task |
|---|---|
| Day 1 | MongoDB schema design + folder structure |
| Day 2 | Admin authentication + middleware |
| Day 3 | Admin CRUD APIs |
| Day 4 | Public-facing APIs |
| Day 5 | Admin UI dashboard |
| Day 6 | User-facing UI (basic) |
| Day 7 | Polish, testing & demo |

---

## 💡 MVP Scope (v1)

Starting with a single city to keep it focused and deliverable:

- ✅ City: **Jaipur**
- ✅ 10 famous nearby places
- ✅ 20 hotels
- ✅ 10 food spots
- ✅ Admin panel for data management

---

## 💰 Monetization (Planned)

- Hotel booking commission
- Featured listings for hotels/restaurants
- Local guide promotions
- Affiliate travel links

---

## 🤝 Contributing

This is a final year academic project. Contributions, suggestions, and feedback are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Raman Singh**  
Final Year Project — 2025  
[GitHub](https://github.com/ramansingh19)

---
