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
  Save
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
        totalQuestions: 50,
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
          // Add more mock questions as needed
        ],
      });
      setTimeLeft(120 * 60); // Convert to seconds
      setLoading(false);
    }, 1000);
  }, [params.id]);

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
  }, [timeLeft, isSubmitted]);

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

  const handleSubmit = async () => {
    setIsSubmitted(true);
    // Here you would submit the exam to the backend
    console.log("Submitting exam with answers:", answers);
    
    // Mock submission - replace with actual API call
    setTimeout(() => {
      router.push(`/student/results/${params.id}`);
    }, 2000);
  };

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
        <p className="text-gray-500">The exam you're looking for doesn't exist.</p>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600">{exam.subject} • {exam.totalQuestions} Questions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Auto-saved</span>
              </div>
              <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                <Clock className="h-5 w-5" />
                <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Question Navigation Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Question Navigation</h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
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
        <div className="flex-1 p-6">
          {!isSubmitted ? (
            <div className="max-w-4xl mx-auto">
              {/* Question */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
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
                
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  {currentQuestion.questionText}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D', 'E'].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
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
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQuestion.id] === option
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-gray-300"
                      }`}>
                        {answers[currentQuestion.id] === option && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium text-gray-700 mr-3">{option}.</span>
                      <span className="text-gray-900">{currentQuestion[`option${option}` as keyof Question]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit Exam</span>
                  </button>
                </div>

                <button
                  onClick={() => setCurrentQuestionIndex(Math.min(exam.questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Exam?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? You won't be able to make changes after submission.
            </p>
            <div className="flex space-x-3">
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
