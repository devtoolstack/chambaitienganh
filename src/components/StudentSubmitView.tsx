import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  BookOpen, 
  User, 
  Mail, 
  KeyRound,
  ArrowLeft,
  Zap,
  MessageSquare
} from 'lucide-react';
import { Submission } from '../types';

interface StudentSubmitViewProps {
  initialToken?: string;
  onReturnToDashboard: () => void;
}

export const StudentSubmitView: React.FC<StudentSubmitViewProps> = ({
  initialToken = 'AI-ESSAY-2026',
  onReturnToDashboard
}) => {
  const [token, setToken] = useState(initialToken);
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student Form
  const [studentName, setStudentName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<Submission | null>(null);

  const fetchAssignment = async (tokenToFetch: string) => {
    if (!tokenToFetch) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/assignment/${tokenToFetch}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Mã bài tập không hợp lệ.');
      }
      const data = await res.json();
      setAssignment(data);
    } catch (err: any) {
      setError(err.message);
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialToken) {
      fetchAssignment(initialToken);
    }
  }, [initialToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/public/submit/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          studentCode,
          studentEmail,
          content
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Lỗi nộp bài.');
      }

      const data = await res.json();
      setSubmittedResult(data.submission);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900">Cổng Nộp Bài Sinh Viên (Student Portal)</h1>
              <p className="text-xs text-slate-500">Chấm bài luận tự động & Phân tích từ vựng Gemini AI</p>
            </div>
          </div>

          <button
            onClick={onReturnToDashboard}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay Lại Giảng Viên</span>
          </button>
        </div>

        {/* Token Search Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Nhập Mã Nộp Bài (Assignment Token)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                placeholder="Ví dụ: AI-ESSAY-2026"
                className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => fetchAssignment(token)}
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
            >
              {loading ? 'Đang Tải...' : 'Tìm Đề Bài'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Submitted Result Overview */}
        {submittedResult ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-md">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 text-base">Nộp Bài & Chấm Điểm AI Thành Công!</h3>
                  <p className="text-xs text-emerald-800">Cảm ơn {submittedResult.studentName}. Dưới đây là báo cáo đánh giá chi tiết.</p>
                </div>
              </div>

              {submittedResult.score !== null && (
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-emerald-700">
                    {submittedResult.score.toFixed(1)} / 10
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Điểm Tổng Thể</span>
                </div>
              )}
            </div>

            {/* AI Breakdown */}
            {submittedResult.aiResult && (
              <div className="space-y-5">
                {/* Score Explanation */}
                <div className="bg-indigo-900 text-white p-5 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Đánh Giá Chi Tiết Bằng Tiếng Việt</span>
                  </h4>
                  <p className="text-xs text-indigo-100 leading-relaxed mt-2">
                    {submittedResult.aiResult.scoreExplanation}
                  </p>
                </div>

                {/* Criteria Breakdown */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Chi Tiết Tiêu Chí Rubric
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {submittedResult.aiResult.criteriaScores.map((cs, i) => (
                      <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex justify-between font-bold text-slate-900 mb-1">
                          <span>{cs.criterionTitle}</span>
                          <span className="text-indigo-600">{cs.score}đ</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{cs.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grammar Errors */}
                {submittedResult.aiResult.grammarErrors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
                      Sửa Lỗi Ngữ Pháp
                    </h4>
                    <div className="space-y-2">
                      {submittedResult.aiResult.grammarErrors.map((err, i) => (
                        <div key={i} className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/60 text-xs">
                          <div className="text-rose-900 line-through">❌ "{err.original}"</div>
                          <div className="text-emerald-800 font-bold">✅ "{err.correction}"</div>
                          <div className="text-slate-600 text-[11px] mt-1">💡 {err.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vocabulary Upgrade */}
                {submittedResult.aiResult.vocabularyErrors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                      Gợi Ý Nâng Cấp Từ Vựng Academic
                    </h4>
                    <div className="space-y-2">
                      {submittedResult.aiResult.vocabularyErrors.map((v, i) => (
                        <div key={i} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs">
                          <div className="text-amber-900 font-medium">Gốc: "{v.original}"</div>
                          <div className="text-indigo-900 font-bold">Academic: "{v.correction}"</div>
                          <div className="text-slate-600 text-[11px] mt-1">💡 {v.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setSubmittedResult(null);
                setContent('');
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Nộp Bài Tải Lên Mới
            </button>
          </div>
        ) : (
          assignment && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Assignment Prompt Details */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {assignment.className || 'Lớp Học'}
                </span>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {assignment.title}
                </h2>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {assignment.instructions}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Tiêu Chí Đánh Giá (Rubric)
                  </h4>
                  <div className="space-y-2">
                    {assignment.criteria?.map((c: any) => (
                      <div key={c.id} className="p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100">
                        <div className="font-bold text-slate-900 flex justify-between">
                          <span>{c.title}</span>
                          <span className="text-indigo-600">{c.maxScore}đ</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Student Submission Form */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Điền Thông Tin & Bài Luận</span>
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Họ và Tên Sinh Viên (*)</label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn An"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mã Số Sinh Viên (MSSV) (*)</label>
                      <input
                        type="text"
                        required
                        placeholder="SV202401"
                        value={studentCode}
                        onChange={(e) => setStudentCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Sinh Viên</label>
                    <input
                      type="email"
                      placeholder="an.nv@st.edu.vn"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-700 font-semibold">Nội Dung Bài Luận Tiếng Anh (*)</label>
                      <span className={`text-[11px] font-bold ${wordCount >= 250 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        Độ dài: {wordCount} từ (Khuyên dùng: &ge;250 từ)
                      </span>
                    </div>

                    <textarea
                      rows={10}
                      required
                      placeholder="In recent years, artificial intelligence has made remarkable progress..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 font-serif leading-relaxed text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className={`w-4 h-4 ${isSubmitting ? 'animate-bounce' : ''}`} />
                    <span>{isSubmitting ? 'AI Đang Chấm Bài & Phân Tích...' : 'Nộp Bài & Chấm Điểm Ngay'}</span>
                  </button>
                </form>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
