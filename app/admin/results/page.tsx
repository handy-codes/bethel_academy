"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Clock, Filter, X } from "lucide-react";

interface ExamResult {
  id: string;
  studentName: string;
  studentEmail: string;
  examTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  grade: string;
  submittedAt: string;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [selected, setSelected] = useState<ExamResult | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/results', { cache: 'no-store' });
        const data = await res.json();
        const list: any[] = Array.isArray(data.results) ? data.results : [];
        const mapped: ExamResult[] = list.map((r: any) => ({
          id: r.id,
          studentName: r.studentName || '',
          studentEmail: r.studentEmail || '',
          examTitle: r.examTitle || '',
          subject: r.subject || '',
          score: r.score,
          totalQuestions: r.totalQuestions,
          correctAnswers: r.correctAnswers,
          percentage: r.percentage,
          grade: r.grade || '',
          submittedAt: r.createdAt || new Date().toISOString(),
          isApproved: r.isApproved,
          approvedBy: r.approvedBy || undefined,
          approvedAt: r.approvedAt || undefined,
        }));
        setResults(mapped);
      } catch (e) {
        console.error('Failed to load results', e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const filteredResults = results.filter(result => {
    const matchesSearch =
      result.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.examTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "approved" && result.isApproved) ||
      (filterStatus === "pending" && !result.isApproved);

    return matchesSearch && matchesStatus;
  });

  const approveResult = async (resultId: string) => {
    try {
      await fetch(`/api/results/${resultId}`, { method: 'PATCH', body: JSON.stringify({ isApproved: true }) });
      setResults(results.map(r => r.id === resultId ? { ...r, isApproved: true, approvedAt: new Date().toISOString() } : r));
    } catch (e) {
      console.error('Approve failed', e);
    }
  };

  const deleteResult = async (resultId: string) => {
    try {
      await fetch(`/api/results/${resultId}`, { method: 'DELETE' });
      setResults(results.filter(r => r.id !== resultId));
    } catch (e) {
      console.error('Delete failed', e);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Exam Results</h1>
        <p className="text-gray-600 mt-2">Review and approve student exam results</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Results</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.filter(r => !r.isApproved).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.filter(r => r.isApproved).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Results
            </label>
            <input
              type="text"
              placeholder="Search by student name or exam title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Results</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Exam Results ({filteredResults.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {result.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.studentEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {result.examTitle}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.subject}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {result.correctAnswers}/{result.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.percentage}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.isApproved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                      }`}>
                      {result.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="View Details" onClick={() => { setSelected(result); setShowViewModal(true); }}>
                        <Eye className="h-4 w-4" />
                      </button>
                      {!result.isApproved && (
                        <>
                          <button
                            onClick={() => approveResult(result.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteResult(result.id)} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Delete">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
