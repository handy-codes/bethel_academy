"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen,
  Clock,
  Target,
  Award,
  Activity
} from "lucide-react";

interface AnalyticsData {
  totalStudents: number;
  totalExams: number;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  topPerformers: Array<{
    name: string;
    score: number;
    subject: string;
  }>;
  subjectPerformance: Array<{
    subject: string;
    averageScore: number;
    attempts: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    attempts: number;
    averageScore: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setAnalytics({
        totalStudents: 156,
        totalExams: 12,
        totalAttempts: 342,
        averageScore: 78.5,
        completionRate: 85.2,
        topPerformers: [
          { name: "Alice Johnson", score: 95, subject: "Mathematics" },
          { name: "Bob Smith", score: 92, subject: "Physics" },
          { name: "Carol Davis", score: 90, subject: "Chemistry" },
          { name: "David Wilson", score: 88, subject: "English" },
          { name: "Eve Brown", score: 87, subject: "Biology" },
        ],
        subjectPerformance: [
          { subject: "Mathematics", averageScore: 82, attempts: 89 },
          { subject: "Physics", averageScore: 79, attempts: 67 },
          { subject: "Chemistry", averageScore: 76, attempts: 54 },
          { subject: "English", averageScore: 81, attempts: 78 },
          { subject: "Biology", averageScore: 75, attempts: 54 },
        ],
        monthlyTrends: [
          { month: "Jan", attempts: 45, averageScore: 75 },
          { month: "Feb", attempts: 52, averageScore: 77 },
          { month: "Mar", attempts: 48, averageScore: 79 },
          { month: "Apr", attempts: 61, averageScore: 78 },
          { month: "May", attempts: 58, averageScore: 80 },
          { month: "Jun", attempts: 65, averageScore: 82 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into exam performance and trends</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalAttempts}</p>
              <p className="text-xs text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageScore}%</p>
              <p className="text-xs text-green-600">+2.3% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</p>
              <p className="text-xs text-green-600">+1.8% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Trends</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.monthlyTrends.map((trend, index) => (
              <div key={trend.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 text-sm font-medium text-gray-600">{trend.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(trend.attempts / 70) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-900">
                  {trend.attempts} attempts ({trend.averageScore}% avg)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Subject Performance</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.subjectPerformance.map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-20 text-sm font-medium text-gray-900">{subject.subject}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${subject.averageScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-900">
                  {subject.averageScore}% ({subject.attempts} attempts)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topPerformers.map((performer, index) => (
              <div key={performer.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{performer.name}</p>
                  <p className="text-sm text-gray-500">{performer.subject}</p>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {performer.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Difficulty Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Easy Questions</span>
              <span className="text-sm font-medium text-green-600">87% success rate</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medium Questions</span>
              <span className="text-sm font-medium text-yellow-600">72% success rate</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hard Questions</span>
              <span className="text-sm font-medium text-red-600">54% success rate</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Completion Time</span>
              <span className="text-sm font-medium text-gray-900">45 minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Peak Activity Hours</span>
              <span className="text-sm font-medium text-gray-900">2PM - 6PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Most Active Day</span>
              <span className="text-sm font-medium text-gray-900">Tuesday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
