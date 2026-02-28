'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Award,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import DashboardGreeting from '@/app/components/DashboardGreeting';

interface DashboardStats {
  totalExams: number;
  averageScore: number;
  recentResults: Array<{
    id: string;
    examTitle: string;
    subject: string;
    percentage: number;
    grade: string;
    createdAt: string;
  }>;
  subjectPerformance: Record<string, {
    total: number;
    count: number;
    average: number;
  }>;
}

interface ParentData {
  parent: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
  };
  stats: DashboardStats;
}

export default function ParentDashboard() {
  const { user } = useUser();
  const [data, setData] = useState<ParentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/parent/dashboard');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Please contact the administrator to set up your parent account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <DashboardGreeting fallbackName="Parent" />
        <p className="text-gray-600 mt-2">
          Monitoring academic progress for <span className="font-semibold">{data.student.name}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-bold text-gray-900">{data.stats.totalExams}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className={`text-2xl font-bold ${getPerformanceColor(data.stats.averageScore)}`}>
                {data.stats.averageScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Latest Grade</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.stats.recentResults[0]?.grade || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Exam Results</h2>
        </div>
        <div className="p-6">
          {data.stats.recentResults.length > 0 ? (
            <div className="space-y-4">
              {data.stats.recentResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getGradeColor(result.grade)}`}>
                        <span className="font-bold">{result.grade}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{result.examTitle}</h3>
                      <p className="text-sm text-gray-600">{result.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getPerformanceColor(result.percentage)}`}>
                      {result.percentage.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No exam results available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Subject Performance */}
      {Object.keys(data.stats.subjectPerformance).length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Subject Performance</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.stats.subjectPerformance).map(([subject, performance]) => (
                <div key={subject} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{subject}</h3>
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold ${getPerformanceColor(performance.average)}`}>
                      {performance.average.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-600">
                      {performance.count} exam{performance.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


