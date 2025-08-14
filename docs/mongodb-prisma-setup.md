# 📝 Blog App – MongoDB & Prisma Setup Guide

This guide documents the setup process for integrating **MongoDB** and **Prisma ORM** into your **Next.js blog application** with **RBAC (Role-Based Access Control)** capabilities.

---

## 📦 Tech Stack

- **Next.js**
- **MongoDB** (via MongoDB Atlas or local)
- **Prisma ORM**
- **RBAC** (User, Role, and Permission management)

---

## 🛠 1. MongoDB Configuration

### a. Environment Variables

Create a `.env` file in the root directory of your project and add the following:

```env
# MongoDB Connection URI
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority"
```

> 🔐 Replace:
> - `<username>` and `<password>` with your MongoDB credentials.
> - `<cluster>` with your MongoDB Atlas cluster name.
> - `<dbname>` with your database name.

---

### b. Database Connection

Prisma will manage MongoDB connections internally using the `DATABASE_URL` from the `.env` file.

✅ **No need to handle raw MongoDB client connections manually.**

---

## 🧬 2. Prisma Setup

### a. Install Dependencies

```bash
npm install prisma --save-dev
npm install @prisma/client
```

---

### b. Initialize Prisma

```bash
npx prisma init
```

This creates the following:

- `.env` (if not present)
- `prisma/schema.prisma` for defining your database models
- `prisma` folder

---

### c. Configure `schema.prisma` for MongoDB

Open `prisma/schema.prisma` and set it up like this:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

Below this configuration, define your data models such as `User`, `Role`, `Permission`, `Post`, etc.

---

### d. Push Prisma Schema to MongoDB

After adding your models to `schema.prisma`, run:

```bash
npx prisma db push
```

> 🧠 Unlike SQL databases, MongoDB does **not** support Prisma migrations via `migrate`, so we use `db push`.

---

### e. Generate Prisma Client (Optional but recommended)

Run this after schema changes:

```bash
npx prisma generate
```

---

## 🖼️ 3. Image Configuration in Next.js

To allow images from external domains, configure the `next.config.mjs` file:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-image-domain.com'], // e.g., cloudinary.com, s3.amazonaws.com
  },
};

export default nextConfig;
```

> Replace `'your-image-domain.com'` with actual image source domains.

---

## ✅ Final Notes

- Your `.env` file should never be committed to version control. Add it to `.gitignore`:

```bash
# .gitignore
.env
```

- Use `PrismaClient` in API routes, server components, or utilities to access the database:

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

- Ensure your schema reflects your RBAC structure clearly, e.g.:

```prisma
model User {
  id       String   @id @default(auto()) @map("_id")
  email    String   @unique
  password String
  role     Role     @relation(fields: [roleId], references: [id])
  roleId   String
}

model Role {
  id          String        @id @default(auto()) @map("_id")
  name        String        @unique
  permissions Permission[]
  users       User[]
}

model Permission {
  id     String   @id @default(auto()) @map("_id")
  name   String   @unique
  roleId String
  role   Role     @relation(fields: [roleId], references: [id])
}
```

---

Happy Building! 🚀
