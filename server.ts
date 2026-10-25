import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GenerateTestRequest {
  institute?: string;
  testType: string;
  course: string;
  subject: string;
  topic: string;
  questionCount: number;
  marksPerQuestion: number;
  difficulty: string;
  language: string;
  model?: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

// Default fallback syllabus topics per course for instant quick-fill
export const COURSE_DEFAULTS: Record<string, { subject: string; topics: string[] }> = {
  'Basic Computer': {
    subject: 'Computer Fundamentals',
    topics: [
      'Computer Memory, MS Word और Input/Output Devices',
      'Introduction to Windows, Files & Folders, Paint, Notepad',
      'Keyboard Shortcuts, Mouse actions, Operating System Concepts',
      'Internet Basics, Email creation, Web Browsing & Security'
    ]
  },
  'CCC': {
    subject: 'Course on Computer Concepts (NIELIT)',
    topics: [
      'LibreOffice Writer, Calc, Impress & Operating System',
      'Digital Financial Services, UPI, AEPS, Net Banking, Cyber Security',
      'Computer Networks, LAN, WAN, IP Address & Web Browsers',
      'E-Governance Services, FutureSkills & Cyber Ethics'
    ]
  },
  'DCA': {
    subject: 'Diploma in Computer Applications',
    topics: [
      'MS Office Suite (Word, Excel, PowerPoint, Access)',
      'Database Management Systems (DBMS) Basics & SQL Concepts',
      'Financial Accounting with Tally, Vouchers & Ledgers',
      'Desktop Publishing (DTP), PageMaker & CorelDraw Fundamentals'
    ]
  },
  'ADCA': {
    subject: 'Advance Diploma in Computer Applications',
    topics: [
      'Advanced Excel (VLOOKUP, Pivot, Macros) & MS Access RDBMS',
      'Tally Prime with GST, TDS, Payroll & Balance Sheet',
      'HTML5, CSS3, JavaScript & Web Page Designing',
      'C & C++ Programming Concepts, Data Types, Loops & Functions'
    ]
  },
  'Tally Prime': {
    subject: 'Computerized Accounting & Taxation',
    topics: [
      'Company Creation, Group, Ledger & Voucher Entries',
      'GST Accounting (CGST, SGST, IGST), E-Way Bill & Invoicing',
      'Inventory Management, Stock Items, Units of Measure & Godowns',
      'Bank Reconciliation, Financial Reports, P&L & Balance Sheet'
    ]
  },
  'MS Office': {
    subject: 'Office Productivity Tools',
    topics: [
      'MS Word: Mail Merge, Tables, Formatting, Header & Footer',
      'MS Excel: Formulas (IF, SUMIFS, COUNTIF, VLOOKUP) & Charts',
      'MS PowerPoint: Slide Master, Animation, Transitions, Custom Show',
      'MS Outlook & Excel Data Sorting, Filtering & Validation'
    ]
  },
  'Photoshop': {
    subject: 'Digital Image Editing & Graphic Design',
    topics: [
      'Selection Tools, Pen Tool, Crop, Move & Healing Brush',
      'Layers, Layer Masks, Clipping Masks & Blending Modes',
      'Color Correction, Curves, Levels, Hue/Saturation & Filters',
      'Banner Design, Passport Photo Printing & Photo Retouching'
    ]
  },
  'Graphic Designing': {
    subject: 'Visual Design & Commercial Art',
    topics: [
      'CorelDraw Vector Graphics, Logo Design & Visiting Cards',
      'Typography, Color Theory, Poster Design & Social Media Posts',
      'Illustrator Vector Tools, Pen Tool, Pathfinder & Gradients',
      'Printing Techniques, CMYK vs RGB, Resolution & Export Formats'
    ]
  },
  'Video Editing': {
    subject: 'Digital Video Post-Production',
    topics: [
      'Timeline Editing, Cutting, Trimming & Transitions',
      'Audio Syncing, Noise Reduction, Background Music & Sound Effects',
      'Color Grading, LUTs, Keyframing & Green Screen (Chroma Key)',
      'Export Settings, Aspect Ratios for YouTube, Instagram Reels & Bitrates'
    ]
  },
  'Computer Hardware': {
    subject: 'Hardware & Networking Essentials',
    topics: [
      'Motherboard, CPU, RAM, SMPS, BIOS Settings & PC Assembling',
      'Storage Devices (HDD, SSD, NVMe), Partitions & Windows Installation',
      'Networking: LAN Cables, RJ45 Crimping, Routers & IP Configuration',
      'Hardware Troubleshooting, Thermal Paste, Beep Codes & Driver Setup'
    ]
  },
  'Python': {
    subject: 'Python Programming',
    topics: [
      'Python Syntax, Variables, Data Types, If-Else & Loops',
      'Functions, Modules, Lists, Tuples, Dictionaries & Sets',
      'Object Oriented Programming (OOP), Classes & Inheritance',
      'File Handling, Exception Handling & Basic Libraries'
    ]
  },
  'Web Development': {
    subject: 'Frontend Web Development',
    topics: [
      'HTML5 Elements, Forms, Semantic Tags & Tables',
      'CSS3 Flexbox, Grid, Responsive Design & Media Queries',
      'JavaScript DOM Manipulation, Events & Functions',
      'Git, GitHub Basics & Website Hosting'
    ]
  },
  'AI Tools': {
    subject: 'Artificial Intelligence Tools & Prompt Engineering',
    topics: [
      'ChatGPT, Gemini, Claude: Effective Prompt Engineering Techniques',
      'Canva AI, Midjourney & AI Image Generation Tools',
      'AI for Office Productivity: Summarization, Excel Formulas, Emails',
      'AI Ethics, Limitations, Verification & Future AI Workflow'
    ]
  }
};

app.post('/api/generate-questions', async (req: Request, res: Response) => {
  try {
    const {
      institute = 'NS Galaxy Computer Institute',
      testType = 'Weekly Test',
      course = 'Basic Computer',
      subject = 'Computer Fundamentals',
      topic = 'Computer Memory, MS Word और Input/Output Devices',
      questionCount = 20,
      marksPerQuestion = 1,
      difficulty = 'आसान और मध्यम',
      language = 'Hindi',
      model = 'gemini-2.5-flash',
    }: GenerateTestRequest = req.body;

    const count = Math.min(Math.max(Number(questionCount) || 10, 1), 50);

    const prompt = `
आप ${institute} के वरिष्ठ व अनुभवी कंप्यूटर शिक्षक और परीक्षा नियंत्रक हैं।
आपको संस्थान के छात्रों के लिए ${testType} का उच्च गुणवत्ता वाला MCQ प्रश्न पत्र तैयार करना है।

परीक्षा विवरण:
- संस्थान: ${institute}
- कोर्स: ${course}
- विषय: ${subject}
- मुख्य टॉपिक: ${topic}
- टेस्ट प्रकार: ${testType}
- कठिनाई स्तर: ${difficulty}
- कुल प्रश्न संख्या: ${count}
- प्रति प्रश्न अंक: ${marksPerQuestion}
- भाषा: ${language}

दिशानिर्देश:
1. कुल ठीक ${count} बहुविकल्पीय (MCQ) प्रश्न तैयार करें।
2. प्रत्येक प्रश्न के ठीक 4 अलग-अलग और प्रामाणिक विकल्प (options) होने चाहिए।
3. 'answer' फ़ील्ड में सही विकल्प का पूरा टेक्स्ट हूबहू (exact character match) होना चाहिए, जो options की सूची में मौजूद हो।
4. प्रत्येक प्रश्न का एक संक्षिप्त और ज्ञानवर्धक स्पष्टीकरण (explanation) भी लिखें ताकि छात्र समझ सकें कि यह उत्तर क्यों सही है।
5. प्रश्न वास्तविक कंप्यूटर शिक्षा, व्यावहारिक ज्ञान, शॉर्टकट कीज़, परिभाषाओं और उपयोगों पर आधारित हों।
6. भाषा: ${language === 'Hindi' ? 'हिंदी में (तकनीकी शब्द जैसे RAM, ROM, CPU, Mouse, File आदि देवनागरी या कोष्ठक में अंग्रेजी में लिखे जा सकते हैं)' : language === 'English' ? 'Strictly in English' : 'Bilingual (Hindi with English technical terms)'}।
7. कोई भी प्रश्न दोहराया न जाए।
`.trim();

    // Use gemini-2.5-flash or gemini-3.8-flash
    const targetModel = model.includes('gemini') ? model : 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: `List of exactly ${count} multiple choice test questions`,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: 'The test question text in the specified language',
                  },
                  options: {
                    type: Type.ARRAY,
                    description: 'Exactly 4 distinct answer choices',
                    items: { type: Type.STRING },
                  },
                  answer: {
                    type: Type.STRING,
                    description: 'Exact text of the correct answer from options',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'Short explanation of why this is correct',
                  },
                },
                required: ['question', 'options', 'answer', 'explanation'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const rawText = response.text || '';
    let parsedData: { questions: any[] };

    try {
      parsedData = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', rawText);
      return res.status(500).json({
        error: 'AI ने सही JSON प्रारूप में उत्तर नहीं दिया। कृपया पुनः प्रयास करें।',
        rawText,
      });
    }

    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      return res.status(500).json({
        error: 'अमान्य प्रश्न संरचना प्राप्त हुई।',
      });
    }

    // Format & validate
    const questions: Question[] = parsedData.questions.map((q, idx) => {
      let options = Array.isArray(q.options) ? q.options.map(String) : [];
      // Ensure 4 options
      while (options.length < 4) {
        options.push(`विकल्प ${options.length + 1}`);
      }
      options = options.slice(0, 4);

      let answer = String(q.answer || options[0]).trim();
      // Ensure answer is in options
      if (!options.includes(answer)) {
        // Find best match or default to first
        const matched = options.find(
          (opt: string) => opt.toLowerCase() === answer.toLowerCase()
        );
        answer = matched || options[0];
      }

      return {
        id: idx + 1,
        question: String(q.question || `प्रश्न ${idx + 1}`).trim(),
        options,
        answer,
        explanation: String(q.explanation || 'यह सही उत्तर है।').trim(),
      };
    });

    return res.json({
      success: true,
      meta: {
        institute,
        testType,
        course,
        subject,
        topic,
        questionCount: questions.length,
        marksPerQuestion,
        totalMarks: questions.length * marksPerQuestion,
        difficulty,
        language,
        model: targetModel,
        createdAt: new Date().toISOString(),
      },
      questions,
    });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({
      error: error.message || 'प्रश्न उत्पन्न करने में त्रुटि हुई। कृपया पुनः प्रयास करें।',
    });
  }
});

// Endpoint to generate ready-to-run Google Apps Script
app.post('/api/generate-apps-script', (req: Request, res: Response) => {
  try {
    const {
      institute = 'NS Galaxy Computer Institute',
      testType = 'Weekly Test',
      course = 'Basic Computer',
      subject = 'Computer Fundamentals',
      topic = 'Computer Memory, MS Word और Input/Output Devices',
      questionCount = 20,
      marksPerQuestion = 1,
      difficulty = 'आसान और मध्यम',
      language = 'Hindi',
      model = 'gemini-2.5-flash',
      embedCurrentQuestions = false,
      questions = [],
    } = req.body;

    let scriptContent = '';

    if (embedCurrentQuestions && questions && questions.length > 0) {
      // Generate Apps Script with direct pre-generated questions embedded so it runs instantly without needing API key!
      scriptContent = `/*
 * =========================================================================
 * ${institute}
 * ${testType} - Instant Google Forms & Sheets Generator
 * Course: ${course} | Subject: ${subject}
 * Questions: ${questions.length} | Total Marks: ${questions.length * marksPerQuestion}
 * =========================================================================
 * कैसे चलाएं:
 * 1. https://script.google.com/ पर जाएं और New Project बनाएं।
 * 2. इस पूरे कोड को paste करें।
 * 3. 'createNSTestWithEmbedQuestions' फंक्शन सेलेक्ट करें और Run दबाएं।
 * 4. Google Drive पर Form और Result Sheet तुरंत बन जाएंगे!
 * =========================================================================
 */

const TEST_META = {
  institute: ${JSON.stringify(institute)},
  testType: ${JSON.stringify(testType)},
  course: ${JSON.stringify(course)},
  subject: ${JSON.stringify(subject)},
  topic: ${JSON.stringify(topic)},
  marksPerQuestion: ${marksPerQuestion},
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

  // 1. Create Google Form Quiz
  const form = FormApp.create(title);

  form.setDescription(
    TEST_META.institute + '\\n' +
    TEST_META.testType + '\\n' +
    'कोर्स: ' + TEST_META.course + '\\n' +
    'विषय: ' + TEST_META.subject + '\\n' +
    'टॉपिक: ' + TEST_META.topic + '\\n' +
    'कुल प्रश्न: ' + PRE_GENERATED_QUESTIONS.length + '\\n' +
    'पूर्णांक: ' + (PRE_GENERATED_QUESTIONS.length * TEST_META.marksPerQuestion) + '\\n\\n' +
    'सभी प्रश्नों को ध्यानपूर्वक हल करें और सबमिट करें।'
  );

  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(true);
  form.setCollectEmail(false);
  form.setConfirmationMessage('आपका टेस्ट सफलतापूर्वक सबमिट हो गया है। NS Galaxy Computer Institute परिणाम जल्द घोषित करेगा।');

  // Student Profile Fields
  form.addSectionHeaderItem().setTitle('विद्यार्थी विवरण (Student Details)');
  form.addTextItem().setTitle('विद्यार्थी का पूरा नाम (Full Name)').setRequired(true);
  form.addTextItem().setTitle('रोल नंबर / विद्यार्थी ID (Roll No / ID)').setRequired(true);
  form.addListItem().setTitle('कोर्स (Course)').setChoiceValues(TEST_META.courses).setRequired(true);
  form.addTextItem().setTitle('बैच / क्लास का समय (Batch Time)').setRequired(true);

  // Questions Section
  form.addSectionHeaderItem().setTitle('ऑनलाइन टेस्ट के प्रश्न (Test Questions)');

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

  // 2. Create Google Sheet for Results & Question Bank
  const sheet = SpreadsheetApp.create(title + ' - Student Results');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Insert AI Question Bank Tab
  const bank = sheet.insertSheet('AI Question Bank');
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

  Logger.log('=============================================');
  Logger.log('SUCCESS! TEST CREATED FOR ' + TEST_META.institute);
  Logger.log('EDIT FORM URL: ' + form.getEditUrl());
  Logger.log('STUDENT TEST LINK: ' + form.getPublishedUrl());
  Logger.log('RESULT SHEET URL: ' + sheet.getUrl());
  Logger.log('=============================================');
}
`;
    } else {
      // Generate Dynamic Apps Script code with Gemini API call (matching user's script)
      scriptContent = `/*
 * =========================================================================
 * ${institute}
 * AI Weekly & Monthly Online Test Generator
 * Google Apps Script + Gemini API + Google Forms + Sheets
 * =========================================================================
 * 
 * पहली बार सेटअप:
 * 1. Google Script Editor (script.google.com) खोलें।
 * 2. Project Settings > Script Properties में 'GEMINI_API_KEY' कुंजी जोड़ें।
 * 3. नीचे TEST_CONFIG में आवश्यकतानुसार बदलाव करें।
 * 4. createNSTest() चलाएँ।
 * =========================================================================
 */

const TEST_CONFIG = {
  institute: ${JSON.stringify(institute)},
  testType: ${JSON.stringify(testType)},
  course: ${JSON.stringify(course)},
  subject: ${JSON.stringify(subject)},
  topic: ${JSON.stringify(topic)},
  questionCount: ${questionCount},
  marksPerQuestion: ${marksPerQuestion},
  difficulty: ${JSON.stringify(difficulty)},
  language: ${JSON.stringify(language)},
  model: ${JSON.stringify(model)},

  courses: [
    'Basic Computer', 'CCC', 'DCA', 'ADCA',
    'Tally Prime', 'MS Office', 'Photoshop',
    'Graphic Designing', 'Video Editing',
    'Computer Hardware', 'Python', 'Web Development',
    'AI Tools'
  ]
};

function getGeminiKey_() {
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!key) {
    throw new Error('GEMINI_API_KEY सेट नहीं है। Project Settings > Script Properties में जोड़ें।');
  }
  return key;
}

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
    'प्रश्न संख्या: ' + questions.length + '\\n' +
    'कुल अंक: ' + (questions.length * TEST_CONFIG.marksPerQuestion) + '\\n\\n' +
    'सभी प्रश्नों को ध्यान से पढ़ें और उत्तर सबमिट करें।'
  );

  form.setIsQuiz(true);
  form.setProgressBar(true);
  form.setShuffleQuestions(true);
  form.setCollectEmail(false);
  form.setConfirmationMessage('आपका टेस्ट जमा हो गया है। NS Galaxy Computer Institute परिणाम जल्द जारी करेगा।');

  // विद्यार्थी की जानकारी
  form.addSectionHeaderItem().setTitle('विद्यार्थी की जानकारी (Student Details)');
  form.addTextItem().setTitle('विद्यार्थी का पूरा नाम').setRequired(true);
  form.addTextItem().setTitle('रोल नंबर / विद्यार्थी ID').setRequired(true);
  form.addListItem().setTitle('कोर्स').setChoiceValues(TEST_CONFIG.courses).setRequired(true);
  form.addTextItem().setTitle('बैच / क्लास').setRequired(true);

  // AI से बने प्रश्न
  form.addSectionHeaderItem().setTitle('ऑनलाइन टेस्ट के प्रश्न');

  questions.forEach(function(q, i) {
    const item = form.addMultipleChoiceItem();
    item.setTitle((i + 1) + '. ' + q.question);
    item.setRequired(true);
    item.setPoints(TEST_CONFIG.marksPerQuestion);

    item.setChoices(
      q.options.map(function(opt) {
        return item.createChoice(opt, opt === q.answer);
      })
    );
  });

  // रिजल्ट शीट
  const spreadsheet = SpreadsheetApp.create(title + ' - Student Results');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  // AI Question Bank टैब
  const bank = spreadsheet.insertSheet('AI Question Bank');
  bank.appendRow(['क्रमांक', 'प्रश्न', 'विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D', 'सही उत्तर', 'अंक']);

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

  PropertiesService.getScriptProperties().setProperty('LAST_TEST_FORM_ID', form.getId());
  PropertiesService.getScriptProperties().setProperty('LAST_TEST_SHEET_ID', spreadsheet.getId());

  Logger.log('FORM EDIT URL: ' + form.getEditUrl());
  Logger.log('STUDENT TEST LINK: ' + form.getPublishedUrl());
  Logger.log('RESULT SHEET URL: ' + spreadsheet.getUrl());
}

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

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(TEST_CONFIG.model) + ':generateContent';

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3
    }
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': key },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const status = response.getResponseCode();
  const body = response.getContentText();

  if (status < 200 || status >= 300) {
    throw new Error('Gemini API Error (' + status + '): ' + body);
  }

  const result = JSON.parse(body);
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('AI ने प्रश्न नहीं लौटाए।');
  }

  const parsed = JSON.parse(text);
  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error('AI का JSON प्रारूप सही नहीं है।');
  }

  return parsed.questions;
}

function validateQuestions_(questions) {
  if (questions.length !== TEST_CONFIG.questionCount) {
    throw new Error('AI ने ' + questions.length + ' प्रश्न दिए, जबकि ' + TEST_CONFIG.questionCount + ' अपेक्षित थे।');
  }
  questions.forEach(function(q, i) {
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.options.includes(q.answer)) {
      throw new Error('प्रश्न ' + (i + 1) + ' का प्रारूप गलत है।');
    }
  });
}

function validateConfig_() {
  if (!['Weekly Test', 'Monthly Test'].includes(TEST_CONFIG.testType)) {
    throw new Error("testType में 'Weekly Test' या 'Monthly Test' लिखें।");
  }
}
`;
    }

    res.json({ script: scriptContent });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend in dev/prod
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`NS Galaxy Test Generator server running on http://0.0.0.0:${PORT}`);
});
