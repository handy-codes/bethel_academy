# 🎯 Simple Admin User Creation Script

## ✅ **Script Created Successfully!**

I've created exactly what you requested - a simple script that can be run with commands like:

```bash
node scripts/create-admin-user.js paxymek@gmail.com ADMIN
node scripts/create-admin-user.js john.doe@student.com STUDENT
node scripts/create-admin-user.js jane.smith@lecturer.com LECTURER
```

---

## 📁 **Available Scripts:**

### **1. Full Script (with Database)**
```bash
node scripts/create-admin-user.js <email> [role]
```

### **2. Simple Script (Clerk only)**
```bash
node scripts/create-admin-user-simple.js <email> [role]
```

---

## 🚀 **Usage Examples:**

### **Create Admin User:**
```bash
node scripts/create-admin-user.js paxymek@gmail.com ADMIN
```

### **Create Student User:**
```bash
node scripts/create-admin-user.js john.doe@student.com STUDENT
```

### **Create Lecturer User:**
```bash
node scripts/create-admin-user.js jane.smith@lecturer.com LECTURER
```

### **Default Role (Admin):**
```bash
node scripts/create-admin-user.js admin@example.com
```

---

## 🔧 **Script Features:**

### **✅ What the Script Does:**
1. **Validates email format**
2. **Validates role** (ADMIN, STUDENT, LECTURER)
3. **Creates user in Clerk** with proper metadata
4. **Sets temporary password** (TempSecurePass2024!@#)
5. **Creates user in database** (full script only)
6. **Provides clear instructions** for next steps

### **✅ User Creation Process:**
1. **Checks if user exists** in Clerk
2. **Creates new user** if not found
3. **Sets role metadata** for proper dashboard access
4. **Generates clean username** from email
5. **Sets temporary password** for initial login

---

## 🔑 **Login Options for Created Users:**

### **Option 1: Google OAuth (Recommended)**
1. Go to `http://localhost:3000`
2. Click "Login"
3. Click "Continue with Google"
4. Sign in with the created email

### **Option 2: Email/Password**
1. Go to `http://localhost:3000`
2. Click "Login"
3. Enter email and password:
   - **Email:** `user@example.com`
   - **Password:** `TempSecurePass2024!@#`

---

## 📋 **Script Output Example:**

```bash
$ node scripts/create-admin-user.js paxymek@gmail.com ADMIN

🚀 Creating ADMIN user: paxymek@gmail.com...
📧 Creating user in Clerk: paxymek@gmail.com...
✅ User created in Clerk: paxymek@gmail.com
🔑 Temporary password set: TempSecurePass2024!@#
   User can sign in with Google OAuth or change password on first login
💾 Creating user in database: paxymek@gmail.com...
✅ User created/updated in database: paxymek@gmail.com

🎉 ADMIN user created successfully!

📋 User Details:
   Email: paxymek@gmail.com
   Role: ADMIN
   Authentication: Google OAuth
   Clerk ID: user_32jk0IOMhMwugyljKOJ7Uc2uAUd
   Database ID: cmfl4xpoi000014k71hc8sgzc

🔑 Next Steps:
1. Start your development server: npm run dev
2. Go to: http://localhost:3000
3. Click "Login" button in the navbar
4. Click "Continue with Google"
5. Sign in with: paxymek@gmail.com
6. You will see the appropriate dashboard link in the navbar
7. Click it to access your dashboard

⚠️  Note: Make sure Google OAuth is enabled in your Clerk dashboard
   and that Clerk environment variables are set in your .env file

✅ User creation completed successfully!
```

---

## 🛠️ **Prerequisites:**

### **1. Environment Variables**
Make sure your `.env` file has:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
```

### **2. Database Connection**
For the full script, ensure database is accessible:
```bash
npx prisma db push
```

### **3. Clerk Configuration**
- Google OAuth enabled in Clerk dashboard
- Proper environment variables set

---

## 🎯 **Quick Start:**

### **1. Create Admin User:**
```bash
node scripts/create-admin-user.js walsam4christ@gmail.com ADMIN
```

### **2. Start Development Server:**
```bash
npm run dev
```

### **3. Login:**
- Go to `http://localhost:3000`
- Click "Login" → "Continue with Google"
- Sign in with `walsam4christ@gmail.com`

### **4. Access Admin Dashboard:**
- Click "Admin Dashboard" in navbar
- Start managing users, exams, and results!

---

## 🎉 **Perfect!**

You now have exactly what you requested:
- ✅ **Simple command-line script**
- ✅ **Easy user creation**
- ✅ **Multiple role support**
- ✅ **Clear output and instructions**
- ✅ **Google OAuth + Password options**

**The script is ready to use!** 🚀
