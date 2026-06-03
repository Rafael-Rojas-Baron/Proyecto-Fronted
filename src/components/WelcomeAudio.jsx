import { useEffect } from 'react';

const AUDIO_SRC = '/Audio_Helados.mp3';
let playAttemptedThisLoad = false;

function tryPlay(audio) {
  return audio.play().catch(() => false);
}

export default function WelcomeAudio() {
  useEffect(() => {
    if (playAttemptedThisLoad) return;
    playAttemptedThisLoad = true;

    const audio = new Audio(AUDIO_SRC);
    audio.volume = 0.55;
    audio.preload = 'auto';

    const unlockAndPlay = () => {
      tryPlay(audio);
      document.removeEventListener('pointerdown', unlockAndPlay);
      document.removeEventListener('keydown', unlockAndPlay);
    };

    tryPlay(audio).then((ok) => {
      if (!ok) {
        document.addEventListener('pointerdown', unlockAndPlay, { once: true });
        document.addEventListener('keydown', unlockAndPlay, { once: true });
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('pointerdown', unlockAndPlay);
      document.removeEventListener('keydown', unlockAndPlay);
    };
  }, []);

  return null;
}
