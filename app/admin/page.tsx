"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  FileText
} from "lucide-react";

interface DashboardStats {
  totalExams: number;
  totalStudents: number;
  totalAttempts: number;
  pendingApprovals: number;
  averageScore: number;
  completionRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalExams: 0,
    totalStudents: 0,
    totalAttempts: 0,
    pendingApprovals: 0,
    averageScore: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load real data from localStorage
    const loadStats = () => {
      const availableExams = JSON.parse(localStorage.getItem('mockExams') || '[]');
      const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');

      // Calculate real statistics
      const totalExams = availableExams.length;
      const totalAttempts = examResults.length;
      const pendingApprovals = examResults.filter((r: any) => !r.isApproved).length;
      const averageScore = examResults.length > 0
        ? Math.round(examResults.reduce((acc: number, r: any) => acc + r.percentage, 0) / examResults.length)
        : 0;
      const completionRate = examResults.length > 0
        ? Math.round((examResults.filter((r: any) => r.isApproved).length / examResults.length) * 100)
        : 0;

      // Estimate unique students (in real app, this would come from user database)
      const uniqueStudents = new Set(examResults.map((r: any) => r.studentId)).size;

      setStats({
        totalExams,
        totalStudents: uniqueStudents || 0,
        totalAttempts,
        pendingApprovals,
        averageScore,
        completionRate,
      });
      setLoading(false);
    };

    loadStats();

    // Set up real-time updates by checking localStorage periodically
    const interval = setInterval(loadStats, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Total Exams",
      value: stats.totalExams,
      icon: BookOpen,
      color: "bg-blue-500",
      change: "+2 this week",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-green-500",
      change: "+12 this month",
    },
    {
      title: "Exam Attempts",
      value: stats.totalAttempts,
      icon: CheckCircle,
      color: "bg-purple-500",
      change: "+8 today",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: AlertCircle,
      color: "bg-orange-500",
      change: "Needs attention",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: "bg-indigo-500",
      change: "+5.2% from last month",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: Clock,
      color: "bg-teal-500",
      change: "+2.1% from last month",
    },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the Bethel Academy CBT Admin Dashboard
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
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {(() => {
              const examResults = JSON.parse(localStorage.getItem('examResults') || '[]');
              const availableExams = JSON.parse(localStorage.getItem('mockExams') || '[]');

              // Get recent exam results (last 3)
              const recentResults = examResults
                .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                .slice(0, 3);

              if (recentResults.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                );
              }

              return recentResults.map((result: any, index: number) => (
                <div key={result.id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${result.isApproved ? 'bg-green-500' : 'bg-orange-500'
                    }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{result.studentName}</span> {result.isApproved ? 'completed' : 'submitted'} {result.examTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(result.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${result.isApproved ? 'text-green-600' : 'text-orange-600'
                    }`}>
                    {result.isApproved ? `Score: ${result.percentage}%` : 'Pending Review'}
                  </span>
                </div>
              ));
            })()}
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
              href="/admin/exams/create"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Create New Exam</p>
              <p className="text-xs text-gray-500">Set up a new CBT exam</p>
            </Link>

            <Link
              href="/admin/questions"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Questions</p>
              <p className="text-xs text-gray-500">Create new exam questions</p>
            </Link>

            <Link
              href="/admin/results"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Review Results</p>
              <p className="text-xs text-gray-500">Approve pending results</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
