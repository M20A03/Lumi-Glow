import { useState, useEffect } from 'react';

/**
 * Custom hook to detect viewport breakpoints accurately with debouncing.
 * Breakpoints aligned with modern device categories:
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Laptop: 1024px - 1439px (covers 1366x768)
 * - Desktop: >= 1440px (covers 1920x1080 and 4K)
 */
export function useBreakpoint() {
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 1200, height: 800 };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  });

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 60);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const width = windowSize.width;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isLaptop = width >= 1024 && width < 1440;
  const isDesktop = width >= 1440;
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isTouchDevice,
  };
}

export default useBreakpoint;
