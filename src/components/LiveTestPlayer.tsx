import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Award,
  Printer,
  ChevronRight,
  User,
  GraduationCap
} from 'lucide-react';
import { Question, TestConfig, StudentInfo, TestSubmission } from '../types/test';
import { INSTITUTE_COURSES } from '../data/courses';
import { StudentCertificate } from './StudentCertificate';

interface LiveTestPlayerProps {
  questions: Question[];
  config: TestConfig;
  onSaveSubmission: (submission: TestSubmission) => void;
  onBackToConfig: () => void;
}

export const LiveTestPlayer: React.FC<LiveTestPlayerProps> = ({
  questions,
  config,
  onSaveSubmission,
  onBackToConfig,
}) => {
  const [student, setStudent] = useState<StudentInfo>({
    fullName: '',
    rollNumber: '',
    course: config.course,
    batchTime: 'सुबह 08:00 - 09:30 AM',
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(config.timeLimitMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [filterResult, setFilterResult] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');
  const [showCertificate, setShowCertificate] = useState(false);

  // Initialize or reset timer on start
  useEffect(() => {
    if (hasStarted && !isSubmitted && secondsLeft > 0) {
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasStarted, isSubmitted, secondsLeft]);

  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.fullName.trim() || !student.rollNumber.trim()) {
      alert('कृपया विद्यार्थी का पूरा नाम और रोल नंबर दर्ज करें।');
      return;
    }
    setSecondsLeft(config.timeLimitMinutes * 60);
    setHasStarted(true);
    setIsSubmitted(false);
  };

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    const qId = questions[currentIndex].id;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const handleClearCurrent = () => {
    if (isSubmitted) return;
    const qId = questions[currentIndex].id;
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const handleToggleFlag = () => {
    const qId = questions[currentIndex].id;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const calculateResults = () => {
    let score = 0;
    const maxScore = questions.length * config.marksPerQuestion;

    questions.forEach((q) => {
      const studentAns = selectedAnswers[q.id];
      if (studentAns) {
        if (studentAns === q.answer) {
          score += config.marksPerQuestion;
        } else if (config.negativeMarking > 0) {
          score = Math.max(0, score - config.negativeMarking);
        }
      }
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= 40;

    return {
      score: Math.round(score * 10) / 10,
      maxScore,
      percentage,
      passed,
    };
  };

  const handleFinalSubmit = () => {
    setShowSubmitModal(false);
    setIsSubmitted(true);

    const { score, maxScore, percentage, passed } = calculateResults();
    const timeSpent = config.timeLimitMinutes * 60 - secondsLeft;

    const submission: TestSubmission = {
      id: 'NSG-' + Date.now(),
      testTitle: `${config.institute} - ${config.testType} - ${config.course}`,
      course: config.course,
      subject: config.subject,
      testType: config.testType,
      student,
      answers: selectedAnswers,
      score,
      maxScore,
      percentage,
      passed,
      timeSpentSeconds: Math.max(timeSpent, 10),
      submittedAt: new Date().toISOString(),
      questions,
    };

    onSaveSubmission(submission);
  };

  const handleAutoSubmit = () => {
    setShowSubmitModal(false);
    setIsSubmitted(true);
    const { score, maxScore, percentage, passed } = calculateResults();
    const submission: TestSubmission = {
      id: 'NSG-' + Date.now(),
      testTitle: `${config.institute} - ${config.testType} - ${config.course}`,
      course: config.course,
      subject: config.subject,
      testType: config.testType,
      student,
      answers: selectedAnswers,
      score,
      maxScore,
      percentage,
      passed,
      timeSpentSeconds: config.timeLimitMinutes * 60,
      submittedAt: new Date().toISOString(),
      questions,
    };
    onSaveSubmission(submission);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-xl mx-auto my-8">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 mb-1">
          कोई टेस्ट प्रश्न उपलब्ध नहीं है
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          कृपया पहले 'AI टेस्ट जनरेटर' टैब में जाकर नया टेस्ट बनाएँ या डिफ़ॉल्ट प्रश्न लोड करें।
        </p>
        <button
          onClick={onBackToConfig}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          AI टेस्ट जनरेटर पर जाएँ
        </button>
      </div>
    );
  }

  // 1. Initial Student Registration Screen
  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto my-6 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-6">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>{config.institute}</span>
          </div>
          <h2 className="text-lg font-bold">
            {config.testType}: {config.course}
          </h2>
          <p className="text-xs text-indigo-100/90 mt-1">
            विषय: {config.subject} · कुल {questions.length} प्रश्न · समय: {config.timeLimitMinutes} मिनट
          </p>
        </div>

        <form onSubmit={handleStartTest} className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
            <p className="font-bold mb-0.5">परीक्षार्थियों के लिए महत्वपूर्ण निर्देश:</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              <li>प्रत्येक प्रश्न के 4 विकल्प हैं, जिनमें से एक सही उत्तर है।</li>
              <li>कुल पूर्णांक: {questions.length * config.marksPerQuestion} अंक।</li>
              <li>समय सीमा समाप्त होते ही टेस्ट स्वतः जमा (auto-submit) हो जाएगा।</li>
            </ul>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              विद्यार्थी का पूरा नाम (Student Full Name) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={student.fullName}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="उदा. राहुल शर्मा (Rahul Sharma)"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                रोल नंबर / विद्यार्थी ID (Roll No / ID) *
              </label>
              <input
                type="text"
                required
                value={student.rollNumber}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, rollNumber: e.target.value }))
                }
                placeholder="उदा. NSG-2026-042"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                कोर्स (Course)
              </label>
              <select
                value={student.course}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, course: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {INSTITUTE_COURSES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              बैच / क्लास का समय (Batch Time)
            </label>
            <select
              value={student.batchTime}
              onChange={(e) =>
                setStudent((prev) => ({ ...prev, batchTime: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            >
              <option value="सुबह 07:00 - 08:30 AM">सुबह 07:00 - 08:30 AM</option>
              <option value="सुबह 08:30 - 10:00 AM">सुबह 08:30 - 10:00 AM</option>
              <option value="दोपहर 11:00 - 12:30 PM">दोपहर 11:00 - 12:30 PM</option>
              <option value="शाम 04:00 - 05:30 PM">शाम 04:00 - 05:30 PM</option>
              <option value="शाम 05:30 - 07:00 PM">शाम 05:30 - 07:00 PM</option>
              <option value="संडे स्पेशल बैच (Sunday Batch)">संडे स्पेशल बैच (Sunday Batch)</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ऑनलाइन परीक्षा शुरू करें (Start Test)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // 2. Result & Scorecard View
  if (isSubmitted) {
    const { score, maxScore, percentage, passed } = calculateResults();
    const answeredCount = Object.keys(selectedAnswers).length;
    const correctCount = questions.filter(
      (q) => selectedAnswers[q.id] === q.answer
    ).length;
    const wrongCount = answeredCount - correctCount;
    const unattemptedCount = questions.length - answeredCount;

    const filteredQuestions = questions.filter((q) => {
      const studentAns = selectedAnswers[q.id];
      if (filterResult === 'correct') return studentAns === q.answer;
      if (filterResult === 'wrong') return studentAns && studentAns !== q.answer;
      if (filterResult === 'unanswered') return !studentAns;
      return true;
    });

    return (
      <div className="space-y-6">
        {/* Certificate Modal / View */}
        {showCertificate && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 no-print">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  आधिकारिक संस्थान प्रमाण पत्र व स्कोरकार्ड
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>प्रिंट / PDF सेव करें</span>
                  </button>
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    बंद करें (Close)
                  </button>
                </div>
              </div>

              <StudentCertificate
                institute={config.institute}
                testType={config.testType}
                studentName={student.fullName}
                rollNumber={student.rollNumber}
                course={student.course}
                batchTime={student.batchTime}
                subject={config.subject}
                score={score}
                maxScore={maxScore}
                percentage={percentage}
                passed={passed}
                date={new Date().toLocaleDateString('hi-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
            </div>
          </div>
        )}

        {/* Scorecard Hero Banner */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div
            className={`p-6 text-white ${
              passed
                ? 'bg-gradient-to-r from-emerald-800 to-teal-800'
                : 'bg-gradient-to-r from-slate-800 to-indigo-900'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  {config.testType} परिणाम (Test Result)
                </span>
                <h2 className="text-xl font-bold mt-2">
                  {student.fullName} (Roll: {student.rollNumber})
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  कोर्स: {student.course} · विषय: {config.subject} · {student.batchTime}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-extrabold tracking-tight">
                    {score} / {maxScore}
                  </div>
                  <div className="text-xs text-white/80">
                    प्रतिशत: {percentage}% · {passed ? 'उत्तीर्ण (PASS)' : 'सुधार अपेक्षित (NEEDS REVIEW)'}
                  </div>
                </div>

                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-50 font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>सर्टिफिकेट देखें</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-b border-slate-100 bg-slate-50/50 text-xs">
            <div className="p-4 text-center">
              <span className="text-slate-500 block mb-0.5">कुल प्रश्न</span>
              <span className="text-base font-bold text-slate-900">
                {questions.length}
              </span>
            </div>
            <div className="p-4 text-center">
              <span className="text-emerald-600 block mb-0.5">सही उत्तर</span>
              <span className="text-base font-bold text-emerald-700">
                {correctCount}
              </span>
            </div>
            <div className="p-4 text-center">
              <span className="text-rose-600 block mb-0.5">गलत उत्तर</span>
              <span className="text-base font-bold text-rose-700">
                {wrongCount}
              </span>
            </div>
            <div className="p-4 text-center">
              <span className="text-slate-400 block mb-0.5">छोड़े गए प्रश्न</span>
              <span className="text-base font-bold text-slate-600">
                {unattemptedCount}
              </span>
            </div>
          </div>

          {/* Question Filter Tabs */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFilterResult('all')}
                className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                  filterResult === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                सभी प्रश्न ({questions.length})
              </button>
              <button
                onClick={() => setFilterResult('correct')}
                className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                  filterResult === 'correct'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                सही ({correctCount})
              </button>
              <button
                onClick={() => setFilterResult('wrong')}
                className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                  filterResult === 'wrong'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                गलत ({wrongCount})
              </button>
              <button
                onClick={() => setFilterResult('unanswered')}
                className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                  filterResult === 'unanswered'
                    ? 'bg-white text-slate-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                अनुत्तरित ({unattemptedCount})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setFlaggedQuestions({});
                  setIsSubmitted(false);
                  setHasStarted(false);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पुनः टेस्ट दें (Retake)</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="divide-y divide-slate-100 p-6 space-y-4">
            {filteredQuestions.map((q, idx) => {
              const studentChoice = selectedAnswers[q.id];
              const isCorrect = studentChoice === q.answer;
              const isUnanswered = !studentChoice;

              return (
                <div key={q.id} className="pt-4 first:pt-0 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="font-bold text-xs text-slate-400 mt-0.5 shrink-0">
                        Q{q.id}.
                      </span>
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isUnanswered ? (
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          छोड़ा गया
                        </span>
                      ) : isCorrect ? (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          + {config.marksPerQuestion} अंक
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          गलत (0)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4 Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isOptionCorrect = opt === q.answer;
                      const isOptionStudentChoice = opt === studentChoice;

                      let itemClass =
                        'border-slate-200 bg-white text-slate-700';

                      if (isOptionCorrect) {
                        itemClass =
                          'border-emerald-500 bg-emerald-50/60 font-semibold text-emerald-950';
                      } else if (isOptionStudentChoice && !isCorrect) {
                        itemClass =
                          'border-rose-400 bg-rose-50/60 font-semibold text-rose-950 line-through';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border flex items-center justify-between text-xs ${itemClass}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isOptionCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 uppercase">
                              सही उत्तर
                            </span>
                          )}
                          {isOptionStudentChoice && !isOptionCorrect && (
                            <span className="text-[10px] font-bold text-rose-600 uppercase">
                              आपका चयन
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Card */}
                  {q.explanation && (
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <span className="font-bold text-slate-800">
                        स्पष्टीकरण (Explanation):{' '}
                      </span>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. Live Examination In-Progress Screen
  const currentQ = questions[currentIndex];
  const attemptedCount = Object.keys(selectedAnswers).length;
  const currentAnswer = selectedAnswers[currentQ.id];
  const isFlagged = flaggedQuestions[currentQ.id];

  return (
    <div className="space-y-4">
      {/* Top Test Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              {config.institute}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-slate-800">
              {config.testType}: {config.course}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            परीक्षार्थी: <span className="font-semibold text-slate-800">{student.fullName}</span> (Roll: {student.rollNumber})
          </p>
        </div>

        {/* Live Timer & Submit Trigger */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
              secondsLeft < 180
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>शेष समय: {formatTimer(secondsLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            टेस्ट सबमिट करें
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Question Area (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  प्रश्न {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-600">
                  {config.marksPerQuestion} अंक
                </span>
              </div>

              <button
                onClick={handleToggleFlag}
                className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  isFlagged
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isFlagged ? 'समीक्षा हेतु चिह्नित (Marked)' : 'रिव्यू के लिए मार्क करें'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="py-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = currentAnswer === opt;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-xs ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Bottom Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>पिछला (Previous)</span>
              </button>

              {currentAnswer && (
                <button
                  type="button"
                  onClick={handleClearCurrent}
                  className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  उत्तर साफ़ करें (Clear)
                </button>
              )}

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(questions.length - 1, prev + 1)
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <span>अगला (Next)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <span>फाइनल सबमिट करें</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Side Question Navigation Palette (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
              प्रश्न पैलेट (Question Palette)
            </h4>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600"></span>
                <span>हल किए ({attemptedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200"></span>
                <span>शेष ({questions.length - attemptedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500"></span>
                <span>चिह्नित ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border-2 border-indigo-600 bg-indigo-50"></span>
                <span>वर्तमान (Active)</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-2 pt-3">
              {questions.map((q, idx) => {
                const isAns = !!selectedAnswers[q.id];
                const isFlag = !!flaggedQuestions[q.id];
                const isCurr = idx === currentIndex;

                let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                if (isAns) {
                  btnClass = 'bg-emerald-600 text-white font-bold';
                }
                if (isFlag) {
                  btnClass = 'bg-amber-500 text-white font-bold ring-1 ring-amber-400';
                }
                if (isCurr) {
                  btnClass += ' ring-2 ring-indigo-600 ring-offset-1 font-extrabold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              क्या आप परीक्षा सबमिट करना चाहते हैं?
            </h3>
            <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>कुल प्रश्न:</span>
                <span className="font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>उत्तर दिए गए प्रश्न:</span>
                <span>{attemptedCount}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>बिना उत्तर छोड़े गए:</span>
                <span>{questions.length - attemptedCount}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>रिव्यू के लिए मार्क किए:</span>
                <span>{Object.values(flaggedQuestions).filter(Boolean).length}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                परीक्षण जारी रखें
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 cursor-pointer"
              >
                हाँ, सबमिट करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
