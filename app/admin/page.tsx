"use client";

import { useEffect, useState } from "react";
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
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setStats({
        totalExams: 12,
        totalStudents: 156,
        totalAttempts: 89,
        pendingApprovals: 23,
        averageScore: 78.5,
        completionRate: 85.2,
      });
      setLoading(false);
    }, 1000);
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
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">John Doe</span> completed Mathematics Exam
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <span className="text-sm font-medium text-green-600">Score: 85%</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Jane Smith</span> submitted Physics Exam
                </p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
              <span className="text-sm font-medium text-orange-600">Pending Review</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  New Chemistry Exam created
                </p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <span className="text-sm font-medium text-blue-600">50 Questions</span>
            </div>
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
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
              <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Create New Exam</p>
              <p className="text-xs text-gray-500">Set up a new CBT exam</p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Questions</p>
              <p className="text-xs text-gray-500">Create new exam questions</p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
              <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Review Results</p>
              <p className="text-xs text-gray-500">Approve pending results</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
