import { useEffect } from 'react';

/**
 * Global Keyboard Shortcut Hook
 * Handles key combinations (e.g., Cmd+K / Ctrl+K, Escape) with proper element focus checks
 */
export function useKeyboardShortcut(shortcuts = {}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      // Cmd+K or Ctrl+K for search / command palette
      if (isCmdOrCtrl && key === 'k') {
        if (shortcuts.onSearch) {
          event.preventDefault();
          shortcuts.onSearch(event);
        }
      }

      // Escape key for dismissing modals, popups, or search bars
      if (event.key === 'Escape') {
        if (shortcuts.onEscape) {
          shortcuts.onEscape(event);
        }
      }

      // Custom key combo if provided (e.g. 'slash')
      if (shortcuts[key] && !['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) {
        shortcuts[key](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export default useKeyboardShortcut;
