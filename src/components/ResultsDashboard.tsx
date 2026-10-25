import React, { useState } from 'react';
import {
  Award,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Users,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { TestSubmission } from '../types/test';
import { StudentCertificate } from './StudentCertificate';

interface ResultsDashboardProps {
  submissions: TestSubmission[];
  onClearSubmissions: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  submissions,
  onClearSubmissions,
}) => {
  const [selectedForCert, setSelectedForCert] = useState<TestSubmission | null>(null);

  const totalTests = submissions.length;
  const passedCount = submissions.filter((s) => s.passed).length;
  const passRate = totalTests > 0 ? Math.round((passedCount / totalTests) * 100) : 0;
  const avgPercentage =
    totalTests > 0
      ? Math.round(
          submissions.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests
        )
      : 0;

  const handleExportResultsCsv = () => {
    if (submissions.length === 0) return;

    const header = [
      'क्रमांक (S.No)',
      'विद्यार्थी का नाम (Name)',
      'रोल नंबर (Roll No)',
      'कोर्स (Course)',
      'विषय (Subject)',
      'बैच का समय (Batch)',
      'प्राप्तांक (Score)',
      'पूर्णांक (Max Score)',
      'प्रतिशत (Percentage)',
      'स्थिति (Result)',
      'समय व्यतीत (Time Spent Sec)',
      'सबमिट समय (Submitted At)'
    ];

    const rows = submissions.map((s, idx) => [
      idx + 1,
      `"${s.student.fullName.replace(/"/g, '""')}"`,
      `"${s.student.rollNumber.replace(/"/g, '""')}"`,
      `"${s.course.replace(/"/g, '""')}"`,
      `"${s.subject.replace(/"/g, '""')}"`,
      `"${s.student.batchTime.replace(/"/g, '""')}"`,
      s.score,
      s.maxScore,
      `${s.percentage}%`,
      s.passed ? 'PASS' : 'FAIL',
      s.timeSpentSeconds,
      `"${new Date(s.submittedAt).toLocaleString('hi-IN')}"`
    ]);

    const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NSGalaxy_Student_Results_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Certificate Viewer Modal */}
      {selectedForCert && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 no-print">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                प्रमाण-पत्र पूर्वावलोकन (Certificate Preview)
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
                  onClick={() => setSelectedForCert(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  बंद करें (Close)
                </button>
              </div>
            </div>

            <StudentCertificate
              institute="NS Galaxy Computer Institute"
              testType={selectedForCert.testType}
              studentName={selectedForCert.student.fullName}
              rollNumber={selectedForCert.student.rollNumber}
              course={selectedForCert.course}
              batchTime={selectedForCert.student.batchTime}
              subject={selectedForCert.subject}
              score={selectedForCert.score}
              maxScore={selectedForCert.maxScore}
              percentage={selectedForCert.percentage}
              passed={selectedForCert.passed}
              date={new Date(selectedForCert.submittedAt).toLocaleDateString('hi-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          </div>
        </div>
      )}

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">कुल परीक्षाएँ (Tests Given)</span>
            <span className="text-xl font-bold text-slate-900">{totalTests} छात्र</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">औसत प्राप्तांक (Average Score)</span>
            <span className="text-xl font-bold text-emerald-700">{avgPercentage}%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">सफलता दर (Pass Rate)</span>
            <span className="text-xl font-bold text-purple-700">{passRate}% उत्तीर्ण</span>
          </div>
        </div>
      </div>

      {/* Results Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              विद्यार्थी परिणाम तालिका (Student Results Sheet)
            </h3>
            <p className="text-xs text-slate-500">
              गूगल शीट्स के समान परिणाम रिकॉर्ड जिसे सीधे Excel / CSV में डाउनलोड किया जा सकता है।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportResultsCsv}
              disabled={submissions.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg disabled:opacity-40 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Result Sheet CSV डाउनलोड</span>
            </button>

            {submissions.length > 0 && (
              <button
                onClick={onClearSubmissions}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                title="सभी रिकॉर्ड साफ़ करें"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            अभी तक किसी विद्यार्थी ने टेस्ट सबमिट नहीं किया है।
            <p className="mt-1 text-slate-500">
              'ऑनलाइन टेस्ट दें' टैब से टेस्ट पूरा करने पर उसका रिकॉर्ड व प्रमाण-पत्र यहाँ सुरक्षित हो जाएगा।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">क्र.</th>
                  <th className="py-2.5 px-3">विद्यार्थी का नाम</th>
                  <th className="py-2.5 px-3">रोल नंबर</th>
                  <th className="py-2.5 px-3">कोर्स / विषय</th>
                  <th className="py-2.5 px-3">प्राप्तांक / कुल</th>
                  <th className="py-2.5 px-3">प्रतिशत</th>
                  <th className="py-2.5 px-3">स्थिति</th>
                  <th className="py-2.5 px-3">सबमिट समय</th>
                  <th className="py-2.5 px-3 text-right">सर्टिफिकेट</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{s.student.fullName}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{s.student.rollNumber}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{s.course}</span>
                      <span className="text-[11px] text-slate-500 block">{s.subject}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {s.score} / {s.maxScore}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{s.percentage}%</td>
                    <td className="py-3 px-3">
                      {s.passed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          <XCircle className="w-3 h-3" />
                          FAIL
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {new Date(s.submittedAt).toLocaleTimeString('hi-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedForCert(s)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors cursor-pointer"
                      >
                        सर्टिफिकेट
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
