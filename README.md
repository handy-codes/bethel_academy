# Bethel Academy CBT System

A comprehensive Computer-Based Test (CBT) system for Nigerian educational institutions, similar to JAMB and WAEC exams. Built with Next.js 14, TypeScript, Prisma, and Clerk authentication.

## 🎯 Overview

The Bethel Academy CBT System provides a complete solution for conducting online examinations with role-based access for administrators, lecturers, and students. The system supports 9 Nigerian subjects with objective questions and includes features for exam management, result review, and user administration.

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: MySQL with Prisma ORM
- **Authentication**: Clerk
- **State Management**: React hooks and context
- **Deployment**: Vercel-ready

### Database Schema
- **Users**: Admin, Student, Lecturer roles
- **Exams**: Subject-based exam management
- **Questions**: 5-option objective questions (A-E)
- **Attempts**: Student exam sessions
- **Results**: Score tracking with admin approval

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bethel_academy
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file with the following variables:
```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/bethel_academy"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Optional: Other services
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Database Setup**
```bash
# Generate Prisma client
npm run postinstall

# Push database schema
npx prisma db push

# Seed initial data (optional)
npm run seed
```

5. **Create Admin User**
```bash
npm run setup-admin
```

6. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 👥 User Roles & Workflows

### 🔐 Authentication Flow

All users must sign in through Clerk authentication. The system automatically detects user roles and provides appropriate dashboard access.

#### Sign In Process:
1. Click "Login" button on the main navbar
2. Enter email and password (or use social login)
3. System redirects based on user role:
   - **Admin** → Admin Dashboard
   - **Student** → Student Dashboard  
   - **Lecturer** → Lecturer Dashboard

---

## 👨‍💼 Admin Workflow

### Initial Setup
**Email**: `admin@bethelacademy.local` (created by setup script)

### Admin Dashboard Features

#### 1. **Dashboard Overview**
- **Statistics Cards**: Total exams, students, attempts, pending approvals
- **Recent Activity**: Latest exam completions and submissions
- **Quick Actions**: Create exam, add questions, review results

#### 2. **User Management** (`/admin/users`)
- **View All Users**: Students, lecturers, and administrators
- **Create New Users**: Add users by email with role assignment
- **User Statistics**: Role-based user counts and activity
- **User Actions**: Edit, deactivate, or delete users

**Creating a New User:**
1. Click "Add User" button
2. Fill in email, first name, last name
3. Select role (Student/Lecturer/Admin)
4. Click "Create User"
5. User receives invitation email from Clerk

#### 3. **Exam Management** (`/admin/exams`)
- **View All Exams**: Active and inactive exams
- **Create New Exams**: Set up CBT exams for any subject
- **Exam Settings**: Duration, instructions, question count
- **Exam Status**: Activate/deactivate exams

**Creating a New Exam:**
1. Click "Create Exam"
2. Enter exam details (title, description, subject)
3. Set duration and total questions
4. Add instructions
5. Save and activate exam

#### 4. **Question Bank** (`/admin/questions`)
- **View All Questions**: Filter by subject and difficulty
- **Add Questions**: Create 5-option objective questions
- **Question Management**: Edit, delete, or categorize questions
- **Bulk Operations**: Import/export question sets

**Adding Questions:**
1. Click "Add Question"
2. Select subject and difficulty level
3. Enter question text and 5 options (A-E)
4. Mark correct answer
5. Add explanation (optional)
6. Save question

#### 5. **Results Management** (`/admin/results`)
- **Review Submissions**: All student exam attempts
- **Approve/Reject Results**: Control result visibility
- **Performance Analytics**: Subject-wise performance
- **Grade Management**: Set grading criteria

**Reviewing Results:**
1. View pending results list
2. Click "View Details" to see full exam
3. Review student answers and score
4. Click "Approve" or "Reject"
5. Add feedback (optional)

### Admin Commands

```bash
# Create additional users
npm run create-user john.doe@student.com John Doe student
npm run create-user jane.smith@lecturer.com Jane Smith lecturer

# Database operations
npx prisma studio  # Open database GUI
npx prisma db push # Update database schema
```

---

## 🎓 Student Workflow

### Student Dashboard Features

#### 1. **Dashboard Overview**
- **Progress Statistics**: Completed exams, average score, study time
- **Available Exams**: List of exams student can take
- **Recent Activity**: Latest exam attempts and results
- **Quick Actions**: Take exam, view results, check history

#### 2. **Available Exams** (`/student/exams`)
- **Browse Exams**: Filter by subject and difficulty
- **Exam Details**: Duration, questions, instructions
- **Start Exam**: Begin CBT examination
- **Exam Status**: Track which exams are available

**Taking an Exam:**
1. Browse available exams
2. Click "Start Exam" on desired exam
3. Read instructions carefully
4. Begin answering questions
5. Use navigation to move between questions
6. Submit when complete

#### 3. **CBT Exam Interface** (`/student/exam/[id]`)
- **Question Navigation**: Sidebar with question numbers
- **Timer Display**: Countdown timer with color warnings
- **Answer Selection**: Radio buttons for options A-E
- **Auto-save**: Progress saved automatically
- **Submit Confirmation**: Final submission with review

**Exam Interface Features:**
- **Timer**: Shows remaining time (red when < 5 minutes)
- **Navigation**: Previous/Next buttons and question list
- **Status Indicators**: Answered/unanswered questions
- **Auto-save**: Answers saved every few seconds
- **Submit Modal**: Confirmation before final submission

#### 4. **Results & History** (`/student/results`)
- **Approved Results**: Only admin-approved scores visible
- **Performance Tracking**: Subject-wise performance
- **Grade Display**: Letter grades and percentages
- **Feedback**: Admin comments and suggestions

**Viewing Results:**
1. Go to "My Results" section
2. View approved exam results
3. See detailed score breakdown
4. Read admin feedback
5. Track improvement over time

### Student Experience

**First Time User:**
1. Sign in with provided email
2. See "Dashboard" link in navbar
3. Access student dashboard
4. Browse available exams
5. Take first exam
6. Wait for result approval
7. View approved results

**Regular Usage:**
1. Sign in to dashboard
2. Check for new available exams
3. Take practice tests
4. Review previous results
5. Track progress and improvement

---

## 👨‍🏫 Lecturer Workflow

### Lecturer Dashboard Features

#### 1. **Dashboard Overview**
- **Teaching Statistics**: My exams, students, attempts
- **Performance Metrics**: Class averages, completion rates
- **Recent Activity**: Student completions, new submissions
- **Quick Actions**: Create exam, review results, manage students

#### 2. **Exam Creation** (`/lecturer/create-exam`)
- **Exam Setup**: Title, description, subject selection
- **Question Management**: Add/edit questions for exam
- **Settings**: Duration, instructions, difficulty
- **Preview**: Test exam before activation

**Creating an Exam:**
1. Click "Create New Exam"
2. Enter exam details and select subject
3. Add questions from question bank
4. Set exam duration and instructions
5. Preview and test exam
6. Activate for students

#### 3. **Student Management** (`/lecturer/students`)
- **My Students**: Students enrolled in lecturer's exams
- **Performance Tracking**: Individual student progress
- **Communication**: Send messages or feedback
- **Grade Management**: Review and approve results

#### 4. **Results Review** (`/lecturer/results`)
- **Student Submissions**: All exam attempts by students
- **Score Review**: Detailed answer analysis
- **Approval Process**: Approve results for student viewing
- **Feedback System**: Add comments and suggestions

**Reviewing Student Results:**
1. View pending student submissions
2. Review each question and answer
3. Check scoring and calculations
4. Add feedback and comments
5. Approve or request review
6. Notify students of results

### Lecturer Experience

**Course Setup:**
1. Sign in with lecturer email
2. Access lecturer dashboard
3. Create exams for subjects
4. Add questions to question bank
5. Set up exam schedules
6. Activate exams for students

**Ongoing Management:**
1. Monitor student progress
2. Review exam submissions
3. Provide feedback and grades
4. Track class performance
5. Update exam content as needed

---

## 📚 Supported Subjects

The system includes comprehensive question banks for 9 Nigerian subjects:

1. **English Language** - Grammar, comprehension, literature
2. **Mathematics** - Algebra, geometry, calculus, statistics
3. **Physics** - Mechanics, thermodynamics, electromagnetism
4. **Chemistry** - Atomic structure, reactions, organic chemistry
5. **Biology** - Cell biology, genetics, ecology, anatomy
6. **Accounting** - Financial statements, bookkeeping, business finance
7. **Economics** - Microeconomics, macroeconomics, economic systems
8. **Literature** - African literature, poetry, drama, prose
9. **Local Languages** - Igbo and Yoruba language and culture

## 🔧 Technical Features

### Security
- **Role-based Access Control**: Secure dashboard access
- **Session Management**: Automatic timeout and security
- **Data Protection**: Secure storage of student information
- **Audit Trail**: Complete activity logging

### Performance
- **Auto-save**: Prevents data loss during exams
- **Real-time Updates**: Live timer and progress tracking
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Optimized Loading**: Fast page loads and smooth navigation

### Accessibility
- **WCAG Compliant**: Accessible to users with disabilities
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Compatible with assistive technologies
- **High Contrast**: Clear visual indicators and colors

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
```env
DATABASE_URL="your_production_database_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_production_key"
CLERK_SECRET_KEY="your_production_secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

2. **Database Migration**
```bash
npx prisma db push
npm run setup-admin
```

3. **Build and Deploy**
```bash
npm run build
npm run start
```

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📞 Support & Maintenance

### Common Issues

**Authentication Problems:**
- Verify Clerk environment variables
- Check user role metadata in Clerk dashboard
- Ensure proper email addresses are registered

**Database Issues:**
- Run `npx prisma db push` to sync schema
- Check database connection string
- Verify MySQL server is running

**Exam Issues:**
- Ensure questions are properly formatted
- Check exam activation status
- Verify student has proper permissions

### Maintenance Tasks

**Daily:**
- Monitor system performance
- Check for failed exam submissions
- Review pending result approvals

**Weekly:**
- Backup database
- Review user activity logs
- Update question banks

**Monthly:**
- Performance optimization
- Security updates
- User feedback analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for Bethel Academy, Nigeria
- Inspired by JAMB and WAEC examination systems
- Uses modern web technologies for optimal performance
- Designed with Nigerian educational context in mind

---

**For technical support or questions, please contact the development team or create an issue in the repository.**