'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react';

interface ExamResult {
  id: string;
  examTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  grade: string;
  isApproved: boolean;
  feedback?: string;
  examDate: string;
  resultDate: string;
  approvedAt?: string;
}

interface ResultsData {
  results: ExamResult[];
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ParentResults() {
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/parent/results');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to load results');
        }
      } catch (err) {
        setError('Failed to load results');
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
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

  const filteredResults = data?.results.filter(result => {
    if (filter === 'approved') return result.isApproved;
    if (filter === 'pending') return !result.isApproved;
    return true;
  }) || [];

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Results</h2>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Results</h1>
        <p className="text-gray-600">
          Complete exam history for <span className="font-semibold">{data?.student.name}</span>
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Results', count: data?.results.length || 0 },
              { key: 'approved', label: 'Approved', count: data?.results.filter(r => r.isApproved).length || 0 },
              { key: 'pending', label: 'Pending', count: data?.results.filter(r => !r.isApproved).length || 0 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {filteredResults.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getGradeColor(result.grade)}`}>
                        <span className="text-xl font-bold">{result.grade}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{result.examTitle}</h3>
                        <p className="text-gray-600">{result.subject}</p>
                        <p className="text-sm text-gray-500">
                          Exam Date: {new Date(result.examDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        {result.isApproved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          result.isApproved ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {result.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                      </div>
                      <p className={`text-2xl font-bold ${getPerformanceColor(result.percentage)}`}>
                        {result.percentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {result.correctAnswers}/{result.totalQuestions} correct
                      </p>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-600">Score</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{result.score}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-gray-600">Grade</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{result.grade}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-600">Result Date</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(result.resultDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Feedback */}
                  {result.feedback && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Lecturer Feedback</h4>
                      <p className="text-blue-800">{result.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No exam results available yet.'
                  : `No ${filter} results found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


