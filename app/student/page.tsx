"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Play
} from "lucide-react";
import Link from "next/link";

interface StudentStats {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  pendingResults: number;
  totalTimeSpent: number;
  currentStreak: number;
}

interface RecentExam {
  id: string;
  title: string;
  subject: string;
  score?: number;
  status: "completed" | "in_progress" | "available";
  submittedAt?: string;
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats>({
    totalExams: 0,
    completedExams: 0,
    averageScore: 0,
    pendingResults: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
  });
  const [recentExams, setRecentExams] = useState<RecentExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load real data from localStorage
    const loadData = () => {
      const availableExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
      const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
      
      setStats({
        totalExams: availableExams.length,
        completedExams: examResults.length,
        averageScore: examResults.length > 0 ? examResults.reduce((acc: number, r: any) => acc + r.percentage, 0) / examResults.length : 0,
        pendingResults: examResults.filter((r: any) => !r.isApproved).length,
        totalTimeSpent: examResults.reduce((acc: number, r: any) => acc + (r.timeSpent || 0), 0),
        currentStreak: 0,
      });
      
      // Show recent exams from available exams and completed results
      const recentExamsData = availableExams.slice(0, 4).map((exam: any) => {
        const result = examResults.find((r: any) => r.examId === exam.id);
        return {
          id: exam.id,
          title: exam.title,
          subject: exam.subject,
          score: result?.percentage,
          status: result ? "completed" : "available",
          submittedAt: result?.submittedAt,
        };
      });
      
      setRecentExams(recentExamsData);
      setLoading(false);
    };
    
    loadData();
    
    // Set up real-time updates by checking localStorage periodically
    const interval = setInterval(loadData, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Available Exams",
      value: stats.totalExams,
      icon: BookOpen,
      color: "bg-blue-500",
      description: "Exams you can take",
    },
    {
      title: "Completed",
      value: stats.completedExams,
      icon: CheckCircle,
      color: "bg-green-500",
      description: "Exams finished",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
      description: "Your performance",
    },
    {
      title: "Pending Results",
      value: stats.pendingResults,
      icon: AlertCircle,
      color: "bg-orange-500",
      description: "Awaiting approval",
    },
    {
      title: "Study Time",
      value: `${Math.floor(stats.totalTimeSpent / 60)}h ${stats.totalTimeSpent % 60}m`,
      icon: Clock,
      color: "bg-indigo-500",
      description: "Total time spent",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: Play,
      color: "bg-teal-500",
      description: "Daily practice",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "available": return "bg-gray-100 text-gray-800";
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
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track your progress and continue your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Exams */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Exams</h2>
          <Link
            href="/student/exams"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-900">{exam.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {exam.subject}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                      {exam.status.replace('_', ' ')}
                    </span>
                  </div>
                  {exam.submittedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(exam.submittedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {exam.score && (
                    <span className="text-sm font-medium text-gray-900">
                      Score: {exam.score}%
                    </span>
                  )}
                  {exam.status === "available" && (
                    <Link
                      href={`/student/exam/${exam.id}`}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                    >
                      Start Exam
                    </Link>
                  )}
                  {exam.status === "completed" && (
                    <Link
                      href={`/student/results/${exam.id}`}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View Result
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/student/exams"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Take New Exam</p>
              <p className="text-xs text-gray-500">Start a practice test</p>
            </Link>
            
            <Link
              href="/student/results"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Results</p>
              <p className="text-xs text-gray-500">Check your scores</p>
            </Link>
            
            <Link
              href="/student/history"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Exam History</p>
              <p className="text-xs text-gray-500">Track your progress</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
