# 🏕️ Campex - The Ultimate Campus Marketplace

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F)
![PostgreSQL](https://img.shields.io/badge/Database-Supabase-3ECF8E)

**Campex** is a modern, full-stack marketplace platform designed specifically for college campuses. It bridges the gap between students who want to sell their old items (books, electronics, dorm essentials) and those looking for affordable deals.

Built with performance and aesthetics in mind, Campex features a premium UI with smooth animations, real-time search, and a secure backend.

---

## ✨ Key Features

*   **🔍 Smart Search**: Instant filtering by category, price, and condition.
*   **🛍️ Buy & Sell**: Easy listing creation with multi-image upload.
*   **🎨 Premium UI**: Glassmorphism design, entrance animations, and responsive layout.
*   **🔐 Secure Auth**: University email verification using Firebase Authentication.
*   **📱 User Profiles**: Track your listings, sold items, and saved favorites.
*   **🛡️ Reporting System**: Community moderation with admin email notifications.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS + Framer Motion (Animations)
*   **State Management**: TanStack Query
*   **Icons**: Lucide React

### Backend
*   **Core**: Java Spring Boot 3
*   **Database**: PostgreSQL (Hosted on Supabase)
*   **ORM**: Hibernate / Spring Data JPA
*   **Security**: Spring Security + Firebase Admin SDK
*   **Cloud Storage**: Cloudinary (Image Optimization)
*   **Email**: JavaMailSender (Gmail SMTP)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   Java JDK 17+
*   Maven

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/campex-project.git
cd campex-project
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd campex-backend
```

Create a file named `src/main/resources/application-local.properties` and add your secrets:
```properties
spring.datasource.password=YOUR_DB_PASSWORD
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET
spring.mail.password=YOUR_MAIL_PASSWORD
```

Run the server:
```bash
mvn spring-boot:run
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd campex-frontend
```

Install dependencies and start the dev server:
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the app!

---

## 📸 Screenshots

*(Add your screenshots here)*

| Home Page | Search |
|:---:|:---:|
| ![Home](https://via.placeholder.com/400x200?text=Home+Page+Screenshot) | ![Search](https://via.placeholder.com/400x200?text=Search+Page+Screenshot) |

| Item Details | Sell Form |
|:---:|:---:|
| ![Details](https://via.placeholder.com/400x200?text=Details+Screenshot) | ![Sell](https://via.placeholder.com/400x200?text=Sell+Page+Screenshot) |

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
