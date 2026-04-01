import quizData from '../components/quiz/quiz.json';

console.log('Available quiz topics:', Object.keys(quizData)); // Debug log

export function getQuizByTopic(topic) {
  console.log(`Getting quiz for topic: ${topic}`); // Debug log
  // quiz.json structure: { categories: {..}, quizzes: { [topicId]: {..} } }
  const quiz = (quizData && quizData.quizzes) ? quizData.quizzes[topic] : null;
  console.log('Found quiz:', quiz ? quiz.title : 'Not found'); // Debug log
  return quiz || null;
}

export function getAllQuizzes() {
  // Only process the quizzes object, not the entire quizData
  const quizzes = quizData.quizzes || {};
  
  const result = Object.entries(quizzes).map(([key, quiz]) => ({
    id: quiz.id || key,
    title: quiz.title || key.charAt(0).toUpperCase() + key.slice(1),
    description: quiz.description || '',
    difficulty: quiz.difficulty || 'Medium',
    duration: quiz.duration || 0,
    // Determine category based on ID or title if not explicitly set
    category: quiz.category || (key.startsWith('sap') || (quiz.title && quiz.title.toLowerCase().includes('sap')) ? 'sap' : 'non-sap'),
    icon: quiz.icon || '❓',
    questions: quiz.questions || [],
    questionCount: Array.isArray(quiz.questions) ? quiz.questions.length : 0
  }));

  console.log('Processed quizzes:', result);
  return result;
}
