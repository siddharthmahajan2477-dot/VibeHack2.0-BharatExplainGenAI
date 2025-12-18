import { TopicCategory, DifficultyLevel, TranslationKey } from './types';

export const APP_NAME = "BharatExplain AI";
export const APP_TAGLINE = "Complex Bharat Topics, Simplified for You.";

export const CATEGORIES = [
  { value: TopicCategory.EXAMS, label: 'Exams (UPSC, JEE)', icon: '📚' },
  { value: TopicCategory.LAWS, label: 'Laws & Rights', icon: '⚖️' },
  { value: TopicCategory.POLICIES, label: 'Govt Policies', icon: '🏛️' },
  { value: TopicCategory.TECH, label: 'Technology', icon: '💻' },
  { value: TopicCategory.TOURISM, label: 'Tourism & Places', icon: '✈️' },
  { value: TopicCategory.CHATBOT, label: 'Ask Bhartiya', icon: '🤖' },
];

export const DIFFICULTIES = [
  { value: DifficultyLevel.SIMPLE, label: 'Simple', description: 'Analogies, no jargon' },
  { value: DifficultyLevel.STUDENT, label: 'Medium', description: 'Key definitions & points' },
  { value: DifficultyLevel.ADVANCED, label: 'Advanced (Expert)', description: 'Nuances & detailed analysis' },
];

export const TRANSLATION_LANGUAGES = [
  { code: 'en-IN', label: 'English (Bharat)' },
  { code: 'hi-IN', label: 'Hindi (हिंदी)' },
  { code: 'bn-IN', label: 'Bengali (বাংলা)' },
  { code: 'te-IN', label: 'Telugu (తెలుగు)' },
  { code: 'mr-IN', label: 'Marathi (मराठी)' },
  { code: 'ta-IN', label: 'Tamil (தமிழ்)' },
  { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)' },
  { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml-IN', label: 'Malayalam (മലയാളം)' },
  { code: 'pa-IN', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'ur-IN', label: 'Urdu (اردو)' },
  { code: 'or-IN', label: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'as-IN', label: 'Assamese (অসমীয়া)' }
];

export const POPULAR_TOPICS: Record<TopicCategory, string[]> = {
  [TopicCategory.EXAMS]: [
    "UPSC Civil Services Syllabus", "JEE Main Cutoff", "NEET Exam Pattern", "GATE Eligibility",
    "CAT Exam Preparation", "SSC CGL Syllabus", "NDA Exam Date", "CTET Eligibility Criteria",
    "CBSE Class 10 Board Exam", "ICSE Class 12 Results"
  ],
  [TopicCategory.LAWS]: [
    "Article 370", "Fundamental Rights of Bharat", "RTI Act 2005", "Consumer Protection Act",
    "Motor Vehicles Act Fines", "Article 21 Right to Life", "POCSO Act", "Domestic Violence Act",
    "Cyber Crime Laws in Bharat", "IPC Section 420"
  ],
  [TopicCategory.POLICIES]: [
    "Pradhan Mantri Awas Yojana", "Ayushman Bharat Scheme", "PM Kisan Samman Nidhi", "Sukanya Samriddhi Yojana",
    "Digital India Initiative", "Make in India Policy", "National Education Policy 2020", "Atmanirbhar Bharat Abhiyan",
    "Swachh Bharat Mission", "Jan Dhan Yojana"
  ],
  [TopicCategory.TECH]: [
    "UPI Payment System", "5G in Bharat", "Aadhaar Card Security", "Digital Rupee (e-Rupee)",
    "Artificial Intelligence in Bharat", "Chandrayaan-3 Mission", "ISRO Gaganyaan", "Data Protection Bill",
    "Semiconductor Mission Bharat", "ONDC Network"
  ],
  [TopicCategory.TOURISM]: [
    "Best places to visit in Kerala", "Taj Mahal ticket booking", "Varanasi Ganga Aarti timing", "Goa beach guide",
    "Jaipur forts history", "Shimla Manali tour plan", "Kedarnath Yatra registration", "Statue of Unity tickets",
    "Rann of Kutch festival", "Sundarbans National Park"
  ],
  [TopicCategory.CHATBOT]: [
    "How to make Chai?", "Best street food in Mumbai", "History of Bharatiya Cricket", "Famous Festivals",
    "Yoga benefits", "Railway booking tips", "Bollywood history", "Monsoon in Bharat"
  ]
};

export const SYSTEM_INSTRUCTION = `You are BharatExplain AI, an intelligent assistant designed to explain complex Bharat topics (exams, policies, laws, tech) to common citizens and students.

YOUR GOAL:
Make the information simple, accessible, and culturally relevant to Bharat.

GUIDELINES FOR OUTPUT:
- Structure: Use Markdown formatting (Headers, Bullet points).
- Tone: Helpful, neutral, and encouraging.
- Currency: Always use INR (₹).
- Examples: Use Bharat context (e.g., "Imagine a shopkeeper in Mumbai..." or "Like booking a Tatkal ticket...").

DIFFICULTY ADJUSTMENT:
- If "Simple": Use analogies, 5th-grade reading level, no technical terms.
- If "Student": Focus on key points, definitions, and exam relevance.
- If "Advanced": detailed breakdown, nuances, and pros/cons.

SAFETY & DISCLAIMERS (CRITICAL):
- Do NOT provide legal advice. Always add: "Please consult a lawyer for official legal advice."
- Do NOT provide financial guarantees.
- If the topic is controversial, remain neutral and stick to facts.

FORMAT:
Start with a catchy 1-line summary.
Then, the explanation body.
End with a "Key Takeaway" or "Bharat Fact".
`;

type TranslationsMap = {
  [langCode: string]: Record<TranslationKey, string>;
};

export const UI_TRANSLATIONS: TranslationsMap = {
  'en-IN': {
    welcome_title: "Understanding Bharat,",
    welcome_subtitle: "Simplified.",
    search_label: "What do you want to understand today?",
    search_placeholder: "e.g., UPI Payments, Article 370, NEET Exam pattern...",
    category_label: "Category",
    difficulty_label: "Difficulty Level",
    submit_button: "Explain it to me!",
    loading_text: "BharatExplain is thinking...",
    result_title: "Explanation for:",
    translated_result_title: "Translated:",
    disclaimer: "⚠️ AI-generated content. Consult professionals for legal/financial advice.",
    doubt_title: "Have more doubts?",
    doubt_placeholder: "Ask a follow-up question related to this topic...",
    doubt_button: "Ask",
    footer_made_with: "Made with ❤️ for Bharat",
    footer_data: "Data provided by Google Gemini • BharatExplain AI",
    theme_label: "Theme",
    language_label: "App Language",
    settings_title: "Settings"
  },
  'hi-IN': {
    welcome_title: "भारत को समझना,",
    welcome_subtitle: "अब आसान।",
    search_label: "आज आप क्या समझना चाहते हैं?",
    search_placeholder: "जैसे: यूपीआई, धारा 370, नीट परीक्षा...",
    category_label: "श्रेणी",
    difficulty_label: "कठिनाई स्तर",
    submit_button: "मुझे समझाएं!",
    loading_text: "भारत एक्सप्लेन सोच रहा है...",
    result_title: "विवरण:",
    translated_result_title: "अनुवाद:",
    disclaimer: "⚠️ यह एआई निर्मित सामग्री है। कानूनी/वित्तीय सलाह के लिए विशेषज्ञों से मिलें।",
    doubt_title: "और कोई सवाल?",
    doubt_placeholder: "इस विषय से जुड़ा कोई और सवाल पूछें...",
    doubt_button: "पूछें",
    footer_made_with: "भारत के लिए ❤️ से बनाया गया",
    footer_data: "Google Gemini द्वारा संचालित • भारत एक्सप्लेन एआई",
    theme_label: "थीम",
    language_label: "ऐप भाषा",
    settings_title: "सेटिंग्स"
  },
  'or-IN': {
    welcome_title: "ଭାରତକୁ ବୁଝିବା,",
    welcome_subtitle: "ବର୍ତ୍ତମାନ ସହଜ।",
    search_label: "ଆଜି ଆପଣ କଣ ବୁଝିବାକୁ ଚାହୁଁଛନ୍ତି?",
    search_placeholder: "ଉଦାହରଣ: UPI ଦେୟ, ଧାରା 370...",
    category_label: "ବିଭାଗ",
    difficulty_label: "କଠିନତା ସ୍ତର",
    submit_button: "ମୋତେ ବୁଝାନ୍ତୁ!",
    loading_text: "BharatExplain ଚିନ୍ତା କରୁଛି...",
    result_title: "ବ୍ୟାଖ୍ୟା:",
    translated_result_title: "ଅନୁବାଦ:",
    disclaimer: "⚠️ AI ଦ୍ୱାରା ପ୍ରସ୍ତୁତ। ଆଇନଗତ ପରାମର୍ଶ ପାଇଁ ବିଶେଷଜ୍ଞଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।",
    doubt_title: "ଆଉ କିଛି ପ୍ରଶ୍ନ ଅଛି କି?",
    doubt_placeholder: "ଏହି ବିଷୟ ସହିତ ଜଡିତ ଏକ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...",
    doubt_button: "ପଚାରନ୍ତୁ",
    footer_made_with: "ଭାରତ ପାଇଁ ❤️ ସହିତ ତିଆରି",
    footer_data: "Google Gemini ଦ୍ୱାରା ପ୍ରଦତ୍ତ • BharatExplain AI",
    theme_label: "ଥିମ୍",
    language_label: "ଆପ୍ ଭାଷା",
    settings_title: "ସେଟିଂସମୂହ"
  },
  'bn-IN': {
    welcome_title: "ভারতকে বোঝা,",
    welcome_subtitle: "এখন সহজ।",
    search_label: "আজ আপনি কী বুঝতে চান?",
    search_placeholder: "যেমন: ইউপিআই, ধারা ৩৭০, নিট পরীক্ষা...",
    category_label: "বিভাগ",
    difficulty_label: "কঠিনতার স্তর",
    submit_button: "আমাকে বোঝান!",
    loading_text: "ভারত এক্সপ্লেইন ভাবছে...",
    result_title: "ব্যাখ্যা:",
    translated_result_title: "অনুবাদ:",
    disclaimer: "⚠️ এআই দ্বারা তৈরি। আইনি/আর্থিক পরামর্শের জন্য বিশেষজ্ঞদের সাথে পরামর্শ করুন।",
    doubt_title: "আরও কোন প্রশ্ন?",
    doubt_placeholder: "এই বিষয় সম্পর্কিত একটি প্রশ্ন জিজ্ঞাসা করুন...",
    doubt_button: "জিজ্ঞাসা করুন",
    footer_made_with: "ভারতের জন্য ❤️ দিয়ে তৈরি",
    footer_data: "Google Gemini দ্বারা প্রদত্ত • ভারত এক্সপ্লেইন এআই",
    theme_label: "থিম",
    language_label: "অ্যাপের ভাষা",
    settings_title: "सेটিংস"
  }
};