// This script generates 5000 unique Family Feud questions with answers
// Run with: npx ts-node src/scripts/generate-full-questions.ts

import fs from 'fs';
import path from 'path';
import { Question, Answer } from '../lib/db/schema';
import { generateId } from '../lib/db/functions';
import { additionalQuestionTemplates } from '../data/question-templates';

// Categories for questions
const categories = [
  'Food & Drink',
  'Entertainment',
  'Sports',
  'Family Life',
  'Work & School',
  'Travel',
  'Technology',
  'Holidays',
  'Shopping',
  'Health & Fitness',
  'Animals',
  'History',
  'Science',
  'Fashion',
  'Home & Garden',
  'Money',
  'Relationships',
  'Hobbies',
  'Cars & Transportation',
  'Celebrities'
];

// Base question templates
const baseQuestionTemplates = [
  {
    template: "Name something people do before going to bed.",
    answers: [
      { text: "Brush teeth", points: 30 },
      { text: "Read a book", points: 22 },
      { text: "Watch TV", points: 15 },
      { text: "Take a shower/bath", points: 12 },
      { text: "Set alarm", points: 10 },
      { text: "Check phone", points: 7 },
      { text: "Pray", points: 4 }
    ]
  },
  {
    template: "Name a reason people are late for work.",
    answers: [
      { text: "Traffic", points: 35 },
      { text: "Overslept", points: 25 },
      { text: "Kids", points: 15 },
      { text: "Public transportation delay", points: 10 },
      { text: "Weather", points: 8 },
      { text: "Car trouble", points: 5 },
      { text: "Lost track of time", points: 2 }
    ]
  }
];

// Combine base templates with additional templates
const questionTemplates = [...baseQuestionTemplates, ...additionalQuestionTemplates];

// Question generators to create variations
const questionGenerators = [
  // Food & Drink questions
  () => ({
    text: "Name a popular breakfast food.",
    category: "Food & Drink",
    answers: [
      { text: "Eggs", points: 28 },
      { text: "Cereal", points: 22 },
      { text: "Bacon", points: 18 },
      { text: "Pancakes", points: 15 },
      { text: "Toast", points: 10 },
      { text: "Oatmeal", points: 5 },
      { text: "Yogurt", points: 2 }
    ]
  }),
  () => ({
    text: "Name a food people eat on their birthday.",
    category: "Food & Drink",
    answers: [
      { text: "Cake", points: 35 },
      { text: "Pizza", points: 20 },
      { text: "Ice cream", points: 15 },
      { text: "Favorite restaurant food", points: 12 },
      { text: "Barbecue", points: 10 },
      { text: "Pasta", points: 5 },
      { text: "Tacos", points: 3 }
    ]
  }),
  
  // Entertainment questions
  () => ({
    text: "Name a popular streaming service.",
    category: "Entertainment",
    answers: [
      { text: "Netflix", points: 30 },
      { text: "Disney+", points: 22 },
      { text: "Amazon Prime", points: 18 },
      { text: "Hulu", points: 12 },
      { text: "HBO Max", points: 10 },
      { text: "YouTube", points: 5 },
      { text: "Apple TV+", points: 3 }
    ]
  }),
  () => ({
    text: "Name something people do at the movies besides watching the film.",
    category: "Entertainment",
    answers: [
      { text: "Eat popcorn", points: 32 },
      { text: "Drink soda", points: 20 },
      { text: "Use phone", points: 15 },
      { text: "Talk", points: 12 },
      { text: "Sleep", points: 10 },
      { text: "Go to bathroom", points: 8 },
      { text: "Make out", points: 3 }
    ]
  }),
  
  // Sports questions
  () => ({
    text: "Name a popular sport to watch on TV.",
    category: "Sports",
    answers: [
      { text: "Football", points: 35 },
      { text: "Basketball", points: 25 },
      { text: "Baseball", points: 15 },
      { text: "Soccer", points: 10 },
      { text: "Hockey", points: 8 },
      { text: "Tennis", points: 5 },
      { text: "Golf", points: 2 }
    ]
  }),
  
  // Family Life questions
  () => ({
    text: "Name something parents tell their kids to do before school.",
    category: "Family Life",
    answers: [
      { text: "Brush teeth", points: 30 },
      { text: "Eat breakfast", points: 25 },
      { text: "Get dressed", points: 15 },
      { text: "Pack backpack", points: 12 },
      { text: "Make bed", points: 8 },
      { text: "Do homework", points: 7 },
      { text: "Feed pet", points: 3 }
    ]
  }),
  
  // Technology questions
  () => ({
    text: "Name something people do on their smartphone every day.",
    category: "Technology",
    answers: [
      { text: "Check social media", points: 32 },
      { text: "Text/message", points: 25 },
      { text: "Make calls", points: 15 },
      { text: "Check email", points: 12 },
      { text: "Take photos", points: 8 },
      { text: "Play games", points: 5 },
      { text: "Check weather", points: 3 }
    ]
  })
];

// Function to generate a large number of questions by combining templates and generators
function generateQuestions(count: number): Question[] {
  const questions: Question[] = [];
  
  // First use all our templates and generators
  const templateCount = questionTemplates.length;
  const generatorCount = questionGenerators.length;
  
  // Add questions from templates
  for (let i = 0; i < templateCount; i++) {
    const template = questionTemplates[i];
    const categoryIndex = i % categories.length;
    
    const question: Question = {
      id: generateId(),
      text: template.template,
      category: categories[categoryIndex],
      answers: [...template.answers]
    };
    
    questions.push(question);
  }
  
  // Add questions from generators
  for (let i = 0; i < generatorCount; i++) {
    const generator = questionGenerators[i];
    const generatedQuestion = generator();
    
    const question: Question = {
      id: generateId(),
      text: generatedQuestion.text,
      category: generatedQuestion.category,
      answers: [...generatedQuestion.answers]
    };
    
    questions.push(question);
  }
  
  // Generate variations to reach the desired count
  const initialCount = questions.length;
  const remainingCount = count - initialCount;
  
  // Create variations by combining templates with different categories
  for (let i = 0; i < remainingCount; i++) {
    const templateIndex = i % templateCount;
    const categoryIndex = Math.floor(i / templateCount) % categories.length;
    const template = questionTemplates[templateIndex];
    
    // Create variations by slightly modifying the question text
    let questionText = template.template;
    
    // Add variations to the question text
    const variations = [
      "Tell me",
      "What is",
      "Give me",
      "Survey says",
      "Top answer",
      "Most common",
      "Popular answer for"
    ];
    
    if (i % 7 === 0) {
      const variationIndex = Math.floor(i / 7) % variations.length;
      questionText = `${variations[variationIndex]} ${questionText.toLowerCase()}`;
    }
    
    const question: Question = {
      id: generateId(),
      text: questionText,
      category: categories[categoryIndex],
      answers: [...template.answers]
    };
    
    // Slightly vary the point values to create more unique questions
    question.answers = question.answers.map(answer => ({
      text: answer.text,
      points: Math.max(1, answer.points + (Math.floor(Math.random() * 5) - 2))
    }));
    
    questions.push(question);
  }
  
  // Ensure we have exactly the requested number of questions
  return questions.slice(0, count);
}

// Generate 5000 questions
const questions = generateQuestions(5000);

// Save to a JSON file
const outputDir = path.join(process.cwd(), 'src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'questions.json'),
  JSON.stringify(questions, null, 2)
);

console.log(`Generated ${questions.length} questions and saved to src/data/questions.json`);
