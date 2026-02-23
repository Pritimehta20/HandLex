# Admin Authentication & Sign Management Setup Guide

## Architecture Overview

This system includes:
- **Admin Login**: Secure JWT-based admin authentication
- **Sign CRUD**: Admins can upload, edit, and delete signs (videos/images)
- **User JWT**: Regular users and admins get JWT tokens on login
- **Protected Routes**: Admin routes require valid JWT token with `isAdmin` flag
- **File Uploads**: Multer handles video/image uploads to `/Backend/uploads`

---

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd Backend
npm install
```

This will install:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `multer` - File uploads
- Other existing dependencies

### 2. Configure Environment Variables

Create a `.env` file in the `Backend` folder with:

```
PORT=8080
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secure-secret-key-change-this-in-production
MONGODB_URI=your-mongodb-connection-url
```

**Important:** In production, use a strong, unique `JWT_SECRET`!

### 3. Create an Admin User

**Easiest Method: Using the Create Admin Script**

```bash
cd Backend

# Create admin with default credentials
npm run create-admin

# Or provide custom credentials
node createAdmin.js your-email@example.com YourPassword "Your Name"
```

The script will:
- Ask for email, password, and name (or use defaults)
- Create a new admin user in the database
- Display login credentials

---

**Alternative: Using MongoDB Compass or Database GUI**

1. Register a normal user via the frontend: `/` → Register with email/password
2. Open MongoDB Compass or your database tool
3. Navigate to the `users` collection
4. Find your user document
5. Set `"isAdmin": true` in that user's document
6. Save

---

**Alternative: Using Node Script Directly**

Create `Backend/createAdmin.js` (already included) and run:

```bash
node createAdmin.js admin@example.com securePassword123 "Admin User"
```

---

## Running the System

### Backend

```bash
cd Backend
npm run dev
```

This starts the server on `http://localhost:8080` with:
- User auth endpoints: `/api/users/login`, `/api/users/register`
- Admin endpoints: `/api/admin/login`, `/api/admin/signs` (CRUD)
- Public sign endpoints: `/api/signs` (list/get)
- File serving: `/uploads` (static)

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Usage Flows

### Admin Login & Upload Signs

1. **Login Selector**: Navigate to `http://localhost:5173/login`
2. You'll see two options - click **"Admin Login"**
3. Enter admin credentials (email you set as `isAdmin`)
4. JWT token is stored in localStorage
5. Redirected to `/admin/dashboard`
6. **Upload Sign**: Click "+ Add New Sign" and fill the form:
   - Sign Name (Gloss): e.g., "HELLO"
   - Language: ISL, LSF, or ASL
   - Difficulty: Easy, Medium, Hard
   - Description: Brief description
   - Tags: Comma-separated
   - Media File: Video (mp4, webm) or Image (jpg, png, gif)
7. Click "Create Sign"
8. **Edit Sign**: Click "Edit" on any sign card to update it
9. **Delete Sign**: Click "Delete" to remove a sign

### User Login & View Signs

1. **Login Selector**: Navigate to `http://localhost:5173/login`
2. You'll see two options - click **"User Login"**
3. Enter user credentials
4. JWT token is stored in localStorage
5. User can access dashboard and other features
6. Signs created by admins are visible in lessons and other user-facing areas

---

## API Endpoints

### Auth

**User Login**
```
POST /api/users/login
Body: { email, password }
Response: { token, userId, name, email, isAdmin, ... }
```

**Admin Login**
```
POST /api/admin/login
Body: { email, password }
Response: { token, userId, name, email }
```

### Signs (Public - No Auth Required)

**List All Signs**
```
GET /api/signs
Response: { signs: [...] }
```

**Get Single Sign**
```
GET /api/signs/:id
Response: { sign: {...} }
```

### Admin Only (Requires JWT with `isAdmin: true`)

**Create Sign**
```
POST /api/admin/signs
Headers: { Authorization: "Bearer <token>" }
Body: FormData with fields: gloss, language, description, difficulty, tags, media (file)
Response: { message, sign: {...} }
```

**Update Sign**
```
PUT /api/admin/signs/:id
Headers: { Authorization: "Bearer <token>" }
Body: FormData (same fields, media optional)
Response: { message, sign: {...} }
```

**Delete Sign**
```
DELETE /api/admin/signs/:id
Headers: { Authorization: "Bearer <token>" }
Response: { message }
```

---

## Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in .env to a strong, random value in production
2. **Password Hashing**: All passwords are hashed using bcryptjs with 10 salt rounds
3. **Token Expiry**: User tokens expire in 24 hours; admin tokens in 8 hours
4. **Admin Verification**: Routes check both token validity and `isAdmin` flag
5. **File Upload**: Only authenticated admins can upload files; files stored in `/Backend/uploads`

---

## Testing with Postman

Example Flow:

1. **Create User** (Register):
   - POST `http://localhost:8080/api/users/register`
   - Body: `{ "name":"John","email":"john@test.com","password":"pass123" }`

2. **Login User**:
   - POST `http://localhost:8080/api/users/login`
   - Body: `{ "email":"john@test.com","password":"pass123" }`
   - Copy the `token` from response

3. **Make Admin** (in MongoDB):
   - Find the user and set `isAdmin: true`

4. **Admin Login** (if using different credentials):
   - POST `http://localhost:8080/api/admin/login`
   - Body: `{ "email":"admin@test.com","password":"pass123" }`

5. **Create Sign**:
   - POST `http://localhost:8080/api/admin/signs`
   - Header: `Authorization: Bearer <token>`
   - Body: FormData with file upload

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Admin access required" | Ensure user has `isAdmin: true` in database |
| "Invalid or expired token" | Re-login to get a fresh token |
| File upload fails | Check `/Backend/uploads` folder exists and is writable |
| CORS errors | Verify `FRONTEND_URL` in .env matches your frontend URL |
| MediaUrl returns 404 | Ensure files are in `/Backend/uploads` and server static route is configured |

---

## Next Steps

- Add role-based access control (RBAC) for more granular permissions
- Implement sign categories and lesson management for admins
- Add sign approval workflow before publishing
- Implement video streaming optimization for large files
- Add audit logging for admin actions
