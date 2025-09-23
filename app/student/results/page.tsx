"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Filter,
  Search,
  Download,
  Eye,
  Star
} from "lucide-react";

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
  isApproved: boolean;
  approvedAt?: string;
  feedback?: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // date, score, subject

  useEffect(() => {
    // Load real data from localStorage
    const loadResults = () => {
      const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
      setResults(examResults);
      setLoading(false);
    };
    
    loadResults();
    
    // Set up real-time updates by checking localStorage periodically
    const interval = setInterval(loadResults, 2000); // Check every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

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

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 90) return <Star className="h-4 w-4 text-yellow-500" />;
    if (percentage >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (percentage >= 70) return <CheckCircle className="h-4 w-4 text-blue-500" />;
    return <Clock className="h-4 w-4 text-orange-500" />;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Filter and sort results
  const filteredResults = results
    .filter(result => {
      const matchesSearch = result.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === "all" || result.subject === filterSubject;
      const matchesGrade = filterGrade === "all" || result.grade === filterGrade;
      return matchesSearch && matchesSubject && matchesGrade;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.percentage - a.percentage;
        case "subject":
          return a.subject.localeCompare(b.subject);
        case "date":
        default:
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });

  const subjects = Array.from(new Set(results.map(r => r.subject)));
  const grades = Array.from(new Set(results.map(r => r.grade))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
              <p className="text-gray-600">View and track your exam performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Export All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{results.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Grade</p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.length > 0 ? results.sort((a, b) => b.percentage - a.percentage)[0].grade : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatTime(results.reduce((acc, r) => acc + r.timeSpent, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Subject Filter */}
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              {/* Grade Filter */}
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="subject">Sort by Subject</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Exam Results ({filteredResults.length})
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredResults.map((result) => (
                <div key={result.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{result.examTitle}</h4>
                        <span className="text-sm text-gray-500">{result.subject}</span>
                        {getPerformanceIcon(result.percentage)}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>Submitted: {new Date(result.submittedAt).toLocaleDateString()}</span>
                        <span>Time: {formatTime(result.timeSpent)}</span>
                        <span>Questions: {result.correctAnswers}/{result.totalQuestions}</span>
                      </div>

                      {result.feedback && (
                        <p className="text-sm text-gray-600 mt-2 italic">&ldquo;{result.feedback}&rdquo;</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Score Display */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{result.percentage}%</div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}>
                          Grade {result.grade}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="text-right">
                        {result.isApproved ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Approved</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-orange-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Pending</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/student/results/${result.id}`}
                          className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Link>
                        <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
