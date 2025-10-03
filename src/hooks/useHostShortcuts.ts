import { useEffect } from 'react';

type ShortcutHandlers = {
  onCopyPin?: () => void;
  onStartGame?: () => void;
  onNextQuestion?: () => void;
  onShowHelp?: () => void;
};

export function useHostShortcuts(handlers: ShortcutHandlers = {}) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Ctrl/Cmd + C: Copy PIN
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && handlers.onCopyPin) {
        event.preventDefault();
        handlers.onCopyPin();
      }

      // Ctrl/Cmd + Enter: Start game or next question
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (handlers.onStartGame) {
          handlers.onStartGame();
        } else if (handlers.onNextQuestion) {
          handlers.onNextQuestion();
        }
      }

      // ? key: Show help
      if (event.key === '?' && handlers.onShowHelp) {
        event.preventDefault();
        handlers.onShowHelp();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers]);
}
