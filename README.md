# RBAC-UI - Role-Based Access Control Blog Platform

A modern blog platform built with Next.js 15 that implements comprehensive Role-Based Access Control (RBAC) with user authentication, permissions management, and content management features.

## Features

### Authentication & Authorization

- **NextAuth.js Integration**: Secure JWT-based authentication
- **Role-Based Access Control**: Three user roles (ADMIN, EDITOR, USER)
- **Permission System**: Granular permissions for specific actions
- **Protected Routes**: Middleware-based route protection

### Blog Management

- **Create/Edit Blogs**: Role and permission-based blog creation and editing
- **Comment System**: Interactive commenting with author-based deletion
- **Content Categories**: Organized blog categorization
- **Image Support**: Blog image upload and display

### User Management

- **Admin Dashboard**: User management and permission assignment
- **User Profiles**: Individual user data and preferences
- **Permission Assignment**: Dynamic permission granting by admins

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 18, TailwindCSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js with Credentials Provider
- **Styling**: TailwindCSS with Geist font family
- **Security**: bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- npm/yarn/pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd rbac-ui
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```env
DATABASE_URL="mongodb://your-mongodb-connection-string"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_JWT_SECRET="your-jwt-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
rbac-ui/
├── app/
│   ├── api/auth/[...nextauth]/     # NextAuth configuration
│   ├── admin/                      # Admin dashboard pages
│   ├── auth/                       # Authentication pages
│   ├── blogs/                      # Blog-related pages
│   ├── components/                 # Reusable UI components
│   ├── libs/                       # Utility libraries
│   ├── ui/                         # UI components
│   ├── layout.js                   # Root layout
│   ├── page.js                     # Home page
│   └── middleware.js               # Route protection middleware
├── actions/
│   └── actions.js                  # Server actions for data operations
├── prisma/
│   └── schema.prisma              # Database schema
└── public/                        # Static assets
```

## Database Schema

### User Model

- **id**: Unique identifier
- **username**: Display name
- **email**: Unique email address
- **password**: Hashed password
- **role**: User role (ADMIN, EDITOR, USER)
- **permissions**: Array of specific permissions
- **interestedTopics**: User preferences

### Blog Model

- **id**: Unique identifier
- **title**: Blog title
- **description**: Blog content
- **category**: Blog category
- **tags**: Array of tags
- **authorId**: Reference to User
- **imageUrl**: Optional blog image
- **likes/upvotes**: Engagement metrics
- **published**: Publication status

### Comment Model

- **id**: Unique identifier
- **text**: Comment content
- **authorId**: Reference to User
- **blogId**: Reference to Blog

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Server Actions

- `fetchBlogs()` - Get all blogs
- `fetchSingleBlog(id)` - Get blog by ID
- `addBlog(formData)` - Create new blog (ADMIN/CREATE_BLOG permission)
- `updateBlog(id, formData)` - Update blog (ADMIN/EDIT_BLOG permission)
- `addCommentToBlog(blogId, formData)` - Add comment
- `deleteComment(commentId, blogId)` - Delete comment (author only)
- `fetchUsers()` - Get all users (admin)
- `assignPermission(userId, formData)` - Assign permissions (admin)

## Permissions System

### Roles

- **ADMIN**: Full system access
- **EDITOR**: Content management permissions
- **USER**: Basic user permissions

### Specific Permissions

- `CREATE_BLOG`: Create new blog posts
- `EDIT_BLOG`: Edit existing blog posts
- Additional permissions can be assigned dynamically

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure session management
- **Route Protection**: Middleware-based access control
- **Permission Validation**: Server-side permission checks
- **CSRF Protection**: Built-in NextAuth.js security

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Permissions

1. Define permission in your permission system
2. Add permission checks in server actions
3. Update UI components to respect permissions
4. Test with different user roles

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms

1. Build the application: `npm run build`
2. Set up environment variables
3. Configure MongoDB connection
4. Deploy the `.next` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
