// This script handles the splash screen behavior
document.addEventListener('DOMContentLoaded', function() {
  // Get the splash screen element
  const splashScreen = document.getElementById('splash-screen');
  
  // Function to hide splash screen
  function hideSplashScreen() {
    splashScreen.classList.add('hidden');
    // Remove splash screen from DOM after transition completes
    setTimeout(() => {
      splashScreen.remove();
    }, 500); // Same duration as the CSS transition
  }

  // Hide splash screen when application is ready
  window.addEventListener('load', function() {
    // Wait for the React app to render content
    const root = document.getElementById('root');
    
    const checkContent = setInterval(function() {
      if (root.children.length > 0) {
        // Add a small delay to make sure the app is fully rendered
        setTimeout(hideSplashScreen, 500);
        clearInterval(checkContent);
      }
    }, 100);
    
    // Fallback to hide splash screen after 5 seconds
    // in case the load event doesn't fire for some reason
    setTimeout(hideSplashScreen, 5000);
  });
});
