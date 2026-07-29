import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink, 
  Trash2, 
  Sparkles,
  Clock,
  Calendar,
  Layers,
  GraduationCap,
  X
} from 'lucide-react';
import { Assignment, ClassRoom, Rubric } from '../types';

interface AssignmentsViewProps {
  assignments: Assignment[];
  classes: ClassRoom[];
  rubrics: Rubric[];
  onCreateAssignment: (data: Partial<Assignment>) => Promise<void>;
  onDeleteAssignment: (id: string) => Promise<void>;
  openPublicSubmissionPage: (token: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  classes,
  rubrics,
  onCreateAssignment,
  onDeleteAssignment,
  openPublicSubmissionPage
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [classRoomId, setClassRoomId] = useState(classes[0]?.id || '');
  const [rubricId, setRubricId] = useState(rubrics[0]?.id || '');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [maxScore, setMaxScore] = useState(10);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    await onCreateAssignment({
      classRoomId: classRoomId || classes[0]?.id,
      rubricId: rubricId || rubrics[0]?.id,
      title,
      instructions,
      maxScore,
      deadline: new Date(deadline).toISOString()
    });
    setIsSubmitting(false);
    setShowModal(false);
    setTitle('');
    setInstructions('');
  };

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/submit/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Quản Lý Bài Tập Tiếng Anh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tạo đề bài luận, gắn thang điểm Rubric và phát hành mã nộp bài công khai cho sinh viên
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Bài Tập Mới</span>
        </button>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map((asg) => (
          <div key={asg.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between hover:shadow-xs transition-all">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Layers className="w-3 h-3 mr-1" />
                  {asg.className || 'Lớp ENG201'}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Hạn: {new Date(asg.deadline).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {asg.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {asg.instructions}
              </p>

              <div className="flex items-center space-x-3 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>Rubric: <strong className="text-slate-800">{asg.rubricTitle || 'Tiêu chí chuẩn'}</strong></span>
                </div>
                <div>•</div>
                <div>Thang điểm: <strong className="text-slate-800">{asg.maxScore}</strong></div>
              </div>
            </div>

            {/* Public Link Box */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Link nộp bài sinh viên:</span>
                <span className="font-mono text-indigo-600 font-semibold bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-200/50">
                  {asg.publicToken}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyShareLink(asg.publicToken)}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                >
                  {copiedToken === asg.publicToken ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã Sao Chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao Chép Link Nộp Bài</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => openPublicSubmissionPage(asg.publicToken)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-indigo-200/60"
                  title="Mở cổng nộp bài mẫu"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteAssignment(asg.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="Xóa bài tập"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl w-[95%] sm:w-[85%] md:w-[80%] max-w-4xl h-[85vh] md:h-[80vh] shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Tạo Bài Tập Luận Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="flex flex-col flex-1 min-h-0 text-xs">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tên Đề Bài Luận (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: IELTS Essay: Impact of Online Education"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Chọn Lớp Học</label>
                    <select
                      value={classRoomId}
                      onChange={(e) => setClassRoomId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs bg-white"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Chọn Rubric Chấm</label>
                    <select
                      value={rubricId}
                      onChange={(e) => setRubricId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs bg-white"
                    >
                      {rubrics.map(r => (
                        <option key={r.id} value={r.id}>{r.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hướng Dẫn / Đề Bài Chi Tiết (*)</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Nhập yêu cầu đề bài, số từ tối thiểu (ví dụ: 250 words)..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Thang Điểm</label>
                    <input
                      type="number"
                      value={maxScore}
                      onChange={(e) => setMaxScore(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Hạn Nộp Bài</label>
                    <input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-200/80 bg-slate-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-200/60 font-semibold rounded-xl text-xs transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all"
                >
                  {isSubmitting ? 'Đang Tạo...' : 'Tạo Bài Tập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
