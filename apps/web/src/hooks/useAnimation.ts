/**
 * DuitDiary - useAnimation Hook
 * Custom hook for common animation patterns
 */

import { useEffect, useState } from 'react';

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

export const useAnimation = (shouldAnimate: boolean = true) => {
  const [isVisible, setIsVisible] = useState(!shouldAnimate);

  useEffect(() => {
    if (shouldAnimate) {
      setIsVisible(true);
    }
  }, [shouldAnimate]);

  const getTransitionClass = (config?: AnimationConfig) => {
    if (!shouldAnimate) return '';
    
    const duration = config?.duration || 300;
    const delay = config?.delay || 0;
    const easing = config?.easing || 'ease-in-out';

    return `transition-all duration-${duration} delay-${delay} ${easing}`;
  };

  const getVariants = (config?: AnimationConfig) => {
    const duration = (config?.duration || 300) / 1000;
    const delay = (config?.delay || 0) / 1000;

    return {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: 'easeOut',
        },
      },
      exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 },
      },
    };
  };

  const getHoverVariants = () => ({
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  });

  return {
    isVisible,
    getTransitionClass,
    getVariants,
    getHoverVariants,
  };
};
