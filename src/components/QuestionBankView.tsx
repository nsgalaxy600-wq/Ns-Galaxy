import React, { useState } from 'react';
import {
  Printer,
  FileText,
  Key,
  Plus,
  Trash2,
  Edit2,
  Check,
  Download,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { Question, TestConfig } from '../types/test';

interface QuestionBankViewProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  config: TestConfig;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  setQuestions,
  config,
}) => {
  const [paperMode, setPaperMode] = useState<'interactive' | 'student-paper' | 'teacher-key'>('interactive');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQ, setNewQ] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
  });

  const handleStartEdit = (q: Question) => {
    setEditingId(q.id);
    setEditForm({ ...q, options: [...q.options] });
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    setQuestions((prev) =>
      prev.map((item) => (item.id === editForm.id ? editForm : item))
    );
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('क्या आप इस प्रश्न को हटाना चाहते हैं?')) {
      setQuestions((prev) =>
        prev
          .filter((item) => item.id !== id)
          .map((item, idx) => ({ ...item, id: idx + 1 }))
      );
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.question?.trim() || !newQ.answer?.trim()) {
      alert('कृपया प्रश्न और सही उत्तर दर्ज करें।');
      return;
    }
    const created: Question = {
      id: questions.length + 1,
      question: newQ.question.trim(),
      options: (newQ.options || []).map((o) => o.trim() || 'विकल्प'),
      answer: newQ.answer.trim(),
      explanation: newQ.explanation?.trim() || 'यह सही उत्तर है।',
    };
    setQuestions((prev) => [...prev, created]);
    setShowAddModal(false);
    setNewQ({
      question: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: '',
    });
  };

  // Student Printable Question Paper View (for offline classroom paper)
  if (paperMode === 'student-paper') {
    return (
      <div className="bg-white min-h-screen p-8 max-w-4xl mx-auto border border-slate-200 print:border-none print:p-0">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 no-print">
          <span className="text-xs font-bold text-slate-700">
            छात्र प्रश्न-पत्र प्रिंट मोड (Offline Exam Paper)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट करें (Print)</span>
            </button>
            <button
              onClick={() => setPaperMode('interactive')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              वापस जाएँ (Back)
            </button>
          </div>
        </div>

        {/* Paper Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900 font-serif">
            {config.institute}
          </h1>
          <h2 className="text-sm font-bold text-slate-800 uppercase mt-1">
            {config.testType} · सत्र परीक्षा (Examination)
          </h2>
          <p className="text-xs text-slate-600">
            कोर्स: <span className="font-bold text-slate-900">{config.course}</span> · विषय: <span className="font-bold text-slate-900">{config.subject}</span>
          </p>
        </div>

        {/* Student Fill-in Fields */}
        <div className="grid grid-cols-2 gap-4 text-xs font-medium border border-slate-300 p-3 mb-6 bg-slate-50/50 print:bg-white">
          <div>विद्यार्थी का नाम: ____________________________________</div>
          <div>रोल नंबर / ID: ____________________________________</div>
          <div>बैच / क्लास: ____________________________________</div>
          <div>दिनांक (Date): __________________ पूर्णांक: {questions.length * config.marksPerQuestion} अंक</div>
        </div>

        {/* Questions in Clean 2-column or 1-column printable layout */}
        <div className="space-y-4 text-xs">
          {questions.map((q, idx) => (
            <div key={q.id} className="page-break-inside-avoid pb-3 border-b border-slate-100">
              <div className="font-bold text-slate-900 flex items-start gap-1.5 mb-1.5">
                <span>{idx + 1}.</span>
                <span>{q.question}</span>
                <span className="text-slate-400 font-normal ml-auto">[{config.marksPerQuestion} अंक]</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-4 text-slate-800">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-slate-400 text-[10px] flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500">
          *** ALL THE BEST - NS GALAXY COMPUTER INSTITUTE ***
        </div>
      </div>
    );
  }

  // Teacher Answer Key View
  if (paperMode === 'teacher-key') {
    return (
      <div className="bg-white min-h-screen p-8 max-w-4xl mx-auto border border-slate-200 print:border-none print:p-0">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 no-print">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
            शिक्षक उत्तर कुंजी व स्पष्टीकरण (Teacher's Answer Key)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट आंसर की</span>
            </button>
            <button
              onClick={() => setPaperMode('interactive')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              वापस जाएँ (Back)
            </button>
          </div>
        </div>

        <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
          <h1 className="text-xl font-bold uppercase text-slate-900">
            {config.institute}
          </h1>
          <h2 className="text-xs font-bold text-emerald-700 uppercase">
            आधिकारिक उत्तर कुंजी (CONFIDENTIAL ANSWER KEY & EXPLANATIONS)
          </h2>
          <p className="text-xs text-slate-600">
            {config.testType} · {config.course} ({config.subject})
          </p>
        </div>

        <div className="divide-y divide-slate-100 text-xs space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="pt-3 page-break-inside-avoid">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-slate-900">
                  {idx + 1}. {q.question}
                </p>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] shrink-0">
                  उत्तर: {q.answer}
                </span>
              </div>
              <div className="pl-4 mt-1 text-slate-600 text-[11px]">
                <span className="font-semibold text-slate-700">व्याख्या: </span>
                {q.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Interactive Question Bank Manager
  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              कुल {questions.length} प्रश्न
            </span>
            <h2 className="text-base font-bold text-slate-900">
              प्रश्न बैंक एवं परीक्षा पत्र (Question Bank)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            प्रश्नों को संपादित करें, नया प्रश्न जोड़ें, या ऑफलाइन परीक्षा के लिए A4 पेपर प्रिंट करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPaperMode('student-paper')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>छात्र प्रश्न पत्र (Print Paper)</span>
          </button>

          <button
            onClick={() => setPaperMode('teacher-key')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>आंसर की (Answer Key)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>प्रश्न जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              नया बहुविकल्पीय प्रश्न जोड़ें (Add Question)
            </h3>
            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  प्रश्न टेक्स्ट *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQ.question}
                  onChange={(e) =>
                    setNewQ((prev) => ({ ...prev, question: e.target.value }))
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="उदा. MS Excel में सक्रिय सेल का पता कहाँ दिखाई देता है?"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx}>
                    <label className="block font-bold text-slate-700 mb-0.5">
                      विकल्प {String.fromCharCode(65 + idx)} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newQ.options?.[idx] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewQ((prev) => {
                          const opts = [...(prev.options || ['', '', '', ''])];
                          opts[idx] = val;
                          return { ...prev, options: opts };
                        });
                      }}
                      className="w-full p-1.5 border border-slate-200 rounded"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  सही उत्तर (Exact Answer Text) *
                </label>
                <input
                  type="text"
                  required
                  value={newQ.answer}
                  onChange={(e) =>
                    setNewQ((prev) => ({ ...prev, answer: e.target.value }))
                  }
                  className="w-full p-1.5 border border-slate-200 rounded"
                  placeholder="दिए गए विकल्पों में से किसी एक का पूरा टेक्स्ट"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  स्पष्टीकरण (Explanation)
                </label>
                <input
                  type="text"
                  value={newQ.explanation}
                  onChange={(e) =>
                    setNewQ((prev) => ({ ...prev, explanation: e.target.value }))
                  }
                  className="w-full p-1.5 border border-slate-200 rounded"
                  placeholder="संक्षिप्त कारण कि यह उत्तर क्यों सही है"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-slate-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white font-bold rounded"
                >
                  प्रश्न सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isEditing = editingId === q.id;

          if (isEditing && editForm) {
            return (
              <div
                key={q.id}
                className="bg-white p-5 rounded-xl border-2 border-indigo-500 shadow-md space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700">
                    संपादित करें - प्रश्न {idx + 1}
                  </span>
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white font-bold rounded"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>सेव करें</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={editForm.question}
                  onChange={(e) =>
                    setEditForm({ ...editForm, question: e.target.value })
                  }
                  className="w-full p-2 border border-slate-300 rounded font-bold"
                />

                <div className="grid grid-cols-2 gap-2">
                  {editForm.options.map((opt, oIdx) => (
                    <input
                      key={oIdx}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...editForm.options];
                        newOpts[oIdx] = e.target.value;
                        setEditForm({ ...editForm, options: newOpts });
                      }}
                      className="p-1.5 border border-slate-300 rounded"
                    />
                  ))}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">
                    सही उत्तर:
                  </label>
                  <input
                    type="text"
                    value={editForm.answer}
                    onChange={(e) =>
                      setEditForm({ ...editForm, answer: e.target.value })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={q.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(q)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-50 cursor-pointer"
                    title="संपादित करें"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50 cursor-pointer"
                    title="हटाएँ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = opt === q.answer;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-50/60 font-semibold text-emerald-950'
                          : 'border-slate-200 bg-slate-50/40 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[11px] text-slate-500">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">
                          सही उत्तर
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <div className="text-[11px] text-slate-500 pt-1 flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700">व्याख्या:</strong> {q.explanation}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
