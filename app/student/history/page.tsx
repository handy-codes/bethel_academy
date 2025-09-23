"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  Eye,
  BarChart3,
  BookOpen
} from "lucide-react";

interface ExamHistory {
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
  attempt: number;
  status: "completed" | "in_progress" | "abandoned";
}

export default function ExamHistoryPage() {
  const [history, setHistory] = useState<ExamHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all"); // all, week, month, year
  const [sortBy, setSortBy] = useState("date"); // date, score, subject

  useEffect(() => {
    // Load real data from localStorage
    const loadHistory = () => {
      const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
      
      // Convert exam results to history format
      const historyData = examResults.map((result: any, index: number) => ({
        id: result.id,
        examTitle: result.examTitle,
        subject: result.subject,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        percentage: result.percentage,
        grade: result.grade,
        submittedAt: result.submittedAt,
        timeSpent: result.timeSpent || 0,
        attempt: index + 1, // Simple attempt numbering
        status: result.isApproved ? "completed" : "completed" // All submitted results are completed
      }));
      
      setHistory(historyData);
      setLoading(false);
    };
    
    loadHistory();
    
    // Set up real-time updates by checking localStorage periodically
    const interval = setInterval(loadHistory, 3000); // Check every 3 seconds
    
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "abandoned": return "bg-red-100 text-red-800";
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

  // Filter and sort history
  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === "all" || item.subject === filterSubject;
      
      let matchesPeriod = true;
      if (filterPeriod !== "all") {
        const itemDate = new Date(item.submittedAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - itemDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filterPeriod) {
          case "week": matchesPeriod = diffDays <= 7; break;
          case "month": matchesPeriod = diffDays <= 30; break;
          case "year": matchesPeriod = diffDays <= 365; break;
        }
      }
      
      return matchesSearch && matchesSubject && matchesPeriod;
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

  const subjects = Array.from(new Set(history.map(h => h.subject)));

  // Calculate statistics
  const completedExams = history.filter(h => h.status === "completed");
  const averageScore = completedExams.length > 0 
    ? Math.round(completedExams.reduce((acc, h) => acc + h.percentage, 0) / completedExams.length)
    : 0;
  const totalTimeSpent = history.reduce((acc, h) => acc + h.timeSpent, 0);
  const bestScore = completedExams.length > 0 
    ? Math.max(...completedExams.map(h => h.percentage))
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
        <h1 className="text-3xl font-bold text-gray-900">Exam History</h1>
        <p className="text-gray-600 mt-2">Track your progress and review past performance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{history.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedExams.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(totalTimeSpent)}</p>
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

            {/* Period Filter */}
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
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

      {/* History List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Exam History ({filteredHistory.length} entries)
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No history found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={`${item.id}-${item.attempt}`} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{item.examTitle}</h4>
                      <span className="text-sm text-gray-500">{item.subject}</span>
                      {item.attempt > 1 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Attempt #{item.attempt}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Submitted: {new Date(item.submittedAt).toLocaleDateString()}</span>
                      <span>Time: {formatTime(item.timeSpent)}</span>
                      <span>Questions: {item.correctAnswers}/{item.totalQuestions}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Score Display */}
                    {item.status === "completed" ? (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{item.percentage}%</div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(item.grade)}`}>
                          Grade {item.grade}
                        </div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-400">--</div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status === "abandoned" ? "Abandoned" : "In Progress"}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {item.status === "completed" && (
                      <Link
                        href={`/student/results/${item.id}`}
                        className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                    )}
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






