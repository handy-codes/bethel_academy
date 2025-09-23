"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Trophy,
  Edit3,
  Save,
  X,
  Camera,
  MapPin,
  GraduationCap
} from "lucide-react";

interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  studentId: string;
  enrollmentDate: string;
  program: string;
  level: string;
  gpa?: number;
  totalExamsTaken: number;
  averageScore: number;
  bestSubject?: string;
  achievements: string[];
}

export default function ProfilePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<StudentProfile>>({});

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setProfile({
        id: user?.id || "student-1",
        fullName: user?.fullName || "John Doe",
        email: user?.emailAddresses[0]?.emailAddress || "john.doe@example.com",
        phone: "+234 801 234 5678",
        dateOfBirth: "1995-03-15",
        address: "123 University Road, Lagos, Nigeria",
        studentId: "BA2024001",
        enrollmentDate: "2024-01-01",
        program: "Computer Science",
        level: "200 Level",
        gpa: 3.75,
        totalExamsTaken: 15,
        averageScore: 78.5,
        bestSubject: "MATHEMATICS",
        achievements: [
          "Dean's List - Fall 2023",
          "Best Student in Mathematics",
          "Perfect Attendance Award",
          "Academic Excellence Award"
        ]
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleEdit = () => {
    setEditForm({
      fullName: profile?.fullName,
      phone: profile?.phone,
      dateOfBirth: profile?.dateOfBirth,
      address: profile?.address,
      program: profile?.program,
      level: profile?.level
    });
    setEditing(true);
  };

  const handleSave = () => {
    if (profile) {
      setProfile({
        ...profile,
        ...editForm
      });
    }
    setEditing(false);
    // Here you would make an API call to update the profile
    console.log("Updating profile:", editForm);
  };

  const handleCancel = () => {
    setEditForm({});
    setEditing(false);
  };

  const handleInputChange = (field: keyof StudentProfile, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
        <p className="text-gray-500">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and academic details</p>
        </div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{profile.fullName}</h3>
              <p className="text-gray-600 mb-2">Student ID: {profile.studentId}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {profile.program} - {profile.level}
              </div>
            </div>
          </div>

          {/* Academic Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Academic Summary</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Exams Taken</span>
                </div>
                <span className="font-semibold text-gray-900">{profile.totalExamsTaken}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm text-gray-600">Average Score</span>
                </div>
                <span className="font-semibold text-gray-900">{profile.averageScore}%</span>
              </div>
              {profile.gpa && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">GPA</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profile.gpa.toFixed(2)}</span>
                </div>
              )}
              {profile.bestSubject && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Best Subject</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profile.bestSubject}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{profile.fullName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {editing ? (
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{profile.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                {editing ? (
                  <input
                    type="date"
                    value={editForm.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {editing ? (
                  <textarea
                    value={editForm.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-900">{profile.address || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                {editing ? (
                  <select
                    value={editForm.program || ''}
                    onChange={(e) => handleInputChange('program', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Program</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Economics">Economics</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{profile.program}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                {editing ? (
                  <select
                    value={editForm.level || ''}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Level</option>
                    <option value="100 Level">100 Level</option>
                    <option value="200 Level">200 Level</option>
                    <option value="300 Level">300 Level</option>
                    <option value="400 Level">400 Level</option>
                    <option value="500 Level">500 Level</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{profile.level}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Date</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">
                    {new Date(profile.enrollmentDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profile.studentId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Achievements & Awards</h4>
            {profile.achievements.length > 0 ? (
              <div className="space-y-3">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <span className="text-gray-900">{achievement}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No achievements yet. Keep studying to earn awards!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}






