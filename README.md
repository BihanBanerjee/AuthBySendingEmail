# Token Verification Using Email

A secure authentication system built with Node.js/Express API and Next.js frontend that implements email-based user verification using JWT tokens.

## Features

- **Email-based registration**: Users sign up with just an email address
- **JWT token verification**: Secure token-based email verification system
- **Automatic user creation**: Users are created only after successful email verification
- **Secure authentication**: HTTP-only cookies for session management
- **Full-stack application**: Express API backend with Next.js frontend

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: Express.js API server with authentication endpoints and email verification
- `web`: Next.js frontend application for user interface
- `@repo/ui`: Shared React component library
- `@repo/eslint-config`: ESLint configurations for code consistency
- `@repo/typescript-config`: TypeScript configurations used throughout the monorepo
- `@repo/prisma-client`: Database client for user management
- `@repo/redis-client`: Redis client for caching (if needed)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Getting Started

### Prerequisites

- Node.js >= 18
- Bun (package manager)
- PostgreSQL database
- Email service configuration (SMTP)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TokenVerifyUsingEmail
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Configure your `.env` file with:
- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: PostgreSQL connection string
- `BASE_URL`: Your application's base URL
- Email service credentials (SMTP)

4. Set up the database:
```bash
bunx prisma migrate dev
```

### Development

To start all apps in development mode:

```bash
bun run dev
```

To develop specific apps:

```bash
# API server only
bun run dev --filter=api

# Frontend only  
bun run dev --filter=web
```

### Build

To build all apps and packages:

```bash
bun run build
```

To build specific packages:

```bash
# Build API only
bun run build --filter=api

# Build web app only
bun run build --filter=web
```

## API Endpoints

### Authentication

- `POST /api/v1/user/signup` - Register with email (sends verification email)
- `GET /api/v1/user/verify-email?token=<token>` - Verify email and create account

## How It Works

1. **User Registration**: User provides email address
2. **Email Verification**: System sends verification email with JWT token
3. **Token Validation**: User clicks email link, token is verified
4. **Account Creation**: Upon successful verification, user account is created
5. **Authentication**: User is automatically logged in with secure HTTP-only cookie

## Project Structure

```
apps/
├── api/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Express middleware
│   │   └── index.ts     # Server entry point
│   └── package.json
├── web/                 # Next.js frontend
│   ├── src/
│   │   ├── app/         # Next.js app router
│   │   └── components/  # React components
│   └── package.json
packages/
├── ui/                  # Shared UI components
├── eslint-config/       # ESLint configuration
└── typescript-config/   # TypeScript configuration
```

## Security Features

- JWT tokens with expiration (24 hours)
- HTTP-only secure cookies
- Email format validation
- Environment-based security settings
- Protection against duplicate registrations

## Built With

- **Backend**: Node.js, Express.js, Prisma ORM
- **Frontend**: Next.js, React
- **Database**: PostgreSQL
- **Email**: Nodemailer
- **Authentication**: JWT + HTTP-only cookies
- **Build System**: Turborepo + Bun
