"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen, 
  TrendingUp,
  ArrowLeft,
  Download,
  Share2,
  Star
} from "lucide-react";

interface QuestionResult {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctAnswer: string;
  userAnswer: string;
  explanation?: string;
  difficulty: string;
  points: number;
}

interface ExamResult {
  id: string;
  examTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  grade: string;
  submittedAt: string;
  timeSpent: number; // in minutes
  questions: QuestionResult[];
  feedback?: string;
  isApproved: boolean;
  approvedAt?: string;
}

export default function ExamResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setResult({
        id: params.id,
        examTitle: "JAMB Mathematics Practice Test",
        subject: "MATHEMATICS",
        score: 42,
        totalQuestions: 50,
        correctAnswers: 42,
        percentage: 84,
        grade: "A",
        submittedAt: "2024-01-15T10:30:00Z",
        timeSpent: 95, // 1 hour 35 minutes
        isApproved: true,
        approvedAt: "2024-01-15T11:00:00Z",
        feedback: "Excellent performance! You demonstrated strong understanding of mathematical concepts. Keep up the great work!",
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
            userAnswer: "B",
            difficulty: "EASY",
            points: 1,
            explanation: "To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4"
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
            userAnswer: "A",
            difficulty: "MEDIUM",
            points: 1,
            explanation: "A triangle with sides 3, 4, 5 satisfies the Pythagorean theorem (3² + 4² = 5²), making it a right-angled triangle."
          },
          // Add more mock questions as needed
        ],
      });
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-green-100 text-green-800";
      case "B": return "bg-blue-100 text-blue-800";
      case "C": return "bg-yellow-100 text-yellow-800";
      case "D": return "bg-orange-100 text-orange-800";
      case "F": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! You've mastered this subject.";
    if (percentage >= 80) return "Excellent work! You have a strong understanding.";
    if (percentage >= 70) return "Good job! You're on the right track.";
    if (percentage >= 60) return "Satisfactory. Consider reviewing the topics you missed.";
    return "Keep studying! You can improve with more practice.";
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Result not found</h3>
        <p className="text-gray-500">The exam result you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{result.examTitle}</h1>
                <p className="text-sm text-gray-600">{result.subject} • {result.submittedAt}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Result Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Score */}
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{result.percentage}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>

            {/* Grade */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold mb-2 ${getGradeColor(result.grade)}`}>
                {result.grade}
              </div>
              <div className="text-sm text-gray-600">Grade</div>
            </div>

            {/* Correct Answers */}
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{result.correctAnswers}/{result.totalQuestions}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>

            {/* Time Spent */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{formatTime(result.timeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-900">Performance Summary</span>
            </div>
            <p className="text-gray-700">{getPerformanceMessage(result.percentage)}</p>
          </div>

          {/* Feedback */}
          {result.feedback && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Instructor Feedback</span>
              </div>
              <p className="text-blue-800">{result.feedback}</p>
            </div>
          )}

          {/* Approval Status */}
          {result.isApproved && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Result Approved</span>
                <span className="text-green-700 text-sm">
                  • {result.approvedAt ? new Date(result.approvedAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            <span>{showDetailedView ? 'Hide' : 'Show'} Detailed Review</span>
          </button>
        </div>

        {/* Detailed Question Review */}
        {showDetailedView && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
              <p className="text-sm text-gray-600">Review each question and see the correct answers with explanations</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {result.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        Question {index + 1}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          question.difficulty === "EASY" ? "bg-green-100 text-green-800" :
                          question.difficulty === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {question.difficulty}
                        </span>
                        {question.userAnswer === question.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>

                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {question.questionText}
                    </h4>

                    <div className="space-y-2 mb-4">
                      {['A', 'B', 'C', 'D', 'E'].map((option) => {
                        const isCorrect = option === question.correctAnswer;
                        const isUserAnswer = option === question.userAnswer;
                        const optionText = question[`option${option}` as keyof QuestionResult] as string;
                        
                        return (
                          <div
                            key={option}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrect
                                ? "border-green-500 bg-green-50"
                                : isUserAnswer && !isCorrect
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-700">{option}.</span>
                              <span className="text-gray-900">{optionText}</span>
                              {isCorrect && (
                                <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                              )}
                              {isUserAnswer && !isCorrect && (
                                <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-900">Explanation</span>
                        </div>
                        <p className="text-blue-800 text-sm">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
