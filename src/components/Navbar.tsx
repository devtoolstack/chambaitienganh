import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  FolderKanban, 
  FileCheck2, 
  FileSearch, 
  Settings, 
  ExternalLink,
  Sparkles,
  Users
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  geminiConfigured: boolean;
  openPublicPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  geminiConfigured,
  openPublicPortal
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: FolderKanban },
    { id: 'assignments', label: 'Bài Tập', icon: BookOpen },
    { id: 'submissions', label: 'Bài Nộp & Chấm AI', icon: FileCheck2 },
    { id: 'plagiarism', label: 'Kiểm Tra Đạo Văn', icon: FileSearch },
    { id: 'rubrics', label: 'Thang Điểm Rubric', icon: GraduationCap },
    { id: 'classes', label: 'Lớp & Môn Học', icon: Users },
    { id: 'settings', label: 'Cấu Hình Hệ Thống', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm ring-4 ring-indigo-50">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Chấm Bài Tiếng Anh AI</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                  Gemini 2.5
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Hệ thống chấm essay tự động & kiểm tra trùng lặp
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={openPublicPortal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200/80 transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Cổng Nộp Bài Sinh Viên</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
