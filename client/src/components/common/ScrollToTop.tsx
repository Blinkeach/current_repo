import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

// Store scroll positions for each route
const scrollPositions = new Map<string, number>();

const ScrollToTop = () => {
  const [location] = useLocation();
  const previousLocation = useRef<string>(location);
  const isNavigatingBack = useRef<boolean>(false);

  useEffect(() => {
    // Save scroll position before route changes
    const saveScrollPosition = () => {
      scrollPositions.set(previousLocation.current, window.scrollY);
    };

    // Listen for popstate (back/forward navigation)
    const handlePopState = () => {
      isNavigatingBack.current = true;
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  useEffect(() => {
    // Save current scroll position before navigating away
    if (previousLocation.current !== location) {
      scrollPositions.set(previousLocation.current, window.scrollY);
    }

    // Immediate scroll to prevent flash
    if (!isNavigatingBack.current) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (isNavigatingBack.current) {
        // Restore scroll position when navigating back
        const savedPosition = scrollPositions.get(location);
        if (savedPosition !== undefined) {
          window.scrollTo({
            top: savedPosition,
            left: 0,
            behavior: 'instant'
          });
        } else {
          // If no saved position, scroll to top
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
          });
        }
        isNavigatingBack.current = false;
      } else {
        // Scroll to top for new navigation (forward)
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }

      previousLocation.current = location;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [location]);

  // Scroll to top on initial page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

  return null;
};

export default ScrollToTop;