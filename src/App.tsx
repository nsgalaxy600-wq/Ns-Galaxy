import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TestGeneratorForm } from './components/TestGeneratorForm';
import { LiveTestPlayer } from './components/LiveTestPlayer';
import { AppsScriptExporter } from './components/AppsScriptExporter';
import { QuestionBankView } from './components/QuestionBankView';
import { ResultsDashboard } from './components/ResultsDashboard';
import { TestConfig, Question, TestSubmission } from './types/test';
import { INITIAL_SAMPLE_QUESTIONS } from './data/courses';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'test' | 'script' | 'paper' | 'results'>('generator');

  const [config, setConfig] = useState<TestConfig>({
    institute: 'NS Galaxy Computer Institute',
    testType: 'Weekly Test',
    course: 'Basic Computer',
    subject: 'Computer Fundamentals',
    topic: 'Computer Memory, MS Word और Input/Output Devices',
    questionCount: 20,
    marksPerQuestion: 1,
    negativeMarking: 0,
    difficulty: 'आसान और मध्यम',
    language: 'Hindi',
    model: 'gemini-2.5-flash',
    timeLimitMinutes: 20,
  });

  const [questions, setQuestions] = useState<Question[]>(INITIAL_SAMPLE_QUESTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submissions persistence in localStorage
  const [submissions, setSubmissions] = useState<TestSubmission[]>(() => {
    try {
      const stored = localStorage.getItem('nsgalaxy_submissions');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load submissions from localStorage:', e);
    }
    // Default initial mock record for demonstration
    return [
      {
        id: 'NSG-SAMPLE-1',
        testTitle: 'NS Galaxy Computer Institute - Weekly Test - Basic Computer',
        course: 'Basic Computer',
        subject: 'Computer Fundamentals',
        testType: 'Weekly Test',
        student: {
          fullName: 'अमित कुमार (Amit Kumar)',
          rollNumber: 'NSG-2026-101',
          course: 'Basic Computer',
          batchTime: 'सुबह 08:30 - 10:00 AM',
        },
        answers: {},
        score: 9,
        maxScore: 10,
        percentage: 90,
        passed: true,
        timeSpentSeconds: 680,
        submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        questions: INITIAL_SAMPLE_QUESTIONS,
      },
      {
        id: 'NSG-SAMPLE-2',
        testTitle: 'NS Galaxy Computer Institute - Weekly Test - Basic Computer',
        course: 'Basic Computer',
        subject: 'Computer Fundamentals',
        testType: 'Weekly Test',
        student: {
          fullName: 'प्रिया वर्मा (Priya Verma)',
          rollNumber: 'NSG-2026-108',
          course: 'Basic Computer',
          batchTime: 'सुबह 08:30 - 10:00 AM',
        },
        answers: {},
        score: 8,
        maxScore: 10,
        percentage: 80,
        passed: true,
        timeSpentSeconds: 740,
        submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        questions: INITIAL_SAMPLE_QUESTIONS,
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('nsgalaxy_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error('Failed to save submissions:', e);
    }
  }, [submissions]);

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'प्रश्न उत्पन्न करने में असफलता।');
      }

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('AI ने कोई प्रश्न नहीं लौटाया।');
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          'प्रश्न तैयार करने में समस्या आई। कृपया नेटवर्क जाँचें या पुनः प्रयास करें।'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setQuestions(INITIAL_SAMPLE_QUESTIONS);
    setError(null);
  };

  const handleSaveSubmission = (newSubmission: TestSubmission) => {
    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  const handleClearSubmissions = () => {
    if (confirm('क्या आप सभी विद्यार्थी परीक्षा रिकॉर्ड मिटाना चाहते हैं?')) {
      setSubmissions([]);
    }
  };

  const activeTestTitle = `${config.testType}: ${config.course} - ${config.subject}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        questionsCount={questions.length}
        testTitle={activeTestTitle}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'generator' && (
          <TestGeneratorForm
            config={config}
            setConfig={setConfig}
            onGenerate={handleGenerateQuestions}
            isLoading={isLoading}
            error={error}
            onLoadSample={handleLoadSample}
            questions={questions}
            onGoToTest={() => setActiveTab('test')}
            onGoToScript={() => setActiveTab('script')}
          />
        )}

        {activeTab === 'test' && (
          <LiveTestPlayer
            questions={questions}
            config={config}
            onSaveSubmission={handleSaveSubmission}
            onBackToConfig={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'script' && (
          <AppsScriptExporter config={config} questions={questions} />
        )}

        {activeTab === 'paper' && (
          <QuestionBankView
            questions={questions}
            setQuestions={setQuestions}
            config={config}
          />
        )}

        {activeTab === 'results' && (
          <ResultsDashboard
            submissions={submissions}
            onClearSubmissions={handleClearSubmissions}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-700">
            {config.institute} · सर्वाधिकार सुरक्षित © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>Powered by Google Gemini AI</span>
            <span>·</span>
            <span>Google Apps Script + Forms + Sheets Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
