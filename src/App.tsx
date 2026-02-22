/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { AdminScreen } from './components/AdminScreen';
import { AppState, Question } from './types';
import { useAudio } from './hooks/useAudio';
import { saveScore } from './utils/leaderboard';
import { getQuestions } from './utils/questions';

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [userName, setUserName] = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [moonClicks, setMoonClicks] = useState(0);

  useEffect(() => {
    setQuestions(getQuestions());
  }, [appState]);

  const handleMoonClick = () => {
    if (appState !== 'welcome') return;
    
    const newClicks = moonClicks + 1;
    if (newClicks >= 3) {
      setAppState('admin');
      setMoonClicks(0);
    } else {
      setMoonClicks(newClicks);
      // Reset clicks after 2 seconds of inactivity
      setTimeout(() => setMoonClicks(0), 2000);
    }
  };

  const playTransition = useAudio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');

  useEffect(() => {
    playTransition();
  }, [appState, playTransition]);

  const handleStart = (name: string) => {
    setUserName(name);
    setAppState('quiz');
  };

  const handleQuizComplete = (score: number) => {
    setFinalScore(score);
    saveScore(userName, score);
    setAppState('results');
  };

  const handleRestart = () => {
    setAppState('welcome');
    setFinalScore(0);
  };

  return (
    <Layout onMoonClick={handleMoonClick}>
      {appState === 'welcome' && (
        <WelcomeScreen 
          onStart={handleStart} 
        />
      )}
      
      {appState === 'quiz' && (
        <QuizScreen onComplete={handleQuizComplete} questions={questions} />
      )}
      
      {appState === 'results' && (
        <ResultsScreen 
          userName={userName} 
          score={finalScore} 
          total={questions.length} 
          onRestart={handleRestart} 
        />
      )}

      {appState === 'admin' && (
        <AdminScreen onBack={() => setAppState('welcome')} />
      )}
    </Layout>
  );
}
