/**
 * This utility handles viewport height adjustments for mobile devices,
 * especially when the keyboard is open. It helps to keep the chat interface
 * properly sized and prevents the entire app from being pushed upwards.
 */

// Set viewport height correctly (especially for mobile)
export const setInitialViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Handle viewport resize and orientation change
export const setupViewportHandler = () => {
  // Initial setup
  setInitialViewportHeight();

  // Set up resize and orientation change listeners
  window.addEventListener('resize', () => {
    // Short timeout to ensure we get the final height after keyboard appears/disappears
    setTimeout(() => {
      setInitialViewportHeight();
    }, 100);
  });

  window.addEventListener('orientationchange', () => {
    // Wait for orientation change to complete
    setTimeout(() => {
      setInitialViewportHeight();
    }, 200);
  });

  // Handle focusing on input - prevents scrolling issues
  document.addEventListener('focus', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      // Prevent scrolling to input if on mobile
      if (window.innerWidth <= 768) {
        window.scrollTo(0, 0);
      }
    }
  }, true);
}; 