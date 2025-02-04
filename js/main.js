// State management
let currentPage = 1;
const totalPages = 5;
let isAnimating = false;
let lastScrollTime = 0;

// Scroll handler
function handleScroll(event) {
    const now = Date.now();
    if (now - lastScrollTime < 800) return; // Debounce
    lastScrollTime = now;

    if (isAnimating) return;
    
    const direction = event.deltaY > 0 ? 'down' : 'up';
    
    // Handle page transitions
    handlePageTransition(direction);
}

// Page transition logic
function handlePageTransition(direction) {
    // Your transition logic here
}

// Mouse move parallax effect for projects
function handleParallax(e) {
    // Your parallax logic here
}

// Event listeners
window.addEventListener('wheel', handleScroll);
document.addEventListener('mousemove', handleParallax);