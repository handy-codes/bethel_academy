"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
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
  explanation?: string;
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
    isActive: true,
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const subjects = [
    "ENGLISH", "MATHEMATICS", "PHYSICS", "CHEMISTRY", "BIOLOGY",
    "ACCOUNTING", "ECONOMICS", "LITERATURE", "IGBO", "YORUBA"
  ];

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
      explanation: "",
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

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    if (questionToDuplicate) {
      const duplicatedQuestion = {
        ...questionToDuplicate,
        id: Date.now().toString(),
        questionText: questionToDuplicate.questionText + " (Copy)",
      };
      setQuestions([...questions, duplicatedQuestion]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      alert("Please add at least one question to the exam.");
      return;
    }

    // Validate all questions are complete
    const incompleteQuestions = questions.filter(q => 
      !q.questionText.trim() || 
      !q.optionA.trim() || 
      !q.optionB.trim() || 
      !q.optionC.trim() || 
      !q.optionD.trim() || 
      !q.optionE.trim()
    );

    if (incompleteQuestions.length > 0) {
      alert(`Please complete all fields for ${incompleteQuestions.length} question(s).`);
      return;
    }

    setLoading(true);
    
    try {
      // Here you would typically send the data to your API
      console.log("Creating exam:", { examData, questions });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Exam "${examData.title}" created successfully with ${questions.length} questions!`);
      router.push("/lecturer");
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Failed to create exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/lecturer"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Exam</h1>
          <p className="text-gray-600 mt-2">Design a comprehensive CBT examination for your students</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Exam Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Exam Configuration</h2>
          
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
                placeholder="e.g., Mid-term Mathematics Examination"
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
                max="300"
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
              placeholder="Brief description of what this exam covers..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions for Students
            </label>
            <textarea
              value={examData.instructions}
              onChange={(e) => setExamData({ ...examData, instructions: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Instructions that students will see before starting the exam..."
            />
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={examData.isActive}
                onChange={(e) => setExamData({ ...examData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Make exam available to students immediately</span>
            </label>
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
              <p className="text-gray-500">No questions added yet. Click &ldquo;Add Question&rdquo; to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => duplicateQuestion(question.id)}
                        className="text-blue-600 hover:text-blue-700 p-1 text-sm"
                        title="Duplicate question"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
                          Difficulty Level
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
                          max="10"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, "points", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation (Optional)
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, "explanation", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Explain why this answer is correct (shown to students after submission)..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Create?</h3>
              <p className="text-gray-600">
                {questions.length > 0 
                  ? `Your exam has ${questions.length} question${questions.length === 1 ? '' : 's'} and will take approximately ${examData.duration} minutes.`
                  : "Add some questions to continue."
                }
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/lecturer"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || questions.length === 0}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Create Exam</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}



