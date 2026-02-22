import { Question } from '../types';
import { QUESTIONS as INITIAL_QUESTIONS } from '../constants';

const QUESTIONS_KEY = 'ramadan_challenge_questions';

export const getQuestions = (): Question[] => {
  const data = localStorage.getItem(QUESTIONS_KEY);
  if (!data) {
    // Initialize with default questions if empty
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(INITIAL_QUESTIONS));
    return INITIAL_QUESTIONS;
  }
  return JSON.parse(data);
};

export const saveQuestions = (questions: Question[]) => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const addQuestion = (question: Omit<Question, 'id'>) => {
  const questions = getQuestions();
  const newQuestion: Question = {
    ...question,
    id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
  };
  saveQuestions([...questions, newQuestion]);
  return newQuestion;
};

export const updateQuestion = (updatedQuestion: Question) => {
  const questions = getQuestions();
  const updated = questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
  saveQuestions(updated);
};

export const deleteQuestion = (id: number) => {
  const questions = getQuestions();
  const filtered = questions.filter(q => q.id !== id);
  saveQuestions(filtered);
};

export const resetQuestions = () => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(INITIAL_QUESTIONS));
  return INITIAL_QUESTIONS;
};
