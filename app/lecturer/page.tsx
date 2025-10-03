"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  BookOpen,
  Users,
  CheckCircle,
  TrendingUp,
  Clock,
  Plus
} from "lucide-react";
import Link from "next/link";

interface LecturerStats {
  totalExams: number;
  totalStudents: number;
  totalAttempts: number;
  averageScore: number;
  pendingReviews: number;
  activeExams: number;
}

interface RecentActivity {
  id: string;
  type: "exam_completed" | "exam_created" | "result_reviewed";
  title: string;
  studentName?: string;
  examName?: string;
  timestamp: string;
  score?: number;
}

export default function LecturerDashboard() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<LecturerStats>({
    totalExams: 0,
    totalStudents: 0,
    totalAttempts: 0,
    averageScore: 0,
    pendingReviews: 0,
    activeExams: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!isLoaded || !user) return;
      const lecturerId = user.id;
      const [exRes, rRes] = await Promise.all([
        fetch(`/api/exams?createdBy=${encodeURIComponent(lecturerId)}`, { cache: 'no-store' }),
        fetch(`/api/results?lecturerId=${encodeURIComponent(lecturerId)}`, { cache: 'no-store' }),
      ]);
      const exData = await exRes.json();
      const rData = await rRes.json();
      const exams = exData.exams || [];
      const results = rData.results || [];

      const totalExams = exams.length;
      const activeExams = exams.filter((e: any) => e.isActive).length;
      const totalAttempts = results.length;
      const averageScore = totalAttempts ? Math.round(results.reduce((s: number, r: any) => s + (r.percentage || 0), 0) / totalAttempts) : 0;
      const pendingReviews = results.filter((r: any) => !r.isApproved).length;

      setStats({ totalExams, totalStudents: 0, totalAttempts, averageScore, pendingReviews, activeExams });

      const recent = results.slice(0, 5).map((r: any, i: number) => ({
        id: String(i),
        type: r.isApproved ? 'result_reviewed' : 'exam_completed',
        title: r.isApproved ? 'Result reviewed' : 'Student completed exam',
        studentName: r.studentName,
        examName: r.examTitle || '',
        timestamp: r.createdAt || new Date().toISOString(),
        score: r.percentage,
      }));
      setRecentActivity(recent);
      setLoading(false);
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [user, isLoaded]);

  const statCards = [
    {
      title: "My Exams",
      value: stats.totalExams,
      icon: BookOpen,
      color: "bg-blue-500",
      description: "Total exams created",
    },
    {
      title: "Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-green-500",
      description: "Students in my classes",
    },
    {
      title: "Exam Attempts",
      value: stats.totalAttempts,
      icon: CheckCircle,
      color: "bg-purple-500",
      description: "Total attempts taken",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: "bg-indigo-500",
      description: "Class average",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: Clock,
      color: "bg-orange-500",
      description: "Results to review",
    },
    {
      title: "Active Exams",
      value: stats.activeExams,
      icon: BookOpen,
      color: "bg-teal-500",
      description: "Currently active",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "exam_completed": return "✅";
      case "exam_created": return "📝";
      case "result_reviewed": return "👁️";
      default: return "📋";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "exam_completed": return "text-green-600";
      case "exam_created": return "text-blue-600";
      case "result_reviewed": return "text-purple-600";
      default: return "text-gray-600";
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
    <div className="space-y-6 mt-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your exams, review results, and track student progress
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/lecturer/create-exam"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Create New Exam</p>
              <p className="text-xs text-gray-500">Set up a new CBT exam</p>
            </Link>

            <Link
              href="/lecturer/results"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Review Results</p>
              <p className="text-xs text-gray-500">Check student performance</p>
            </Link>

            <Link
              href="/lecturer/students"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
            >
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Students</p>
              <p className="text-xs text-gray-500">Manage your students</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.studentName && `${activity.studentName} • `}
                    {activity.examName}
                    {activity.score && ` • Score: ${activity.score}%`}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}







