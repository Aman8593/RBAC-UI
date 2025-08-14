# Development Guide

## Development Environment Setup

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm
- MongoDB (local or Atlas)
- Git

### Initial Setup

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd rbac-ui
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   DATABASE_URL="mongodb://localhost:27017/rbac-ui"
   NEXTAUTH_SECRET="development-secret-key"
   NEXTAUTH_JWT_SECRET="development-jwt-secret"
   NEXTAUTH_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

3. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push

   # (Optional) Open Prisma Studio
   npx prisma studio
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Code Organization

#### Component Structure

```javascript
// components/ComponentName.jsx
import { useState } from "react";

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  return <div className="component-container">{/* Component JSX */}</div>;
}
```

#### Server Action Pattern

```javascript
// actions/actions.js
"use server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function actionName(formData) {
  const session = await getServerSession(authOptions);

  // Permission check
  if (!session || !hasPermission(session.user, "REQUIRED_PERMISSION")) {
    return { error: "Unauthorized" };
  }

  // Database operation
  try {
    const result = await prisma.model.create({
      data: {
        // data fields
      },
    });

    revalidatePath("/relevant-path");
    return { success: true, data: result };
  } catch (error) {
    console.error("Action error:", error);
    return { error: "Operation failed" };
  }
}
```

### Adding New Features

#### 1. Database Schema Changes

```bash
# Modify prisma/schema.prisma
# Then apply changes
npx prisma db push
npx prisma generate
```

#### 2. Creating New Pages

```javascript
// app/new-feature/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function NewFeaturePage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>New Feature</h1>
      {/* Page content */}
    </div>
  );
}
```

#### 3. Adding Server Actions

```javascript
// actions/newFeatureActions.js
"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createNewItem(formData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    authorId: session.user.id,
  };

  const newItem = await prisma.newModel.create({ data });

  revalidatePath("/new-feature");
  return newItem;
}
```

#### 4. Creating Components

```javascript
// app/components/NewComponent.jsx
"use client";
import { useState } from "react";

export default function NewComponent({ initialData }) {
  const [data, setData] = useState(initialData);

  const handleSubmit = async (formData) => {
    // Handle form submission
  };

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Permission System Development

### Adding New Permissions

1. **Define Permission Constants**

   ```javascript
   // lib/permissions.js
   export const PERMISSIONS = {
     CREATE_BLOG: "CREATE_BLOG",
     EDIT_BLOG: "EDIT_BLOG",
     DELETE_BLOG: "DELETE_BLOG",
     MANAGE_USERS: "MANAGE_USERS",
     // Add new permissions here
   };
   ```

2. **Update Permission Checks**

   ```javascript
   // lib/auth.js
   export function hasPermission(user, permission) {
     return user.role === "ADMIN" || user.permissions?.includes(permission);
   }
   ```

3. **Apply in Server Actions**
   ```javascript
   export async function protectedAction(formData) {
     const session = await getServerSession(authOptions);

     if (!hasPermission(session?.user, PERMISSIONS.CREATE_BLOG)) {
       throw new Error("Insufficient permissions");
     }

     // Action logic
   }
   ```

### Role Management

#### Adding New Roles

1. Update Prisma schema enum
2. Update role checks in middleware
3. Add role-specific UI components
4. Update permission assignment logic

```prisma
enum Role {
  ADMIN
  EDITOR
  MODERATOR  // New role
  USER
}
```

## Testing Strategy

### Unit Testing Setup

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```javascript
// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customJestConfig);
```

### Component Testing

```javascript
// __tests__/components/BlogItem.test.js
import { render, screen } from "@testing-library/react";
import BlogItem from "@/app/components/BlogItem";

describe("BlogItem", () => {
  const mockBlog = {
    id: "1",
    title: "Test Blog",
    description: "Test Description",
    author: { username: "testuser" },
  };

  it("renders blog information", () => {
    render(<BlogItem blog={mockBlog} />);

    expect(screen.getByText("Test Blog")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });
});
```

### API Testing

```javascript
// __tests__/api/auth.test.js
import { POST } from "@/app/api/auth/[...nextauth]/route";

describe("/api/auth", () => {
  it("handles valid credentials", async () => {
    const request = new Request("http://localhost:3000/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

## Debugging

### Development Tools

1. **Prisma Studio**

   ```bash
   npx prisma studio
   ```

2. **Next.js Debug Mode**

   ```bash
   DEBUG=* npm run dev
   ```

3. **Database Logging**
   ```javascript
   // Enable in development
   const prisma = new PrismaClient({
     log: ["query", "info", "warn", "error"],
   });
   ```

### Common Issues

#### Authentication Problems

```javascript
// Debug session issues
console.log("Session:", await getServerSession(authOptions));
console.log("Token:", token);
```

#### Database Connection Issues

```javascript
// Test database connection
try {
  await prisma.$connect();
  console.log("Database connected");
} catch (error) {
  console.error("Database connection failed:", error);
}
```

#### Permission Issues

```javascript
// Debug permission checks
console.log("User role:", session?.user?.role);
console.log("User permissions:", session?.user?.permissions);
console.log("Required permission:", requiredPermission);
```

## Code Style Guidelines

### JavaScript/React Conventions

1. **Use functional components with hooks**
2. **Prefer server components when possible**
3. **Use TypeScript for type safety (future enhancement)**
4. **Follow Next.js App Router conventions**

### CSS/Styling Guidelines

1. **Use TailwindCSS utility classes**
2. **Create component-specific styles when needed**
3. **Follow mobile-first responsive design**
4. **Use semantic HTML elements**

### File Naming Conventions

- **Components**: PascalCase (`BlogItem.jsx`)
- **Pages**: lowercase (`page.js`, `layout.js`)
- **Actions**: camelCase (`actions.js`)
- **Utilities**: camelCase (`utils.js`)

## Performance Optimization

### Development Best Practices

1. **Use Server Components by default**
2. **Minimize client-side JavaScript**
3. **Implement proper loading states**
4. **Use Next.js Image component for images**
5. **Implement pagination for large datasets**

### Database Optimization

```javascript
// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    username: true,
    email: true,
    role: true,
  },
});

// Use pagination
const blogs = await prisma.blog.findMany({
  take: 10,
  skip: page * 10,
  orderBy: { createdAt: "desc" },
});
```

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development
- `hotfix/*`: Critical fixes

### Commit Conventions

```
feat: add user permission management
fix: resolve authentication redirect issue
docs: update API documentation
style: format code with prettier
refactor: optimize database queries
test: add component unit tests
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement feature with tests
3. Update documentation
4. Create pull request to `develop`
5. Code review and approval
6. Merge to `develop`
7. Deploy to staging for testing
8. Merge to `main` for production

## Environment Management

### Development Environment

```env
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/rbac-ui-dev
NEXTAUTH_URL=http://localhost:3000
```

### Staging Environment

```env
NODE_ENV=staging
DATABASE_URL=mongodb+srv://user:pass@cluster/rbac-ui-staging
NEXTAUTH_URL=https://staging.yourapp.com
```

### Production Environment

```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster/rbac-ui-prod
NEXTAUTH_URL=https://yourapp.com
```
