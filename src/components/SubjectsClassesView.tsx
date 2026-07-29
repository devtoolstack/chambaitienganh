import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Trash2, 
  GraduationCap, 
  Layers, 
  KeyRound 
} from 'lucide-react';
import { Subject, ClassRoom } from '../types';

interface SubjectsClassesViewProps {
  subjects: Subject[];
  classes: ClassRoom[];
  onCreateSubject: (data: Partial<Subject>) => Promise<void>;
  onDeleteSubject: (id: string) => Promise<void>;
  onCreateClass: (data: Partial<ClassRoom>) => Promise<void>;
  onDeleteClass: (id: string) => Promise<void>;
}

export const SubjectsClassesView: React.FC<SubjectsClassesViewProps> = ({
  subjects,
  classes,
  onCreateSubject,
  onDeleteSubject,
  onCreateClass,
  onDeleteClass
}) => {
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);

  // Subject Form State
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectDesc, setSubjectDesc] = useState('');

  // Class Form State
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [studentCount, setStudentCount] = useState(30);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    await onCreateSubject({
      name: subjectName,
      code: subjectCode,
      description: subjectDesc
    });
    setShowSubjectModal(false);
    setSubjectName('');
    setSubjectCode('');
    setSubjectDesc('');
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    await onCreateClass({
      subjectId: selectedSubjectId || subjects[0]?.id,
      name: className,
      code: classCode,
      studentCount
    });
    setShowClassModal(false);
    setClassName('');
    setClassCode('');
  };

  return (
    <div className="space-y-8">
      {/* Subjects Section */}
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Danh Sách Môn Học</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Quản lý danh mục các học phần Tiếng Anh</p>
          </div>
          <button
            onClick={() => setShowSubjectModal(true)}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Môn Học</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {sub.code}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{sub.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{sub.description}</p>
              </div>
              <button
                onClick={() => onDeleteSubject(sub.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Classes Section */}
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Danh Sách Lớp Học</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Các lớp tín chỉ, sĩ số và mã ghi danh</p>
          </div>
          <button
            onClick={() => setShowClassModal(true)}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Lớp Học</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                    {cls.code}
                  </span>
                  <span className="text-xs text-slate-500">{cls.subjectName}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{cls.name}</h3>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2">
                  <span>Sĩ số: <strong className="text-slate-800">{cls.studentCount} SV</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    <KeyRound className="w-3 h-3" />
                    {cls.token}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDeleteClass(cls.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Thêm Môn Học Mới</h3>
            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mã Môn Học</label>
                <input
                  type="text"
                  required
                  placeholder="ENG201"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên Môn Học</label>
                <input
                  type="text"
                  required
                  placeholder="Tiếng Anh Chuyên Ngành"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mô Tả</label>
                <input
                  type="text"
                  placeholder="Mô tả nội dung môn học..."
                  value={subjectDesc}
                  onChange={(e) => setSubjectDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setShowSubjectModal(false)} className="px-4 py-2 text-slate-600">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold">Thêm Môn</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Thêm Lớp Học Mới</h3>
            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Môn Học</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mã Lớp Tín Chỉ</label>
                <input
                  type="text"
                  required
                  placeholder="ENG201-K15-T3"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên Lớp Lịch Học</label>
                <input
                  type="text"
                  required
                  placeholder="Lớp ENG201 - Sáng Thứ 3"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sĩ Số Sinh Viên</label>
                <input
                  type="number"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setShowClassModal(false)} className="px-4 py-2 text-slate-600">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold">Thêm Lớp</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
