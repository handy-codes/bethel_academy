"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Filter, Search, CheckCircle, X } from "lucide-react";
import { dummyExams, getAllSubjects, ExamSubject } from "@/lib/dummyData";

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
  subject: ExamSubject;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState<ExamSubject | "all">("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [actionToast, setActionToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const subjects = getAllSubjects();
  const difficulties = ["EASY", "MEDIUM", "HARD"];

  useEffect(() => {
    // Load questions from localStorage only (no dummy data)
    const loadQuestions = () => {
      const availableExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
      
      // Extract all questions from exams
      const allQuestions: Question[] = [];
      availableExams.forEach((exam: any) => {
        if (exam.questions) {
          exam.questions.forEach((question: any) => {
            allQuestions.push({
              ...question,
              subject: exam.subject,
            });
          });
        }
      });
      
      setQuestions(allQuestions);
      setLoading(false);
    };
    
    loadQuestions();
    
    // Set up real-time updates by checking localStorage periodically
    const interval = setInterval(loadQuestions, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === "all" || question.subject === filterSubject;
    const matchesDifficulty = filterDifficulty === "all" || question.difficulty === filterDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "bg-green-100 text-green-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "HARD": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSubjectColor = (subject: ExamSubject) => {
    const colors: Record<ExamSubject, string> = {
      ENGLISH: "bg-blue-100 text-blue-800",
      MATHEMATICS: "bg-purple-100 text-purple-800",
      PHYSICS: "bg-indigo-100 text-indigo-800",
      CHEMISTRY: "bg-green-100 text-green-800",
      BIOLOGY: "bg-emerald-100 text-emerald-800",
      ACCOUNTING: "bg-orange-100 text-orange-800",
      ECONOMICS: "bg-pink-100 text-pink-800",
      LITERATURE: "bg-rose-100 text-rose-800",
      IGBO: "bg-amber-100 text-amber-800",
      YORUBA: "bg-cyan-100 text-cyan-800",
    };
    return colors[subject] || "bg-gray-100 text-gray-800";
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setActionToast({ show: true, type, message });
    setTimeout(() => {
      setActionToast({ show: false, type: 'success', message: '' });
    }, 4000);
  };

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowViewModal(true);
  };

  const handleEditQuestion = (question: Question, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setEditingQuestion({ ...question });
    setSelectedQuestion(question);
    setShowEditModal(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowDeleteConfirm(true);
  };

  const handleUpdateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingQuestion || !selectedQuestion) return;
    
    try {
      setQuestions(questions.map(q => 
        q.id === selectedQuestion.id ? editingQuestion : q
      ));
      
      setShowEditModal(false);
      setSelectedQuestion(null);
      setEditingQuestion(null);
      showToast('success', `✅ Question updated successfully!`);
    } catch (error) {
      showToast('error', '❌ Failed to update question. Please try again.');
    }
  };

  const confirmDeleteQuestion = () => {
    if (!selectedQuestion) return;
    
    try {
      const deletedQuestion = selectedQuestion;
      setQuestions(questions.filter(q => q.id !== selectedQuestion.id));
      
      setShowDeleteConfirm(false);
      setSelectedQuestion(null);
      showToast('success', `✅ Question deleted successfully!`);
    } catch (error) {
      showToast('error', '❌ Failed to delete question. Please try again.');
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600 mt-2">Manage exam questions for all subjects</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Easy Questions</p>
              <p className="text-2xl font-bold text-gray-900">
                {questions.filter(q => q.difficulty === "EASY").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hard Questions</p>
              <p className="text-2xl font-bold text-gray-900">
                {questions.filter(q => q.difficulty === "HARD").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Questions
            </label>
            <input
              type="text"
              placeholder="Search by question text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Subject
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value as ExamSubject | "all")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject.charAt(0) + subject.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Difficulty
            </label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Questions ({filteredQuestions.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correct Answer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {question.questionText}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(question.subject)}`}>
                      {question.subject.charAt(0) + question.subject.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium text-green-600">{question.correctAnswer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewQuestion(question)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded" 
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => handleEditQuestion(question, e)}
                        className="p-1 text-indigo-600 hover:bg-indigo-100 rounded" 
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(question)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-500">
            {searchTerm || filterSubject !== "all" || filterDifficulty !== "all"
              ? "Try adjusting your search or filter criteria."
              : "No questions are available in the question bank."
            }
          </p>
        </div>
      )}

      {/* Action Toast Notification */}
      {actionToast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${
          actionToast.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : actionToast.type === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {actionToast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : actionToast.type === 'error' ? (
            <X className="h-5 w-5 text-red-600" />
          ) : (
            <CheckCircle className="h-5 w-5 text-blue-600" />
          )}
          <span className="font-medium">{actionToast.message}</span>
          <button
            onClick={() => setActionToast({ show: false, type: 'success', message: '' })}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* View Question Modal */}
      {showViewModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Question Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Question</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedQuestion.questionText}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(selectedQuestion.subject)}`}>
                      {selectedQuestion.subject}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                      {selectedQuestion.difficulty}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    <p className="text-sm text-gray-900">{selectedQuestion.points}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                    <p className="text-sm text-gray-900 font-semibold">Option {selectedQuestion.correctAnswer}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  <div className="space-y-2">
                    {["A", "B", "C", "D", "E"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700 w-6">Option {option}:</span>
                        <span className={`text-sm ${selectedQuestion.correctAnswer === option ? 'text-green-600 font-semibold' : 'text-gray-900'}`}>
                          {selectedQuestion[`option${option}` as keyof Question] as string}
                          {selectedQuestion.correctAnswer === option && ' ✓'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditModal && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Edit Question</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedQuestion(null);
                    setEditingQuestion(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                  <textarea
                    value={editingQuestion.questionText}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
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
                        value={editingQuestion[`option${option}` as keyof Question] as string}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, [`option${option}`]: e.target.value })}
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
                      value={editingQuestion.correctAnswer}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value as "A" | "B" | "C" | "D" | "E" })}
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
                      value={editingQuestion.difficulty}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD" })}
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
                      value={editingQuestion.points}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, points: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedQuestion(null);
                      setEditingQuestion(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Update Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Question</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-700">
                  Are you sure you want to delete this question?
                </p>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    &ldquo;{selectedQuestion.questionText.substring(0, 100)}...&rdquo;
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedQuestion(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteQuestion}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
