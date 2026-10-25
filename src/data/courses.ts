import { Question } from '../types/test';

export interface CourseDetail {
  id: string;
  name: string;
  hindiName: string;
  defaultSubject: string;
  topics: string[];
  icon: string;
  duration: string;
}

export const INSTITUTE_COURSES: CourseDetail[] = [
  {
    id: 'basic-computer',
    name: 'Basic Computer',
    hindiName: 'बेसिक कंप्यूटर कोर्स',
    defaultSubject: 'Computer Fundamentals',
    topics: [
      'Computer Memory, MS Word और Input/Output Devices',
      'Introduction to Windows, Files & Folders, Paint, Notepad',
      'Keyboard Shortcuts, Mouse actions, Operating System Basics',
      'Internet, Email Creation, Web Browsing & Online Safety'
    ],
    icon: 'Monitor',
    duration: '3 Months'
  },
  {
    id: 'ccc',
    name: 'CCC',
    hindiName: 'Course on Computer Concepts (NIELIT)',
    defaultSubject: 'NIELIT CCC Exam Preparation',
    topics: [
      'LibreOffice Writer, Calc, Impress & GUI Operating System',
      'Digital Financial Tools: UPI, AEPS, USSD, Cards, Net Banking',
      'Computer Networks, LAN, WAN, IP Address, Web Protocols',
      'Cyber Security, Malware, Antivirus, Digital Signature & IT Act'
    ],
    icon: 'Award',
    duration: '3 Months'
  },
  {
    id: 'dca',
    name: 'DCA',
    hindiName: 'Diploma in Computer Applications',
    defaultSubject: 'DCA Core Modules',
    topics: [
      'MS Office Suite (Word, Excel, PowerPoint, MS Access)',
      'Database Management Systems (DBMS) Basics & SQL Concepts',
      'Financial Accounting with Tally, Vouchers & Ledgers',
      'Desktop Publishing (DTP), PageMaker & CorelDraw Fundamentals'
    ],
    icon: 'GraduationCap',
    duration: '6 Months'
  },
  {
    id: 'adca',
    name: 'ADCA',
    hindiName: 'Advance Diploma in Computer Applications',
    defaultSubject: 'ADCA Professional Suite',
    topics: [
      'Advanced Excel (VLOOKUP, XLOOKUP, Pivot, Macros) & MS Access',
      'Tally Prime with GST, TDS, Payroll & Balance Sheet Finalization',
      'HTML5, CSS3, JavaScript & Web Page Designing',
      'C & C++ Programming Concepts, Data Types, Loops & Functions'
    ],
    icon: 'Laptop',
    duration: '1 Year'
  },
  {
    id: 'tally-prime',
    name: 'Tally Prime',
    hindiName: 'टैली प्राइम एवं जीएसटी',
    defaultSubject: 'Computerized Accounting & Taxation',
    topics: [
      'Company Creation, Group, Ledger & Voucher Entries (F4 to F9)',
      'GST Accounting (CGST, SGST, IGST), E-Way Bill & Invoicing',
      'Inventory Management, Stock Items, Units of Measure & Godowns',
      'Bank Reconciliation, Financial Reports, P&L & Balance Sheet'
    ],
    icon: 'Calculator',
    duration: '3 Months'
  },
  {
    id: 'ms-office',
    name: 'MS Office',
    hindiName: 'माइक्रोसॉफ्ट ऑफिस पैकेज',
    defaultSubject: 'Office Productivity Suite',
    topics: [
      'MS Word: Mail Merge, Tables, Formatting, Header & Footer',
      'MS Excel: Formulas (IF, SUMIFS, COUNTIF, VLOOKUP) & Charts',
      'MS PowerPoint: Slide Master, Animation, Transitions, Custom Show',
      'MS Outlook & Excel Data Sorting, Filtering & Data Validation'
    ],
    icon: 'FileSpreadsheet',
    duration: '3 Months'
  },
  {
    id: 'photoshop',
    name: 'Photoshop',
    hindiName: 'एडोब फोटोशॉप',
    defaultSubject: 'Digital Image Editing & Graphic Design',
    topics: [
      'Selection Tools, Pen Tool, Crop, Move & Healing Brush',
      'Layers, Layer Masks, Clipping Masks & Blending Modes',
      'Color Correction, Curves, Levels, Hue/Saturation & Filters',
      'Banner Design, Passport Photo Printing & Photo Retouching'
    ],
    icon: 'Image',
    duration: '2 Months'
  },
  {
    id: 'graphic-designing',
    name: 'Graphic Designing',
    hindiName: 'ग्राफिक डिजाइनिंग',
    defaultSubject: 'Visual Design & Commercial Art',
    topics: [
      'CorelDraw Vector Graphics, Logo Design & Visiting Cards',
      'Typography, Color Theory, Poster Design & Social Media Posts',
      'Illustrator Vector Tools, Pen Tool, Pathfinder & Gradients',
      'Printing Techniques, CMYK vs RGB, Resolution & Export Formats'
    ],
    icon: 'Palette',
    duration: '6 Months'
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    hindiName: 'वीडियो एडिटिंग',
    defaultSubject: 'Digital Video Post-Production',
    topics: [
      'Timeline Editing, Cutting, Trimming & Transitions',
      'Audio Syncing, Noise Reduction, Background Music & Sound Effects',
      'Color Grading, LUTs, Keyframing & Green Screen (Chroma Key)',
      'Export Settings, Aspect Ratios for YouTube, Instagram Reels & Bitrates'
    ],
    icon: 'Video',
    duration: '3 Months'
  },
  {
    id: 'computer-hardware',
    name: 'Computer Hardware',
    hindiName: 'हार्डवेयर एवं नेटवर्किंग',
    defaultSubject: 'Hardware & Networking Essentials',
    topics: [
      'Motherboard, CPU, RAM, SMPS, BIOS Settings & PC Assembling',
      'Storage Devices (HDD, SSD, NVMe), Partitions & Windows Installation',
      'Networking: LAN Cables, RJ45 Crimping, Routers & IP Configuration',
      'Hardware Troubleshooting, Thermal Paste, Beep Codes & Driver Setup'
    ],
    icon: 'Cpu',
    duration: '4 Months'
  },
  {
    id: 'python',
    name: 'Python',
    hindiName: 'पायथन प्रोग्रामिंग',
    defaultSubject: 'Python Programming Essentials',
    topics: [
      'Python Syntax, Variables, Data Types, If-Else & Loops',
      'Functions, Modules, Lists, Tuples, Dictionaries & Sets',
      'Object Oriented Programming (OOP), Classes & Inheritance',
      'File Handling, Exception Handling & Basic Libraries'
    ],
    icon: 'Code',
    duration: '4 Months'
  },
  {
    id: 'web-development',
    name: 'Web Development',
    hindiName: 'वेब डेवलपमेंट (HTML/CSS/JS)',
    defaultSubject: 'Frontend Web Development',
    topics: [
      'HTML5 Elements, Forms, Semantic Tags & Tables',
      'CSS3 Flexbox, Grid, Responsive Design & Media Queries',
      'JavaScript DOM Manipulation, Events & Functions',
      'Git, GitHub Basics & Responsive Website Hosting'
    ],
    icon: 'Globe',
    duration: '6 Months'
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    hindiName: 'एआई टूल्स एवं प्रॉम्प्ट इंजीनियरिंग',
    defaultSubject: 'Artificial Intelligence & Modern Tools',
    topics: [
      'ChatGPT, Gemini, Claude: Effective Prompt Engineering Techniques',
      'Canva AI, Midjourney & AI Image Generation Tools',
      'AI for Office Productivity: Summarization, Excel Formulas, Emails',
      'AI Ethics, Limitations, Verification & Future AI Workflow'
    ],
    icon: 'Sparkles',
    duration: '2 Months'
  }
];

export const INITIAL_SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'कंप्यूटर का मस्तिष्क (Brain of Computer) किसे कहा जाता है?',
    options: ['RAM (रैम)', 'CPU (सेंट्रल प्रोसेसिंग यूनिट)', 'Hard Disk (हार्ड डिस्क)', 'Monitor (मॉनिटर)'],
    answer: 'CPU (सेंट्रल प्रोसेसिंग यूनिट)',
    explanation: 'CPU कंप्यूटर के सभी निर्देशों को निष्पादित (execute) और गणना करता है, इसलिए इसे कंप्यूटर का दिमाग या मस्तिष्क कहा जाता है।'
  },
  {
    id: 2,
    question: 'MS Word में नया दस्तावेज़ (New Document) खोलने के लिए कौन सा शॉर्टकट प्रयोग किया जाता है?',
    options: ['Ctrl + O', 'Ctrl + N', 'Ctrl + S', 'Ctrl + P'],
    answer: 'Ctrl + N',
    explanation: 'Ctrl + N शॉर्टकट का उपयोग नया रिक्त दस्तावेज़ (New Blank Document) खोलने के लिए किया जाता है।'
  },
  {
    id: 3,
    question: 'निम्नलिखित में से कौन सा एक इनपुट डिवाइस (Input Device) का उदाहरण है?',
    options: ['Plotter (प्लॉटर)', 'Printer (प्रिंटर)', 'Optical Mark Reader - OMR', 'Speaker (स्पीकर)'],
    answer: 'Optical Mark Reader - OMR',
    explanation: 'OMR एक इनपुट डिवाइस है जो परीक्षा की ओएमआर शीट को स्कैन करके कंप्यूटर में डेटा इनपुट करता है, जबकि अन्य सभी आउटपुट डिवाइस हैं।'
  },
  {
    id: 4,
    question: 'कंप्यूटर की प्राइमरी मेमोरी (Primary Memory) में कौन सा शामिल है?',
    options: ['RAM और ROM', 'Hard Disk और SSD', 'CD और DVD', 'Pen Drive और Memory Card'],
    answer: 'RAM और ROM',
    explanation: 'RAM (Random Access Memory) और ROM (Read Only Memory) कंप्यूटर की प्राथमिक (Primary/Main) मेमोरी हैं।'
  },
  {
    id: 5,
    question: 'MS Word में किसी टेक्स्ट को कॉपी (Copy) करने के लिए शॉर्टकट कुंजी क्या है?',
    options: ['Ctrl + X', 'Ctrl + V', 'Ctrl + C', 'Ctrl + Z'],
    answer: 'Ctrl + C',
    explanation: 'Ctrl + C का उपयोग टेक्स्ट या ऑब्जेक्ट को क्लिपबोर्ड में कॉपी करने के लिए किया जाता है।'
  },
  {
    id: 6,
    question: '1 गीगाबाइट (1 GB) में कितने मेगाबाइट (MB) होते हैं?',
    options: ['1000 MB', '1024 MB', '1024 KB', '512 MB'],
    answer: '1024 MB',
    explanation: 'कंप्यूटर मेमोरी माप में 1 GB = 1024 MB (Megabytes) होता है।'
  },
  {
    id: 7,
    question: 'कीबोर्ड पर स्थित F1 से F12 कुंजियों को क्या कहा जाता है?',
    options: ['Numeric Keys', 'Function Keys', 'Toggle Keys', 'Navigation Keys'],
    answer: 'Function Keys',
    explanation: 'F1 से F12 तक की कुंजियों को Function Keys (फंक्शन कीज) कहा जाता है जिनका उपयोग विशेष कार्यों के लिए होता है।'
  },
  {
    id: 8,
    question: 'कंप्यूटर में ' + 'ALU' + ' का पूर्ण रूप (Full Form) क्या है?',
    options: ['Application Logic Unit', 'Arithmetic Logic Unit', 'Array Level Utility', 'Advanced Linear Unit'],
    answer: 'Arithmetic Logic Unit',
    explanation: 'ALU का पूरा नाम Arithmetic Logic Unit है जो अंकगणितीय और तार्किक गणनाएं करता है।'
  },
  {
    id: 9,
    question: 'MS Word में चयनित टेक्स्ट को ' + 'बोल्ड (Bold)' + ' करने का शॉर्टकट क्या है?',
    options: ['Ctrl + I', 'Ctrl + U', 'Ctrl + B', 'Ctrl + K'],
    answer: 'Ctrl + B',
    explanation: 'Ctrl + B शॉर्टकट का उपयोग टेक्स्ट को गहरा (Bold) करने के लिए किया जाता है।'
  },
  {
    id: 10,
    question: 'निम्नलिखित में से कौन सी मेमोरी वोलाटाइल (Volatile / अस्थायी) होती है?',
    options: ['ROM', 'RAM', 'Hard Disk', 'Flash Drive'],
    answer: 'RAM',
    explanation: 'RAM एक वोलाटाइल मेमोरी है, जिसका अर्थ है कि कंप्यूटर बंद होने पर इसमें संग्रहीत डेटा नष्ट हो जाता है।'
  }
];
