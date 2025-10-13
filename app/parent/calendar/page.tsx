'use client';

import { useState } from 'react';
import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';

export default function ParentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Mathematics Exam',
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'exam',
      subject: 'MATHEMATICS'
    },
    {
      id: 2,
      title: 'Physics Quiz',
      date: '2024-03-22',
      time: '2:00 PM',
      type: 'quiz',
      subject: 'PHYSICS'
    },
    {
      id: 3,
      title: 'Parent-Teacher Conference',
      date: '2024-03-25',
      time: '4:00 PM',
      type: 'meeting',
      subject: 'GENERAL'
    },
    {
      id: 4,
      title: 'English Literature Test',
      date: '2024-03-28',
      time: '11:00 AM',
      type: 'exam',
      subject: 'LITERATURE'
    }
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'quiz': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam': return BookOpen;
      case 'quiz': return BookOpen;
      case 'meeting': return AlertCircle;
      default: return Calendar;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Calendar</h1>
        <p className="text-gray-600">Upcoming exams, quizzes, and important dates</p>
      </div>

      {/* Calendar Widget */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-blue-600" />
            March 2024
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {/* Calendar days would go here - simplified for demo */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <div 
                key={day} 
                className={`text-center py-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  day === selectedDate.getDate() ? 'bg-blue-600 text-white' : 'text-gray-700'
                }`}
                onClick={() => setSelectedDate(new Date(2024, 2, day))}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingEvents.map((event) => {
              const Icon = getEventIcon(event.type);
              return (
                <div key={event.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.time}
                      </div>
                      <span className="capitalize">{event.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.type)}`}>
                      {event.subject}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingEvents.filter(e => e.type === 'exam').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingEvents.filter(e => e.type === 'quiz').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Meetings</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingEvents.filter(e => e.type === 'meeting').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
