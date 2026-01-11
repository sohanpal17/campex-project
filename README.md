# 🎓 Campex - The Trusted Campus Marketplace

![Campex Banner](https://via.placeholder.com/1200x400/79864B/FFFFFF?text=CAMPEX+-+Buy,+Sell,+Connect)

<div align="center">

  ![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)
  ![Tailwind](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?style=for-the-badge&logo=spring-boot)
  ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql)
  ![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?style=for-the-badge&logo=firebase)
  ![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)

</div>

<br />

**Campex** is a hyper-local, peer-to-peer marketplace built exclusively for university students. By restricting access to verified college email domains (e.g., `@ves.ac.in`), we solve the "stranger danger" problem of open marketplaces like OLX or Facebook, creating a safe space for students to trade textbooks, electronics, and supplies.

---

## 🧐 The Problem
Students struggle to buy and sell campus essentials. WhatsApp groups are spammy and unorganized, while open marketplaces are unsafe and full of irrelevant listings.

## 💡 The Solution
**Campex** provides a verified, organized, and AI-moderated platform where every user is a confirmed student from your university.

---

## ✨ Key Features

### 🔐 Trust & Security
*   **Domain-Locked Auth:** Sign-up is strictly restricted to university email domains.
*   **OTP Verification:** Custom email verification flow using Gmail SMTP.
*   **Identity Verification:** Users must set up a profile with their Academic Year (FE, SE, TE, BE).

### 🛒 Smart Marketplace
*   **Vertical Feed:** Instagram-style scrolling feed for easy browsing.
*   **Advanced Filters:** Filter by **Category** (Books, Stationery, Electronics) and **Price Type** (Free, Fixed, Negotiable).
*   **Live Search:** Debounced search with instant results.

### 🛡️ AI & Moderation
*   **Automated Content Safety:** Integrated **Google Cloud Vision API** to scan uploaded images. Inappropriate or unsafe content is blocked instantly before listing.
*   **Community Safety:** Built-in reporting system and user blocking mechanisms.

### 💬 Interaction
*   **Real-Time Chat:** Seamless in-app messaging to negotiate deals and arrange meetups.
*   **Notifications:** Push notifications via **Firebase Cloud Messaging (FCM)** for new messages and wishlist updates.

---

## 🛠️ Technology Stack

| Domain | Technology | Use Case |
| :--- | :--- | :--- |
| **Frontend** | **React.js + Vite** | SPA Architecture, Fast HMR |
| **Styling** | **Tailwind CSS** | Custom "Olive & Gold" Design System |
| **State** | **React Query** | Server state management & caching |
| **Backend** | **Spring Boot (Java 17)** | RESTful API, Business Logic |
| **Database** | **PostgreSQL (Supabase)** | Relational Data Persistence |
| **Auth** | **Firebase Auth** | Identity Management & Token Verification |
| **Storage** | **Cloudinary** | Image Optimization & CDN |
| **AI** | **Google Cloud Vision** | Image Content Moderation |
| **Deployment** | **Vercel** (FE) / **Render** (BE) | CI/CD Hosting |

---

## 📸 Application Screenshots

| **Landing Page** | **Home Feed** | **Selling Wizard** |
|:---:|:---:|:---:|
| <img src="https://via.placeholder.com/300x500?text=Landing" width="300" /> | <img src="https://via.placeholder.com/300x500?text=Feed" width="300" /> | <img src="https://via.placeholder.com/300x500?text=Sell+Page" width="300" /> |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   Java JDK 17
*   Maven
*   PostgreSQL Database (Local or Supabase)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/campex.git
cd campex
```

### 2. Backend Setup
Navigate to the backend folder:
```bash
cd campex-backend
```
Add your configuration files to `src/main/resources/`:
* `firebase-service-account.json`
* `google-credentials.json`

Configure `application.properties` with your database and API keys.

Run the server:
```bash
./mvnw spring-boot:run
```
Server runs on port 8080.

### 3. Frontend Setup
Navigate to the frontend folder:
```bash
cd campex-frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file (see structure below).

Run the client:
```bash
npm run dev
```
Client runs on http://localhost:3000.

### 🔑 Environment Variables

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_COLLEGE_EMAIL_DOMAIN=@ves.ac.in
```

#### Backend (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://host:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=password
cloudinary.cloud-name=name
cloudinary.api-key=key
cloudinary.api-secret=secret
google.cloud.project-id=id
spring.mail.username=email@gmail.com
spring.mail.password=app_password
```

## ☁️ Deployment

### Frontend (Vercel)
1. Push code to GitHub.
2. Import project into Vercel.
3. Add Environment Variables in Vercel Dashboard.
4. Deploy.

### Backend (Render)
1. Create a Web Service on Render.
2. Connect GitHub repo.
3. Set Build Command: `./mvnw clean package`
4. Set Start Command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
5. Add Environment Variables (or upload secure files).

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <p>Made with ❤️ by the Campex Team</p>
</div>
