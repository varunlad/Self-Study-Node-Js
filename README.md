# 🔐 Express + JWT + MongoDB Auth API (MVC)

![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-blue)

A minimal authentication API with **Register, Login, Me, Change Password, Forgot/Reset Password**, built using **Node.js, Express, JWT, Mongoose**, and **Nodemailer**.  
Clean **MVC** structure for easy scaling.

---

## ✨ Features
- 🔑 JWT Auth (Login, Protected routes)
- 👤 Register & Profile (`/me`)
- 🔒 Change Password (old → new)
- ✉️ Forgot/Reset Password (email token)
- 🧱 MVC structure (controllers, routes, models, services)

---

## 🧭 Endpoints (Quick)
- `POST /auth/register` – create account  
- `POST /auth/login` – get `{ token, user }`  
- `GET /me` – profile (Bearer token)  
- `PATCH /auth/change-password` – old + new password (Bearer)  
- `POST /auth/forgot-password` – email reset link  
- `POST /auth/reset-password` – use token to set new password  

---

## 🚀 Quick Start
```bash
npm i
# add .env (see below)
npm run dev   # nodemon
# or
npm start
