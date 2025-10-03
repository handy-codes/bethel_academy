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

export default function EditLecturerExamPage() {
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
  const [initialExamData, setInitialExamData] = useState({
    title: "",
    description: "",
    subject: "MATHEMATICS",
    duration: 120,
    instructions: "",
  });
  const [initialQuestions, setInitialQuestions] = useState<Question[]>([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [bankQuestions, setBankQuestions] = useState<Question[]>([]);
  const [selectedBankIds, setSelectedBankIds] = useState<Record<string, boolean>>({});
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
    const loadExam = () => {
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
        setInitialExamData({
          title: customExam.title,
          description: customExam.description || "",
          subject: customExam.subject,
          duration: customExam.duration,
          instructions: customExam.instructions || "",
        });
        setInitialQuestions(customExam.questions || []);
        preloadBankQuestions(customExam.subject);
        setLoading(false);
        return;
      }

      setToast({ show: true, type: 'error', message: '❌ Exam not found!' });
      setTimeout(() => router.push('/lecturer/exams'), 2000);
      setLoading(false);
    };

    loadExam();
  }, [examId, router]);

  const preloadBankQuestions = (subject: string) => {
    const availableExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
    const all: Question[] = [];
    availableExams.forEach((ex: any) => {
      if (ex.questions && ex.subject) {
        ex.questions.forEach((q: any) => {
          const qb: Question = {
            id: q.id,
            questionText: q.questionText || "",
            optionA: q.optionA || "",
            optionB: q.optionB || "",
            optionC: q.optionC || "",
            optionD: q.optionD || "",
            optionE: q.optionE || "",
            correctAnswer: (q.correctAnswer || 'A') as "A" | "B" | "C" | "D" | "E",
            difficulty: (q.difficulty || 'MEDIUM') as "EASY" | "MEDIUM" | "HARD",
            points: typeof q.points === 'number' ? q.points : 1,
          };
          (qb as any).__subject = ex.subject;
          all.push(qb);
        });
      }
    });
    const prioritized = all.filter(q => (q as any).__subject === subject);
    const others = all.filter(q => (q as any).__subject !== subject);
    setBankQuestions([...prioritized, ...others]);
  };

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
    };
    setQuestions([...questions, newQuestion]);
    showToast('success', 'Empty question created below.');
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
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

      const customExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
      const examIndex = customExams.findIndex((exam: Exam) => exam.id === examId);
      if (examIndex !== -1) {
        customExams[examIndex] = updatedExam;
        localStorage.setItem('mockExams', JSON.stringify(customExams));
      } else {
        customExams.push(updatedExam);
        localStorage.setItem('mockExams', JSON.stringify(customExams));
      }

      showToast('success', `✅ Exam "${examData.title}" updated successfully!`);
      setInitialExamData({
        title: updatedExam.title,
        description: updatedExam.description || "",
        subject: updatedExam.subject,
        duration: updatedExam.duration,
        instructions: updatedExam.instructions || "",
      });
      setInitialQuestions(updatedExam.questions || []);
      setTimeout(() => { router.push("/lecturer/exams"); }, 1500);
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
          href="/lecturer/exams"
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <select
                value={examData.subject}
                onChange={(e) => setExamData({ ...examData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject.charAt(0) + subject.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Questions</label>
              <input
                type="number"
                value={questions.length}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={examData.description}
              onChange={(e) => setExamData({ ...examData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Brief description of the exam..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <textarea
              value={examData.instructions}
              onChange={(e) => setExamData({ ...examData, instructions: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Instructions for students taking this exam..."
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBankModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add from Question Bank</span>
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
                    <button type="button" onClick={() => removeQuestion(question.id)} className="text-red-600 hover:text-red-700 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Option {option} *</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
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

        <div className="flex justify-end space-x-4">
          <Link href="/lecturer/exams" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
          <button
            type="submit"
            disabled={saving || (JSON.stringify(examData) === JSON.stringify(initialExamData) && JSON.stringify(questions) === JSON.stringify(initialQuestions))}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {showBankModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add from Question Bank</h2>
                <button onClick={() => setShowBankModal(false)} className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-3 max-h-[55vh] overflow-y-auto">
                {bankQuestions
                  .filter(q => q.questionText.toLowerCase().includes(bankSearch.toLowerCase()))
                  .map(q => (
                    <label key={q.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={!!selectedBankIds[q.id]}
                        onChange={(e) => setSelectedBankIds(prev => ({ ...prev, [q.id]: e.target.checked }))}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{q.questionText}</p>
                        <p className="text-xs text-gray-500">Correct: {q.correctAnswer} • Difficulty: {q.difficulty} • Points: {q.points}</p>
                      </div>
                    </label>
                  ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowBankModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => {
                    const selected = bankQuestions.filter(q => selectedBankIds[q.id]);
                    if (selected.length === 0) {
                      showToast('error', 'Please select at least one question.');
                      return;
                    }
                    const cloned: Question[] = selected.map(q => ({ ...q, id: `${q.id}-${Date.now()}` }));
                    setQuestions(prev => [...prev, ...cloned]);
                    setSelectedBankIds({});
                    setShowBankModal(false);
                    showToast('success', `${cloned.length} question(s) added from bank.`);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


