# 🔐 Next.js 14 Authentication with NextAuth.js – Full Guide for Beginners

This document explains how to implement **authentication**, **session management**, and **role-based route protection** in a **Next.js 14** app using **NextAuth.js** with **Credentials Provider**, **JWT**, and **middleware**.

---

## 📦 Packages to Install

Install the required packages:

```bash
npm install next-auth
npm install bcrypt
```

- `next-auth` – handles authentication
- `bcrypt` – used to hash and verify passwords

---

## 🔧 Folder Structure Suggestion

```
/app
  /api
    /auth
      [...nextauth]/route.js
  /dashboard
    page.jsx
  /login
    page.jsx
/prisma
  schema.prisma
/utils
  authOptions.js
  middleware.js
```

---

## 📁 Route Handler Setup (app/api/auth/[...nextauth]/route.js)

This file contains the main auth configuration:

```js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 🧠 Key Concepts

### 🔐 Credentials Provider

Allows us to authenticate users via email and password.

### 🛡️ JWT (JSON Web Tokens)

- Used to store session data client-side (not in a database).
- Set via `session.strategy = "jwt"`.

### 🪪 Session Callback

Adds custom fields like `role` to the session:

```js
async session({ session, token }) {
  session.user.role = token.role;
  return session;
}
```

---

## 🧪 Middleware – Protecting Routes

You can use middleware to restrict access based on user roles.

`middleware.js`:

```js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const restrictedRoutes = ["/dashboard"];

  if (
    restrictedRoutes.includes(new URL(req.url).pathname) &&
    !token.role.includes("ADMIN")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

## 🧩 Role-Based Access in Components

```js
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role.includes("EDIT_BLOG")) {
    console.log("You cannot Edit Blog");
    redirect("/");
  }

  return <div>Welcome to the Editor’s Dashboard</div>;
}
```

---

## 🐛 Error in Fetch

### Example:

```js
let text = "Hello world, welcome to the universe.";
let result = text.includes("world"); // returns true
```

Used to check for permission roles like:

```js
if (!session?.user?.role.includes("EDIT_BLOG")) {
  redirect("/");
}
```

---

## ✅ Summary

- Use **NextAuth.js** with **Credentials Provider** for login.
- Use **JWT strategy** to avoid server-stored sessions.
- Use **bcrypt** to hash passwords.
- Use **middleware** and **callbacks** to manage roles and secure pages.
- Extend sessions and tokens with custom fields like `role`.

---

Happy Coding! 🎯
