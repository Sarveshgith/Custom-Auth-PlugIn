# 🔐 Centralized RS256 Authentication System (Manual JWT)

A secure and scalable authentication service for microservices using **RS256 (RSA SHA-256)**, built from scratch without JWT libraries. This project demonstrates how to **manually create and verify JWTs** using **asymmetric key cryptography** — with a centralized Auth Service issuing signed tokens and other services verifying them using a public key.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [📐 Architecture](#-architecture)
- [🔐 Key Generation](#-key-generation)
- [🚀 Usage](#-usage)

---

## ✨ Features

✅ Centralized **Auth Service** that signs tokens with a **private RSA key**  
✅ Microservices verify tokens using **public RSA key**  
✅ Manual JWT creation: no libraries like `jsonwebtoken` used  
✅ Stateless and scalable across distributed systems  
✅ Secure token expiration and role-based payload  
✅ Public key exposed via endpoint or local embedding  
✅ Tamper-proof authentication model  

---

## 📐 Architecture

```

+-------------+           +-------------------+           +------------------+
\|   Client    |           |   Auth Service    |           |  API Service A   |
+-------------+           +-------------------+           +------------------+
│                         │                                │
├── Login Request ───────▶│                                │
│                         ├── Validates login              │
│                         └── Signs JWT with private key   │
◀──── Token (JWT) ────────┘                                │
│                                                          │
├─ Request: Authorization: Bearer <JWT> ──────────────────▶│
│                                                          ├── Fetches public key from Auth (if not cached)
│                                                          ├── Verifies JWT signature & claims
│                                                          └── Grants access if valid

````

---

## Key Generation

Generate RSA 2048-bit key pair:

```bash
# Generate private key
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

# Generate public key from private
openssl rsa -pubout -in private.pem -out public.pem

```

---

##  Usage


###  Issue Token

```bash
curl -X POST http://localhost:3000/issue-token \
-H "Content-Type: application/json" \
-d '{"userId": "user123", "role": "admin"}'
```

###  Access Protected Endpoint

```bash
curl http://localhost:4000/main \
-H "Authorization: Bearer <paste-token-here>"
```

---