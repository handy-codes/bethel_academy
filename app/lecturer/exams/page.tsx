"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Exam {
  id: string;
  title: string;
  subject: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  isActive: boolean;
  duration: number;
  createdBy?: string;
  questions?: any[];
  createdAt?: string;
}

export default function LecturerExamsPage() {
  const { user, isLoaded } = useUser();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const lecturerId = user?.id || "anonymous-lecturer";

  useEffect(() => {
    const load = async () => {
      try {
        if (!isLoaded) return;
        const res = await fetch(`/api/exams?createdBy=${encodeURIComponent(lecturerId)}`, { cache: 'no-store' });
        const data = await res.json();
        setExams(data.exams || []);
      } catch (e) {
        console.error('Load exams failed', e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [isLoaded, lecturerId]);

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/exams/${id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !current }) });
    const res = await fetch(`/api/exams?createdBy=${encodeURIComponent(lecturerId)}`, { cache: 'no-store' });
    const data = await res.json();
    setExams(data.exams || []);
  };

  const deleteExam = async (id: string) => {
    await fetch(`/api/exams/${id}`, { method: 'DELETE' });
    const res = await fetch(`/api/exams?createdBy=${encodeURIComponent(lecturerId)}`, { cache: 'no-store' });
    const data = await res.json();
    setExams(data.exams || []);
  };

  return (
    <div className="pt-20 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Exams</h1>
        <Link href="/lecturer/create-exam" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Exam</Link>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : exams.length === 0 ? (
        <div className="text-gray-600">No exams yet. Click Create Exam to add one.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map(exam => (
            <div key={exam.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                  <p className="text-sm text-gray-600">Subject: {exam.subject}</p>
                  <p className="text-sm text-gray-600">Questions: {(exam.questions || []).length}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${exam.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{exam.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Link href={`/admin/exams/edit/${exam.id}`} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm">Edit</Link>
                <button onClick={() => toggleActive(exam.id, exam.isActive)} className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">{exam.isActive ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => deleteExam(exam.id)} className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


