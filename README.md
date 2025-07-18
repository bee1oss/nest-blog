# 🛡️ NestJS Authentication System (Secure Cookie + CSRF + Rotation)

This project implements a **secure, scalable, and production-ready authentication system** using NestJS and Prisma, with refresh token rotation and CSRF protection.

---

## 📦 Technologies Used

- **NestJS**
- **Prisma** + PostgreSQL
- **@nestjs/jwt**, **@nestjs/passport**, **passport-jwt**
- **argon2** (password hashing)
- **cookie-parser**
- **@nestjs/config**
- **uuid** / `crypto` (for CSRF token generation)

---

## 🔐 Authentication Flow

### Login / Register

- Verifies user credentials
- Generates 3 cookies:
  - `access_token` (1 hour, httpOnly)
  - `refresh_token` (7 days, httpOnly, saved in DB)
  - `csrf_token` (1 hour, JS-accessible)
- Sets cookies in response

### Accessing Protected Routes

- Requires:
  - `access_token` (cookie)
  - `csrf_token` (cookie)
  - `X-CSRF-Token` header matching `csrf_token`
- Verified using JwtStrategy + CsrfMiddleware

### Refresh Token Rotation

- Validates `refresh_token` from DB
- Deletes used token
- Issues new `access_token` and `refresh_token`
- Saves new token in DB

### Logout

- Clears all cookies
- Deletes refresh token from DB

---

## 🛡️ Security Measures

| Feature | Description |
|--------|-------------|
| `httpOnly` Cookies | Prevents XSS |
| `secure` Cookies | HTTPS only |
| `sameSite: none` | Supports cross-origin frontend |
| CSRF Protection | Validates `csrf_token` + header |
| Password Hashing | Uses argon2 |
| Token Rotation | One-time use refresh tokens |
| Token Invalidation | DB-deletion on logout |

---

## 🧠 Architecture

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── dto/
├── refresh-token/
│   └── refresh-token.service.ts
├── user/
├── common/
│   └── middleware/csrf.middleware.ts
├── main.ts
```

---

## 🗃️ Database Schema

```
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 🔧 Environment Variables (.env)

```
JWT_SECRET=your-jwt-secret
PORT=5000
CLIENT_URL=http://localhost:3000
SERVER_DOMAIN=localhost
```

---

## 🧪 Testing

- Login → receives all 3 cookies
- Access protected routes with cookies + CSRF header
- Refresh token only works once (rotation)
- Logout clears and invalidates tokens

---

## 📝 Last Updated

2025-07-17
