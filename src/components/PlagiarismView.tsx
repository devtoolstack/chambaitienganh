import React, { useState } from 'react';
import { 
  FileSearch, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Users, 
  Copy, 
  Eye,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Assignment, PlagiarismCheckResult, SimilarityPair } from '../types';

interface PlagiarismViewProps {
  assignments: Assignment[];
  onCheckPlagiarism: (assignmentId: string) => Promise<PlagiarismCheckResult | null>;
}

export const PlagiarismView: React.FC<PlagiarismViewProps> = ({
  assignments,
  onCheckPlagiarism
}) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignments[0]?.id || '');
  const [result, setResult] = useState<PlagiarismCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [activePair, setActivePair] = useState<SimilarityPair | null>(null);

  const handleRunCheck = async () => {
    if (!selectedAssignmentId) return;
    setIsChecking(true);
    const res = await onCheckPlagiarism(selectedAssignmentId);
    setResult(res);
    setIsChecking(false);
    if (res && res.pairs.length > 0) {
      setActivePair(res.pairs[0]);
    } else {
      setActivePair(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-indigo-600" />
            <span>Kiểm Tra Đạo Văn & Trùng Lặp Cặp Bài</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            So sánh trùng lặp ngữ liệu (N-gram Jaccard) giữa toàn bộ bài nộp của sinh viên trong lớp
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs w-full sm:w-auto">
          <select
            value={selectedAssignmentId}
            onChange={(e) => {
              setSelectedAssignmentId(e.target.value);
              setResult(null);
              setActivePair(null);
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-1 sm:flex-initial"
          >
            {assignments.map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>

          <button
            onClick={handleRunCheck}
            disabled={isChecking || !selectedAssignmentId}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-xs whitespace-nowrap"
          >
            <Search className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Đang So Sánh...' : 'Quét Trùng Lặp'}</span>
          </button>
        </div>
      </div>

      {/* Results View */}
      {result ? (
        <div className="space-y-6">
          {/* Overview Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Tổng Số Bài</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{result.totalSubmissions} bài nộp</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Số Cặp Đã So Sánh</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{result.checkedPairsCount} cặp bài</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Cảnh Báo Trùng Cao</span>
              <div className={`text-xl font-bold mt-1 ${result.flaggedPairsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {result.flaggedPairsCount} cặp bài (&gt;25%)
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Tỷ Lệ Trùng TB</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{result.averageSimilarity}%</div>
            </div>
          </div>

          {/* Pairwise Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pairs Ranking */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200/60 font-semibold text-xs text-slate-700">
                Xếp Hạng Tỷ Lệ Trùng Lặp Cặp Bài
              </div>

              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {result.pairs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Chưa phát hiện cặp bài trùng lặp đáng chú ý.
                  </div>
                ) : (
                  result.pairs.map((pair) => {
                    const isSelected = activePair?.id === pair.id;
                    const isHigh = pair.similarityPercentage >= 25;
                    return (
                      <div
                        key={pair.id}
                        onClick={() => setActivePair(pair)}
                        className={`p-4 cursor-pointer transition-all ${
                          isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            isHigh ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            Trùng lặp: {pair.similarityPercentage}%
                          </span>

                          <span className="text-[11px] text-slate-400">
                            {pair.matchingExcerpts.length} đoạn khớp
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span>{pair.submission1.studentName} ({pair.submission1.studentCode})</span>
                          </div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>{pair.submission2.studentName} ({pair.submission2.studentCode})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Comparison Excerpts View */}
            <div className="lg:col-span-7">
              {activePair ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-5">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        So Sánh Đối Chiếu Văn Bản Trùng Lặp
                      </h3>
                      <p className="text-xs text-slate-500">
                        {activePair.submission1.studentName} vs {activePair.submission2.studentName}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                      Tương đồng: {activePair.similarityPercentage}%
                    </span>
                  </div>

                  {/* Excerpts List */}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {activePair.matchingExcerpts.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                        Không tìm thấy đoạn văn trùng lặp nguyên văn. Sự tương đồng là do từ vựng chung.
                      </div>
                    ) : (
                      activePair.matchingExcerpts.map((ex, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-3">
                          <div className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
                            Đoạn trùng lặp #{idx + 1}
                          </div>

                          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-indigo-950 font-serif">
                            <span className="font-sans font-bold text-[11px] text-indigo-700 block mb-1">
                              Bài của {activePair.submission1.studentName}:
                            </span>
                            "{ex.text1}"
                          </div>

                          <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-100 text-rose-950 font-serif">
                            <span className="font-sans font-bold text-[11px] text-rose-700 block mb-1">
                              Bài của {activePair.submission2.studentName}:
                            </span>
                            "{ex.text2}"
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-12 text-center text-slate-400 text-xs">
                  Chọn một cặp bài nộp ở danh sách bên trái để xem đoạn văn trùng lặp đối chiếu.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-12 text-center space-y-3">
          <FileSearch className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Sẵn Sàng Quét Đạo Văn</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Chọn bài tập ở ô phía trên và nhấn "Quét Trùng Lặp" để tiến hành phân tích thuật toán N-gram đối với tất cả sinh viên đã nộp bài.
          </p>
        </div>
      )}
    </div>
  );
};
