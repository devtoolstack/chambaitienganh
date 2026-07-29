import React, { useState } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  User, 
  GraduationCap, 
  FileText, 
  ChevronRight,
  BookOpen,
  X,
  MessageSquare,
  Zap
} from 'lucide-react';
import { Submission, Assignment } from '../types';

interface SubmissionsViewProps {
  submissions: Submission[];
  assignments: Assignment[];
  selectedSubmission: Submission | null;
  setSelectedSubmission: (sub: Submission | null) => void;
  onRegradeSubmission: (id: string) => Promise<void>;
}

export const SubmissionsView: React.FC<SubmissionsViewProps> = ({
  submissions,
  assignments,
  selectedSubmission,
  setSelectedSubmission,
  onRegradeSubmission
}) => {
  const [filterAssignmentId, setFilterAssignmentId] = useState<string>('all');
  const [isRegrading, setIsRegrading] = useState(false);

  const filteredSubmissions = filterAssignmentId === 'all' 
    ? submissions 
    : submissions.filter(s => s.assignmentId === filterAssignmentId);

  const handleRegrade = async (id: string) => {
    setIsRegrading(true);
    await onRegradeSubmission(id);
    setIsRegrading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <span>Kết Quả Chấm Bài & Phân Tích AI</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem kết quả chấm chi tiết theo Rubric, phân tích lỗi ngữ pháp và từ vựng học thuật từ Gemini
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <label className="text-slate-600 font-medium">Lọc theo Bài Tập:</label>
          <select
            value={filterAssignmentId}
            onChange={(e) => setFilterAssignmentId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">Tất cả bài tập ({submissions.length})</option>
            {assignments.map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Submissions List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submissions List Column */}
        <div className={selectedSubmission ? 'lg:col-span-5' : 'lg:col-span-12'}>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200/60 font-semibold text-xs text-slate-700 flex justify-between items-center">
              <span>Danh Sách Bài Nộp ({filteredSubmissions.length})</span>
              <span className="text-[11px] text-indigo-600 font-normal">Nhấp vào bài nộp để xem chi tiết AI</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
              {filteredSubmissions.map((sub) => {
                const isSelected = selectedSubmission?.id === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sub.studentName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{sub.studentCode} • {sub.studentEmail}</div>
                      </div>

                      <div className="text-right">
                        {sub.score !== null ? (
                          <div className={`text-base font-bold ${sub.score >= 8 ? 'text-emerald-600' : sub.score >= 6.5 ? 'text-indigo-600' : 'text-amber-600'}`}>
                            {sub.score.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/10</span>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">Đang chấm...</span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 my-2 bg-slate-50 p-2 rounded-lg border border-slate-100/80">
                      "{sub.content}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{new Date(sub.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}</span>
                      <span className="text-indigo-600 font-medium flex items-center">
                        Xem chấm điểm AI <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Submission AI Detail Panel */}
        {selectedSubmission && (
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 relative">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Info */}
              <div className="mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Mã SV: {selectedSubmission.studentCode}
                  </span>
                  <span className="text-xs text-slate-500">
                    Bài tập: {selectedSubmission.assignmentTitle}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedSubmission.studentName}
                </h3>
              </div>

              {/* Overall Score Card */}
              {selectedSubmission.aiResult && (
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 mb-6 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>Tổng Điểm Đánh Giá AI</span>
                      </div>
                      <div className="text-3xl font-extrabold mt-1 text-white">
                        {selectedSubmission.aiResult.totalScore.toFixed(1)} <span className="text-lg font-normal text-indigo-200">/ 10</span>
                      </div>
                      <p className="text-xs text-indigo-100/90 mt-2 max-w-md">
                        {selectedSubmission.aiResult.scoreExplanation}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRegrade(selectedSubmission.id)}
                      disabled={isRegrading}
                      className="inline-flex items-center space-x-1.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRegrading ? 'animate-spin' : ''}`} />
                      <span>{isRegrading ? 'Đang Chấm Lại...' : 'Chấm Lại Bằng AI'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Essay Content Display */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Bài Luận Đã Nộp</span>
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-serif">
                  {selectedSubmission.content}
                </div>
              </div>

              {/* Detailed Rubric Breakdown */}
              {selectedSubmission.aiResult?.criteriaScores && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>Chi Tiết Điểm Theo Tiêu Chí (Rubric)</span>
                  </h4>

                  <div className="space-y-3">
                    {selectedSubmission.aiResult.criteriaScores.map((cs, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-xs">{cs.criterionTitle}</span>
                          <span className="font-bold text-indigo-600 text-xs">{cs.score} {cs.maxScore ? `/ ${cs.maxScore}` : 'đ'}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-normal">{cs.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar Errors Table */}
              {selectedSubmission.aiResult?.grammarErrors && selectedSubmission.aiResult.grammarErrors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-rose-700">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Phân Tích Sửa Lỗi Ngữ Pháp ({selectedSubmission.aiResult.grammarErrors.length})</span>
                  </h4>

                  <div className="space-y-3">
                    {selectedSubmission.aiResult.grammarErrors.map((err, idx) => (
                      <div key={idx} className="p-3 bg-rose-50/40 rounded-xl border border-rose-200/60 text-xs">
                        <div className="text-rose-900 line-through font-medium mb-1">❌ Ban đầu: "{err.original}"</div>
                        <div className="text-emerald-800 font-bold mb-1">✅ Đã sửa: "{err.correction}"</div>
                        <div className="text-slate-600 text-[11px] bg-white p-2 rounded-lg border border-rose-100">💡 {err.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary Upgrade Suggestions */}
              {selectedSubmission.aiResult?.vocabularyErrors && selectedSubmission.aiResult.vocabularyErrors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-amber-700">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Gợi Ý Nâng Cấp Từ Vựng Học Thuật ({selectedSubmission.aiResult.vocabularyErrors.length})</span>
                  </h4>

                  <div className="space-y-3">
                    {selectedSubmission.aiResult.vocabularyErrors.map((vocab, idx) => (
                      <div key={idx} className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/60 text-xs">
                        <div className="text-amber-900 font-medium mb-1">Từ cũ: "{vocab.original}"</div>
                        <div className="text-indigo-900 font-bold mb-1">Gợi ý Academic: "{vocab.correction}"</div>
                        <div className="text-slate-600 text-[11px] bg-white p-2 rounded-lg border border-amber-100">💡 {vocab.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Teacher Feedback */}
              {selectedSubmission.aiResult?.overallFeedbackVi && (
                <div className="bg-indigo-50/80 p-4 rounded-xl border border-indigo-200/60">
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span>Nhận Xét Tổng Quan Từ AI Teacher</span>
                  </h4>
                  <p className="text-xs text-indigo-950 leading-relaxed">
                    {selectedSubmission.aiResult.overallFeedbackVi}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
