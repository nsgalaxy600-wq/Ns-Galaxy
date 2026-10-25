import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Sliders,
  Clock,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { TestConfig, Question } from '../types/test';
import { INSTITUTE_COURSES } from '../data/courses';

interface TestGeneratorFormProps {
  config: TestConfig;
  setConfig: React.Dispatch<React.SetStateAction<TestConfig>>;
  onGenerate: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onLoadSample: () => void;
  questions: Question[];
  onGoToTest: () => void;
  onGoToScript: () => void;
}

export const TestGeneratorForm: React.FC<TestGeneratorFormProps> = ({
  config,
  setConfig,
  onGenerate,
  isLoading,
  error,
  onLoadSample,
  questions,
  onGoToTest,
  onGoToScript,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedCourseDetail = INSTITUTE_COURSES.find(
    (c) => c.name === config.course
  ) || INSTITUTE_COURSES[0];

  const handleCourseChange = (courseName: string) => {
    const found = INSTITUTE_COURSES.find((c) => c.name === courseName);
    if (found) {
      setConfig((prev) => ({
        ...prev,
        course: found.name,
        subject: found.defaultSubject,
        topic: found.topics[0] || prev.topic,
      }));
    } else {
      setConfig((prev) => ({ ...prev, course: courseName }));
    }
  };

  const handleApplyPreset = (presetType: 'weekly' | 'monthly' | 'ccc' | 'tally') => {
    if (presetType === 'weekly') {
      const basic = INSTITUTE_COURSES.find((c) => c.name === 'Basic Computer')!;
      setConfig((prev) => ({
        ...prev,
        testType: 'Weekly Test',
        course: basic.name,
        subject: basic.defaultSubject,
        topic: 'Computer Memory, MS Word और Input/Output Devices',
        questionCount: 20,
        marksPerQuestion: 1,
        difficulty: 'आसान और मध्यम',
        language: 'Hindi',
        timeLimitMinutes: 20,
      }));
    } else if (presetType === 'monthly') {
      const dca = INSTITUTE_COURSES.find((c) => c.name === 'DCA')!;
      setConfig((prev) => ({
        ...prev,
        testType: 'Monthly Test',
        course: dca.name,
        subject: dca.defaultSubject,
        topic: 'MS Office Suite (Word, Excel, PowerPoint) & Windows OS',
        questionCount: 30,
        marksPerQuestion: 1,
        difficulty: 'मध्यम (Moderate)',
        language: 'Hindi',
        timeLimitMinutes: 35,
      }));
    } else if (presetType === 'ccc') {
      const ccc = INSTITUTE_COURSES.find((c) => c.name === 'CCC')!;
      setConfig((prev) => ({
        ...prev,
        testType: 'Monthly Test',
        course: ccc.name,
        subject: ccc.defaultSubject,
        topic: 'LibreOffice Writer, Calc, Impress & Digital Financial Tools (UPI/AEPS)',
        questionCount: 25,
        marksPerQuestion: 1,
        difficulty: 'मध्यम (Moderate)',
        language: 'Bilingual (Hindi + English)',
        timeLimitMinutes: 30,
      }));
    } else if (presetType === 'tally') {
      const tally = INSTITUTE_COURSES.find((c) => c.name === 'Tally Prime')!;
      setConfig((prev) => ({
        ...prev,
        testType: 'Weekly Test',
        course: tally.name,
        subject: tally.defaultSubject,
        topic: 'Company Creation, GST Accounting (CGST/SGST), Vouchers & Invoicing',
        questionCount: 20,
        marksPerQuestion: 2,
        difficulty: 'मध्यम (Moderate)',
        language: 'Hindi',
        timeLimitMinutes: 25,
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Preset Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            त्वरित प्रीसेट (Quick Institute Presets)
          </span>
          <button
            type="button"
            onClick={onLoadSample}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            डिफ़ॉल्ट 10 प्रश्न लोड करें
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset('weekly')}
            className={`p-2.5 text-left rounded-lg border text-xs transition-all cursor-pointer ${
              config.testType === 'Weekly Test' && config.course === 'Basic Computer'
                ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 shadow-xs'
                : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="font-bold">साप्ताहिक टेस्ट (Weekly)</div>
            <div className="text-[11px] text-slate-500">Basic Computer · 20 प्रश्न</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('monthly')}
            className={`p-2.5 text-left rounded-lg border text-xs transition-all cursor-pointer ${
              config.testType === 'Monthly Test' && config.course === 'DCA'
                ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 shadow-xs'
                : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="font-bold">मासिक परीक्षा (Monthly)</div>
            <div className="text-[11px] text-slate-500">DCA Office Suite · 30 प्रश्न</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('ccc')}
            className={`p-2.5 text-left rounded-lg border text-xs transition-all cursor-pointer ${
              config.course === 'CCC'
                ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 shadow-xs'
                : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="font-bold">NIELIT CCC Exam</div>
            <div className="text-[11px] text-slate-500">LibreOffice & UPI · द्वैभाषिक</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('tally')}
            className={`p-2.5 text-left rounded-lg border text-xs transition-all cursor-pointer ${
              config.course === 'Tally Prime'
                ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 shadow-xs'
                : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="font-bold">Tally Prime GST</div>
            <div className="text-[11px] text-slate-500">Vouchers & Tax · 20 प्रश्न</div>
          </button>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                परीक्षा कॉन्फ़िगरेशन (Test Parameters)
              </h2>
              <p className="text-xs text-slate-500">
                NS Galaxy Institute पाठ्यक्रम के अनुसार टेस्ट सेटिंग्स चुनें
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            मॉडल:{' '}
            <span className="font-mono font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              {config.model}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-bold">त्रुटि (Error)</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Row 1: Institute Name & Test Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                संस्थान का नाम (Institute Name)
              </label>
              <input
                type="text"
                value={config.institute}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, institute: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                placeholder="NS Galaxy Computer Institute"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                टेस्ट प्रकार (Test Type)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Weekly Test', 'Monthly Test', 'Semester Exam'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({ ...prev, testType: type }))
                    }
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer text-center ${
                      config.testType === type
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {type === 'Weekly Test'
                      ? 'साप्ताहिक (Weekly)'
                      : type === 'Monthly Test'
                      ? 'मासिक (Monthly)'
                      : 'सत्र परीक्षा'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Course & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                कोर्स का चयन करें (Select Course)
              </label>
              <select
                value={config.course}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {INSTITUTE_COURSES.map((course) => (
                  <option key={course.id} value={course.name}>
                    {course.name} ({course.hindiName}) · {course.duration}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                विषय (Subject / Module)
              </label>
              <input
                type="text"
                value={config.subject}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                placeholder="उदा. Computer Fundamentals"
              />
            </div>
          </div>

          {/* Row 3: Topic Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                टॉपिक / पाठ्यक्रम अध्याय (Exam Topic)
              </label>
              <span className="text-[11px] text-slate-500">
                सुझाए गए टॉपिक पर क्लिक करें या नीचे खुद लिखें
              </span>
            </div>

            <input
              type="text"
              value={config.topic}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, topic: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white mb-2"
              placeholder="Computer Memory, MS Word और Input/Output Devices"
            />

            {/* Quick topics for selected course */}
            <div className="flex flex-wrap gap-1.5">
              {selectedCourseDetail.topics.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, topic: t }))}
                  className={`text-[11px] px-2.5 py-1 rounded border text-left transition-colors cursor-pointer ${
                    config.topic === t
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Question Count & Scoring */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                प्रश्न संख्या (Count)
              </label>
              <div className="flex items-center gap-1">
                {[10, 20, 30, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        questionCount: num,
                        timeLimitMinutes: Math.max(10, num),
                      }))
                    }
                    className={`flex-1 py-1.5 text-xs font-semibold rounded border cursor-pointer ${
                      config.questionCount === num
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                प्रति प्रश्न अंक (Marks)
              </label>
              <select
                value={config.marksPerQuestion}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    marksPerQuestion: Number(e.target.value) || 1,
                  }))
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value={1}>1 अंक (Marks)</option>
                <option value={2}>2 अंक (Marks)</option>
                <option value={4}>4 अंक (Marks)</option>
                <option value={5}>5 अंक (Marks)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                कठिनाई (Difficulty)
              </label>
              <select
                value={config.difficulty}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, difficulty: e.target.value }))
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="आसान और मध्यम">आसान और मध्यम (Default)</option>
                <option value="आसान (Easy)">आसान (Beginner Friendly)</option>
                <option value="मध्यम (Moderate)">मध्यम (Standard)</option>
                <option value="कठिन (Challenging)">कठिन (Advanced)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                भाषा (Language)
              </label>
              <select
                value={config.language}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    language: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="English">English</option>
                <option value="Bilingual (Hindi + English)">द्विभाषी (Bilingual)</option>
              </select>
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'अतिरिक्त सेटिंग्स छिपाएँ' : 'अतिरिक्त सेटिंग्स (Time limit, Negative Marking, AI Model)'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    समय सीमा (Time Limit in Minutes)
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={config.timeLimitMinutes}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          timeLimitMinutes: Math.max(5, Number(e.target.value) || 20),
                        }))
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white"
                    />
                    <span className="text-xs text-slate-500">मिनट</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    नेगेटिव मार्किंग (Negative Marking)
                  </label>
                  <select
                    value={config.negativeMarking}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        negativeMarking: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white"
                  >
                    <option value={0}>कोई नेगेटिव मार्किंग नहीं (0)</option>
                    <option value={0.25}>0.25 (1/4 अंक)</option>
                    <option value={0.33}>0.33 (1/3 अंक)</option>
                    <option value={0.5}>0.5 (1/2 अंक)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gemini AI मॉडल
                  </label>
                  <select
                    value={config.model}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, model: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded bg-white"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & Accurate)</option>
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Latest Model)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">
                पूर्णांक: {config.questionCount * config.marksPerQuestion} अंक
              </span>
              <span>·</span>
              <span>अनुमानित समय: {config.timeLimitMinutes} मिनट</span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">
                4 ऑप्शंस + स्पष्टीकरण सहित
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onGenerate}
                disabled={isLoading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>AI प्रश्न बना रहा है...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI से टेस्ट बनाएँ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Questions Status & Quick Actions Bar */}
      {questions.length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                <span>{questions.length} प्रश्न सफलतापूर्वक तैयार हैं</span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                  {config.course}
                </span>
              </div>
              <p className="text-xs text-emerald-800">
                आप तुरंत लाइव ऑनलाइन टेस्ट दे सकते हैं या Google Forms / Sheets स्क्रिप्ट कॉपी कर सकते हैं।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onGoToTest}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>लाइव टेस्ट शुरू करें</span>
            </button>

            <button
              onClick={onGoToScript}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Google Forms कोड</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
