import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Table,
  Sparkles,
  Info
} from 'lucide-react';
import { TestConfig, Question } from '../types/test';

interface AppsScriptExporterProps {
  config: TestConfig;
  questions: Question[];
}

export const AppsScriptExporter: React.FC<AppsScriptExporterProps> = ({
  config,
  questions,
}) => {
  const [copied, setCopied] = useState(false);
  const [embedQuestions, setEmbedQuestions] = useState(false);

  // Generate code dynamically on client or fetch
  const generateScriptCode = () => {
    if (embedQuestions && questions.length > 0) {
      return `/*
 * =========================================================================
 * ${config.institute}
 * ${config.testType} - Instant Google Forms & Sheets Generator
 * Course: ${config.course} | Subject: ${config.subject}
 * Questions: ${questions.length} | Total Marks: ${questions.length * config.marksPerQuestion}
 * =========================================================================
 * कैसे चलाएं:
 * 1. https://script.google.com/ पर जाएं और New Project बनाएं।
 * 2. इस पूरे कोड को Editor में Paste करें।
 * 3. 'createNSTestWithEmbedQuestions' सेलेक्ट करें और Run दबाएं।
 * 4. Google Drive में Forms और Google Sheet स्वतः तैयार हो जाएंगे!
 * =========================================================================
 */

const TEST_META = {
  institute: ${JSON.stringify(config.institute)},
  testType: ${JSON.stringify(config.testType)},
  course: ${JSON.stringify(config.course)},
  subject: ${JSON.stringify(config.subject)},
  topic: ${JSON.stringify(config.topic)},
  marksPerQuestion: ${config.marksPerQuestion},
  courses: [
    'Basic Computer', 'CCC', 'DCA', 'ADCA',
    'Tally Prime', 'MS Office', 'Photoshop',
    'Graphic Designing', 'Video Editing',
    'Computer Hardware', 'Python', 'Web Development',
    'AI Tools'
  ]
};

const PRE_GENERATED_QUESTIONS = ${JSON.stringify(questions, null, 2)};

function createNSTestWithEmbedQuestions() {
  const title = [
    TEST_META.institute,
    TEST_META.testType,
    TEST_META.course,
    TEST_META.subject
  ].join(' - ');

  // 1. Google Form Quiz निर्माण
  const form = FormApp.create(title);

  form.setDescription(
    TEST_META.institute + '\\n' +
    TEST_META.testType + '\\n' +
    'कोर्स: ' + TEST_META.course + '\\n' +
    'विषय: ' + TEST_META.subject + '\\n' +
    'टॉपिक: ' + TEST_META.topic + '\\n' +
    'प्रश्न: ' + PRE_GENERATED_QUESTIONS.length + '\\n' +
    'कुल अंक: ' + (PRE_GENERATED_QUESTIONS.length * TEST_META.marksPerQuestion) + '\\n\\n' +
    'सभी प्रश्नों को ध्यान से पढ़ें और उत्तर जमा करें।'
  );

  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(true);
  form.setCollectEmail(false);
  form.setConfirmationMessage('आपका टेस्ट जमा हो गया है। अपने परिणाम के लिए संस्थान के निर्देशों का पालन करें।');

  // विद्यार्थी की जानकारी
  form.addSectionHeaderItem().setTitle('विद्यार्थी की जानकारी');
  form.addTextItem().setTitle('विद्यार्थी का पूरा नाम').setRequired(true);
  form.addTextItem().setTitle('रोल नंबर / विद्यार्थी ID').setRequired(true);
  form.addListItem().setTitle('कोर्स').setChoiceValues(TEST_META.courses).setRequired(true);
  form.addTextItem().setTitle('बैच / क्लास').setRequired(true);

  // AI से बने प्रश्न
  form.addSectionHeaderItem().setTitle('ऑनलाइन टेस्ट के प्रश्न');

  PRE_GENERATED_QUESTIONS.forEach(function(q, i) {
    const item = form.addMultipleChoiceItem();
    item.setTitle((i + 1) + '. ' + q.question);
    item.setRequired(true);
    item.setPoints(TEST_META.marksPerQuestion);

    item.setChoices(
      q.options.map(function(opt) {
        return item.createChoice(opt, opt === q.answer);
      })
    );
  });

  // रिजल्ट के लिए Google Sheet
  const spreadsheet = SpreadsheetApp.create(title + ' - Student Results');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  // AI Question Bank टैब में प्रश्न व उत्तर सुरक्षित करें
  const bank = spreadsheet.insertSheet('AI Question Bank');
  bank.appendRow(['क्रमांक', 'प्रश्न', 'विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D', 'सही उत्तर', 'अंक', 'स्पष्टीकरण']);

  PRE_GENERATED_QUESTIONS.forEach(function(q, i) {
    bank.appendRow([
      i + 1,
      q.question,
      q.options[0] || '',
      q.options[1] || '',
      q.options[2] || '',
      q.options[3] || '',
      q.answer,
      TEST_META.marksPerQuestion,
      q.explanation || ''
    ]);
  });

  bank.setFrozenRows(1);
  bank.autoResizeColumns(1, 9);

  PropertiesService.getScriptProperties().setProperty('LAST_TEST_FORM_ID', form.getId());
  PropertiesService.getScriptProperties().setProperty('LAST_TEST_SHEET_ID', spreadsheet.getId());

  Logger.log('=============================================');
  Logger.log('TEST CREATED SUCCESSFULLY!');
  Logger.log('EDIT FORM: ' + form.getEditUrl());
  Logger.log('STUDENT TEST LINK: ' + form.getPublishedUrl());
  Logger.log('RESULT SHEET: ' + spreadsheet.getUrl());
  Logger.log('QUESTION BANK: ' + bank.getName());
  Logger.log('=============================================');
}
`;
    }

    // Default Dynamic Script matching user's original script
    return `/*
 NS Galaxy Computer Institute
 AI Weekly & Monthly Online Test Generator
 Google Apps Script + Gemini API + Google Forms + Sheets

 पहली बार:
 1. Script Properties में GEMINI_API_KEY सेट करें।
 2. नीचे TEST_CONFIG बदलें।
 3. createNSTest() चलाएँ।
*/

const TEST_CONFIG = {
  institute: ${JSON.stringify(config.institute)},

  // 'Weekly Test' या 'Monthly Test'
  testType: ${JSON.stringify(config.testType)},

  course: ${JSON.stringify(config.course)},
  subject: ${JSON.stringify(config.subject)},
  topic: ${JSON.stringify(config.topic)},

  questionCount: ${config.questionCount},
  marksPerQuestion: ${config.marksPerQuestion},
  difficulty: ${JSON.stringify(config.difficulty)},
  language: ${JSON.stringify(config.language)},

  // API में उपलब्ध Gemini मॉडल का नाम
  model: ${JSON.stringify(config.model)},

  courses: [
    'Basic Computer', 'CCC', 'DCA', 'ADCA',
    'Tally Prime', 'MS Office', 'Photoshop',
    'Graphic Designing', 'Video Editing',
    'Computer Hardware', 'Python', 'Web Development',
    'AI Tools'
  ]
};

/**
 * सुरक्षित API key यहाँ से पढ़ी जाएगी।
 * API key को कोड में न लिखें।
 */
function getGeminiKey_() {
  const key = PropertiesService
    .getScriptProperties()
    .getProperty('GEMINI_API_KEY');

  if (!key) {
    throw new Error(
      'GEMINI_API_KEY सेट नहीं है। ' +
      'Project Settings > Script Properties में इसे जोड़ें।'
    );
  }

  return key;
}

/**
 * मुख्य फंक्शन:
 * AI प्रश्न बनाएगा, Google Form और Result Sheet बनाएगा।
 */
function createNSTest() {
  validateConfig_();

  const questions = generateQuestionsWithAI_();

  validateQuestions_(questions);

  const title = [
    TEST_CONFIG.institute,
    TEST_CONFIG.testType,
    TEST_CONFIG.course,
    TEST_CONFIG.subject
  ].join(' - ');

  const form = FormApp.create(title);

  form.setDescription(
    TEST_CONFIG.institute + '\\n' +
    TEST_CONFIG.testType + '\\n' +
    'कोर्स: ' + TEST_CONFIG.course + '\\n' +
    'विषय: ' + TEST_CONFIG.subject + '\\n' +
    'टॉपिक: ' + TEST_CONFIG.topic + '\\n' +
    'प्रश्न: ' + questions.length + '\\n' +
    'कुल अंक: ' +
    (questions.length * TEST_CONFIG.marksPerQuestion) + '\\n\\n' +
    'सभी प्रश्नों को ध्यान से पढ़ें और उत्तर जमा करें।'
  );

  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(true);
  form.setCollectEmail(false);

  form.setConfirmationMessage(
    'आपका टेस्ट जमा हो गया है। ' +
    'अपने परिणाम के लिए संस्थान के निर्देशों का पालन करें।'
  );

  // विद्यार्थी की जानकारी
  form.addSectionHeaderItem()
    .setTitle('विद्यार्थी की जानकारी');

  form.addTextItem()
    .setTitle('विद्यार्थी का पूरा नाम')
    .setRequired(true);

  form.addTextItem()
    .setTitle('रोल नंबर / विद्यार्थी ID')
    .setRequired(true);

  form.addListItem()
    .setTitle('कोर्स')
    .setChoiceValues(TEST_CONFIG.courses)
    .setRequired(true);

  form.addTextItem()
    .setTitle('बैच / क्लास')
    .setRequired(true);

  // AI से बने प्रश्न
  form.addSectionHeaderItem()
    .setTitle('ऑनलाइन टेस्ट के प्रश्न');

  questions.forEach(function(q, i) {
    const item = form.addMultipleChoiceItem();

    item.setTitle((i + 1) + '. ' + q.question);
    item.setRequired(true);
    item.setPoints(TEST_CONFIG.marksPerQuestion);

    item.setChoices(
      q.options.map(function(option) {
        return item.createChoice(
          option,
          option === q.answer
        );
      })
    );
  });

  // रिजल्ट के लिए Google Sheet
  const spreadsheet = SpreadsheetApp.create(
    title + ' - Student Results'
  );

  form.setDestination(
    FormApp.DestinationType.SPREADSHEET,
    spreadsheet.getId()
  );

  // AI Question Bank टैब में प्रश्न व उत्तर सुरक्षित करें
  const bank = spreadsheet.insertSheet('AI Question Bank');

  bank.appendRow([
    'क्रमांक',
    'प्रश्न',
    'विकल्प A',
    'विकल्प B',
    'विकल्प C',
    'विकल्प D',
    'सही उत्तर',
    'अंक'
  ]);

  questions.forEach(function(q, i) {
    bank.appendRow([
      i + 1,
      q.question,
      q.options[0],
      q.options[1],
      q.options[2],
      q.options[3],
      q.answer,
      TEST_CONFIG.marksPerQuestion
    ]);
  });

  bank.setFrozenRows(1);
  bank.autoResizeColumns(1, 8);

  // लिंक और रिकॉर्ड
  PropertiesService.getScriptProperties()
    .setProperty('LAST_TEST_FORM_ID', form.getId());

  PropertiesService.getScriptProperties()
    .setProperty('LAST_TEST_SHEET_ID', spreadsheet.getId());

  Logger.log('EDIT FORM: ' + form.getEditUrl());
  Logger.log('STUDENT TEST LINK: ' + form.getPublishedUrl());
  Logger.log('RESULT SHEET: ' + spreadsheet.getUrl());
  Logger.log('QUESTION BANK: ' + bank.getName());
}

/**
 * Gemini से MCQ प्रश्न बनवाना।
 */
function generateQuestionsWithAI_() {
  const key = getGeminiKey_();

  const prompt = [
    'आप ' + TEST_CONFIG.institute + ' के अनुभवी कंप्यूटर शिक्षक हैं।',
    'हिंदी में परीक्षा के लिए सटीक MCQ प्रश्न बनाएँ।',
    'कोर्स: ' + TEST_CONFIG.course,
    'विषय: ' + TEST_CONFIG.subject,
    'टॉपिक: ' + TEST_CONFIG.topic,
    'टेस्ट प्रकार: ' + TEST_CONFIG.testType,
    'कठिनाई: ' + TEST_CONFIG.difficulty,
    'प्रश्न संख्या: ' + TEST_CONFIG.questionCount,
    'हर प्रश्न के ठीक 4 अलग विकल्प होने चाहिए।',
    'हर प्रश्न का केवल एक सही उत्तर होना चाहिए।',
    'उत्तर तथ्यात्मक, स्पष्ट और विषय से संबंधित हों।',
    'प्रश्न दोहराएँ नहीं।',
    'सभी प्रश्न और विकल्प ' + TEST_CONFIG.language + ' में हों।',
    'उत्तर में केवल वैध JSON दें, Markdown या अतिरिक्त टिप्पणी नहीं।',
    'JSON संरचना:',
    '{"questions":[',
    '{"question":"प्रश्न","options":["A","B","C","D"],"answer":"A"}',
    ']}',
    'answer में सही विकल्प का पूरा टेक्स्ट हूबहू होना चाहिए।'
  ].join('\\n');

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(TEST_CONFIG.model) +
    ':generateContent';

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3
    }
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-goog-api-key': key
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const status = response.getResponseCode();
  const body = response.getContentText();

  if (status < 200 || status >= 300) {
    throw new Error(
      'Gemini API Error (' + status + '): ' + body
    );
  }

  const result = JSON.parse(body);
  const text = result.candidates &&
    result.candidates[0] &&
    result.candidates[0].content &&
    result.candidates[0].content.parts &&
    result.candidates[0].content.parts[0] &&
    result.candidates[0].content.parts[0].text;

  if (!text) {
    throw new Error(
      'AI ने प्रश्न नहीं लौटाए। API response की जाँच करें।'
    );
  }

  const parsed = JSON.parse(text);

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error('AI का JSON प्रारूप सही नहीं है।');
  }

  return parsed.questions;
}

/**
 * गलत या अधूरे प्रश्नों को रोकें।
 */
function validateQuestions_(questions) {
  if (questions.length !== TEST_CONFIG.questionCount) {
    throw new Error(
      'AI ने ' + questions.length + ' प्रश्न दिए, जबकि ' +
      TEST_CONFIG.questionCount + ' अपेक्षित थे। दोबारा प्रयास करें।'
    );
  }

  questions.forEach(function(q, i) {
    if (
      !q.question ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      q.options.some(function(x) {
        return typeof x !== 'string' || !x.trim();
      }) ||
      new Set(q.options).size !== 4 ||
      !q.options.includes(q.answer)
    ) {
      throw new Error(
        'प्रश्न ' + (i + 1) +
        ' का प्रारूप गलत है। टेस्ट नहीं बनाया गया।'
      );
    }
  });
}

function validateConfig_() {
  if (
    !['Weekly Test', 'Monthly Test'].includes(
      TEST_CONFIG.testType
    )
  ) {
    throw new Error(
      "testType में 'Weekly Test' या 'Monthly Test' लिखें।"
    );
  }

  if (
    !Number.isInteger(TEST_CONFIG.questionCount) ||
    TEST_CONFIG.questionCount < 1 ||
    TEST_CONFIG.questionCount > 50
  ) {
    throw new Error(
      'questionCount 1 से 50 के बीच पूर्ण संख्या होनी चाहिए।'
    );
  }

  if (
    !Number.isFinite(TEST_CONFIG.marksPerQuestion) ||
    TEST_CONFIG.marksPerQuestion <= 0
  ) {
    throw new Error('प्रति प्रश्न अंक शून्य से अधिक रखें।');
  }
}
`;
  };

  const scriptCode = generateScriptCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([scriptCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NSGalaxy_${config.testType.replace(/\s+/g, '')}_${config.course.replace(/\s+/g, '')}.gs`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    if (!questions || questions.length === 0) return;
    const header = ['क्रमांक', 'प्रश्न', 'विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D', 'सही उत्तर', 'अंक', 'स्पष्टीकरण'];
    const rows = questions.map((q, idx) => [
      idx + 1,
      `"${q.question.replace(/"/g, '""')}"`,
      `"${(q.options[0] || '').replace(/"/g, '""')}"`,
      `"${(q.options[1] || '').replace(/"/g, '""')}"`,
      `"${(q.options[2] || '').replace(/"/g, '""')}"`,
      `"${(q.options[3] || '').replace(/"/g, '""')}"`,
      `"${q.answer.replace(/"/g, '""')}"`,
      config.marksPerQuestion,
      `"${(q.explanation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuestionBank_${config.course}_${config.testType}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase">
                Google Apps Script
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Google Forms व Google Sheets ऑटोमेशन कोड
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              इस कोड को Google Apps Script में चलाकर 1 क्लिक में Google Form Quiz और Result Spreadsheet बना सकते हैं।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कोड कॉपी हो गया!' : 'Copy Code (कोड कॉपी करें)'}</span>
            </button>

            <button
              onClick={handleDownloadScript}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.gs फ़ाइल डाउनलोड</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              disabled={questions.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg disabled:opacity-50 cursor-pointer"
            >
              <Table className="w-3.5 h-3.5 text-emerald-600" />
              <span>Question Bank CSV</span>
            </button>
          </div>
        </div>

        {/* Script Mode Options */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-bold text-slate-700">स्क्रिप्ट मोड:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="scriptMode"
                checked={!embedQuestions}
                onChange={() => setEmbedQuestions(false)}
                className="text-indigo-600"
              />
              <span className="text-slate-800">
                डायनामिक AI मोड (Gemini API Call ऑन रन)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="scriptMode"
                checked={embedQuestions}
                onChange={() => setEmbedQuestions(true)}
                className="text-indigo-600"
              />
              <span className="text-slate-800 font-medium">
                वर्तमान जनरेट किए गए प्रश्न एम्बेड करें ({questions.length} प्रश्न - बिना API key तुरंत 2 सेकंड में तैयार)
              </span>
            </label>
          </div>

          <a
            href="https://script.google.com/home/start"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>script.google.com खोलें</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Step by Step Guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Google Forms व Sheets में चलाने की 4 आसान चरण (How to Run):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs mb-2">
              1
            </div>
            <p className="font-bold text-slate-800">Apps Script खोलें</p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              ब्राउज़र में <span className="font-mono text-indigo-600">script.google.com</span> खोलें और 'New Project' पर क्लिक करें।
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs mb-2">
              2
            </div>
            <p className="font-bold text-slate-800">कोड पेस्ट करें</p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              ऊपर 'Copy Code' बटन दबाएँ और Apps Script के <span className="font-mono">Code.gs</span> में पेस्ट कर दें।
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs mb-2">
              3
            </div>
            <p className="font-bold text-slate-800">API Key (यदि डायनामिक हो)</p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Project Settings {'>'} Script Properties में जाकर <span className="font-mono">GEMINI_API_KEY</span> जोड़ें। (एम्बेडेड मोड में आवश्यकता नहीं)
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs mb-2">
              4
            </div>
            <p className="font-bold text-slate-800">Run दबाएँ और लिंक पाएँ</p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              ऊपर रन बटन दबाएँ। Execution log में छात्र टेस्ट लिंक और Google Sheet का लिंक तुरंत मिल जाएगा!
            </p>
          </div>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-md">
        <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800">
          <div className="flex items-center gap-2 font-mono">
            <FileCode2 className="w-4 h-4 text-amber-400" />
            <span>Code.gs (Google Apps Script)</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px] leading-relaxed selection:bg-indigo-600">
          <code>{scriptCode}</code>
        </pre>
      </div>
    </div>
  );
};
