import React from 'react';
import {
  Sparkles,
  BookOpen,
  FileCode2,
  Printer,
  Award,
  GraduationCap
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'generator' | 'test' | 'script' | 'paper' | 'results';
  setActiveTab: (tab: 'generator' | 'test' | 'script' | 'paper' | 'results') => void;
  questionsCount: number;
  testTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  questionsCount,
  testTitle,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                NS Galaxy Computer Institute
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                AI Exam System
              </span>
            </div>
            <p className="text-xs text-slate-500">
              साप्ताहिक एवं मासिक ऑनलाइन परीक्षा पोर्टल · Google Forms & Sheets Automator
            </p>
          </div>
        </div>

        {/* Current Active Test Indicator */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 self-start md:self-auto max-w-md truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="text-slate-500 shrink-0">सक्रिय टेस्ट:</span>
          <span className="font-semibold text-slate-800 truncate" title={testTitle}>
            {testTitle}
          </span>
          <span className="text-slate-400">·</span>
          <span className="font-medium text-indigo-600 shrink-0">
            {questionsCount} प्रश्न
          </span>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              activeTab === 'generator'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI टेस्ट जनरेटर (Generator)</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              activeTab === 'test'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>ऑनलाइन टेस्ट दें (Student Test Portal)</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              activeTab === 'script'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileCode2 className="w-4 h-4 text-amber-600" />
            <span>Google Apps Script & Forms</span>
          </button>

          <button
            onClick={() => setActiveTab('paper')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              activeTab === 'paper'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Printer className="w-4 h-4 text-sky-600" />
            <span>प्रश्न बैंक व प्रिंट पेपर (Question Bank)</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              activeTab === 'results'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span>रिजल्ट व सर्टिफिकेट (Scorecards)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
