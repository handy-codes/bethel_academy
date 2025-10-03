"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface ExamResult { examId: string; examTitle: string; subject: string; percentage: number; isApproved?: boolean; submittedAt?: string; }
interface Exam { id: string; createdBy?: string; subject: string; title: string; }

export default function LecturerAnalyticsPage() {
  const { user, isLoaded } = useUser();
  const lecturerId = user?.id || "anonymous-lecturer";
  const [results, setResults] = useState<ExamResult[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!isLoaded) return;
      const res = await fetch(`/api/exams?createdBy=${encodeURIComponent(lecturerId)}`, { cache: 'no-store' });
      const data = await res.json();
      const mine: Exam[] = data.exams || [];
      setExams(mine);

      const rres = await fetch(`/api/results?lecturerId=${encodeURIComponent(lecturerId)}`, { cache: 'no-store' });
      const rdata = await rres.json();
      setResults(rdata.results || []);
    };
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, [isLoaded, lecturerId]);

  const stats = useMemo(() => {
    const totalExams = exams.length;
    const attempts = results.length;
    const avg = attempts ? Math.round(results.reduce((s, r) => s + (r.percentage || 0), 0) / attempts) : 0;
    const approved = results.filter(r => r.isApproved).length;
    return { totalExams, attempts, avg, approved };
  }, [exams, results]);

  return (
    <div className="pt-20 p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4"><div className="text-sm text-gray-600">My Exams</div><div className="text-2xl font-bold">{stats.totalExams}</div></div>
        <div className="bg-white border border-gray-200 rounded-lg p-4"><div className="text-sm text-gray-600">Attempts</div><div className="text-2xl font-bold">{stats.attempts}</div></div>
        <div className="bg-white border border-gray-200 rounded-lg p-4"><div className="text-sm text-gray-600">Average Score</div><div className="text-2xl font-bold">{stats.avg}%</div></div>
        <div className="bg-white border border-gray-200 rounded-lg p-4"><div className="text-sm text-gray-600">Approved</div><div className="text-2xl font-bold">{stats.approved}</div></div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Submissions</h2>
        {results.slice(0, 10).map((r, i) => (
          <div key={i} className="flex justify-between py-2 border-b last:border-b-0">
            <div className="text-sm text-gray-800">{r.examTitle} • {r.subject}</div>
            <div className="text-sm font-medium">{r.percentage}%</div>
          </div>
        ))}
        {results.length === 0 && <div className="text-sm text-gray-600">No submissions yet.</div>}
      </div>
    </div>
  );
}


