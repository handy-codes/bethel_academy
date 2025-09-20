"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  FileText, 
  Calendar,
  Filter,
  Eye,
  BarChart3,
  Users,
  BookOpen
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: "student_performance" | "exam_summary" | "attendance" | "custom";
  description: string;
  generatedDate: string;
  generatedBy: string;
  fileSize: string;
  downloadCount: number;
  status: "ready" | "generating" | "failed";
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("30");
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setReports([
        {
          id: "1",
          title: "Student Performance Report - January 2024",
          type: "student_performance",
          description: "Comprehensive analysis of student performance across all subjects",
          generatedDate: "2024-01-31T10:30:00Z",
          generatedBy: "Admin User",
          fileSize: "2.3 MB",
          downloadCount: 15,
          status: "ready",
        },
        {
          id: "2",
          title: "Mathematics Exam Summary",
          type: "exam_summary",
          description: "Detailed breakdown of mathematics exam results and statistics",
          generatedDate: "2024-01-25T14:20:00Z",
          generatedBy: "Admin User",
          fileSize: "1.8 MB",
          downloadCount: 8,
          status: "ready",
        },
        {
          id: "3",
          title: "Weekly Attendance Report",
          type: "attendance",
          description: "Student attendance tracking and participation rates",
          generatedDate: "2024-01-20T09:15:00Z",
          generatedBy: "System",
          fileSize: "0.9 MB",
          downloadCount: 12,
          status: "ready",
        },
        {
          id: "4",
          title: "Custom Analytics Report",
          type: "custom",
          description: "Custom report with specific metrics and filters",
          generatedDate: "2024-01-18T16:45:00Z",
          generatedBy: "Admin User",
          fileSize: "3.1 MB",
          downloadCount: 5,
          status: "ready",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const reportTypes = [
    { value: "all", label: "All Reports" },
    { value: "student_performance", label: "Student Performance" },
    { value: "exam_summary", label: "Exam Summary" },
    { value: "attendance", label: "Attendance" },
    { value: "custom", label: "Custom Reports" },
  ];

  const filteredReports = reports.filter(report => 
    filterType === "all" || report.type === filterType
  );

  const generateReport = async (type: string) => {
    setGenerating(type);
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        title: `New ${type.replace('_', ' ')} Report - ${new Date().toLocaleDateString()}`,
        type: type as any,
        description: `Generated ${type.replace('_', ' ')} report`,
        generatedDate: new Date().toISOString(),
        generatedBy: "Current Admin",
        fileSize: "1.5 MB",
        downloadCount: 0,
        status: "ready",
      };
      
      setReports([newReport, ...reports]);
      setGenerating(null);
    }, 3000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "student_performance": return <Users className="h-5 w-5" />;
      case "exam_summary": return <BookOpen className="h-5 w-5" />;
      case "attendance": return <Calendar className="h-5 w-5" />;
      case "custom": return <BarChart3 className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "student_performance": return "bg-blue-100 text-blue-800";
      case "exam_summary": return "bg-green-100 text-green-800";
      case "attendance": return "bg-purple-100 text-purple-800";
      case "custom": return "bg-orange-100 text-orange-800";
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
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Generate and download comprehensive reports</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => generateReport("student_performance")}
            disabled={generating === "student_performance"}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center disabled:opacity-50"
          >
            {generating === "student_performance" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            ) : (
              <Users className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-gray-900">Student Performance</p>
            <p className="text-xs text-gray-500">Detailed student analytics</p>
          </button>

          <button
            onClick={() => generateReport("exam_summary")}
            disabled={generating === "exam_summary"}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center disabled:opacity-50"
          >
            {generating === "exam_summary" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
            ) : (
              <BookOpen className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-gray-900">Exam Summary</p>
            <p className="text-xs text-gray-500">Exam results breakdown</p>
          </button>

          <button
            onClick={() => generateReport("attendance")}
            disabled={generating === "attendance"}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center disabled:opacity-50"
          >
            {generating === "attendance" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
            ) : (
              <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-gray-900">Attendance Report</p>
            <p className="text-xs text-gray-500">Participation tracking</p>
          </button>

          <button
            onClick={() => generateReport("custom")}
            disabled={generating === "custom"}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center disabled:opacity-50"
          >
            {generating === "custom" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto mb-2"></div>
            ) : (
              <BarChart3 className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-gray-900">Custom Report</p>
            <p className="text-xs text-gray-500">Build custom analytics</p>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Reports ({filteredReports.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(report.type)}`}>
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {report.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {report.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                      <span>By: {report.generatedBy}</span>
                      <span>Size: {report.fileSize}</span>
                      <span>Downloads: {report.downloadCount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    title="Preview Report"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg"
                    title="Download Report"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or generate a new report.
          </p>
        </div>
      )}
    </div>
  );
}
