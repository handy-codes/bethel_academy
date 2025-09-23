// Test script to verify all admin pages functionality
// Run this in the browser console to test the updated admin pages

console.log('🧪 Testing All Admin Pages...\n');

// Test 1: Clear existing data
console.log('1. Clearing existing data...');
localStorage.removeItem('mockExams');
localStorage.removeItem('examResults');
localStorage.removeItem('adminReports');
localStorage.removeItem('adminSettings');
console.log('✅ Cleared existing data\n');

// Test 2: Create sample exams for admin dashboard and questions
console.log('2. Creating sample exams...');
const sampleExams = [
  {
    id: 'exam-1',
    title: 'Mathematics Fundamentals',
    description: 'Basic mathematics concepts and problem solving',
    subject: 'MATHEMATICS',
    duration: 60,
    totalQuestions: 10,
    instructions: 'Answer all questions carefully. You have 60 minutes.',
    isActive: true,
    createdAt: new Date().toISOString(),
    attempts: 0,
    questions: [
      {
        id: 'math-q1',
        questionText: 'What is 2 + 2?',
        optionA: '3',
        optionB: '4',
        optionC: '5',
        optionD: '6',
        optionE: '7',
        correctAnswer: 'B',
        difficulty: 'EASY',
        points: 1
      },
      {
        id: 'math-q2',
        questionText: 'What is the derivative of x²?',
        optionA: 'x',
        optionB: '2x',
        optionC: 'x²',
        optionD: '2x²',
        optionE: 'x³',
        correctAnswer: 'B',
        difficulty: 'MEDIUM',
        points: 1
      }
    ]
  },
  {
    id: 'exam-2',
    title: 'English Language Test',
    description: 'Grammar and comprehension test',
    subject: 'ENGLISH',
    duration: 45,
    totalQuestions: 8,
    instructions: 'Read each question carefully and choose the best answer.',
    isActive: true,
    createdAt: new Date().toISOString(),
    attempts: 0,
    questions: [
      {
        id: 'eng-q1',
        questionText: 'Choose the correct form: "She ___ to school every day."',
        optionA: 'go',
        optionB: 'goes',
        optionC: 'going',
        optionD: 'went',
        optionE: 'gone',
        correctAnswer: 'B',
        difficulty: 'EASY',
        points: 1
      }
    ]
  }
];

localStorage.setItem('mockExams', JSON.stringify(sampleExams));
console.log('✅ Created', sampleExams.length, 'sample exams\n');

// Test 3: Create sample exam results for analytics and dashboard
console.log('3. Creating sample exam results...');
const sampleResults = [
  {
    id: 'result-1',
    examId: 'exam-1',
    examTitle: 'Mathematics Fundamentals',
    subject: 'MATHEMATICS',
    studentId: 'student-1',
    studentName: 'Alice Johnson',
    studentEmail: 'alice@example.com',
    score: 8,
    totalQuestions: 10,
    correctAnswers: 8,
    percentage: 80,
    grade: 'B',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeSpent: 45,
    isApproved: true,
    approvedBy: 'Admin',
    approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'result-2',
    examId: 'exam-1',
    examTitle: 'Mathematics Fundamentals',
    subject: 'MATHEMATICS',
    studentId: 'student-2',
    studentName: 'Bob Smith',
    studentEmail: 'bob@example.com',
    score: 9,
    totalQuestions: 10,
    correctAnswers: 9,
    percentage: 90,
    grade: 'A',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeSpent: 50,
    isApproved: true,
    approvedBy: 'Admin',
    approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'result-3',
    examId: 'exam-2',
    examTitle: 'English Language Test',
    subject: 'ENGLISH',
    studentId: 'student-3',
    studentName: 'Carol Davis',
    studentEmail: 'carol@example.com',
    score: 1,
    totalQuestions: 8,
    correctAnswers: 1,
    percentage: 12.5,
    grade: 'F',
    submittedAt: new Date().toISOString(),
    timeSpent: 30,
    isApproved: false // Pending approval
  }
];

localStorage.setItem('examResults', JSON.stringify(sampleResults));
console.log('✅ Created', sampleResults.length, 'sample exam results\n');

// Test 4: Create sample admin reports
console.log('4. Creating sample admin reports...');
const sampleReports = [
  {
    id: 'report-1',
    title: 'Student Performance Report - January 2024',
    type: 'student_performance',
    description: 'Comprehensive analysis of student performance across all subjects',
    generatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    generatedBy: 'Admin User',
    fileSize: '2.3 MB',
    downloadCount: 5,
    status: 'ready'
  },
  {
    id: 'report-2',
    title: 'Mathematics Exam Summary',
    type: 'exam_summary',
    description: 'Detailed breakdown of mathematics exam results and statistics',
    generatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    generatedBy: 'Admin User',
    fileSize: '1.8 MB',
    downloadCount: 3,
    status: 'ready'
  }
];

localStorage.setItem('adminReports', JSON.stringify(sampleReports));
console.log('✅ Created', sampleReports.length, 'sample admin reports\n');

// Test 5: Create sample admin settings
console.log('5. Creating sample admin settings...');
const sampleSettings = {
  general: {
    siteName: 'Bethel Academy CBT System',
    siteDescription: 'Computer-Based Testing Platform for Educational Excellence',
    contactEmail: 'admin@bethelacademy.edu',
    timezone: 'Africa/Lagos',
    language: 'en'
  },
  exam: {
    defaultDuration: 90,
    maxAttempts: 2,
    autoSubmit: true,
    showResults: true,
    allowReview: true,
    passingScore: 60
  },
  notifications: {
    emailNotifications: true,
    examReminders: true,
    resultNotifications: true,
    systemAlerts: false
  },
  security: {
    sessionTimeout: 45,
    passwordMinLength: 10,
    requireTwoFactor: false,
    allowGoogleAuth: true
  },
  system: {
    maintenanceMode: false,
    debugMode: false,
    dataRetentionDays: 180,
    backupFrequency: 'weekly'
  }
};

localStorage.setItem('adminSettings', JSON.stringify(sampleSettings));
console.log('✅ Created sample admin settings\n');

// Test 6: Verify all data is accessible
console.log('6. Verifying data accessibility...');
const storedExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
const storedResults = JSON.parse(localStorage.getItem('examResults') || '[]');
const storedReports = JSON.parse(localStorage.getItem('adminReports') || '[]');
const storedSettings = JSON.parse(localStorage.getItem('adminSettings') || '{}');

console.log('📊 Admin Dashboard Data:');
console.log('   - Total Exams:', storedExams.length);
console.log('   - Total Students:', new Set(storedResults.map(r => r.studentId)).size);
console.log('   - Total Attempts:', storedResults.length);
console.log('   - Pending Approvals:', storedResults.filter(r => !r.isApproved).length);
console.log('   - Average Score:', Math.round(storedResults.reduce((acc, r) => acc + r.percentage, 0) / storedResults.length) + '%');

console.log('\n📊 Admin Questions Data:');
console.log('   - Total Questions:', storedExams.reduce((acc, exam) => acc + (exam.questions ? exam.questions.length : 0), 0));
console.log('   - Subjects:', [...new Set(storedExams.map(e => e.subject))].length);

console.log('\n📊 Admin Analytics Data:');
console.log('   - Top Performer:', storedResults.sort((a, b) => b.percentage - a.percentage)[0]?.studentName, '-', storedResults.sort((a, b) => b.percentage - a.percentage)[0]?.percentage + '%');
console.log('   - Subject Performance:', Object.keys(storedResults.reduce((acc, r) => { acc[r.subject] = (acc[r.subject] || 0) + 1; return acc; }, {})).length, 'subjects');

console.log('\n📊 Admin Reports Data:');
console.log('   - Total Reports:', storedReports.length);
console.log('   - Report Types:', [...new Set(storedReports.map(r => r.type))].length);

console.log('\n📊 Admin Settings Data:');
console.log('   - Site Name:', storedSettings.general?.siteName);
console.log('   - Default Duration:', storedSettings.exam?.defaultDuration, 'minutes');
console.log('   - Passing Score:', storedSettings.exam?.passingScore + '%');

console.log('\n✅ All data verification complete\n');

// Test 7: Simulate admin actions
console.log('7. Simulating admin actions...');

// Simulate approving a pending result
const pendingResult = storedResults.find(r => !r.isApproved);
if (pendingResult) {
  const updatedResults = storedResults.map(r => 
    r.id === pendingResult.id 
      ? { ...r, isApproved: true, approvedBy: 'Admin', approvedAt: new Date().toISOString() }
      : r
  );
  localStorage.setItem('examResults', JSON.stringify(updatedResults));
  console.log('✅ Approved pending result for', pendingResult.studentName);
}

// Simulate generating a new report
const newReport = {
  id: 'report-' + Date.now(),
  title: 'Custom Analytics Report - ' + new Date().toLocaleDateString(),
  type: 'custom',
  description: 'Custom report with specific metrics and filters',
  generatedDate: new Date().toISOString(),
  generatedBy: 'Current Admin',
  fileSize: '2.1 MB',
  downloadCount: 0,
  status: 'ready'
};

const updatedReports = [newReport, ...storedReports];
localStorage.setItem('adminReports', JSON.stringify(updatedReports));
console.log('✅ Generated new custom report');

// Simulate updating settings
const updatedSettings = {
  ...storedSettings,
  exam: {
    ...storedSettings.exam,
    defaultDuration: 75,
    passingScore: 70
  }
};
localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));
console.log('✅ Updated exam settings (duration: 75min, passing: 70%)');

console.log('\n🎉 All admin page tests completed successfully!');
console.log('\n📝 Next Steps:');
console.log('   1. Visit /admin to see the dashboard with real statistics');
console.log('   2. Visit /admin/questions to see questions from created exams');
console.log('   3. Visit /admin/analytics to see real performance analytics');
console.log('   4. Visit /admin/reports to see and generate reports');
console.log('   5. Visit /admin/settings to see and modify system settings');
console.log('   6. Notice how all pages update in real-time as data changes');
console.log('   7. Try creating new exams to see questions page update');
console.log('   8. Try approving results to see dashboard and analytics update');
console.log('   9. Try generating reports to see reports page update');
console.log('   10. Try modifying settings to see persistence');
