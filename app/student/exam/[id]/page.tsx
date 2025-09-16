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

  // Load exam data
  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setExam({
        id: params.id,
        title: "JAMB Mathematics Practice Test",
        description: "Comprehensive mathematics test covering algebra, geometry, and calculus",
        subject: "MATHEMATICS",
        duration: 120, // 2 hours
        totalQuestions: 15,
        instructions: "Read each question carefully and select the best answer. You can navigate between questions and change your answers before submitting.",
        questions: [
          {
            id: "1",
            questionText: "What is the value of x in the equation 2x + 5 = 13?",
            optionA: "3",
            optionB: "4",
            optionC: "5",
            optionD: "6",
            optionE: "7",
            correctAnswer: "B",
            difficulty: "EASY",
            points: 1,
          },
          {
            id: "2",
            questionText: "If a triangle has sides of length 3, 4, and 5, what type of triangle is it?",
            optionA: "Equilateral",
            optionB: "Isosceles",
            optionC: "Right-angled",
            optionD: "Obtuse",
            optionE: "Acute",
            correctAnswer: "C",
            difficulty: "MEDIUM",
            points: 1,
          },
          {
            id: "3",
            questionText: "What is the derivative of x² + 3x + 2?",
            optionA: "2x + 3",
            optionB: "x + 3",
            optionC: "2x + 2",
            optionD: "x² + 3",
            optionE: "2x² + 3x",
            correctAnswer: "A",
            difficulty: "MEDIUM",
            points: 1,
          },
          {
            id: "4",
            questionText: "If log₂(x) = 4, what is the value of x?",
            optionA: "8",
            optionB: "16",
            optionC: "32",
            optionD: "64",
            optionE: "128",
            correctAnswer: "B",
            difficulty: "MEDIUM",
            points: 1,
          },
          {
            id: "5",
            questionText: "What is the area of a circle with radius 7 cm? (Use π = 22/7)",
            optionA: "154 cm²",
            optionB: "44 cm²",
            optionC: "88 cm²",
            optionD: "308 cm²",
            optionE: "616 cm²",
            correctAnswer: "A",
            difficulty: "EASY",
            points: 1,
          },
          {
            id: "6",
            questionText: "Solve the quadratic equation x² - 5x + 6 = 0",
            optionA: "x = 2, x = 3",
            optionB: "x = 1, x = 6",
            optionC: "x = -2, x = -3",
            optionD: "x = 0, x = 5",
            optionE: "x = 1, x = 5",
            correctAnswer: "A",
            difficulty: "MEDIUM",
            points: 1,
          },
          {
            id: "7",
            questionText: "What is the value of sin(30°)?",
            optionA: "1/2",
            optionB: "√2/2",
            optionC: "√3/2",
            optionD: "1",
            optionE: "0",
            correctAnswer: "A",
            difficulty: "EASY",
            points: 1,
          },
          {
            id: "8",
            questionText: "If f(x) = 3x + 2 and g(x) = x - 1, what is f(g(4))?",
            optionA: "11",
            optionB: "13",
            optionC: "15",
            optionD: "17",
            optionE: "19",
            correctAnswer: "A",
            difficulty: "MEDIUM",
            points: 1,
          },
          {
            id: "9",
            questionText: "What is the probability of rolling a 6 on a fair die?",
            optionA: "1/6",
            optionB: "1/3",
            optionC: "1/2",
            optionD: "2/3",
            optionE: "5/6",
            correctAnswer: "A",
            difficulty: "EASY",
            points: 1,
          },
          {
            id: "10",
            questionText: "Find the limit as x approaches 0 of (sin x)/x",
            optionA: "0",
            optionB: "1",
            optionC: "∞",
            optionD: "-1",
            optionE: "undefined",
            correctAnswer: "B",
            difficulty: "HARD",
            points: 2,
          },
          {
            id: "11",
            questionText: "What is the sum of the first 10 natural numbers?",
            optionA: "45",
            optionB: "50",
            optionC: "55",
            optionD: "60",
            optionE: "65",
            correctAnswer: "C",
            difficulty: "EASY",
            points: 1,
          },
          {
            id: "12",
            questionText: "If a = 2 and b = 3, what is the value of a^b + b^a?",
            optionA: "17",
            optionB: "19",
            optionC: "21",
            optionD: "23",
            optionE: "25",
            correctAnswer: "A",
            difficulty: "MEDIUM",
            points: 1,
          },
          {
            id: "13",
            questionText: "What is the volume of a sphere with radius 3 cm? (Use π = 22/7)",
            optionA: "108π cm³",
            optionB: "36π cm³",
            optionC: "72π cm³",
            optionD: "144π cm³",
            optionE: "216π cm³",
            correctAnswer: "B",
            difficulty: "MEDIUM",
            points: 1,
          },
          {
            id: "14",
            questionText: "Solve for x: 2^(x+1) = 16",
            optionA: "2",
            optionB: "3",
            optionC: "4",
            optionD: "5",
            optionE: "6",
            correctAnswer: "B",
            difficulty: "MEDIUM",
            points: 1,
          },
          {
            id: "15",
            questionText: "What is the coefficient of x² in the expansion of (x + 2)³?",
            optionA: "6",
            optionB: "8",
            optionC: "12",
            optionD: "16",
            optionE: "24",
            correctAnswer: "C",
            difficulty: "MEDIUM",
            points: 1,
          },
        ],
      });
      setTimeLeft(120 * 60); // Convert to seconds
      setLoading(false);
    }, 1000);
  }, [params.id]);

  // Auto-save answers
  const saveAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    saveAnswer(questionId, answer);
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitted(true);
    // Here you would submit the exam to the backend
    console.log("Submitting exam with answers:", answers);
    
    // Mock submission - replace with actual API call
    setTimeout(() => {
      router.push(`/student/results/${params.id}`);
    }, 2000);
  }, [answers, router, params.id]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 300) return "text-red-600"; // Less than 5 minutes
    if (timeLeft < 900) return "text-orange-600"; // Less than 15 minutes
    return "text-green-600";
  };

  const getQuestionStatus = (index: number) => {
    const question = exam?.questions[index];
    if (!question) return "unanswered";
    if (answers[question.id]) return "answered";
    return "unanswered";
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
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Exam not found</h3>
        <p className="text-gray-500">The exam you are looking for does not exist.</p>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">{exam.title}</h1>
                <p className="text-xs sm:text-sm text-gray-600">{exam.subject} • {exam.totalQuestions} Questions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <Save className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Auto-saved</span>
              </div>
              <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-lg font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Question Navigation Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Question Navigation</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestionIndex(index);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? "bg-indigo-600 text-white"
                      : getQuestionStatus(index) === "answered"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span className="text-xs text-gray-600">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span className="text-xs text-gray-600">Unanswered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {!isSubmitted ? (
            <div className="max-w-4xl mx-auto">
              {/* Question */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                  <span className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {exam.totalQuestions}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentQuestion.difficulty === "EASY" ? "bg-green-100 text-green-800" :
                    currentQuestion.difficulty === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
                
                <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-6">
                  {currentQuestion.questionText}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D', 'E'].map((option) => (
                    <label
                      key={option}
                      className={`flex items-start p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === option
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                        answers[currentQuestion.id] === option
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-gray-300"
                      }`}>
                        {answers[currentQuestion.id] === option && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-700 mr-2">{option}.</span>
                        <span className="text-gray-900 text-sm sm:text-base">{currentQuestion[`option${option}` as keyof Question]}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit Exam</span>
                  </button>
                </div>

                <button
                  onClick={() => setCurrentQuestionIndex(Math.min(exam.questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Submitting your exam...</h2>
              <p className="text-gray-600">Please wait while we process your answers.</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Exam?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? You will not be able to make changes after submission.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleSubmit();
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}