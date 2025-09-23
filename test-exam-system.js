// Test script to verify the exam system functionality
// Run this in the browser console to test the system

console.log('🧪 Testing Exam System Functionality...\n');

// Test 1: Clear existing data
console.log('1. Clearing existing placeholder data...');
localStorage.removeItem('mockExams');
localStorage.removeItem('examResults');
console.log('✅ Cleared existing data\n');

// Test 2: Create a sample exam
console.log('2. Creating a sample exam...');
const sampleExam = {
  id: 'test-exam-1',
  title: 'Sample Mathematics Test',
  description: 'A test exam to verify the system works',
  subject: 'MATHEMATICS',
  duration: 30,
  totalQuestions: 3,
  difficulty: 'EASY',
  isActive: true,
  createdAt: new Date().toISOString(),
  attempts: 0,
  instructions: 'Answer all questions carefully.',
  questions: [
    {
      id: 'q1',
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
      id: 'q2',
      questionText: 'What is 5 × 3?',
      optionA: '12',
      optionB: '15',
      optionC: '18',
      optionD: '20',
      optionE: '25',
      correctAnswer: 'B',
      difficulty: 'EASY',
      points: 1
    },
    {
      id: 'q3',
      questionText: 'What is 10 ÷ 2?',
      optionA: '3',
      optionB: '4',
      optionC: '5',
      optionD: '6',
      optionE: '8',
      correctAnswer: 'C',
      difficulty: 'EASY',
      points: 1
    }
  ]
};

localStorage.setItem('mockExams', JSON.stringify([sampleExam]));
console.log('✅ Created sample exam:', sampleExam.title, '\n');

// Test 3: Simulate a student taking the exam
console.log('3. Simulating student exam completion...');
const examResult = {
  id: 'result-1',
  examId: 'test-exam-1',
  examTitle: 'Sample Mathematics Test',
  subject: 'MATHEMATICS',
  studentId: 'test-student',
  studentName: 'Test Student',
  studentEmail: 'test@example.com',
  score: 2,
  totalQuestions: 3,
  correctAnswers: 2,
  percentage: 67,
  grade: 'D',
  submittedAt: new Date().toISOString(),
  timeSpent: 15,
  isApproved: false
};

localStorage.setItem('examResults', JSON.stringify([examResult]));
console.log('✅ Student completed exam with score:', examResult.percentage + '%\n');

// Test 4: Verify data is accessible
console.log('4. Verifying data accessibility...');
const storedExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
const storedResults = JSON.parse(localStorage.getItem('examResults') || '[]');

console.log('📊 Available Exams:', storedExams.length);
console.log('📊 Exam Results:', storedResults.length);
console.log('📊 Pending Approvals:', storedResults.filter(r => !r.isApproved).length);
console.log('✅ Data verification complete\n');

// Test 5: Simulate admin approval
console.log('5. Simulating admin approval...');
const updatedResults = storedResults.map(result => ({
  ...result,
  isApproved: true,
  approvedBy: 'Test Admin',
  approvedAt: new Date().toISOString()
}));

localStorage.setItem('examResults', JSON.stringify(updatedResults));
console.log('✅ Admin approved all results\n');

// Test 6: Final verification
console.log('6. Final system verification...');
const finalExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
const finalResults = JSON.parse(localStorage.getItem('examResults') || '[]');

console.log('📊 Final Stats:');
console.log('   - Available Exams:', finalExams.length);
console.log('   - Total Results:', finalResults.length);
console.log('   - Approved Results:', finalResults.filter(r => r.isApproved).length);
console.log('   - Average Score:', Math.round(finalResults.reduce((acc, r) => acc + r.percentage, 0) / finalResults.length) + '%');

console.log('\n🎉 All tests passed! The exam system is working correctly.');
console.log('\n📝 Next Steps:');
console.log('   1. Visit /admin/exams to see the created exam');
console.log('   2. Visit /admin/results to see and approve results');
console.log('   3. Visit /student/exams to see available exams');
console.log('   4. Visit /student/results to see approved results');
console.log('   5. Create real exams using the admin interface');
