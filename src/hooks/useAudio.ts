import { useCallback, useRef } from 'react';

export const useAudio = (url: string) => {
  const audio = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (!audio.current) {
      audio.current = new Audio(url);
    }
    audio.current.currentTime = 0;
    audio.current.play().catch(e => console.log('Audio play blocked or failed:', e));
  }, [url]);

  return play;
};
