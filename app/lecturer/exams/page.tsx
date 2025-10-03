"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'warning' | 'success' | 'error'; message: string } | null>(null);
  const lecturerId = user?.id || "anonymous-lecturer";
  const router = useRouter();

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
    try {
      setTogglingId(id);
      await fetch(`/api/exams/${id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !current }) });
      const res = await fetch(`/api/exams?createdBy=${encodeURIComponent(lecturerId)}`, { cache: 'no-store' });
      const data = await res.json();
      setExams(data.exams || []);
    } catch (e) {
      console.error('Toggle exam failed', e);
    } finally {
      setTogglingId(null);
    }
  };

  const deleteExam = async (id: string, title?: string) => {
    setToast({ type: 'warning', message: `Are you sure you want to delete "${title || 'this exam'}"?` });
    const confirmed = window.confirm(`This action cannot be undone. Delete "${title || 'this exam'}"?`);
    if (!confirmed) {
      setToast(null);
      return;
    }
    try {
      setDeletingId(id);
      await fetch(`/api/exams/${id}`, { method: 'DELETE' });
      const res = await fetch(`/api/exams?createdBy=${encodeURIComponent(lecturerId)}`, { cache: 'no-store' });
      const data = await res.json();
      setExams(data.exams || []);
      setToast({ type: 'success', message: 'Exam deleted successfully.' });
      setTimeout(() => setToast(null), 2000);
    } catch (e) {
      console.error('Delete exam failed', e);
      setToast({ type: 'error', message: 'Failed to delete exam.' });
      setTimeout(() => setToast(null), 2500);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    try {
      setNavigatingId(id);
      router.push(`/lecturer/exams/edit/${id}`);
    } finally {
      setTimeout(() => setNavigatingId(null), 1500);
    }
  };

  return (
    <div className="pt-20 p-4">
      {toast && (
        <div className={`mb-4 px-4 py-2 rounded ${toast.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {toast.message}
        </div>
      )}
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
                <button
                  onClick={() => handleEdit(exam.id)}
                  disabled={navigatingId === exam.id || togglingId === exam.id || deletingId === exam.id}
                  className={`px-3 py-1.5 rounded text-sm ${navigatingId === exam.id ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {navigatingId === exam.id ? 'Opening…' : 'Edit'}
                </button>
                <button
                  onClick={() => toggleActive(exam.id, exam.isActive)}
                  disabled={togglingId === exam.id || deletingId === exam.id || navigatingId === exam.id}
                  className={`px-3 py-1.5 text-white rounded text-sm ${togglingId === exam.id ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {togglingId === exam.id ? (exam.isActive ? 'Deactivating…' : 'Activating…') : (exam.isActive ? 'Deactivate' : 'Activate')}
                </button>
                <button
                  onClick={() => deleteExam(exam.id, exam.title)}
                  disabled={deletingId === exam.id || togglingId === exam.id || navigatingId === exam.id}
                  className={`px-3 py-1.5 text-white rounded text-sm ${deletingId === exam.id ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {deletingId === exam.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


