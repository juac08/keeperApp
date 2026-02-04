# Organization-Based Multi-Tenant System

## Overview

Keeper now implements an organization-based multi-tenant system where users must be part of an organization to access boards. Only organization admins can create boards, and users can only see boards they've been explicitly added to.

## Table of Contents

- [Architecture](#architecture)
- [User Roles](#user-roles)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [User Flows](#user-flows)
- [Setup & Configuration](#setup--configuration)
- [Testing](#testing)

---

## Architecture

### Database Schema

```
┌─────────────┐
│    User     │
│─────────────│
│ id          │
│ email       │
│ name        │
│ password    │
│ isSuperAdmin│──┐
└─────────────┘  │
       │         │
       │         │
       ▼         │
┌─────────────────────┐
│ OrganizationMember  │
│─────────────────────│
│ id                  │
│ organizationId      │
│ userId              │
│ role (admin/member) │
└─────────────────────┘
       │
       │
       ▼
┌─────────────┐
│Organization │
│─────────────│
│ id          │
│ name        │
│ slug        │
└─────────────┘
       │
       │
       ▼
┌─────────────┐        ┌─────────────┐
│   Board     │────────│ BoardMember │
│─────────────│        │─────────────│
│ id          │        │ boardId     │
│ name        │        │ userId      │
│ orgId       │        │ role        │
└─────────────┘        └─────────────┘
```

### Key Concepts

1. **Organization**: A container for users and boards
2. **Organization Member**: Links users to organizations with a role (admin/member)
3. **Board Member**: Links users to specific boards with granular permissions
4. **Super Admin**: Special users who bypass organization restrictions

---

## User Roles

### Super Admin (`isSuperAdmin: true`)

- **Can do everything** across all organizations
- Cannot be removed from organizations
- Cannot have role changed
- Created via seed script or environment variable
- Bypass all permission checks

### Organization Admin (`organizationRole: 'admin'`)

- **Can create boards** within their organization
- **Can manage organization members**:
  - Invite users to organization
  - Change member roles (admin ↔ member)
  - Remove members (except themselves and super admins)
- Can be added to boards as owner/admin/member/viewer
- Full access to all features

### Organization Member (`organizationRole: 'member'`)

- **Cannot create boards**
- **Cannot manage organization members**
- Can be added to boards by board owners/admins
- Can only see boards they're explicitly added to
- Can use all task management features on assigned boards

### Board Roles (Independent of Organization Role)

Once added to a board, users have board-specific roles:

- **Owner**: Full control over board
- **Admin**: Can add/remove members, manage settings
- **Member**: Can create/edit tasks
- **Viewer**: Read-only access

---

## API Endpoints

### Authentication

#### `POST /api/auth/register`

Register a new user (no boards created automatically)

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### `POST /api/auth/login`

Login user

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### `GET /api/auth/me`

Get current user info including organization role

**Response:**

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "isSuperAdmin": false,
  "organizationRole": "admin",
  "organizationId": "org_id"
}
```

### Organizations

#### `GET /api/organizations/:id/members`

List all members in an organization

**Authentication:** Required  
**Authorization:** Any member can view

**Response:**

```json
{
  "members": [
    {
      "id": "member_id",
      "organizationId": "org_id",
      "userId": "user_id",
      "role": "admin",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": null
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/organizations/:id/members`

Invite a user to the organization

**Authentication:** Required  
**Authorization:** Admin or Super Admin only

**Request:**

```json
{
  "email": "newuser@example.com",
  "role": "member"
}
```

**Response:**

```json
{
  "id": "member_id",
  "organizationId": "org_id",
  "userId": "new_user_id",
  "role": "member",
  "user": {
    "id": "new_user_id",
    "name": "New User",
    "email": "newuser@example.com"
  }
}
```

**Error Responses:**

- `403`: Not authorized (user is not admin)
- `404`: User with email not found
- `409`: User already in organization

#### `PATCH /api/organizations/:id/members/:userId`

Update member role

**Authentication:** Required  
**Authorization:** Admin or Super Admin only

**Request:**

```json
{
  "role": "admin"
}
```

**Response:**

```json
{
  "id": "member_id",
  "role": "admin",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**

- `403`: Cannot change super admin role
- `403`: Not authorized

#### `DELETE /api/organizations/:id/members/:userId`

Remove a member from the organization

**Authentication:** Required  
**Authorization:** Admin or Super Admin only

**Response:** `204 No Content`

**Error Responses:**

- `403`: Cannot remove yourself
- `403`: Cannot remove super admin
- `403`: Not authorized

### Boards

#### `POST /api/boards`

Create a new board (admin only)

**Authentication:** Required  
**Authorization:** Organization Admin or Super Admin only

**Request:**

```json
{
  "name": "Q1 Planning",
  "description": "Planning board for Q1 2024",
  "template": "default",
  "icon": "📋"
}
```

**Response:**

```json
{
  "id": "board_id",
  "name": "Q1 Planning",
  "description": "Planning board for Q1 2024",
  "organizationId": "org_id",
  "template": "default",
  "icon": "📋",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**

- `403`: Only admins can create boards

---

## Frontend Components

### BoardSelector

**Location:** `src/components/board/BoardSelector.tsx`

**Features:**

- Displays dropdown of available boards
- Shows "Create Board" button only to admins
- Shows "No boards available. Contact your admin." to non-admins with no boards
- Hides "Create New Board" option in dropdown for non-admins

**Props:**

```typescript
type Props = {
  onCreateBoard: () => void;
};
```

**Access Control:**

```typescript
const canCreateBoard = user?.organizationRole === "admin" || user?.isSuperAdmin;
```

### OrganizationMembersModal

**Location:** `src/components/modal/OrganizationMembersModal.tsx`

**Features:**

- Display all organization members
- Invite new members by email
- Assign roles (admin/member)
- Change member roles
- Remove members
- View member information with avatars

**Props:**

```typescript
type Props = {
  organizationId: string;
  isOpen: boolean;
  onClose: () => void;
};
```

**Permissions:**

- Only visible to admins and super admins
- Super admins cannot be removed or have roles changed
- Current user cannot remove themselves

### SettingsDropdown

**Location:** `src/components/header/SettingsDropdown.tsx`

**Features:**

- "Organization Members" option (admin only)
- "Board Members" option (all users)
- Other settings (theme, density, etc.)

**Access Control:**

```typescript
const canManageOrganization =
  user?.organizationRole === "admin" || user?.isSuperAdmin;
```

### API Integration

**Location:** `src/store/api/organizationsApi.ts`

**Exports:**

```typescript
// Queries
useGetOrganizationMembersQuery(organizationId);

// Mutations
useAddOrganizationMemberMutation();
useUpdateOrganizationMemberRoleMutation();
useRemoveOrganizationMemberMutation();
```

---

## User Flows

### 1. New User Registration Flow

```mermaid
graph TD
    A[User Registers] --> B[Account Created]
    B --> C[No Boards Available]
    C --> D[Shows: Contact Admin Message]
    D --> E[Wait for Admin Invite]
```

**Steps:**

1. User fills registration form
2. `POST /api/auth/register` creates user account
3. User is logged in but has no organization membership
4. UI shows "No boards available. Contact your admin."
5. User waits for admin to add them to organization

### 2. Admin Inviting Users Flow

```mermaid
graph TD
    A[Admin Opens Settings] --> B[Click Organization Members]
    B --> C[Organization Members Modal Opens]
    C --> D[Enter User Email]
    D --> E[Select Role: Admin/Member]
    E --> F[Click Add]
    F --> G[User Added to Organization]
    G --> H[User Can Now See Boards]
```

**Steps:**

1. Admin clicks Settings → "Organization Members"
2. Modal displays current members
3. Admin enters new user's email address
4. Admin selects role (admin or member)
5. Clicks "Add" button
6. `POST /api/organizations/:id/members` adds user
7. User is now part of organization
8. User can be added to boards via "Board Members"

### 3. Board Creation Flow (Admin Only)

```mermaid
graph TD
    A[Admin Clicks Create Board] --> B[Board Modal Opens]
    B --> C[Fill Board Details]
    C --> D[Select Template]
    D --> E[Click Create Board]
    E --> F[Board Created in Organization]
    F --> G[Admin is Board Owner]
    G --> H[Can Add Other Members]
```

**Steps:**

1. Admin clicks "Create Board" button
2. Board creation modal opens
3. Admin fills board name, description, template
4. `POST /api/boards` creates board
5. Board is created within organization
6. Admin becomes board owner automatically
7. Admin can add other organization members to board

### 4. Member Accessing Boards Flow

```mermaid
graph TD
    A[Member Logs In] --> B{Has Boards?}
    B -->|No| C[Shows: Contact Admin]
    B -->|Yes| D[Shows Board List]
    D --> E[Select Board]
    E --> F[Access Board Tasks]
    F --> G[Create/Edit Tasks]
```

**Steps:**

1. Member logs in
2. If no boards assigned: sees "Contact your admin" message
3. If boards assigned: sees list in BoardSelector
4. Member selects a board
5. Can view and work on tasks based on board role

### 5. Changing Member Roles Flow

```mermaid
graph TD
    A[Admin Opens Org Members] --> B[Views Member List]
    B --> C[Select Member Role Dropdown]
    C --> D[Choose New Role]
    D --> E[Role Updated]
    E --> F{New Role = Admin?}
    F -->|Yes| G[Can Create Boards]
    F -->|No| H[Cannot Create Boards]
```

**Steps:**

1. Admin opens Organization Members modal
2. Finds member to update
3. Clicks role dropdown next to member
4. Selects new role (admin/member)
5. `PATCH /api/organizations/:id/members/:userId` updates role
6. Member's permissions immediately updated
7. If promoted to admin: can create boards
8. If demoted to member: loses board creation ability

---

## Setup & Configuration

### Backend Setup

#### 1. Database Migration

Run the Prisma migration to add organization tables:

```bash
cd api
npx prisma migrate dev --name add-organizations
```

#### 2. Create Bootstrap Admin

**Option A: Seed Script (Recommended)**

Create `api/prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@keeper.com",
      password: hashedPassword,
      name: "System Admin",
      isSuperAdmin: true,
    },
  });

  const organization = await prisma.organization.create({
    data: {
      name: "Default Organization",
      slug: "default",
      members: {
        create: {
          userId: adminUser.id,
          role: "admin",
        },
      },
    },
  });

  console.log("✅ Admin user created:");
  console.log("   Email: admin@keeper.com");
  console.log("   Password: admin123");
  console.log("⚠️  Change this password in production!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Update `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Run seed:

```bash
npm run prisma:seed
```

**Option B: Environment Variable**

Set in `.env`:

```env
ADMIN_EMAIL=admin@yourcompany.com
```

Update registration endpoint to check:

```typescript
if (email === process.env.ADMIN_EMAIL) {
  user.isSuperAdmin = true;
}
```

#### 3. Update Auth Endpoint

Modify `GET /api/auth/me`:

```typescript
router.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: {
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });

  const orgMembership = user.organizations[0]; // Assuming single org per user

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
    organizationRole: orgMembership?.role,
    organizationId: orgMembership?.organizationId,
  });
});
```

#### 4. Add Board Creation Check

Update `POST /api/boards`:

```typescript
router.post("/boards", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { organizations: true },
  });

  const isAdmin =
    user.organizations.some((org) => org.role === "admin") || user.isSuperAdmin;

  if (!isAdmin) {
    return res.status(403).json({
      error: "Only admins can create boards",
    });
  }

  const orgId = user.organizations[0]?.organizationId;

  const board = await prisma.board.create({
    data: {
      ...req.body,
      organizationId: orgId,
      members: {
        create: {
          userId: req.userId,
          role: "owner",
        },
      },
    },
  });

  res.json(board);
});
```

### Frontend Setup

All frontend components are already configured. No additional setup required.

### Environment Variables

**Backend (.env):**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/keeper?schema=public"

# Authentication
JWT_SECRET="your-secure-random-secret-key"

# Server
PORT=3001
NODE_ENV=development

# Optional: Bootstrap Admin
ADMIN_EMAIL=admin@yourcompany.com
```

**Frontend (.env):**

```env
REACT_APP_API_URL=http://localhost:3001/api
```

---

## Testing

### Test Scenarios

#### Scenario 1: Admin User

1. **Login as admin:**
   - Email: `admin@keeper.com`
   - Password: `admin123`

2. **Verify Admin Capabilities:**
   - ✅ See "Create Board" button in BoardSelector
   - ✅ See "Create New Board" in dropdown
   - ✅ See "Organization Members" in settings
   - ✅ Can create boards successfully
   - ✅ Can invite users to organization
   - ✅ Can change member roles
   - ✅ Can remove members (except self)

#### Scenario 2: Regular Member

1. **Register a new user:**
   - Email: `member@example.com`
   - Name: `Test Member`

2. **Verify Member Restrictions:**
   - ✅ No "Create Board" button visible
   - ✅ Shows "No boards available. Contact your admin."
   - ✅ No "Organization Members" in settings
   - ✅ Cannot access board creation modal

3. **Have admin add member to organization**

4. **Verify Post-Invitation:**
   - ✅ Still no "Create Board" button
   - ✅ No boards visible until added to specific boards

5. **Have admin add member to a board**

6. **Verify Board Access:**
   - ✅ Can see board in BoardSelector
   - ✅ Can create/edit tasks on board
   - ✅ Cannot create new boards

#### Scenario 3: Member Promotion to Admin

1. **Admin opens Organization Members modal**
2. **Admin changes member role to "admin"**
3. **Member refreshes or re-logs in**

4. **Verify New Admin Capabilities:**
   - ✅ Now sees "Create Board" button
   - ✅ Can access "Organization Members"
   - ✅ Can create boards
   - ✅ Can manage organization members

#### Scenario 4: Super Admin

1. **Login as super admin**

2. **Verify Super Admin Powers:**
   - ✅ Cannot be removed from organization
   - ✅ Role cannot be changed by other admins
   - ✅ Can perform all admin actions
   - ✅ Badge shows "Super Admin" in member list

### API Testing with cURL

**Create Board (Admin Only):**

```bash
curl -X POST http://localhost:3001/api/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Board",
    "description": "Testing board creation",
    "template": "default"
  }'
```

**Expected Response (Admin):** `200 OK` with board data  
**Expected Response (Member):** `403 Forbidden`

**Add Organization Member:**

```bash
curl -X POST http://localhost:3001/api/organizations/ORG_ID/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "email": "newuser@example.com",
    "role": "member"
  }'
```

**Update Member Role:**

```bash
curl -X PATCH http://localhost:3001/api/organizations/ORG_ID/members/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "role": "admin"
  }'
```

**Remove Member:**

```bash
curl -X DELETE http://localhost:3001/api/organizations/ORG_ID/members/USER_ID \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

---

## Troubleshooting

### Issue: User Can't See "Create Board" Button

**Check:**

1. User's `organizationRole` in database
2. JWT token includes correct role in `/auth/me` response
3. Frontend is fetching user data correctly

**Solution:**

```sql
-- Check user's organization role
SELECT u.email, om.role, o.name
FROM "User" u
JOIN "OrganizationMember" om ON u.id = om."userId"
JOIN "Organization" o ON om."organizationId" = o.id
WHERE u.email = 'user@example.com';

-- Update role if needed
UPDATE "OrganizationMember"
SET role = 'admin'
WHERE "userId" = 'USER_ID';
```

### Issue: "Organization Members" Not Visible in Settings

**Check:**

1. User is logged in
2. User has admin role
3. Frontend is checking `canManageOrganization` correctly

**Debug:**

```javascript
// In browser console
console.log(user?.organizationRole); // Should be 'admin'
console.log(user?.isSuperAdmin); // Or should be true
```

### Issue: Member Added But Can't See Boards

**Explanation:**
Being in an organization ≠ Access to boards

**Solution:**

1. Admin must first add user to organization (Organization Members)
2. Then admin must add user to specific boards (Board Members)
3. User will then see those boards in BoardSelector

### Issue: Cannot Remove Member

**Check:**

1. Are you trying to remove yourself? (Not allowed)
2. Are you trying to remove super admin? (Not allowed)
3. Do you have admin permissions?

**Solution:**

- Super admins cannot be removed
- Admins cannot remove themselves
- Transfer board ownership before removing admin

---

## Security Considerations

### 1. Role Validation

Always validate roles on both frontend and backend:

```typescript
// Backend
if (!isAdmin && !isSuperAdmin) {
  return res.status(403).json({ error: "Unauthorized" });
}

// Frontend
const canManage = user?.organizationRole === "admin" || user?.isSuperAdmin;
```

### 2. Token Security

- JWT tokens include user ID only
- Role is fetched fresh on each request
- Changes to roles take effect immediately

### 3. Super Admin Protection

- Super admins cannot be removed via UI or API
- Role changes blocked at API level
- Frontend hides removal buttons for super admins

### 4. Self-Removal Prevention

- Users cannot remove themselves from organizations
- Prevents accidental lockout
- Must transfer ownership first

---

## Migration Guide

### Migrating from Single-Tenant to Multi-Tenant

If you have existing users and boards:

**1. Create Default Organization:**

```sql
INSERT INTO "Organization" (id, name, slug, "createdAt", "updatedAt")
VALUES ('default-org-id', 'Default Organization', 'default', NOW(), NOW());
```

**2. Migrate Users to Organization:**

```sql
-- Add all users as members
INSERT INTO "OrganizationMember" ("organizationId", "userId", role, "createdAt", "updatedAt")
SELECT 'default-org-id', id, 'member', NOW(), NOW()
FROM "User";

-- Promote first user to admin
UPDATE "OrganizationMember"
SET role = 'admin'
WHERE "userId" = (SELECT id FROM "User" ORDER BY "createdAt" LIMIT 1);
```

**3. Link Boards to Organization:**

```sql
UPDATE "Board"
SET "organizationId" = 'default-org-id'
WHERE "organizationId" IS NULL;
```

---

## Best Practices

### 1. Organization Structure

- **Small Teams (< 10 people):** Single organization with all members
- **Departments:** Separate organizations per department
- **Clients:** One organization per client for agencies

### 2. Role Assignment

- **Start with members:** Promote to admin as needed
- **Limit admins:** Only give admin to people who need to create boards
- **Use board roles:** For granular permissions within boards

### 3. Onboarding Process

1. Admin creates user account (or user self-registers)
2. Admin adds user to organization as member
3. Admin creates boards for projects
4. Admin adds specific users to relevant boards
5. Users start working on assigned boards

### 4. Security

- Rotate JWT secrets regularly
- Use strong passwords for admin accounts
- Audit organization membership regularly
- Remove inactive users promptly

---

## Future Enhancements

### Planned Features

- [ ] Multi-organization support (users in multiple orgs)
- [ ] Organization invitations via email
- [ ] Billing per organization
- [ ] Organization-level settings and branding
- [ ] Audit logs for organization changes
- [ ] Bulk user import via CSV
- [ ] SSO integration for organizations
- [ ] Organization transfer (change owner)

### API Improvements

- [ ] Pagination for organization members
- [ ] Search/filter members
- [ ] Organization activity feed
- [ ] Member statistics and analytics

---

## Support

### Common Questions

**Q: Can a user be in multiple organizations?**  
A: Current implementation supports single organization per user. Multi-org support is planned.

**Q: What happens to boards when organization is deleted?**  
A: Boards are deleted via cascade. Backup data before deletion.

**Q: Can members see other organization members?**  
A: Yes, all organization members can view the member list.

**Q: How do I transfer board ownership?**  
A: Use Board Members modal to change a member's role to "owner".

**Q: Can I have multiple super admins?**  
A: Yes, set `isSuperAdmin: true` for any user in database.

### Resources

- [API Documentation](./api.md)
- [Board Members Documentation](./BOARD_MEMBERS_API.md)
- [GitHub Issues](https://github.com/yourrepo/issues)

---

## Changelog

### v2.0.0 - Organization System Launch

**Added:**

- Organization-based multi-tenancy
- Organization member management
- Admin/member role system
- Super admin capabilities
- Board creation restrictions
- Organization Members UI modal
- Role-based access control

**Changed:**

- User registration no longer creates boards automatically
- Board creation restricted to admins
- Settings menu reorganized

**Migration:**

- Requires database migration for new tables
- Existing users need organization assignment

---

## License

Same as parent project license.
