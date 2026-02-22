export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const LEADERBOARD_KEY = 'ramadan_challenge_leaderboard';

export const getLeaderboard = (): LeaderboardEntry[] => {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveScore = (name: string, score: number) => {
  const leaderboard = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    name,
    score,
    date: new Date().toISOString(),
  };
  
  const updatedLeaderboard = [...leaderboard, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
    
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
};
