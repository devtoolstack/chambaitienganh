import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AssignmentsView } from './components/AssignmentsView';
import { SubmissionsView } from './components/SubmissionsView';
import { PlagiarismView } from './components/PlagiarismView';
import { RubricsView } from './components/RubricsView';
import { SubjectsClassesView } from './components/SubjectsClassesView';
import { StudentSubmitView } from './components/StudentSubmitView';
import { SettingsView } from './components/SettingsView';
import { 
  Subject, 
  ClassRoom, 
  Rubric, 
  Assignment, 
  Submission, 
  PlagiarismCheckResult, 
  SystemSettings 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isStudentPortal, setIsStudentPortal] = useState<boolean>(false);
  const [studentToken, setStudentToken] = useState<string>('AI-ESSAY-2026');

  // State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [settings, setSettings] = useState<SystemSettings>({
    aiModel: 'gemini-2.5-flash',
    geminiApiKeyConfigured: false,
    plagiarismThreshold: 25,
    promptTemplate: 'Chấm bài luận theo tiêu chí Rubric...'
  });

  // Check URL pathname for /submit/:token or /share/:token
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/submit/')) {
      const token = path.replace('/submit/', '');
      if (token) {
        setStudentToken(token);
        setIsStudentPortal(true);
      }
    } else if (path.startsWith('/share/')) {
      const token = path.replace('/share/', '');
      if (token) {
        setStudentToken(token);
        setIsStudentPortal(true);
      }
    }
  }, []);

  // Fetch initial data
  const loadData = async () => {
    try {
      const [subsRes, clsRes, rubRes, asgRes, submRes, setRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/classes'),
        fetch('/api/rubrics'),
        fetch('/api/assignments'),
        fetch('/api/submissions'),
        fetch('/api/settings')
      ]);

      if (subsRes.ok) setSubjects(await subsRes.json());
      if (clsRes.ok) setClasses(await clsRes.json());
      if (rubRes.ok) setRubrics(await rubRes.json());
      if (asgRes.ok) setAssignments(await asgRes.json());
      if (submRes.ok) setSubmissions(await submRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch (err) {
      console.error('Failed to load API data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // API Actions
  const handleCreateSubject = async (data: Partial<Subject>) => {
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) loadData();
  };

  const handleDeleteSubject = async (id: string) => {
    await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleCreateClass = async (data: Partial<ClassRoom>) => {
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) loadData();
  };

  const handleDeleteClass = async (id: string) => {
    await fetch(`/api/classes/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleCreateRubric = async (data: Partial<Rubric>) => {
    const res = await fetch('/api/rubrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) loadData();
  };

  const handleDeleteRubric = async (id: string) => {
    await fetch(`/api/rubrics/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleCreateAssignment = async (data: Partial<Assignment>) => {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) loadData();
  };

  const handleDeleteAssignment = async (id: string) => {
    await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleRegradeSubmission = async (id: string) => {
    const res = await fetch(`/api/submissions/${id}/grade`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setSelectedSubmission(data.submission);
      loadData();
    }
  };

  const handleCheckPlagiarism = async (assignmentId: string): Promise<PlagiarismCheckResult | null> => {
    const res = await fetch(`/api/plagiarism/check/${assignmentId}`, { method: 'POST' });
    if (res.ok) {
      return await res.json();
    }
    return null;
  };

  const handleSaveSettings = async (data: Partial<SystemSettings>) => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) loadData();
  };

  const openPublicPortal = (token?: string) => {
    if (token) setStudentToken(token);
    setIsStudentPortal(true);
  };

  if (isStudentPortal) {
    return (
      <StudentSubmitView
        initialToken={studentToken}
        onReturnToDashboard={() => {
          setIsStudentPortal(false);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        geminiConfigured={settings.geminiApiKeyConfigured}
        openPublicPortal={() => openPublicPortal()}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            assignments={assignments}
            submissions={submissions}
            setActiveTab={setActiveTab}
            openPublicPortal={() => openPublicPortal()}
            selectSubmission={(s) => setSelectedSubmission(s)}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsView
            assignments={assignments}
            classes={classes}
            rubrics={rubrics}
            onCreateAssignment={handleCreateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            openPublicSubmissionPage={(token) => openPublicPortal(token)}
          />
        )}

        {activeTab === 'submissions' && (
          <SubmissionsView
            submissions={submissions}
            assignments={assignments}
            selectedSubmission={selectedSubmission}
            setSelectedSubmission={setSelectedSubmission}
            onRegradeSubmission={handleRegradeSubmission}
          />
        )}

        {activeTab === 'plagiarism' && (
          <PlagiarismView
            assignments={assignments}
            onCheckPlagiarism={handleCheckPlagiarism}
          />
        )}

        {activeTab === 'rubrics' && (
          <RubricsView
            rubrics={rubrics}
            onCreateRubric={handleCreateRubric}
            onDeleteRubric={handleDeleteRubric}
          />
        )}

        {activeTab === 'classes' && (
          <SubjectsClassesView
            subjects={subjects}
            classes={classes}
            onCreateSubject={handleCreateSubject}
            onDeleteSubject={handleDeleteSubject}
            onCreateClass={handleCreateClass}
            onDeleteClass={handleDeleteClass}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Chấm Bài Tiếng Anh AI — Tối ưu hóa đánh giá bài luận & chống đạo văn</span>
          <span className="font-medium text-slate-600">Được vận hành bởi Gemini 2.5 Flash</span>
        </div>
      </footer>
    </div>
  );
}
