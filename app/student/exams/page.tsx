"use client";

import { useState, useEffect } from "react";
import { Clock, BookOpen, Play, CheckCircle } from "lucide-react";
import Link from "next/link";

interface AvailableExam {
  id: string;
  title: string;
  description: string;
  subject: string;
  totalQuestions: number;
  duration: number;
  difficulty: string;
  isActive: boolean;
  createdAt: string;
  attempts: number;
}

export default function AvailableExamsPage() {
  const [exams, setExams] = useState<AvailableExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");

  const subjects = [
    "ENGLISH", "MATHEMATICS", "PHYSICS", "CHEMISTRY", "BIOLOGY",
    "ACCOUNTING", "ECONOMICS", "LITERATURE", "IGBO", "YORUBA"
  ];

  useEffect(() => {
    // Load exams from localStorage only (created by admin)
    const loadExams = () => {
      const customExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
      setExams(customExams);
      setLoading(false);
    };
    
    loadExams();
    
    // Set up real-time updates by checking localStorage periodically
    const interval = setInterval(loadExams, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === "all" || exam.subject === filterSubject;
    return matchesSearch && matchesSubject && exam.isActive;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "bg-green-100 text-green-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "HARD": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Exams</h1>
        <p className="text-gray-600 mt-2">Choose an exam to test your knowledge</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Exams
            </label>
            <input
              type="text"
              placeholder="Search by exam title..."
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
              onChange={(e) => setFilterSubject(e.target.value)}
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
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {exam.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {exam.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Subject:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {exam.subject.charAt(0) + exam.subject.slice(1).toLowerCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Difficulty:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                  {exam.difficulty}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Questions:</span>
                <span className="text-sm font-medium text-gray-900">
                  {exam.totalQuestions}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Duration:</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {exam.duration} min
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Attempts:</span>
                <span className="text-sm font-medium text-gray-900">
                  {exam.attempts}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Link
                href={`/student/exam/${exam.id}`}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Start Exam</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
          <p className="text-gray-500">
            {searchTerm || filterSubject !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "No exams are currently available. Check back later."
            }
          </p>
        </div>
      )}
    </div>
  );
}
