"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Filter,
  Search,
  Eye,
  Download,
  MessageSquare,
  Star,
  AlertCircle,
  User
} from "lucide-react";

interface StudentResult {
  id: string;
  studentName: string;
  studentEmail: string;
  examTitle: string;
  examId: string;
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
  attempt: number;
}

export default function LecturerResultsPage() {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExam, setFilterExam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // all, approved, pending
  const [sortBy, setSortBy] = useState("date"); // date, score, student

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setResults([
        {
          id: "1",
          studentName: "John Doe",
          studentEmail: "john.doe@student.edu",
          examTitle: "JAMB Mathematics Practice Test",
          examId: "1",
          subject: "MATHEMATICS",
          score: 42,
          totalQuestions: 50,
          correctAnswers: 42,
          percentage: 84,
          grade: "A",
          submittedAt: "2024-01-15T10:30:00Z",
          timeSpent: 95,
          isApproved: false,
          attempt: 1,
        },
        {
          id: "2",
          studentName: "Jane Smith",
          studentEmail: "jane.smith@student.edu",
          examTitle: "WAEC English Language Mock",
          examId: "2",
          subject: "ENGLISH",
          score: 75,
          totalQuestions: 100,
          correctAnswers: 75,
          percentage: 75,
          grade: "B",
          submittedAt: "2024-01-14T14:20:00Z",
          timeSpent: 120,
          isApproved: true,
          approvedAt: "2024-01-14T15:00:00Z",
          feedback: "Good work! Focus on improving grammar and vocabulary.",
          attempt: 1,
        },
        {
          id: "3",
          studentName: "Mike Johnson",
          studentEmail: "mike.johnson@student.edu",
          examTitle: "Chemistry Basic Concepts",
          examId: "4",
          subject: "CHEMISTRY",
          score: 35,
          totalQuestions: 50,
          correctAnswers: 35,
          percentage: 70,
          grade: "B",
          submittedAt: "2024-01-13T16:45:00Z",
          timeSpent: 110,
          isApproved: true,
          approvedAt: "2024-01-13T17:30:00Z",
          feedback: "Solid understanding of basic chemistry. Keep practicing!",
          attempt: 2,
        },
        {
          id: "4",
          studentName: "Sarah Wilson",
          studentEmail: "sarah.wilson@student.edu",
          examTitle: "Biology Cell Structure",
          examId: "5",
          subject: "BIOLOGY",
          score: 28,
          totalQuestions: 30,
          correctAnswers: 28,
          percentage: 93,
          grade: "A",
          submittedAt: "2024-01-12T11:30:00Z",
          timeSpent: 75,
          isApproved: false,
          attempt: 1,
        },
        {
          id: "5",
          studentName: "David Brown",
          studentEmail: "david.brown@student.edu",
          examTitle: "JAMB Mathematics Practice Test",
          examId: "1",
          subject: "MATHEMATICS",
          score: 30,
          totalQuestions: 50,
          correctAnswers: 30,
          percentage: 60,
          grade: "C",
          submittedAt: "2024-01-11T09:15:00Z",
          timeSpent: 118,
          isApproved: true,
          approvedAt: "2024-01-11T10:00:00Z",
          feedback: "You're making progress. Review algebra and geometry sections.",
          attempt: 3,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApproveResult = (resultId: string) => {
    setResults(results.map(result => 
      result.id === resultId 
        ? { ...result, isApproved: true, approvedAt: new Date().toISOString() }
        : result
    ));
  };

  const handleAddFeedback = (resultId: string, feedback: string) => {
    setResults(results.map(result => 
      result.id === resultId 
        ? { ...result, feedback, isApproved: true, approvedAt: new Date().toISOString() }
        : result
    ));
  };

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
      const matchesSearch = 
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesExam = filterExam === "all" || result.examId === filterExam;
      const matchesStatus = filterStatus === "all" || 
        (filterStatus === "approved" && result.isApproved) ||
        (filterStatus === "pending" && !result.isApproved);
      return matchesSearch && matchesExam && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.percentage - a.percentage;
        case "student":
          return a.studentName.localeCompare(b.studentName);
        case "date":
        default:
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });

  const exams = Array.from(new Set(results.map(r => ({ id: r.examId, title: r.examTitle }))))
    .reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as { id: string; title: string }[]);

  // Calculate statistics
  const totalResults = results.length;
  const pendingResults = results.filter(r => !r.isApproved).length;
  const averageScore = results.length > 0 
    ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
    : 0;

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
        <h1 className="text-3xl font-bold text-gray-900">Student Results</h1>
        <p className="text-gray-600 mt-2">Review and approve student exam submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{totalResults}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingResults}</p>
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
              <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{totalResults - pendingResults}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students or exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Exam Filter */}
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Exams</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.title}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
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
              <option value="student">Sort by Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Results ({filteredResults.length})
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
                      <h4 className="text-lg font-medium text-gray-900">{result.studentName}</h4>
                      <span className="text-sm text-gray-500">{result.studentEmail}</span>
                      {result.attempt > 1 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Attempt #{result.attempt}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
                      <span><strong>Exam:</strong> {result.examTitle}</span>
                      <span><strong>Subject:</strong> {result.subject}</span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Submitted: {new Date(result.submittedAt).toLocaleDateString()}</span>
                      <span>Time: {formatTime(result.timeSpent)}</span>
                      <span>Questions: {result.correctAnswers}/{result.totalQuestions}</span>
                    </div>

                    {result.feedback && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <MessageSquare className="h-4 w-4 inline mr-1" />
                          {result.feedback}
                        </p>
                      </div>
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
                        className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                      
                      {!result.isApproved && (
                        <button
                          onClick={() => handleApproveResult(result.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                      )}
                      
                      <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
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
  );
}



