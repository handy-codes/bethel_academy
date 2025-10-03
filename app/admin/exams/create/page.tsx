"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, CheckCircle, X, Search, Filter } from "lucide-react";
import Link from "next/link";
import { getAllSubjects, ExamSubject } from "@/lib/dummyData";
import { useUser } from "@clerk/nextjs";

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
  subject: ExamSubject;
}

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [questionBankSearch, setQuestionBankSearch] = useState("");
  const [questionBankFilter, setQuestionBankFilter] = useState<ExamSubject | "all">("all");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const subjects = [
    "ENGLISH", "MATHEMATICS", "PHYSICS", "CHEMISTRY", "BIOLOGY",
    "ACCOUNTING", "ECONOMICS", "LITERATURE", "IGBO", "YORUBA"
  ];

  const { user, isLoaded } = useUser();

  // Load questions from question bank when modal opens (from API)
  useEffect(() => {
    if (showQuestionBank) {
      (async () => {
        try {
          const res = await fetch('/api/questions', { cache: 'no-store' });
          const data = await res.json();
          const qs = (data.questions || []).map((q: any) => ({
            id: q.id,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            optionE: q.optionE,
            correctAnswer: q.correctAnswer,
            difficulty: q.difficulty || 'MEDIUM',
            points: q.points || 1,
            subject: q.subject as ExamSubject,
          })) as Question[];
          setAvailableQuestions(qs);
        } catch (e) {
          console.error('Failed to load question bank', e);
          setAvailableQuestions([]);
        }
      })();
    }
  }, [showQuestionBank]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      optionE: "",
      correctAnswer: "A",
      difficulty: "MEDIUM",
      points: 1,
      subject: examData.subject as ExamSubject,
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

  // Filter questions for the question bank modal
  const filteredAvailableQuestions = availableQuestions.filter(question => {
    const matchesSearch = question.questionText.toLowerCase().includes(questionBankSearch.toLowerCase());
    const matchesSubject = questionBankFilter === "all" || question.subject === questionBankFilter;
    return matchesSearch && matchesSubject;
  });

  const handleSelectQuestions = () => {
    const questionsToAdd = availableQuestions.filter(q => selectedQuestions.includes(q.id));
    setQuestions([...questions, ...questionsToAdd]);
    setSelectedQuestions([]);
    setShowQuestionBank(false);
    showToast('success', `✅ Added ${questionsToAdd.length} questions to exam!`);
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
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

    setLoading(true);

    try {
      const payload = {
        title: examData.title,
        description: examData.description,
        subject: examData.subject,
        duration: examData.duration,
        instructions: examData.instructions,
        isActive: true,
        createdBy: user?.id,
        questions: questions.map(q => ({
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          optionE: q.optionE,
          correctAnswer: q.correctAnswer,
          difficulty: q.difficulty,
          points: q.points,
        })),
      };

      const res = await fetch('/api/exams', { method: 'POST', body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to create');

      showToast('success', `✅ Exam "${examData.title}" created successfully!`);
      setTimeout(() => router.push('/admin/exams'), 1200);

    } catch (error) {
      console.error("Error creating exam:", error);
      showToast('error', '❌ Failed to create exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${toast.type === 'success'
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Exam</h1>
          <p className="text-gray-600 mt-2">Set up a new CBT examination</p>
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
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowQuestionBank(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Select from Bank</span>
              </button>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </button>
            </div>
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
            disabled={loading || questions.length === 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating..." : "Create Exam"}
          </button>
        </div>
      </form>

      {/* Question Bank Selection Modal */}
      {showQuestionBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Select Questions from Bank</h2>
                <button
                  onClick={() => {
                    setShowQuestionBank(false);
                    setSelectedQuestions([]);
                    setQuestionBankSearch("");
                    setQuestionBankFilter("all");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Questions
                  </label>
                  <input
                    type="text"
                    placeholder="Search by question text..."
                    value={questionBankSearch}
                    onChange={(e) => setQuestionBankSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Subject
                  </label>
                  <select
                    value={questionBankFilter}
                    onChange={(e) => setQuestionBankFilter(e.target.value as ExamSubject | "all")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Subjects</option>
                    {getAllSubjects().map(subject => (
                      <option key={subject} value={subject}>
                        {subject.charAt(0) + subject.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Questions Count */}
              {selectedQuestions.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAvailableQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No questions found matching your criteria.</p>
                  </div>
                ) : (
                  filteredAvailableQuestions.map((question) => (
                    <div
                      key={question.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedQuestions.includes(question.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => toggleQuestionSelection(question.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(question.id)}
                          onChange={() => toggleQuestionSelection(question.id)}
                          className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 mb-2">{question.questionText}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {question.subject}
                            </span>
                            <span className={`px-2 py-1 rounded ${question.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {question.difficulty}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {question.points} point{question.points !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowQuestionBank(false);
                    setSelectedQuestions([]);
                    setQuestionBankSearch("");
                    setQuestionBankFilter("all");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelectQuestions}
                  disabled={selectedQuestions.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add {selectedQuestions.length} Question{selectedQuestions.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
