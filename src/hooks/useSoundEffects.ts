import { useState, useEffect, useCallback } from 'react';

type SoundEffects = {
  correctSoundUrl?: string;
  wrongSoundUrl?: string;
  eliminationSoundUrl?: string;
};

export function useSoundEffects() {
  const [sounds, setSounds] = useState<SoundEffects>({});
  const [audioElements, setAudioElements] = useState<{
    correct?: HTMLAudioElement;
    wrong?: HTMLAudioElement;
    elimination?: HTMLAudioElement;
  }>({});

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const settings = await res.json();
          setSounds({
            correctSoundUrl: settings.correctSoundUrl,
            wrongSoundUrl: settings.wrongSoundUrl,
            eliminationSoundUrl: settings.eliminationSoundUrl,
          });
        }
      } catch (error) {
        console.error('Failed to fetch sound settings:', error);
      }
    };

    fetchSounds();
  }, []);

  useEffect(() => {
    const newAudioElements: typeof audioElements = {};

    if (sounds.correctSoundUrl) {
      newAudioElements.correct = new Audio(sounds.correctSoundUrl);
    }
    if (sounds.wrongSoundUrl) {
      newAudioElements.wrong = new Audio(sounds.wrongSoundUrl);
    }
    if (sounds.eliminationSoundUrl) {
      newAudioElements.elimination = new Audio(sounds.eliminationSoundUrl);
    }

    setAudioElements(newAudioElements);

    return () => {
      Object.values(newAudioElements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [sounds]);

  const playCorrect = useCallback(() => {
    if (audioElements.correct) {
      audioElements.correct.currentTime = 0;
      audioElements.correct.play().catch(err => console.error('Error playing correct sound:', err));
    }
  }, [audioElements.correct]);

  const playWrong = useCallback(() => {
    if (audioElements.wrong) {
      audioElements.wrong.currentTime = 0;
      audioElements.wrong.play().catch(err => console.error('Error playing wrong sound:', err));
    }
  }, [audioElements.wrong]);

  const playElimination = useCallback(() => {
    if (audioElements.elimination) {
      audioElements.elimination.currentTime = 0;
      audioElements.elimination.play().catch(err => console.error('Error playing elimination sound:', err));
    }
  }, [audioElements.elimination]);

  return {
    playCorrect,
    playWrong,
    playElimination,
    hasCorrectSound: !!sounds.correctSoundUrl,
    hasWrongSound: !!sounds.wrongSoundUrl,
    hasEliminationSound: !!sounds.eliminationSoundUrl,
  };
}
