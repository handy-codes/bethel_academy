"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  TrendingUp,
  Eye,
  MessageSquare,
  Download,
  UserCheck,
  AlertCircle
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  enrollmentDate: string;
  program: string;
  level: string;
  totalExams: number;
  completedExams: number;
  averageScore: number;
  lastActivity: string;
  status: "active" | "inactive" | "suspended";
  profileImage?: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // name, performance, activity

  const programs = [
    "Computer Science", "Mathematics", "Physics", "Chemistry", 
    "Biology", "English", "Economics", "Accounting"
  ];

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setStudents([
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@student.edu",
          phone: "+234 801 234 5678",
          enrollmentDate: "2024-01-15",
          program: "Computer Science",
          level: "200 Level",
          totalExams: 8,
          completedExams: 6,
          averageScore: 84,
          lastActivity: "2024-01-20T10:30:00Z",
          status: "active",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@student.edu",
          phone: "+234 802 345 6789",
          enrollmentDate: "2024-01-10",
          program: "Mathematics",
          level: "300 Level",
          totalExams: 12,
          completedExams: 10,
          averageScore: 78,
          lastActivity: "2024-01-19T14:20:00Z",
          status: "active",
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike.johnson@student.edu",
          enrollmentDate: "2024-01-08",
          program: "Physics",
          level: "100 Level",
          totalExams: 5,
          completedExams: 3,
          averageScore: 65,
          lastActivity: "2024-01-18T09:15:00Z",
          status: "active",
        },
        {
          id: "4",
          name: "Sarah Wilson",
          email: "sarah.wilson@student.edu",
          phone: "+234 803 456 7890",
          enrollmentDate: "2023-09-01",
          program: "Chemistry",
          level: "400 Level",
          totalExams: 15,
          completedExams: 15,
          averageScore: 92,
          lastActivity: "2024-01-20T16:45:00Z",
          status: "active",
        },
        {
          id: "5",
          name: "David Brown",
          email: "david.brown@student.edu",
          enrollmentDate: "2024-01-12",
          program: "Biology",
          level: "200 Level",
          totalExams: 6,
          completedExams: 4,
          averageScore: 58,
          lastActivity: "2024-01-17T11:30:00Z",
          status: "inactive",
        },
        {
          id: "6",
          name: "Emily Davis",
          email: "emily.davis@student.edu",
          phone: "+234 804 567 8901",
          enrollmentDate: "2023-08-15",
          program: "English",
          level: "300 Level",
          totalExams: 11,
          completedExams: 9,
          averageScore: 87,
          lastActivity: "2024-01-20T08:20:00Z",
          status: "active",
        },
        {
          id: "7",
          name: "Alex Thompson",
          email: "alex.thompson@student.edu",
          enrollmentDate: "2024-01-05",
          program: "Economics",
          level: "100 Level",
          totalExams: 4,
          completedExams: 2,
          averageScore: 45,
          lastActivity: "2024-01-15T13:10:00Z",
          status: "suspended",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompletionRate = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.program.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProgram = filterProgram === "all" || student.program === filterProgram;
      const matchesStatus = filterStatus === "all" || student.status === filterStatus;
      return matchesSearch && matchesProgram && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "performance":
          return b.averageScore - a.averageScore;
        case "activity":
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const averageClassScore = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)
    : 0;
  const totalExamsCompleted = students.reduce((acc, s) => acc + s.completedExams, 0);

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
        <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-600 mt-2">Manage and track your students&apos; progress</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Class Average</p>
              <p className="text-2xl font-bold text-gray-900">{averageClassScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Exams Completed</p>
              <p className="text-2xl font-bold text-gray-900">{totalExamsCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Program Filter */}
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Programs</option>
              {programs.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="name">Sort by Name</option>
              <option value="performance">Sort by Performance</option>
              <option value="activity">Sort by Last Activity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Students ({filteredStudents.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Student Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-lg font-medium text-gray-900">{student.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{student.email}</span>
                        </div>
                        {student.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{student.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span><strong>Program:</strong> {student.program}</span>
                        <span><strong>Level:</strong> {student.level}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="flex items-center space-x-6">
                    {/* Exam Progress */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {student.completedExams}/{student.totalExams}
                      </div>
                      <div className="text-xs text-gray-500">Exams</div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full" 
                          style={{ width: `${getCompletionRate(student.completedExams, student.totalExams)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Average Score */}
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getPerformanceColor(student.averageScore)}`}>
                        {student.averageScore}%
                      </div>
                      <div className="text-xs text-gray-500">Average</div>
                    </div>

                    {/* Last Activity */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {formatLastActivity(student.lastActivity)}
                      </div>
                      <div className="text-xs text-gray-500">Last active</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>Message</span>
                      </button>

                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Performance Indicators */}
                {student.averageScore < 60 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800 font-medium">Needs Attention</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Student performance is below average. Consider providing additional support.
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


