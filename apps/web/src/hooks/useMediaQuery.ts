/**
 * DuitDiary - useMediaQuery Hook
 * Detect screen size and adjust animations accordingly
 */

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * Check if device is mobile (< 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * Check if device is tablet (768px - 1024px)
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * Check if device is desktop (> 1024px)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * Get animation config based on device
 */
export function useResponsiveAnimationConfig() {
  const isMobile = useIsMobile();

  return {
    // Reduce complexity on mobile
    shouldAnimateHover: !isMobile,
    shouldAnimateBackground: !isMobile,
    shouldAnimateScale: !isMobile,
    
    // Use faster transitions on mobile
    transitionDuration: isMobile ? 0.15 : 0.3,
    
    // Reduce stagger on mobile for snappier feel
    staggerDelay: isMobile ? 0.05 : 0.1,
    
    // Less aggressive scale on mobile
    hoverScale: isMobile ? 1.01 : 1.02,
    tapScale: isMobile ? 0.97 : 0.95,
  };
}
