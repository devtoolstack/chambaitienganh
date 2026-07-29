import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Scale,
  X
} from 'lucide-react';
import { Rubric, RubricCriterion } from '../types';

interface RubricsViewProps {
  rubrics: Rubric[];
  onCreateRubric: (rubric: Partial<Rubric>) => Promise<void>;
  onDeleteRubric: (id: string) => Promise<void>;
}

export const RubricsView: React.FC<RubricsViewProps> = ({
  rubrics,
  onCreateRubric,
  onDeleteRubric
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState<{ title: string; maxScore: number; weight: number; description: string }[]>([
    { title: 'Task Response', maxScore: 2.5, weight: 25, description: 'Trả lời đúng và đầy đủ đề bài' },
    { title: 'Coherence & Cohesion', maxScore: 2.5, weight: 25, description: 'Mạch văn logic, dùng từ nối phù hợp' },
    { title: 'Lexical Resource', maxScore: 2.5, weight: 25, description: 'Từ vựng đa dạng, collocations chuẩn' },
    { title: 'Grammar Accuracy', maxScore: 2.5, weight: 25, description: 'Kiểm soát tốt cấu trúc câu và lỗi thì' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCriterion = () => {
    setCriteria([
      ...criteria,
      { title: 'Tiêu chí mới', maxScore: 2.5, weight: 25, description: 'Mô tả yêu cầu tiêu chí' }
    ]);
  };

  const handleRemoveCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const handleCriterionChange = (index: number, field: string, value: any) => {
    const updated = [...criteria];
    (updated[index] as any)[field] = value;
    setCriteria(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    await onCreateRubric({
      title,
      description,
      criteria
    });
    setIsSubmitting(false);
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Thang Điểm & Bộ Tiêu Chí Rubric</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Thiết lập tiêu chí đánh giá trọng số để AI chấm điểm chuẩn xác theo chuẩn IELTS / CEFR / Đại Học
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Rubric Mới</span>
        </button>
      </div>

      {/* Rubrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rubrics.map((rub) => (
          <div key={rub.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900">{rub.title}</h3>
                {rub.isDefault && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Mặc định
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mb-4">{rub.description}</p>

              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Các Tiêu Chí Thành Phần ({rub.criteria.length})
                </div>
                {rub.criteria.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                      <span>{c.title}</span>
                      <span className="text-indigo-600">Tối đa: {c.maxScore}đ ({c.weight}%)</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              {!rub.isDefault && (
                <button
                  onClick={() => onDeleteRubric(rub.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-xs flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa Rubric</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl w-[95%] sm:w-[85%] md:w-[80%] max-w-5xl h-[85vh] md:h-[80vh] shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>Tạo Bộ Tiêu Chí Rubric Mới</span>
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
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 text-xs">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Tên Thang Điểm Rubric (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Thang điểm Báo cáo Tiếng Anh Thương Mại"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Mô Tả Tổng Quan</label>
                    <input
                      type="text"
                      placeholder="Mô tả phạm vi áp dụng..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center bg-slate-100/70 p-3 rounded-xl border border-slate-200/60">
                    <div>
                      <label className="font-bold text-slate-800 text-sm">Danh Sách Tiêu Chí Chấm ({criteria.length})</label>
                      <p className="text-[11px] text-slate-500">Các tiêu chí đánh giá thành phần và trọng số % tương ứng</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCriterion}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1 shadow-2xs transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm Tiêu Chí
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {criteria.map((c, index) => (
                      <div key={index} className="p-4 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-3 relative hover:border-indigo-300 transition-all">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Tên tiêu chí"
                            value={c.title}
                            onChange={(e) => handleCriterionChange(index, 'title', e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCriterion(index)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa tiêu chí"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-500 font-medium">Điểm Tối Đa</label>
                            <input
                              type="number"
                              step="0.1"
                              value={c.maxScore}
                              onChange={(e) => handleCriterionChange(index, 'maxScore', Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-medium">Trọng Số (%)</label>
                            <input
                              type="number"
                              value={c.weight}
                              onChange={(e) => handleCriterionChange(index, 'weight', Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Mô tả chi tiết yêu cầu đạt điểm..."
                          value={c.description}
                          onChange={(e) => handleCriterionChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs"
                        />
                      </div>
                    ))}
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
                  {isSubmitting ? 'Đang Tạo...' : 'Lưu Rubric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
