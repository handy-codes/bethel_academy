"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle,
  AlertTriangle,
  Save,
  Menu,
  X
} from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
  points: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  instructions: string;
  questions: Question[];
}

export default function ExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);

  // Load exam data from localStorage only
  useEffect(() => {
    const loadExam = () => {
      // Load custom exams from localStorage only
      const customExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
      
      // Find the exam with the matching ID
      const foundExam = customExams.find((exam: any) => exam.id === params.id);
      
      if (foundExam) {
        setExam(foundExam);
        setTimeLeft(foundExam.duration * 60); // Convert to seconds
        
        // Check if exam has already been completed
        const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
        const existingResult = examResults.find((result: any) => 
          result.examId === params.id && result.studentId === 'current-student' // In real app, use actual student ID
        );
        
        if (existingResult) {
          setIsSubmitted(true);
        }
      } else {
        // Exam not found, redirect to exams page
        router.push('/student/exams');
      }
      
      setLoading(false);
    };

    loadExam();
  }, [params.id, router]);

  const calculateScore = () => {
    if (!exam) return { score: 0, total: 0, percentage: 0, grade: 'F' };
    
    let correctAnswers = 0;
    exam.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const percentage = Math.round((correctAnswers / exam.questions.length) * 100);
    let grade = 'F';
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    
    return {
      score: correctAnswers,
      total: exam.questions.length,
      percentage,
      grade
    };
  };

  // Timer effect
  useEffect(() => {
    if (!examStarted || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          if (exam) {
            const result = calculateScore();
            const timeSpent = Math.floor((exam.duration * 60 - timeLeft) / 60);
            
            const examResult = {
              id: Date.now().toString(),
              examId: exam.id,
              examTitle: exam.title,
              subject: exam.subject,
              studentId: 'current-student',
              studentName: 'Current Student',
              studentEmail: 'student@example.com',
              score: result.score,
              totalQuestions: result.total,
              correctAnswers: result.score,
              percentage: result.percentage,
              grade: result.grade,
              submittedAt: new Date().toISOString(),
              timeSpent: timeSpent,
              isApproved: false,
            };
            
            const existingResults = JSON.parse(localStorage.getItem('examResults') || '[]');
            existingResults.push(examResult);
            localStorage.setItem('examResults', JSON.stringify(existingResults));
            
            setIsSubmitted(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isSubmitted, timeLeft, exam, answers]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setSidebarOpen(false);
  };

  const handleSubmitExam = useCallback(() => {
    if (!exam) return;
    
    const result = calculateScore();
    const timeSpent = Math.floor((exam.duration * 60 - timeLeft) / 60); // Convert to minutes
    
    const examResult = {
      id: Date.now().toString(),
      examId: exam.id,
      examTitle: exam.title,
      subject: exam.subject,
      studentId: 'current-student', // In real app, use actual student ID
      studentName: 'Current Student', // In real app, use actual student name
      studentEmail: 'student@example.com', // In real app, use actual student email
      score: result.score,
      totalQuestions: result.total,
      correctAnswers: result.score,
      percentage: result.percentage,
      grade: result.grade,
      submittedAt: new Date().toISOString(),
      timeSpent: timeSpent,
      isApproved: false,
    };
    
    // Save result to localStorage
    const existingResults = JSON.parse(localStorage.getItem('examResults') || '[]');
    existingResults.push(examResult);
    localStorage.setItem('examResults', JSON.stringify(existingResults));
    
    setIsSubmitted(true);
    setShowConfirmSubmit(false);
  }, [exam, timeLeft, answers]);

  const startExam = () => {
    setExamStarted(true);
    setShowStartConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Exam Not Found</h2>
          <p className="text-gray-600 mb-4">The exam you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/student/exams')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    const result = calculateScore();
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Submitted Successfully!</h1>
              <p className="text-gray-600">Your exam has been submitted and is pending review.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{result.percentage}%</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{result.score}/{result.total}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{result.grade}</div>
                <div className="text-sm text-gray-600">Grade</div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => router.push('/student/results')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 mr-4"
              >
                View All Results
              </button>
              <button
                onClick={() => router.push('/student/exams')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
              >
                Take Another Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
              <p className="text-gray-600 text-lg">{exam.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Exam Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Subject: <span className="font-medium">{exam.subject}</span></div>
                  <div>Duration: <span className="font-medium">{exam.duration} minutes</span></div>
                  <div>Questions: <span className="font-medium">{exam.totalQuestions}</span></div>
                </div>
              </div>
              
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                <div className="text-sm text-gray-600">
                  <p>{exam.instructions}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setShowStartConfirm(true)}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 text-lg font-medium"
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
        
        {/* Start Confirmation Modal */}
        {showStartConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Ready to Start?</h3>
                    <p className="text-sm text-gray-500">Once you start, the timer will begin.</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-700">
                    You have <strong>{exam.duration} minutes</strong> to complete this exam. 
                    Make sure you&apos;re ready before starting.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowStartConfirm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startExam}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Start Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{exam.title}</h1>
                <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Save className="h-4 w-4" />
                <span>Auto-saved</span>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Question Navigator</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleGoToQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-indigo-600 text-white'
                      : answers[exam.questions[index].id]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                <span>Current Question</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span>Answered ({answeredQuestions})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>Not Answered ({exam.questions.length - answeredQuestions})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* Question */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">
                      Question {currentQuestionIndex + 1} of {exam.questions.length}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentQuestion.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                      currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {currentQuestion.questionText}
                  </h2>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  {['A', 'B', 'C', 'D', 'E'].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === option
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="font-medium text-gray-900">{option}.</span>
                      <span className="text-gray-700">{currentQuestion[`option${option}` as keyof Question]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit Exam</span>
                  </button>
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={isLastQuestion}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Submit Exam?</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-700">
                  You have answered <strong>{answeredQuestions} out of {exam.questions.length}</strong> questions.
                  Are you sure you want to submit your exam?
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitExam}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
