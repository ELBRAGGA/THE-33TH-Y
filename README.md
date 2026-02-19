# THE 33TH Y - Vinyl Store Evolution 🎵

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![GitHub Pages](https://img.shields.io/badge/deploy-live-success?logo=github)](https://elbragga.github.io/THE-33TH-Y/)

## 🌐 Live Demo
**[View The 33rd Y Live](https://elbragga.github.io/THE-33TH-Y/)**  
Experience the vinyl store in action! Fully functional frontend with secure backend API integration.

A vinyl store application showcasing my evolution from frontend developer (2024) to cloud security engineer (2026). The 2024 version is a static website, while the 2026 version transforms it into a full-stack application with enterprise-grade security features.
## 📁 Project Structure
```markdown
THE-33TH-Y/
├── website/                 # Version 1.0 (2024) - Frontend only
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── images/
├── cpp-program/             # Original C++ console version (2024)
│   └── main.cpp
└── cloud-security-v2/       # Version 2.0 (2026) - Full-stack with security
    ├── frontend/            # Updated website with API integration
    │   ├── index.html
    │   ├── styles.css
    │   ├── script.js
    │   └── images/
    └── backend/             # Node.js API with security features
        ├── server.js
        ├── package.json
        └── .env
```

## 🚀 Version 2.0 - Cloud Security Features

### 🔐 Security Implementations

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| **JWT Authentication** | JSON Web Tokens | Secure user sessions |
| **Rate Limiting** | express-rate-limit | Prevent brute force attacks |
| **Security Headers** | Helmet.js | Protect against common vulnerabilities |
| **Password Hashing** | bcrypt | Secure credential storage |
| **CORS Protection** | CORS middleware | Control cross-origin requests |

### 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create new user account |
| POST | /api/auth/login | Authenticate user & get JWT token |
| GET | /api/records | Retrieve all vinyl records |
| GET | /api/records/:id | Get single record details |

## 🛠️ How to Run Locally

### Backend Server
```bash
cd cloud-security-v2/backend
npm install
echo "JWT_SECRET=your-secret-key-here" > .env
node server.js
```

### Frontend Application
```bash
cd cloud-security-v2/frontend
open index.html
```

## 📊 My Development Journey

| Year | Version | Technologies | Security Features |
|------|---------|--------------|-------------------|
| 2024 | v1.0 | HTML, CSS, JavaScript | None (static site) |
| 2024 | C++ Version | C++ | Console application |
| 2026 | v2.0 | Node.js, Express, JWT | Auth, Rate Limiting, Helmet, bcrypt |

## 🔮 Future Enhancements

- Add PostgreSQL database (AWS RDS)
- Deploy backend to AWS EC2
- Deploy frontend to Netlify
- Add HTTPS/SSL certificate
- Implement admin dashboard
- Containerize with Docker
- Add CI/CD pipeline

## 👨‍💻 Author

**Yahya (Elbragga) AFFAN**
- GitHub: [@ELBRAGGA](https://github.com/ELBRAGGA)
- Project Link: [https://github.com/ELBRAGGA/THE-33TH-Y](https://github.com/ELBRAGGA/THE-33TH-Y)
```
