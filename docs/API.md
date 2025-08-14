# API Documentation

## Authentication API

### NextAuth Configuration

Located in `app/api/auth/[...nextauth]/route.js`

#### Authentication Flow

1. User submits credentials (email/password)
2. System validates against MongoDB user collection
3. Password verification using bcrypt
4. JWT token generation with user data
5. Session management with role and permissions

#### Session Structure

```javascript
{
  user: {
    id: "user_id",
    email: "user@example.com",
    username: "username",
    role: "ADMIN|EDITOR|USER",
    permissions: ["CREATE_BLOG", "EDIT_BLOG"]
  }
}
```

## Server Actions API

### Blog Operations

#### `fetchBlogs()`

- **Purpose**: Retrieve all blog posts
- **Returns**: Array of blog objects
- **Permissions**: Public access

#### `fetchSingleBlog(id)`

- **Purpose**: Get specific blog with comments
- **Parameters**:
  - `id` (string): Blog ID
- **Returns**: Blog object with comments
- **Permissions**: Public access

#### `addBlog(formData)`

- **Purpose**: Create new blog post
- **Parameters**:
  - `formData`: Form data containing blog details
- **Required Fields**:
  - `title` (string): Blog title
  - `category` (string): Blog category
  - `description` (string): Blog content
  - `imageUrl` (string, optional): Blog image URL
- **Permissions**: ADMIN role OR CREATE_BLOG permission
- **Returns**: Redirects to /blogs on success

#### `updateBlog(id, formData)`

- **Purpose**: Update existing blog post
- **Parameters**:
  - `id` (string): Blog ID to update
  - `formData`: Updated blog data
- **Permissions**: ADMIN role OR EDIT_BLOG permission
- **Returns**: Redirects to /blogs on success

### Comment Operations

#### `addCommentToBlog(blogId, formData)`

- **Purpose**: Add comment to blog post
- **Parameters**:
  - `blogId` (string): Target blog ID
  - `formData`: Comment data containing `text`
- **Permissions**: Authenticated user
- **Returns**: Revalidates blog page

#### `deleteComment(commentId, blogId)`

- **Purpose**: Delete comment (author only)
- **Parameters**:
  - `commentId` (string): Comment ID to delete
  - `blogId` (string): Parent blog ID
- **Permissions**: Comment author only
- **Returns**: Revalidates blog page

#### `fetchComments(blogId)`

- **Purpose**: Get comments for specific blog
- **Parameters**:
  - `blogId` (string): Blog ID
- **Returns**: Array of 5 most recent comments
- **Permissions**: Public access

### User Management Operations

#### `fetchUsers()`

- **Purpose**: Get all users (limited to 5)
- **Returns**: Array of user objects
- **Permissions**: Admin access recommended

#### `assignPermission(userId, formData)`

- **Purpose**: Assign permission to user
- **Parameters**:
  - `userId` (string): Target user ID
  - `formData`: Contains `permission_name`
- **Permissions**: ADMIN role only
- **Returns**: Redirects to admin dashboard

## Error Handling

### Authentication Errors

- Invalid credentials return `null`
- Missing fields return `null`
- Database errors are logged to console

### Permission Errors

- Insufficient permissions result in no action
- Error messages logged to console
- User remains on current page

### Database Errors

- Prisma errors caught and logged
- Graceful fallbacks implemented
- Page revalidation ensures data consistency

## Rate Limiting & Security

### Built-in Protections

- NextAuth.js CSRF protection
- JWT token validation
- Server-side permission checks
- bcrypt password hashing

### Recommended Additions

- Rate limiting middleware
- Input validation schemas
- API request logging
- Error monitoring

## Response Formats

### Success Responses

- Server actions use redirects and revalidation
- Data fetching returns plain objects/arrays
- No explicit success status codes

### Error Responses

- Errors logged to console
- Silent failures for security
- User feedback through UI state changes
