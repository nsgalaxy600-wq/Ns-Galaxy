import React from 'react';
import { Award, CheckCircle, ShieldCheck } from 'lucide-react';

interface StudentCertificateProps {
  institute: string;
  testType: string;
  studentName: string;
  rollNumber: string;
  course: string;
  batchTime: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  date: string;
}

export const StudentCertificate: React.FC<StudentCertificateProps> = ({
  institute,
  testType,
  studentName,
  rollNumber,
  course,
  batchTime,
  subject,
  score,
  maxScore,
  percentage,
  passed,
  date,
}) => {
  return (
    <div className="bg-white border-8 border-double border-indigo-950 p-8 sm:p-12 rounded-lg relative overflow-hidden shadow-md max-w-3xl mx-auto my-4 text-center print:border-4 print:p-6 print:shadow-none">
      {/* Corner Decorative Ornaments */}
      <div className="absolute top-2 left-2 text-indigo-900 text-xs font-serif opacity-40">✦ ✦ ✦</div>
      <div className="absolute top-2 right-2 text-indigo-900 text-xs font-serif opacity-40">✦ ✦ ✦</div>
      <div className="absolute bottom-2 left-2 text-indigo-900 text-xs font-serif opacity-40">✦ ✦ ✦</div>
      <div className="absolute bottom-2 right-2 text-indigo-900 text-xs font-serif opacity-40">✦ ✦ ✦</div>

      {/* Header */}
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 border-2 border-indigo-600 text-indigo-800 mb-2">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-slate-900 uppercase font-serif">
          {institute}
        </h1>
        <p className="text-xs font-bold text-indigo-800 tracking-widest uppercase mt-0.5">
          ISO Certified Computer Education & Skill Training Center
        </p>
        <div className="w-32 h-0.5 bg-indigo-600 mx-auto mt-2"></div>
      </div>

      {/* Certificate Title */}
      <div className="my-6">
        <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-1">
          आधिकारिक परीक्षा प्रमाण-पत्र / अंक-तालिका (CERTIFICATE OF MERIT & MARKSHEET)
        </span>
        <h2 className="text-base sm:text-lg font-bold text-slate-800 italic">
          यह प्रमाणित किया जाता है कि (This is to certify that)
        </h2>
      </div>

      {/* Student Details */}
      <div className="my-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 underline decoration-indigo-300 underline-offset-8">
          {studentName}
        </h3>
        <p className="text-xs text-slate-600 mt-3 font-medium">
          रोल नंबर (Roll No): <span className="font-bold text-slate-900">{rollNumber}</span> · बैच: <span className="font-bold text-slate-900">{batchTime}</span>
        </p>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed my-5">
        ने संस्थान द्वारा आयोजित <span className="font-bold text-slate-900">{testType}</span> के अंतर्गत पाठ्यक्रम{' '}
        <span className="font-bold text-indigo-900">{course}</span> (विषय: <span className="font-bold text-slate-900">{subject}</span>)
        की ऑनलाइन कंप्यूटर परीक्षा में सफलता प्राप्त की है।
      </p>

      {/* Score Summary Box */}
      <div className="max-w-md mx-auto my-6 p-4 rounded-xl border border-slate-200 bg-slate-50/80 grid grid-cols-3 divide-x divide-slate-200 text-center">
        <div>
          <span className="text-[11px] text-slate-500 block">पूर्णांक (Total)</span>
          <span className="text-base font-extrabold text-slate-900">{maxScore}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block">प्राप्तांक (Scored)</span>
          <span className="text-base font-extrabold text-indigo-700">{score}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-500 block">प्रतिशत (Score %)</span>
          <span className="text-base font-extrabold text-emerald-700">{percentage}%</span>
        </div>
      </div>

      {/* Result Status Stamp */}
      <div className="my-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border-emerald-300">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>स्थिति: {passed ? 'सफलतापूर्वक उत्तीर्ण (PASS)' : 'उत्तीर्ण (COMPLETED)'}</span>
      </div>

      {/* Signatures */}
      <div className="mt-10 pt-6 border-t border-slate-200 flex items-end justify-between px-4 sm:px-12 text-xs">
        <div className="text-left">
          <p className="text-slate-500">जारी तिथि (Date):</p>
          <p className="font-bold text-slate-900">{date}</p>
        </div>

        {/* Center Seal */}
        <div className="hidden sm:flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-700 flex items-center justify-center text-[10px] font-bold text-indigo-800 uppercase text-center p-1 leading-tight">
            NS Galaxy Seal
          </div>
        </div>

        <div className="text-right">
          <div className="w-32 border-b border-slate-800 mb-1 ml-auto"></div>
          <p className="font-bold text-slate-900">परीक्षा नियंत्रक / निदेशक</p>
          <p className="text-[10px] text-slate-500">{institute}</p>
        </div>
      </div>
    </div>
  );
};
