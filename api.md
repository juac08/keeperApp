# Keeper API

Express.js REST API for the Keeper task management application with TypeScript, Prisma ORM, and PostgreSQL.

## Features

- 🔐 JWT Authentication- 🏢 Organization-Based Multi-Tenant System- 📋 Boards, Tasks, Subtasks
- � Board Members & Role-Based Permissions
- 💬 Comments
- 🏷️ Tags
- 🔍 User Search
- 📊 Activity Tracking
- 🐳 Docker Support

## Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **Auth**: JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. Clone and install dependencies:

```bash
cd api
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and update:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/keeper?schema=public"
JWT_SECRET="your-secure-secret-key"
PORT=3001
NODE_ENV=development
```

3. Set up the database:

```bash
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed  # Creates admin user
```

4. Start development server:

```bash
npm run dev
```

The API will be running at `http://localhost:3001`

## Docker Deployment

### Local Docker

```bash
docker-compose up -d
```

This starts:

- PostgreSQL on port 5432
- API on port 3001

### Digital Ocean Deployment

1. **Create a Droplet** (Ubuntu 22.04, $6/month)
2. **Install Docker**:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

3. **Clone your repo**:

```bash
git clone <your-repo-url>
cd keeper-api
```

4. **Set environment variables**:

```bash
echo "JWT_SECRET=$(openssl rand -base64 32)" > .env
```

5. **Start containers**:

```bash
docker-compose up -d
```

6. **Run migrations**:

```bash
docker-compose exec api npx prisma migrate deploy
```

7. **Set up firewall**:

```bash
ufw allow 22
ufw allow 3001
ufw enable
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (includes `isSuperAdmin` and `organizationRole`)

### Organizations

- `GET /api/organizations/:id/members` - List organization members
- `POST /api/organizations/:id/members` - Invite user to organization (admin only)
- `PATCH /api/organizations/:id/members/:userId` - Update member role (admin only)
- `DELETE /api/organizations/:id/members/:userId` - Remove member (admin only)

**Roles**: `admin`, `member`

### Boards

- `GET /api/boards` - Get all boards (where user is a member)
- `GET /api/boards/:id` - Get single board
- `POST /api/boards` - Create board (**admin only**)
- `PUT /api/boards/:id` - Update board (owner only)
- `DELETE /api/boards/:id` - Delete board (owner only)

### Board Members

- `GET /api/boards/:boardId/members` - List all board members
- `POST /api/boards/:boardId/members` - Add member (owner/admin only)
- `PATCH /api/boards/:boardId/members/:userId` - Update member role (owner only)
- `DELETE /api/boards/:boardId/members/:userId` - Remove member (owner/admin only)

**Roles**: `owner`, `admin`, `member`, `viewer`

### Tasks

- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/archive` - Archive/unarchive task
- `POST /api/tasks/:taskId/subtasks` - Create subtask
- `PUT /api/tasks/:taskId/subtasks/:id` - Update subtask
- `DELETE /api/tasks/:taskId/subtasks/:id` - Delete subtask
- `POST /api/tasks/:taskId/comments` - Create comment
- `GET /api/tasks/:taskId/activities` - Get task activities

### Tags

- `GET /api/tags?boardId=:id` - Get tags for board
- `POST /api/tags` - Create tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

### Users

- `GET /api/users` - Get all users
- `GET /api/users/search?q=:email` - Search users by email (min 3 chars)

## Database Schema

- **User**: Authentication and profile with super admin flag
- **Organization**: Multi-tenant organizations
- **OrganizationMember**: Organization membership with roles (admin/member)
- **Board**: Project boards scoped to organizations
- **BoardMember**: Board members with role-based permissions (owner/admin/member/viewer)
- **Task**: Tasks with status, priority, assignee
- **Subtask**: Task subtasks with completion status
- **Comment**: Task comments
- **Tag**: Categorization tags
- **Activity**: Audit log of changes

## Quick Start - Admin Setup

After initial setup, create an admin user:

```bash
npm run prisma:seed
```

**Admin Credentials:**

- Email: `admin@keeper.com`
- Password: `admin123`

⚠️ Change this password in production!

Login as admin to create boards and invite users to the organization.

## Multi-Tenant System

The API implements an organization-based multi-tenant system:

- **Users register** but have no boards initially
- **Only admins** can create boards
- **Admins invite users** to their organization
- **Users access** only boards they're added to

---

## Detailed Documentation

### Organization System

#### Roles

**Super Admin**

- `isSuperAdmin: true` on User model
- Can create boards regardless of organization role
- Cannot be removed from organizations
- Cannot have role changed

**Organization Admin**

- `role: "admin"` in OrganizationMember
- Can create boards within their organization
- Can invite users to the organization
- Can update member roles (except super admins)
- Can remove members (except themselves and super admins)

**Organization Member**

- `role: "member"` in OrganizationMember
- Cannot create boards
- Can access boards they're added to via BoardMember system
- Standard board member permissions apply (owner/admin/member/viewer)

#### Organization API Details

**GET /api/organizations/:id/members**

```json
// Response
{
  "members": [
    {
      "id": "member-uuid",
      "organizationId": "org-uuid",
      "userId": "user-uuid",
      "user": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "isSuperAdmin": false
      },
      "role": "admin",
      "createdAt": "2026-02-03T...",
      "updatedAt": "2026-02-03T..."
    }
  ]
}
```

**POST /api/organizations/:id/members**

```json
// Request
{
  "userId": "user-uuid",
  "role": "member" // optional, defaults to "member"
}
```

**PATCH /api/organizations/:id/members/:userId**

```json
// Request
{
  "role": "admin" // or "member"
}
```

**Restrictions:**

- Cannot change your own role
- Cannot change role of super admin

**DELETE /api/organizations/:id/members/:userId**

**Restrictions:**

- Cannot remove yourself
- Cannot remove super admin

---

### Board Members System

The board members management system allows multiple users to collaborate on boards with different permission levels.

#### Board Roles

- **Owner**: Full access, can delete board, manage all members, change any settings
- **Admin**: Can manage members (except owner), create/edit/delete tasks
- **Member**: Can create/edit/delete their own tasks, view all tasks
- **Viewer**: Read-only access, can view but not modify anything

#### Board Members API Details

**GET /api/boards/:boardId/members**

Lists all members of a board.

**Authorization**: User must be a member of the board

```json
// Response
{
  "members": [
    {
      "id": "member-uuid",
      "boardId": "board-uuid",
      "userId": "user-uuid",
      "user": {
        "id": "user-uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "role": "owner",
      "createdAt": "2026-02-03T...",
      "updatedAt": "2026-02-03T..."
    }
  ]
}
```

**POST /api/boards/:boardId/members**

Adds a new member to the board.

**Authorization**: User must be owner or admin of the board

```json
// Request
{
  "userId": "user-uuid",
  "role": "member" // optional, defaults to "member"
}

// Response (201)
{
  "id": "member-uuid",
  "boardId": "board-uuid",
  "userId": "user-uuid",
  "user": {
    "id": "user-uuid",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "role": "member",
  "createdAt": "2026-02-03T...",
  "updatedAt": "2026-02-03T..."
}
```

**Validations:**

- Role must be one of: "owner", "admin", "member", "viewer"
- User cannot add themselves if already a member
- Only owner can add other owners
- User being added must exist

**Error Responses:**

- `400`: Invalid request (missing fields, invalid role)
- `403`: Only board owners can add admin members
- `404`: User not found
- `409`: User is already a member

**PATCH /api/boards/:boardId/members/:userId**

Updates a member's role on the board.

**Authorization**: User must be the owner of the board

```json
// Request
{
  "role": "admin"
}
```

**Restrictions:**

- Cannot change owner role
- Cannot change your own role
- Only owner can update roles

**DELETE /api/boards/:boardId/members/:userId**

Removes a member from the board.

**Authorization**: User must be owner or admin

**Restrictions:**

- Cannot remove the owner
- Cannot remove yourself
- Admins can only remove members/viewers, not other admins

**Response**: 204 No Content

**GET /api/users/search?q=:email**

Search for users by email to add as board members.

**Query Parameters:**

- `q` (required): Email to search, minimum 3 characters

```json
// Response
{
  "users": [
    {
      "id": "user-uuid",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

#### Permission Middleware

The following middleware functions check board permissions:

- `requireBoardMember`: Checks if user is a member of the board
- `requireBoardAdmin`: Checks if user has admin or owner role
- `requireBoardOwner`: Checks if user is the board owner
- `requireBoardEditor`: Checks if user can modify content (not a viewer)

---

### Testing Flow

#### 1. Setup Admin

```bash
npm run prisma:seed
```

#### 2. Login as Admin

```bash
POST /api/auth/login
{
  "email": "admin@keeper.com",
  "password": "admin123"
}
```

#### 3. Admin Creates Boards

```bash
POST /api/boards
{
  "name": "Project Board",
  "description": "Description"
}
```

✅ Should succeed

#### 4. Register New User

```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Regular User"
}
```

#### 5. Login as New User

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 6. Try to Create Board (Should Fail)

```bash
POST /api/boards
{
  "name": "My Board",
  "description": "Description"
}
```

❌ Returns 403: "Only admins can create boards"

#### 7. Admin Invites User to Organization

```bash
POST /api/organizations/{orgId}/members
{
  "userId": "user-uuid",
  "role": "member"
}
```

#### 8. Admin Adds User to Board

```bash
POST /api/boards/{boardId}/members
{
  "userId": "user-uuid",
  "role": "member"
}
```

#### 9. User Can Now Access Board

```bash
GET /api/boards
```

✅ Shows boards the user is a member of

---

### Frontend Integration

#### User Object

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isSuperAdmin: boolean;
  organizationRole?: "admin" | "member";
}
```

#### Checking Permissions

```typescript
// Can create boards
const canCreateBoard = user.isSuperAdmin || user.organizationRole === 'admin';

// Show appropriate UI
{canCreateBoard ? (
  <CreateBoardButton />
) : (
  <p>Contact your admin to create boards</p>
)}
```

#### Empty State for Non-Members

```typescript
if (boards.length === 0 && user.organizationRole !== 'admin') {
  return <EmptyState message="Contact your admin to get access to boards" />;
}
```

#### Usage Example

```typescript
// Add a member to your board
const response = await fetch("/api/boards/board-123/members", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: "user-456",
    role: "member",
  }),
});

// Search for users
const users = await fetch("/api/users/search?q=jane@example.com", {
  headers: {
    Authorization: "Bearer <token>",
  },
});

// Update member role (owner only)
await fetch("/api/boards/board-123/members/user-456", {
  method: "PATCH",
  headers: {
    Authorization: "Bearer <token>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    role: "admin",
  }),
});

// Remove member
await fetch("/api/boards/board-123/members/user-456", {
  method: "DELETE",
  headers: {
    Authorization: "Bearer <token>",
  },
});
```

---

### Security Considerations

1. **Super Admin Access**: Super admins can perform any action - protect these accounts carefully
2. **Organization Isolation**: Boards are scoped to organizations - ensure proper org ID validation
3. **Member Validation**: Always verify user is a member of the organization before granting access
4. **Role Changes**: Only admins can modify roles, and they cannot modify their own role or super admin roles
5. **Default Password**: Change the seed script admin password before deploying to production

### Best Practices

1. **One Organization per Deployment**: Most deployments will have a single organization for all users
2. **Admin Designation**: Carefully choose who gets admin role - they control board creation
3. **Member Onboarding**: Have a clear process for admins to invite and add new users to boards
4. **Board Ownership**: Use the existing BoardMember system for fine-grained board permissions
5. **Audit Trail**: Activity tracking still works - monitor board and member changes

### Error Codes

- `400`: Bad request (missing fields, invalid values)
- `401`: Not authenticated (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Resource not found (user, organization, member, board)
- `409`: Conflict (user already a member)

---

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Production Considerations

- Change `JWT_SECRET` to a strong random value
- Use environment-specific database credentials
- Enable HTTPS with a reverse proxy (nginx/Caddy)
- Set up monitoring and logging
- Configure CORS for your frontend domain
- Set up automated backups for PostgreSQL
- Use PM2 or similar for process management (if not using Docker)

## License

MIT
