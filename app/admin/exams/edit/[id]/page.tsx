"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, CheckCircle, X } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  points: number;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  totalQuestions: number;
  duration: number;
  isActive: boolean;
  createdAt: string;
  attempts: number;
  description?: string;
  instructions?: string;
  questions?: Question[];
}

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    subject: "MATHEMATICS",
    duration: 120,
    instructions: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const subjects = [
    "ENGLISH", "MATHEMATICS", "PHYSICS", "CHEMISTRY", "BIOLOGY",
    "ACCOUNTING", "ECONOMICS", "LITERATURE", "IGBO", "YORUBA"
  ];

  useEffect(() => {
    // Load exam data
    const loadExam = () => {
      // First try to find in localStorage (custom exams)
      const customExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
      const customExam = customExams.find((exam: Exam) => exam.id === examId);
      
      if (customExam) {
        setExamData({
          title: customExam.title,
          description: customExam.description || "",
          subject: customExam.subject,
          duration: customExam.duration,
          instructions: customExam.instructions || "",
        });
        setQuestions(customExam.questions || []);
        setLoading(false);
        return;
      }

      // If not found in custom exams, check default exams
      const defaultExams = [
        {
          id: "1",
          title: "JAMB Mathematics Practice Test",
          subject: "MATHEMATICS",
          totalQuestions: 50,
          duration: 120,
          isActive: true,
          createdAt: "2024-01-15",
          attempts: 45,
          description: "Comprehensive mathematics practice test for JAMB preparation",
          instructions: "Answer all questions. You have 120 minutes to complete the exam.",
          questions: [
            {
              id: "1",
              questionText: "What is 2 + 2?",
              optionA: "3",
              optionB: "4",
              optionC: "5",
              optionD: "6",
              optionE: "7",
              correctAnswer: "B" as const,
              difficulty: "EASY" as const,
              points: 1,
            },
            {
              id: "2",
              questionText: "What is the derivative of x²?",
              optionA: "x",
              optionB: "2x",
              optionC: "x²",
              optionD: "2x²",
              optionE: "x³",
              correctAnswer: "B" as const,
              difficulty: "MEDIUM" as const,
              points: 2,
            }
          ]
        },
        {
          id: "2",
          title: "WAEC English Language Mock",
          subject: "ENGLISH",
          totalQuestions: 100,
          duration: 180,
          isActive: true,
          createdAt: "2024-01-14",
          attempts: 32,
          description: "English language mock exam for WAEC preparation",
          instructions: "Read all questions carefully. Choose the best answer for each question.",
          questions: [
            {
              id: "1",
              questionText: "What is the plural of 'child'?",
              optionA: "childs",
              optionB: "children",
              optionC: "childes",
              optionD: "child",
              optionE: "child's",
              correctAnswer: "B" as const,
              difficulty: "EASY" as const,
              points: 1,
            }
          ]
        },
        {
          id: "3",
          title: "Physics Fundamentals Test",
          subject: "PHYSICS",
          totalQuestions: 40,
          duration: 90,
          isActive: false,
          createdAt: "2024-01-13",
          attempts: 18,
          description: "Basic physics concepts test",
          instructions: "Solve all physics problems. Show your work where necessary.",
          questions: [
            {
              id: "1",
              questionText: "What is the unit of force?",
              optionA: "Joule",
              optionB: "Newton",
              optionC: "Watt",
              optionD: "Pascal",
              optionE: "Ampere",
              correctAnswer: "B" as const,
              difficulty: "EASY" as const,
              points: 1,
            }
          ]
        }
      ];

      const defaultExam = defaultExams.find(exam => exam.id === examId);
      if (defaultExam) {
        setExamData({
          title: defaultExam.title,
          description: defaultExam.description || "",
          subject: defaultExam.subject,
          duration: defaultExam.duration,
          instructions: defaultExam.instructions || "",
        });
        setQuestions(defaultExam.questions || []);
      } else {
        setToast({ show: true, type: 'error', message: '❌ Exam not found!' });
        setTimeout(() => router.push('/admin/exams'), 2000);
      }
      
      setLoading(false);
    };

    loadExam();
  }, [examId, router]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      optionE: "",
              correctAnswer: "A" as const,
      difficulty: "MEDIUM" as const,
      points: 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' });
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      showToast('error', 'Please add at least one question to the exam.');
      return;
    }

    // Validate that all questions have required fields
    const incompleteQuestions = questions.filter(q => 
      !q.questionText.trim() || 
      !q.optionA.trim() || 
      !q.optionB.trim() || 
      !q.optionC.trim() || 
      !q.optionD.trim()
    );

    if (incompleteQuestions.length > 0) {
      showToast('error', 'Please fill in all required fields for all questions.');
      return;
    }

    setSaving(true);
    
    try {
      // Create the updated exam object
      const updatedExam = {
        id: examId,
        title: examData.title,
        subject: examData.subject,
        totalQuestions: questions.length,
        duration: examData.duration,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        attempts: 0,
        description: examData.description,
        instructions: examData.instructions,
        questions: questions
      };

      // Update localStorage
      const customExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
      const examIndex = customExams.findIndex((exam: Exam) => exam.id === examId);
      
      if (examIndex !== -1) {
        // Update existing custom exam
        customExams[examIndex] = updatedExam;
        localStorage.setItem('mockExams', JSON.stringify(customExams));
      } else {
        // Add as new custom exam (for default exams being edited)
        customExams.push(updatedExam);
        localStorage.setItem('mockExams', JSON.stringify(customExams));
      }
      
      showToast('success', `✅ Exam "${examData.title}" updated successfully!`);
      
      // Redirect after a short delay to show the toast
      setTimeout(() => {
        router.push("/admin/exams");
      }, 1500);
      
    } catch (error) {
      console.error("Error updating exam:", error);
      showToast('error', '❌ Failed to update exam. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${
          toast.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, type: 'success', message: '' })}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <Link
          href="/admin/exams"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Exam</h1>
          <p className="text-gray-600 mt-2">Modify exam details and questions</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Exam Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Title *
              </label>
              <input
                type="text"
                required
                value={examData.title}
                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., JAMB Mathematics Practice Test"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                value={examData.subject}
                onChange={(e) => setExamData({ ...examData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject.charAt(0) + subject.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={examData.duration}
                onChange={(e) => setExamData({ ...examData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Questions
              </label>
              <input
                type="number"
                value={questions.length}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={examData.description}
              onChange={(e) => setExamData({ ...examData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Brief description of the exam..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={examData.instructions}
              onChange={(e) => setExamData({ ...examData, instructions: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Instructions for students taking this exam..."
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No questions added yet. Click &quot;Add Question&quot; to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text *
                      </label>
                      <textarea
                        value={question.questionText}
                        onChange={(e) => updateQuestion(question.id, "questionText", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter the question..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["A", "B", "C", "D", "E"].map((option) => (
                        <div key={option}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Option {option} *
                          </label>
                          <input
                            type="text"
                            value={question[`option${option}` as keyof Question] as string}
                            onChange={(e) => updateQuestion(question.id, `option${option}` as keyof Question, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={`Option ${option}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer *
                        </label>
                        <select
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(question.id, "correctAnswer", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {["A", "B", "C", "D", "E"].map((option) => (
                            <option key={option} value={option}>Option {option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty
                        </label>
                        <select
                          value={question.difficulty}
                          onChange={(e) => updateQuestion(question.id, "difficulty", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, "points", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/exams"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || questions.length === 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
