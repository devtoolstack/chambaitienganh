import React from 'react';
import { 
  BookOpen, 
  FileCheck2, 
  Award, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  Sparkles,
  ExternalLink,
  Search
} from 'lucide-react';
import { Assignment, Submission, PlagiarismCheckResult } from '../types';

interface DashboardViewProps {
  assignments: Assignment[];
  submissions: Submission[];
  setActiveTab: (tab: string) => void;
  openPublicPortal: () => void;
  selectSubmission: (sub: Submission) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  assignments,
  submissions,
  setActiveTab,
  openPublicPortal,
  selectSubmission
}) => {
  const gradedSubs = submissions.filter(s => s.status === 'graded');
  const avgScore = gradedSubs.length > 0 
    ? (gradedSubs.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubs.length).toFixed(1)
    : '0.0';

  const highSimCount = submissions.filter(s => (s.score && s.score < 6.5)).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-medium mb-3 backdrop-blur-xs border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI English Essay Grading System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-serif-title">
            Chào mừng Giảng viên đến với Chấm Bài AI
          </h1>
          <p className="text-sm text-indigo-100/90 leading-relaxed mb-5">
            Hệ thống hỗ trợ tự động chấm điểm bài luận Tiếng Anh theo tiêu chí Rubric chi tiết, phân tích lỗi ngữ pháp, từ vựng và phát hiện trùng lặp giữa các sinh viên.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('assignments')}
              className="inline-flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Bài Tập Mới</span>
            </button>
            <button
              onClick={openPublicPortal}
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all border border-white/20 backdrop-blur-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Link Cổng Nộp Bài Sinh Viên</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Bài Tập</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{assignments.length}</div>
          <p className="text-xs text-slate-500 mt-1">
            {assignments.filter(a => a.status === 'active').length} bài đang mở nộp
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bài Đã Nộp</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{submissions.length}</div>
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            100% đã được chấm điểm AI
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm Trung Bình</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgScore} <span className="text-sm font-normal text-slate-500">/ 10</span></div>
          <p className="text-xs text-slate-500 mt-1">
            Tính trên {gradedSubs.length} bài đã chấm
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cảnh Báo Đạo Văn</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">1 <span className="text-sm font-normal text-slate-500">cặp trùng</span></div>
          <p className="text-xs text-rose-600 mt-1 font-medium">
            Phát hiện 1 cặp bài trùng &gt;25%
          </p>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bài Nộp Mới Nhất</h3>
            <p className="text-xs text-slate-500">Danh sách sinh viên vừa nộp bài luận và kết quả chấm AI</p>
          </div>
          <button
            onClick={() => setActiveTab('submissions')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Sinh Viên</th>
                <th className="py-3 px-4">Bài Tập</th>
                <th className="py-3 px-4">Thời Gian Nộp</th>
                <th className="py-3 px-4">Trạng Thái AI</th>
                <th className="py-3 px-4 text-right">Điểm Số</th>
                <th className="py-3 px-4 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{sub.studentName}</div>
                    <div className="text-[11px] text-slate-500">{sub.studentCode} • {sub.studentEmail}</div>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">
                    <span className="font-medium text-slate-800">{sub.assignmentTitle || 'IELTS Essay'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(sub.submittedAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-3 px-4">
                    {sub.status === 'graded' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <Sparkles className="w-3 h-3 mr-1 text-emerald-500" />
                        Đã chấm AI
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                        Đang xử lý...
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-sm">
                    {sub.score !== null ? (
                      <span className={sub.score >= 8 ? 'text-emerald-600' : sub.score >= 6.5 ? 'text-indigo-600' : 'text-amber-600'}>
                        {sub.score.toFixed(1)} / 10
                      </span>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        selectSubmission(sub);
                        setActiveTab('submissions');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      Chi Tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
