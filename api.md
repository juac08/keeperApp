# Keeper API

Express.js REST API for the Keeper task management application with TypeScript, Prisma ORM, and PostgreSQL.

## Features

- 🔐 JWT Authentication
- 📋 Boards, Tasks, Subtasks
- 💬 Comments
- 🏷️ Tags
- 👥 User Management
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
- `GET /api/auth/me` - Get current user

### Boards

- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get single board
- `POST /api/boards` - Create board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

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

## Database Schema

- **User**: Authentication and profile
- **Board**: Project boards
- **Task**: Tasks with status, priority, assignee
- **Subtask**: Task subtasks with completion status
- **Comment**: Task comments
- **Tag**: Categorization tags
- **Activity**: Audit log of changes

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
