import React, { useState } from 'react';
import { 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Save, 
  Sliders, 
  KeyRound,
  BookOpen
} from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (settings: Partial<SystemSettings>) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings
}) => {
  const [plagiarismThreshold, setPlagiarismThreshold] = useState(settings.plagiarismThreshold || 25);
  const [promptTemplate, setPromptTemplate] = useState(settings.promptTemplate || '');
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings({
      plagiarismThreshold,
      promptTemplate,
      ...(apiKey ? { apiKey } : {})
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>Cấu Hình Hệ Thống Chấm AI</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tùy chỉnh thông số AI Gemini, ngưỡng phát hiện trùng lặp và Prompt mẫu cho giảng viên
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6 shadow-2xs">
        {/* Gemini API Status */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.geminiApiKeyConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span>Mô Hình AI: Gemini 2.5 Flash</span>
                {settings.geminiApiKeyConfigured ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">API Key Sẵn Sàng</span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Chế Độ Chấm Smart Engine</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {settings.geminiApiKeyConfigured 
                  ? 'Hệ thống đang kết nối trực tiếp với Gemini API để chấm bài luận.' 
                  : 'Chưa tìm thấy GEMINI_API_KEY trong môi trường. Hệ thống tự động kích hoạt bộ chấm thông minh Smart Rubric Engine.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Gemini API Key Input */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>Khóa API Gemini (GEMINI_API_KEY)</span>
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Server-side Proxy
              </span>
            </label>
            <input
              type="password"
              placeholder={settings.geminiApiKeyConfigured ? "•••••••••••••••• (Đã bảo mật trên Backend Server)" : "Nhập AIzaSy... để cập nhật mới"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            />
            <p className="text-[11px] text-slate-500">
              🔒 <b>Giải pháp bảo mật:</b> API Key được lưu trên môi trường Server (Node.js/Vercel Environment Variables) và gọi Gemini qua API Backend, tuyệt đối không lộ ở phía Trình duyệt (Client-side HTML/JS). Để cập nhật Key mới, hãy nhập vào ô trên và bấm Lưu.
            </p>
          </div>

          {/* Plagiarism Threshold */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Ngưỡng Cảnh Báo Trùng Lặp Đạo Văn (%)
              </span>
              <span className="text-indigo-600 font-extrabold">{plagiarismThreshold}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={plagiarismThreshold}
              onChange={(e) => setPlagiarismThreshold(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Các cặp bài có tỷ lệ tương đồng N-gram lớn hơn ngưỡng {plagiarismThreshold}% sẽ được tô màu đỏ và đưa vào danh sách cảnh báo.
            </p>
          </div>

          {/* Teacher Prompt Customization */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Prompt Mẫu Giảng Viên Gửi Cho Gemini AI</span>
            </label>
            <textarea
              rows={6}
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Prompt này quy định phong thái chấm bài (khắt khe, đại học, chi tiết 0.1 điểm) và yêu cầu nhận xét bằng Tiếng Việt.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {isSaved ? (
              <span className="text-emerald-600 font-semibold text-xs">✓ Đã lưu cài đặt thành công!</span>
            ) : (
              <span></span>
            )}
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
