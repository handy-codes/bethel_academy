# 🎓 Bethel Academy Admin Guide

## 👨‍💼 Admin User Created Successfully!

**Admin Credentials:**
- **Email:** `walsam4christ@gmail.com`
- **Authentication:** Google OAuth (No password required)
- **Role:** Admin

---

## 🚀 How to Login as Admin

### Step 1: Start the Application
```bash
npm run dev
```
The application will be available at: `http://localhost:3000`

### Step 2: Login Process
1. **Open your browser** and go to `http://localhost:3000`
2. **Click the "Login" button** in the top navigation bar
3. **Click "Continue with Google"** button
4. **Sign in with your Google account:**
   - Use: `walsam4christ@gmail.com`
   - Complete Google OAuth flow
5. **You'll see "Admin Dashboard" link** in the navbar - click it!

---

## 🏠 Admin Dashboard Overview

Once logged in, you'll see the **Admin Dashboard** with:

### 📊 Statistics Cards
- **Total Exams:** Number of exams in the system
- **Total Students:** Number of registered students
- **Exam Attempts:** Number of exam submissions
- **Pending Approvals:** Results waiting for admin approval
- **Average Score:** Overall performance metrics
- **Completion Rate:** Exam completion statistics

### 📈 Recent Activity Feed
- Real-time updates of student activities
- Exam completions and submissions
- New exam creations

### ⚡ Quick Actions
- **Create New Exam:** Set up new CBT exams
- **Add Questions:** Create exam questions
- **Review Results:** Approve pending results

---

## 👥 User Management (`/admin/users`)

### Creating New Users

1. **Navigate to Users Page:**
   - Click "Users" in the admin sidebar
   - Or go to `/admin/users`

2. **Add New User:**
   - Click the **"Add User"** button
   - Fill in the form:
     - **Email:** User's email address
     - **First Name:** User's first name
     - **Last Name:** User's last name
     - **Role:** Select from dropdown:
       - `Student` - Can take exams
       - `Lecturer` - Can create and manage exams
       - `Admin` - Full system access
   - Click **"Create User"**

3. **User Creation Process:**
   - User is created in Clerk authentication system
   - User receives invitation email
   - User can set their own password
   - User appears in the users list

### Managing Existing Users

- **View All Users:** See complete list with roles and status
- **Search Users:** Filter by name or email
- **Filter by Role:** View only students, lecturers, or admins
- **Edit User:** Update user information
- **Deactivate User:** Disable user access
- **Delete User:** Remove user from system

---

## 📚 Exam Management (`/admin/exams`)

### Creating New Exams

1. **Navigate to Exams Page:**
   - Click "Exams" in the admin sidebar
   - Or go to `/admin/exams`

2. **Create New Exam:**
   - Click **"Create Exam"** button
   - Fill in exam details:
     - **Title:** Exam name (e.g., "JAMB Mathematics Practice")
     - **Description:** Brief description of exam content
     - **Subject:** Select from dropdown:
       - MATHEMATICS
       - ENGLISH
       - PHYSICS
       - CHEMISTRY
       - BIOLOGY
       - ACCOUNTING
       - ECONOMICS
       - LITERATURE
       - IGBO
       - YORUBA
     - **Duration:** Time limit in minutes
     - **Total Questions:** Number of questions
     - **Instructions:** Special instructions for students
   - Click **"Save Exam"**

3. **Exam Status:**
   - **Active:** Students can take the exam
   - **Inactive:** Exam is hidden from students
   - Toggle status as needed

### Managing Existing Exams

- **View All Exams:** See complete list with status
- **Edit Exam:** Modify exam details
- **Activate/Deactivate:** Control exam availability
- **View Statistics:** See attempt counts and performance
- **Delete Exam:** Remove exam from system

---

## ❓ Question Bank (`/admin/questions`)

### Adding Questions to Exams

1. **Navigate to Questions Page:**
   - Click "Questions" in the admin sidebar
   - Or go to `/admin/questions`

2. **Create New Question:**
   - Click **"Add Question"** button
   - Fill in question details:
     - **Question Text:** The actual question
     - **Option A, B, C, D, E:** All five answer choices
     - **Correct Answer:** Select the correct option
     - **Explanation:** Optional explanation for the answer
     - **Difficulty:** EASY, MEDIUM, or HARD
     - **Points:** Points awarded for correct answer
     - **Subject:** Subject category
   - Click **"Save Question"**

3. **Question Management:**
   - **View All Questions:** Browse question bank
   - **Search Questions:** Find specific questions
   - **Filter by Subject:** View questions by subject
   - **Edit Questions:** Modify existing questions
   - **Delete Questions:** Remove questions

---

## 📊 Results Management (`/admin/results`)

### Reviewing and Approving Results

1. **Navigate to Results Page:**
   - Click "Results" in the admin sidebar
   - Or go to `/admin/results`

2. **Review Student Results:**
   - **View All Results:** See all exam submissions
   - **Filter by Status:** Pending, Approved, Rejected
   - **Search by Student:** Find specific student results
   - **View Details:** See individual question responses

3. **Approve Results:**
   - **Review Performance:** Check scores and answers
   - **Add Feedback:** Provide comments to students
   - **Approve/Reject:** Accept or reject results
   - **Bulk Actions:** Approve multiple results at once

---

## 🔧 Admin Features Summary

### ✅ What You Can Do as Admin:

1. **User Management:**
   - Create students, lecturers, and other admins
   - Manage user accounts and permissions
   - View user activity and statistics

2. **Exam Management:**
   - Create and configure CBT exams
   - Set exam duration and question counts
   - Activate/deactivate exams
   - Monitor exam usage

3. **Question Management:**
   - Create comprehensive question banks
   - Set difficulty levels and point values
   - Organize questions by subject
   - Provide explanations for answers

4. **Results Management:**
   - Review all exam submissions
   - Approve or reject results
   - Provide feedback to students
   - Generate performance reports

5. **System Monitoring:**
   - View real-time statistics
   - Monitor system usage
   - Track student progress
   - Identify areas for improvement

---

## 🎯 Sample Workflow: Creating a Complete Exam

### Step 1: Create the Exam
1. Go to `/admin/exams`
2. Click "Create Exam"
3. Fill in details:
   - Title: "WAEC Mathematics Mock Test"
   - Subject: MATHEMATICS
   - Duration: 120 minutes
   - Total Questions: 50
   - Instructions: "Answer all questions carefully"

### Step 2: Add Questions
1. Go to `/admin/questions`
2. Create 50 questions with:
   - Clear question text
   - 5 options (A, B, C, D, E)
   - Correct answer marked
   - Difficulty level set
   - Explanations provided

### Step 3: Activate Exam
1. Go back to `/admin/exams`
2. Find your exam in the list
3. Toggle status to "Active"
4. Students can now take the exam

### Step 4: Monitor Results
1. Go to `/admin/results`
2. Watch for new submissions
3. Review and approve results
4. Provide feedback to students

---

## 🚨 Important Notes

### Security
- **Change Default Password:** Consider changing the admin password after first login
- **User Permissions:** Only create admin users for trusted personnel
- **Regular Backups:** Ensure database backups are maintained

### Best Practices
- **Test Exams:** Always test exams before making them available to students
- **Clear Instructions:** Provide clear instructions for all exams
- **Regular Monitoring:** Check results regularly for any issues
- **Student Support:** Be available to help students with technical issues

### Troubleshooting
- **Login Issues:** Check Clerk environment variables in `.env` file
- **Database Issues:** Run `npx prisma db push` to sync database
- **User Creation Issues:** Verify Clerk API keys are correct

---

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database connection is working
4. Check Clerk dashboard for authentication issues

**Happy Administering! 🎉**
