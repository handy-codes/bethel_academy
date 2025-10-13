'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, BookOpen, Calendar } from 'lucide-react';

interface AnalyticsData {
  subjectPerformance: Record<string, {
    total: number;
    count: number;
    average: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    averageScore: number;
    examCount: number;
  }>;
  gradeDistribution: Record<string, number>;
  recentActivity: Array<{
    date: string;
    exam: string;
    score: number;
    grade: string;
  }>;
}

export default function ParentAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setData({
        subjectPerformance: {
          'MATHEMATICS': { total: 85, count: 3, average: 28.33 },
          'ENGLISH': { total: 78, count: 2, average: 39 },
          'PHYSICS': { total: 92, count: 2, average: 46 },
          'CHEMISTRY': { total: 88, count: 1, average: 88 }
        },
        monthlyTrends: [
          { month: 'Jan', averageScore: 75, examCount: 2 },
          { month: 'Feb', averageScore: 82, examCount: 3 },
          { month: 'Mar', averageScore: 88, examCount: 1 }
        ],
        gradeDistribution: {
          'A': 3,
          'B': 2,
          'C': 1,
          'D': 0,
          'F': 0
        },
        recentActivity: [
          { date: '2024-03-15', exam: 'Physics Test', score: 92, grade: 'A' },
          { date: '2024-03-10', exam: 'Mathematics Quiz', score: 88, grade: 'A' },
          { date: '2024-03-05', exam: 'English Exam', score: 78, grade: 'B' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Detailed performance insights and trends</p>
      </div>

      {/* Subject Performance Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            Subject Performance
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(data?.subjectPerformance || {}).map(([subject, performance]) => (
              <div key={subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{subject}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {performance.average.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {performance.count} exam{performance.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${performance.average}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
            Monthly Performance Trends
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.monthlyTrends.map((trend, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{trend.month}</span>
                  <span className="text-sm text-gray-600">{trend.examCount} exams</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">
                    {trend.averageScore}%
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trend.averageScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Grade Distribution</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(data?.gradeDistribution || {}).map(([grade, count]) => (
              <div key={grade} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  grade === 'A' ? 'bg-green-100 text-green-600' :
                  grade === 'B' ? 'bg-blue-100 text-blue-600' :
                  grade === 'C' ? 'bg-yellow-100 text-yellow-600' :
                  grade === 'D' ? 'bg-orange-100 text-orange-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <span className="font-bold">{grade}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">exams</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-purple-600" />
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {data?.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.exam}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{activity.score}%</p>
                  <p className={`text-sm font-medium ${
                    activity.grade === 'A' ? 'text-green-600' :
                    activity.grade === 'B' ? 'text-blue-600' :
                    activity.grade === 'C' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    Grade {activity.grade}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
