// Configuration data for the application

export const INSTRUCTORS = [
  {
    id: 1,
    name: "Dr. Ahmed Rahman",
    subject: "Physics",
    experience: "15 years",
    students: 2000,
    image: null,
  },
  {
    id: 2,
    name: "Prof. Fatima Khatun",
    subject: "Chemistry",
    experience: "12 years",
    students: 1800,
    image: null,
  },
  {
    id: 3,
    name: "Md. Karim Hossain",
    subject: "Mathematics",
    experience: "10 years",
    students: 2200,
    image: null,
  },
  {
    id: 4,
    name: "Dr. Nusrat Jahan",
    subject: "Biology",
    experience: "14 years",
    students: 1900,
    image: null,
  },
];

export const DUMMY_COURSE = {
  id: 1,
  course_title: "Physics Complete Course - HSC 27",
  price: 2500,
  thumbnail: null,
  batch: "HSC 27",
  language: "Bangla",
  created_at: "2024-01-15",
  description:
    "This comprehensive physics course covers all topics required for HSC 2027 examination. You'll learn fundamental concepts, solve complex problems, and prepare for your exams with confidence. The course includes video lectures, practice problems, and mock tests.",
  curriculum: [
    {
      id: 1,
      chapter: "Chapter 1: Introduction to Physics",
      topics: [
        { id: 1, title: "What is Physics?", type: "video" },
        { id: 2, title: "Basic Concepts and Units", type: "video" },
        { id: 3, title: "Measurement and Precision", type: "video" },
      ],
    },
    {
      id: 2,
      chapter: "Chapter 2: Mechanics Fundamentals",
      topics: [
        { id: 5, title: "Motion and Rest", type: "video" },
        { id: 6, title: "Speed vs Velocity", type: "video" },
        { id: 7, title: "Acceleration Concepts", type: "video" },
        { id: 8, title: "Newton's Laws Introduction", type: "video" },
      ],
    },
    {
      id: 3,
      chapter: "Chapter 3: Energy and Work",
      topics: [
        { id: 11, title: "Work Definition and Formula", type: "video" },
        { id: 12, title: "Different Forms of Energy", type: "video" },
        { id: 13, title: "Conservation of Energy", type: "video" },
        { id: 14, title: "Power and Efficiency", type: "video" },
      ],
    },
    {
      id: 4,
      chapter: "Chapter 4: Thermodynamics",
      topics: [
        { id: 17, title: "Heat and Temperature", type: "video" },
        { id: 18, title: "Thermal Expansion", type: "video" },
        { id: 19, title: "Specific Heat Capacity", type: "video" },
        { id: 20, title: "Laws of Thermodynamics", type: "video" },
      ],
    },
  ],
  instructor: INSTRUCTORS[0], // Use the first instructor as default
  quiz_count: 25,
  assessment: true,
  expiry: 365,
  skill_level: "Intermediate",
};

export const DUMMY_RELATED_BOOKS = [
  {
    id: 1,
    title: "HSC Physics Solved Problems",
    book_image: null,
    price: 450,
  },
  {
    id: 2,
    title: "Advanced Physics Concepts",
    book_image: null,
    price: 380,
  },
  {
    id: 3,
    title: "Physics Formula Handbook",
    book_image: null,
    price: 280,
  },
  {
    id: 4,
    title: "HSC Physics MCQ Bank",
    book_image: null,
    price: 320,
  },
];

export const DUMMY_RELATED_COURSES = [
  {
    id: 2,
    course_title: "Chemistry Crash Course - HSC 27",
    price: 2200,
    thumbnail: null,
    batch: "HSC 27",
  },
  {
    id: 3,
    course_title: "Mathematics Advanced - HSC 27",
    price: 2800,
    thumbnail: null,
    batch: "HSC 27",
  },
];
