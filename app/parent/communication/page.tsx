'use client';

import { useState } from 'react';
import { MessageCircle, Send, Clock, User } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function ParentCommunication() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    message: ''
  });

  // Mock messages
  const messages: Message[] = [
    {
      id: '1',
      from: 'Dr. Sarah Johnson',
      to: 'Parent',
      subject: 'Mathematics Performance Update',
      message: 'I wanted to update you on your child\'s progress in Mathematics. They have shown significant improvement in the recent quizzes.',
      timestamp: '2024-03-15T10:30:00Z',
      isRead: false
    },
    {
      id: '2',
      from: 'Prof. Michael Brown',
      to: 'Parent',
      subject: 'Physics Lab Assignment',
      message: 'Please ensure your child completes the physics lab assignment by Friday. The assignment details are available in the student portal.',
      timestamp: '2024-03-14T14:20:00Z',
      isRead: true
    },
    {
      id: '3',
      from: 'Ms. Emily Davis',
      to: 'Parent',
      subject: 'Parent-Teacher Conference',
      message: 'We have scheduled a parent-teacher conference for next week. Please confirm your availability.',
      timestamp: '2024-03-13T09:15:00Z',
      isRead: true
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message sending logic here
    console.log('Sending message:', newMessage);
    setNewMessage({ to: '', subject: '', message: '' });
    setActiveTab('inbox');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Communication Hub</h1>
        <p className="text-gray-600">Stay connected with teachers and administrators</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inbox'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Inbox ({messages.filter(m => !m.isRead).length})
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'compose'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Compose Message
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'inbox' ? (
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                      !message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{message.from}</span>
                          {!message.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{message.subject}</h3>
                        <p className="text-gray-600 text-sm mb-2">{message.message}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(message.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages</h3>
                  <p className="text-gray-600">You don't have any messages yet.</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To (Teacher Email)
                </label>
                <input
                  type="email"
                  value={newMessage.to}
                  onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="teacher@school.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Message subject"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your message here..."
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-medium text-gray-900">Dr. Sarah Johnson</div>
              <div className="text-sm text-gray-600">Mathematics Teacher</div>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-medium text-gray-900">Prof. Michael Brown</div>
              <div className="text-sm text-gray-600">Physics Teacher</div>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-medium text-gray-900">Ms. Emily Davis</div>
              <div className="text-sm text-gray-600">Class Teacher</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-medium text-blue-900">Parent-Teacher Conference</div>
              <div className="text-sm text-blue-800">Scheduled for March 25th at 4:00 PM</div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="font-medium text-green-900">Exam Schedule Update</div>
              <div className="text-sm text-green-800">Mathematics exam moved to March 20th</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
