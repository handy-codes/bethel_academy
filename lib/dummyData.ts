import { ExamSubject, QuestionDifficulty } from "@prisma/client";

export interface DummyQuestion {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctAnswer: string;
  explanation?: string;
  difficulty: QuestionDifficulty;
  points: number;
}

export interface DummyExam {
  id: string;
  title: string;
  description: string;
  subject: ExamSubject;
  duration: number;
  totalQuestions: number;
  instructions: string;
  questions: DummyQuestion[];
}

// English Language Questions
export const englishQuestions: DummyQuestion[] = [
  {
    id: "eng-1",
    questionText: "Choose the word that best completes the sentence: The students were asked to _____ their assignments before the deadline.",
    optionA: "submit",
    optionB: "submits",
    optionC: "submitted",
    optionD: "submitting",
    optionE: "submission",
    correctAnswer: "A",
    explanation: "The infinitive form 'submit' is needed after 'to' in this context.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "eng-2",
    questionText: "Which of the following is a synonym for 'abundant'?",
    optionA: "scarce",
    optionB: "plentiful",
    optionC: "rare",
    optionD: "limited",
    optionE: "insufficient",
    correctAnswer: "B",
    explanation: "Abundant means existing in large quantities; plentiful.",
    difficulty: "MEDIUM",
    points: 1,
  },
  {
    id: "eng-3",
    questionText: "Identify the figure of speech in: 'The wind whispered through the trees.'",
    optionA: "Metaphor",
    optionB: "Simile",
    optionC: "Personification",
    optionD: "Hyperbole",
    optionE: "Alliteration",
    correctAnswer: "C",
    explanation: "Personification gives human characteristics to non-human things.",
    difficulty: "MEDIUM",
    points: 1,
  },
];

// Mathematics Questions
export const mathematicsQuestions: DummyQuestion[] = [
  {
    id: "math-1",
    questionText: "What is the value of x in the equation 2x + 5 = 13?",
    optionA: "3",
    optionB: "4",
    optionC: "5",
    optionD: "6",
    optionE: "7",
    correctAnswer: "B",
    explanation: "2x + 5 = 13, so 2x = 8, therefore x = 4",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "math-2",
    questionText: "If a triangle has sides of length 3, 4, and 5, what type of triangle is it?",
    optionA: "Equilateral",
    optionB: "Isosceles",
    optionC: "Right-angled",
    optionD: "Obtuse",
    optionE: "Acute",
    correctAnswer: "C",
    explanation: "A triangle with sides 3, 4, 5 satisfies the Pythagorean theorem (3² + 4² = 5²).",
    difficulty: "MEDIUM",
    points: 1,
  },
  {
    id: "math-3",
    questionText: "What is the derivative of x³ + 2x² - 5x + 1?",
    optionA: "3x² + 4x - 5",
    optionB: "3x² + 2x - 5",
    optionC: "x² + 4x - 5",
    optionD: "3x² + 4x + 5",
    optionE: "3x² - 4x - 5",
    correctAnswer: "A",
    explanation: "Using the power rule: d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(1) = 0",
    difficulty: "HARD",
    points: 1,
  },
];

// Physics Questions
export const physicsQuestions: DummyQuestion[] = [
  {
    id: "phy-1",
    questionText: "What is the SI unit of force?",
    optionA: "Joule",
    optionB: "Newton",
    optionC: "Watt",
    optionD: "Pascal",
    optionE: "Ampere",
    correctAnswer: "B",
    explanation: "The SI unit of force is the Newton (N), named after Isaac Newton.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "phy-2",
    questionText: "According to Newton's second law, force equals:",
    optionA: "mass × velocity",
    optionB: "mass × acceleration",
    optionC: "velocity × time",
    optionD: "acceleration × time",
    optionE: "mass × distance",
    correctAnswer: "B",
    explanation: "Newton's second law states that F = ma (force equals mass times acceleration).",
    difficulty: "MEDIUM",
    points: 1,
  },
  {
    id: "phy-3",
    questionText: "What is the speed of light in vacuum?",
    optionA: "3 × 10⁶ m/s",
    optionB: "3 × 10⁷ m/s",
    optionC: "3 × 10⁸ m/s",
    optionD: "3 × 10⁹ m/s",
    optionE: "3 × 10¹⁰ m/s",
    correctAnswer: "C",
    explanation: "The speed of light in vacuum is approximately 3 × 10⁸ m/s.",
    difficulty: "MEDIUM",
    points: 1,
  },
];

// Chemistry Questions
export const chemistryQuestions: DummyQuestion[] = [
  {
    id: "chem-1",
    questionText: "What is the chemical symbol for gold?",
    optionA: "Go",
    optionB: "Gd",
    optionC: "Au",
    optionD: "Ag",
    optionE: "Al",
    correctAnswer: "C",
    explanation: "The chemical symbol for gold is Au, from the Latin word 'aurum'.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "chem-2",
    questionText: "What is the pH of a neutral solution?",
    optionA: "0",
    optionB: "7",
    optionC: "14",
    optionD: "1",
    optionE: "10",
    correctAnswer: "B",
    explanation: "A neutral solution has a pH of 7, indicating equal concentrations of H⁺ and OH⁻ ions.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "chem-3",
    questionText: "Which of the following is an example of a covalent bond?",
    optionA: "NaCl",
    optionB: "CaCl₂",
    optionC: "H₂O",
    optionD: "MgO",
    optionE: "KBr",
    correctAnswer: "C",
    explanation: "H₂O (water) has covalent bonds between hydrogen and oxygen atoms.",
    difficulty: "MEDIUM",
    points: 1,
  },
];

// Biology Questions
export const biologyQuestions: DummyQuestion[] = [
  {
    id: "bio-1",
    questionText: "What is the powerhouse of the cell?",
    optionA: "Nucleus",
    optionB: "Mitochondria",
    optionC: "Ribosome",
    optionD: "Endoplasmic reticulum",
    optionE: "Golgi apparatus",
    correctAnswer: "B",
    explanation: "Mitochondria are called the powerhouse of the cell because they produce ATP.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "bio-2",
    questionText: "Which process converts light energy into chemical energy?",
    optionA: "Respiration",
    optionB: "Photosynthesis",
    optionC: "Digestion",
    optionD: "Fermentation",
    optionE: "Transpiration",
    correctAnswer: "B",
    explanation: "Photosynthesis converts light energy into chemical energy stored in glucose.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "bio-3",
    questionText: "What is the basic unit of heredity?",
    optionA: "Chromosome",
    optionB: "Gene",
    optionC: "DNA",
    optionD: "RNA",
    optionE: "Protein",
    correctAnswer: "B",
    explanation: "A gene is the basic unit of heredity that carries genetic information.",
    difficulty: "MEDIUM",
    points: 1,
  },
];

// Accounting Questions
export const accountingQuestions: DummyQuestion[] = [
  {
    id: "acc-1",
    questionText: "What is the fundamental accounting equation?",
    optionA: "Assets = Liabilities + Equity",
    optionB: "Assets = Liabilities - Equity",
    optionC: "Assets + Liabilities = Equity",
    optionD: "Assets - Liabilities = Equity",
    optionE: "Assets = Equity - Liabilities",
    correctAnswer: "A",
    explanation: "The fundamental accounting equation is Assets = Liabilities + Owner's Equity.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "acc-2",
    questionText: "Which account increases with a debit?",
    optionA: "Revenue",
    optionB: "Expenses",
    optionC: "Liabilities",
    optionD: "Owner's Equity",
    optionE: "All of the above",
    correctAnswer: "B",
    explanation: "Expenses increase with debits, while revenues, liabilities, and owner's equity increase with credits.",
    difficulty: "MEDIUM",
    points: 1,
  },
  {
    id: "acc-3",
    questionText: "What is depreciation?",
    optionA: "Increase in asset value",
    optionB: "Decrease in asset value over time",
    optionC: "Cash outflow",
    optionD: "Revenue recognition",
    optionE: "Liability increase",
    correctAnswer: "B",
    explanation: "Depreciation is the systematic allocation of an asset's cost over its useful life.",
    difficulty: "MEDIUM",
    points: 1,
  },
];

// Economics Questions
export const economicsQuestions: DummyQuestion[] = [
  {
    id: "econ-1",
    questionText: "What is the study of how individuals and societies choose to use scarce resources?",
    optionA: "Sociology",
    optionB: "Psychology",
    optionC: "Economics",
    optionD: "Political Science",
    optionE: "Anthropology",
    correctAnswer: "C",
    explanation: "Economics is the study of how individuals and societies allocate scarce resources.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "econ-2",
    questionText: "What happens to demand when price increases?",
    optionA: "Demand increases",
    optionB: "Demand decreases",
    optionC: "Demand remains constant",
    optionD: "Demand becomes infinite",
    optionE: "Demand becomes zero",
    correctAnswer: "B",
    explanation: "According to the law of demand, as price increases, quantity demanded decreases.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "econ-3",
    questionText: "What is GDP?",
    optionA: "Gross Domestic Product",
    optionB: "General Development Plan",
    optionC: "Government Debt Payment",
    optionD: "Global Distribution Process",
    optionE: "Gross Domestic Profit",
    correctAnswer: "A",
    explanation: "GDP stands for Gross Domestic Product, the total value of goods and services produced in a country.",
    difficulty: "MEDIUM",
    points: 1,
  },
];

// Literature Questions
export const literatureQuestions: DummyQuestion[] = [
  {
    id: "lit-1",
    questionText: "Who wrote 'Things Fall Apart'?",
    optionA: "Wole Soyinka",
    optionB: "Chinua Achebe",
    optionC: "Ngugi wa Thiong'o",
    optionD: "Ben Okri",
    optionE: "Ama Ata Aidoo",
    correctAnswer: "B",
    explanation: "Chinua Achebe wrote 'Things Fall Apart', a classic African novel.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "lit-2",
    questionText: "What is a sonnet?",
    optionA: "A 14-line poem",
    optionB: "A 16-line poem",
    optionC: "A 12-line poem",
    optionD: "A 20-line poem",
    optionE: "A 8-line poem",
    correctAnswer: "A",
    explanation: "A sonnet is a 14-line poem with a specific rhyme scheme.",
    difficulty: "MEDIUM",
    points: 1,
  },
  {
    id: "lit-3",
    questionText: "Which literary device is used in 'The stars danced playfully in the moonlit sky'?",
    optionA: "Metaphor",
    optionB: "Simile",
    optionC: "Personification",
    optionD: "Hyperbole",
    optionE: "Irony",
    correctAnswer: "C",
    explanation: "Personification gives human characteristics (dancing) to non-human things (stars).",
    difficulty: "MEDIUM",
    points: 1,
  },
];

// Igbo Language Questions
export const igboQuestions: DummyQuestion[] = [
  {
    id: "igbo-1",
    questionText: "What does 'Ndewo' mean in English?",
    optionA: "Goodbye",
    optionB: "Hello",
    optionC: "Thank you",
    optionD: "Please",
    optionE: "Sorry",
    correctAnswer: "B",
    explanation: "'Ndewo' is a common Igbo greeting meaning 'Hello'.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "igbo-2",
    questionText: "How do you say 'Thank you' in Igbo?",
    optionA: "Ndewo",
    optionB: "Daalụ",
    optionC: "Biko",
    optionD: "Ndo",
    optionE: "Ka ọ dị",
    correctAnswer: "B",
    explanation: "'Daalụ' means 'Thank you' in Igbo language.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "igbo-3",
    questionText: "What is the Igbo word for 'water'?",
    optionA: "Nri",
    optionB: "Mmiri",
    optionC: "Ụlọ",
    optionD: "Akụkụ",
    optionE: "Ihe",
    correctAnswer: "B",
    explanation: "'Mmiri' is the Igbo word for water.",
    difficulty: "EASY",
    points: 1,
  },
];

// Yoruba Language Questions
export const yorubaQuestions: DummyQuestion[] = [
  {
    id: "yor-1",
    questionText: "What does 'Bawo ni' mean in English?",
    optionA: "Goodbye",
    optionB: "How are you?",
    optionC: "Thank you",
    optionD: "Please",
    optionE: "Sorry",
    correctAnswer: "B",
    explanation: "'Bawo ni' is a Yoruba greeting meaning 'How are you?'",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "yor-2",
    questionText: "How do you say 'Thank you' in Yoruba?",
    optionA: "O dabo",
    optionB: "E se",
    optionC: "Jọwọ",
    optionD: "Ma binu",
    optionE: "O da",
    correctAnswer: "B",
    explanation: "'E se' means 'Thank you' in Yoruba language.",
    difficulty: "EASY",
    points: 1,
  },
  {
    id: "yor-3",
    questionText: "What is the Yoruba word for 'house'?",
    optionA: "Omi",
    optionB: "Ile",
    optionC: "Ounje",
    optionD: "Ara",
    optionE: "Owo",
    correctAnswer: "B",
    explanation: "'Ile' is the Yoruba word for house.",
    difficulty: "EASY",
    points: 1,
  },
];

// Complete dummy exams for each subject
export const dummyExams: DummyExam[] = [
  {
    id: "exam-english-1",
    title: "JAMB English Language Practice Test",
    description: "Comprehensive English language test covering grammar, comprehension, and literature",
    subject: "ENGLISH",
    duration: 120,
    totalQuestions: englishQuestions.length,
    instructions: "Read each question carefully and select the best answer. Pay attention to grammar rules and context.",
    questions: englishQuestions,
  },
  {
    id: "exam-math-1",
    title: "JAMB Mathematics Practice Test",
    description: "Mathematics test covering algebra, geometry, calculus, and statistics",
    subject: "MATHEMATICS",
    duration: 120,
    totalQuestions: mathematicsQuestions.length,
    instructions: "Solve each problem step by step. Show your work and select the correct answer.",
    questions: mathematicsQuestions,
  },
  {
    id: "exam-physics-1",
    title: "JAMB Physics Practice Test",
    description: "Physics test covering mechanics, thermodynamics, electromagnetism, and modern physics",
    subject: "PHYSICS",
    duration: 90,
    totalQuestions: physicsQuestions.length,
    instructions: "Apply physics principles and formulas to solve each problem.",
    questions: physicsQuestions,
  },
  {
    id: "exam-chemistry-1",
    title: "JAMB Chemistry Practice Test",
    description: "Chemistry test covering atomic structure, chemical bonding, reactions, and organic chemistry",
    subject: "CHEMISTRY",
    duration: 90,
    totalQuestions: chemistryQuestions.length,
    instructions: "Use chemical principles and periodic table knowledge to answer questions.",
    questions: chemistryQuestions,
  },
  {
    id: "exam-biology-1",
    title: "JAMB Biology Practice Test",
    description: "Biology test covering cell biology, genetics, ecology, and human anatomy",
    subject: "BIOLOGY",
    duration: 90,
    totalQuestions: biologyQuestions.length,
    instructions: "Apply biological concepts and scientific reasoning to answer questions.",
    questions: biologyQuestions,
  },
  {
    id: "exam-accounting-1",
    title: "WAEC Accounting Practice Test",
    description: "Accounting test covering financial statements, bookkeeping, and business finance",
    subject: "ACCOUNTING",
    duration: 120,
    totalQuestions: accountingQuestions.length,
    instructions: "Apply accounting principles and double-entry bookkeeping concepts.",
    questions: accountingQuestions,
  },
  {
    id: "exam-economics-1",
    title: "WAEC Economics Practice Test",
    description: "Economics test covering microeconomics, macroeconomics, and economic systems",
    subject: "ECONOMICS",
    duration: 120,
    totalQuestions: economicsQuestions.length,
    instructions: "Apply economic theories and principles to analyze situations.",
    questions: economicsQuestions,
  },
  {
    id: "exam-literature-1",
    title: "WAEC Literature Practice Test",
    description: "Literature test covering African literature, poetry, drama, and prose",
    subject: "LITERATURE",
    duration: 120,
    totalQuestions: literatureQuestions.length,
    instructions: "Analyze literary devices, themes, and contexts in the given texts.",
    questions: literatureQuestions,
  },
  {
    id: "exam-igbo-1",
    title: "WAEC Igbo Language Practice Test",
    description: "Igbo language test covering vocabulary, grammar, and cultural context",
    subject: "IGBO",
    duration: 90,
    totalQuestions: igboQuestions.length,
    instructions: "Demonstrate knowledge of Igbo language, culture, and traditions.",
    questions: igboQuestions,
  },
  {
    id: "exam-yoruba-1",
    title: "WAEC Yoruba Language Practice Test",
    description: "Yoruba language test covering vocabulary, grammar, and cultural context",
    subject: "YORUBA",
    duration: 90,
    totalQuestions: yorubaQuestions.length,
    instructions: "Demonstrate knowledge of Yoruba language, culture, and traditions.",
    questions: yorubaQuestions,
  },
];

// Function to get questions by subject
export const getQuestionsBySubject = (subject: ExamSubject): DummyQuestion[] => {
  switch (subject) {
    case "ENGLISH": return englishQuestions;
    case "MATHEMATICS": return mathematicsQuestions;
    case "PHYSICS": return physicsQuestions;
    case "CHEMISTRY": return chemistryQuestions;
    case "BIOLOGY": return biologyQuestions;
    case "ACCOUNTING": return accountingQuestions;
    case "ECONOMICS": return economicsQuestions;
    case "LITERATURE": return literatureQuestions;
    case "IGBO": return igboQuestions;
    case "YORUBA": return yorubaQuestions;
    default: return [];
  }
};

// Function to get exam by subject
export const getExamBySubject = (subject: ExamSubject): DummyExam | undefined => {
  return dummyExams.find(exam => exam.subject === subject);
};

// Function to get all subjects
export const getAllSubjects = (): ExamSubject[] => {
  return ["ENGLISH", "MATHEMATICS", "PHYSICS", "CHEMISTRY", "BIOLOGY", "ACCOUNTING", "ECONOMICS", "LITERATURE", "IGBO", "YORUBA"];
};
