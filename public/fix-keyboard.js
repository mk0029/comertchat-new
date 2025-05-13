/**
 * This script fixes keyboard issues on mobile devices in PWA chat applications
 * It prevents the whole page from being pushed up when the keyboard appears
 */

(function() {
  // Original viewport height (before keyboard appears)
  let originalHeight = window.innerHeight;
  let isKeyboardOpen = false;
  
  // Function to handle viewport changes
  function setInitialViewportHeight() {
    const vh = originalHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Initial setup
  setInitialViewportHeight();
  
  // Function to resize chat interface
  function resizeChatInterface(keyboardHeight) {
    // Get elements
    const messagesWrapper = document.querySelector('.cometchat-messages-wrapper');
    const headerEl = document.querySelector('.cometchat-header-wrapper');
    const messageListEl = document.querySelector('.cometchat-message-list-wrapper');
    const composerEl = document.querySelector('.cometchat-composer-wrapper');
    
    // Get threaded message elements (for replies)
    const threadedMessageEl = document.querySelector('.cometchat-threaded-message');
    const threadHeaderEl = document.querySelector('.cometchat-threaded-message-header');
    const threadListEl = document.querySelector('.cometchat-threaded-message-list');
    const threadComposerEl = document.querySelector('.cometchat-threaded-message-composer');
    
    // Check if we're in the thread view
    const isThreadView = threadedMessageEl && threadedMessageEl.offsetParent !== null;
    
    // If we're in thread view, adjust the thread interface
    if (isThreadView && threadedMessageEl && threadHeaderEl && threadListEl) {
      if (keyboardHeight > 0) {
        // Calculate available height
        const availableHeight = window.innerHeight - keyboardHeight;
        
        // Set wrapper height to available height
        threadedMessageEl.style.height = `${availableHeight}px`;
        
        // Get header and composer heights
        const threadHeaderHeight = threadHeaderEl.offsetHeight || 65;
        const threadComposerHeight = threadComposerEl ? (threadComposerEl.offsetHeight || 56) : 0;
        
        // Set thread list height to fit available space
        const threadListHeight = availableHeight - threadHeaderHeight - threadComposerHeight;
        threadListEl.style.height = `${threadListHeight}px`;
        
        // Make sure thread composer stays in view
        if (threadComposerEl) {
          threadComposerEl.style.position = 'absolute';
          threadComposerEl.style.bottom = '0';
        }
        
        // Force redraw
        setTimeout(() => {
          window.scrollTo(0, 0);
          if (threadComposerEl) {
            threadComposerEl.scrollIntoView(false);
          }
        }, 50);
      } else {
        // Reset when keyboard is hidden
        threadedMessageEl.style.height = '';
        threadListEl.style.height = '';
        if (threadComposerEl) {
          threadComposerEl.style.position = '';
          threadComposerEl.style.bottom = '';
        }
        window.scrollTo(0, 0);
      }
      
      // Stop here if we're in thread view
      return;
    }
    
    // If we're in the main chat view and elements exist
    if (messagesWrapper && headerEl && messageListEl && composerEl) {
      // Get header height
      const headerHeight = headerEl.offsetHeight || 64;
      const composerHeight = composerEl.offsetHeight || 64;
      
      // When keyboard is shown
      if (keyboardHeight > 0) {
        // Calculate available height
        const availableHeight = window.innerHeight - keyboardHeight;
        
        // Set wrapper height to available height
        messagesWrapper.style.height = `${availableHeight}px`;
        
        // Set message list height to fit in the available space
        const messageListHeight = availableHeight - headerHeight - composerHeight;
        messageListEl.style.height = `${messageListHeight}px`;
        
        // Position composer at the bottom of the available space
        composerEl.style.position = 'absolute';
        composerEl.style.bottom = '0';
        
        // Force redraw to ensure everything fits
        setTimeout(() => {
          window.scrollTo(0, 0);
          
          // Ensure composer is visible
          composerEl.scrollIntoView(false);
        }, 50);
      } else {
        // Reset when keyboard is hidden
        messagesWrapper.style.height = '100%';
        messageListEl.style.height = '';
        composerEl.style.position = '';
        composerEl.style.bottom = '';
        
        // Reset scroll position
        window.scrollTo(0, 0);
      }
    }
  }
  
  // Check if VirtualKeyboard API is available
  if (navigator.virtualKeyboard) {
    // Use the VirtualKeyboard API
    navigator.virtualKeyboard.overlaysContent = true;
    
    // Listen for keyboard geometry changes
    navigator.virtualKeyboard.addEventListener('geometrychange', (event) => {
      const keyboardHeight = event.target.boundingRect.height;
      
      // Update UI classes
      if (keyboardHeight > 0) {
        document.body.classList.add('keyboard-open');
      } else {
        document.body.classList.remove('keyboard-open');
      }
      
      // Resize the entire chat interface
      resizeChatInterface(keyboardHeight);
    });
  } else {
    // Fallback to window resize detection for browsers without VirtualKeyboard API
    window.addEventListener('resize', function() {
      // Get current height
      const currentHeight = window.innerHeight;
      
      // Detect if keyboard is likely open (using 15% threshold)
      const heightReduction = originalHeight - currentHeight;
      const keyboardMaybeOpen = heightReduction > (originalHeight * 0.15);
      
      // Only handle state changes
      if (keyboardMaybeOpen !== isKeyboardOpen) {
        isKeyboardOpen = keyboardMaybeOpen;
        
        if (isKeyboardOpen) {
          // When keyboard opens
          document.body.classList.add('keyboard-open');
          
          // Calculate approximate keyboard height
          const keyboardHeight = heightReduction;
          
          // Resize the chat interface
          resizeChatInterface(keyboardHeight);
        } else {
          // When keyboard closes
          document.body.classList.remove('keyboard-open');
          
          // Reset interface
          resizeChatInterface(0);
        }
      }
    });
  }
  
  // Handle orientation changes
  window.addEventListener('orientationchange', function() {
    // Wait for orientation change to complete
    setTimeout(function() {
      originalHeight = window.innerHeight;
      setInitialViewportHeight();
      
      // Reset interface after orientation change
      isKeyboardOpen = false;
      resizeChatInterface(0);
    }, 200);
  });
  
  // Handle focusing on inputs
  document.addEventListener('focus', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (window.innerWidth <= 768) {
        // Add special class for styling
        document.body.classList.add('input-focused');
      }
    }
  }, true);
  
  // Remove special class when focus is lost
  document.addEventListener('blur', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      document.body.classList.remove('input-focused');
    }
  }, true);
})(); 