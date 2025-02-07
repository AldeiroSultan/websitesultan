document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let currentPage = 1;
    const totalPages = 5;
    let isAnimating = false;
    let lastScrollTime = 0;

    // Timeline State
    let timelineProgress = 0;
    let timelineComplete = false;
    const SCROLL_STEP = 33.33; // Simplified to 3 steps total

    // Initialize Elements
    const pages = {
        splitLeft: document.querySelector('.panel-left'),
        splitRight: document.querySelector('.panel-right'),
        page2: document.getElementById('page2'),
        page3: document.getElementById('page3'),
        page4: document.getElementById('page4'),
        page5: document.getElementById('page5'),
        timeline: {
            progress: document.querySelector('.timeline-progress'),
            points: document.querySelectorAll('.timeline-point'),
            cards: document.querySelectorAll('.timeline-card')
        }
    };

    // Handle Timeline Progress
    function updateTimeline(direction) {
        if (direction === 'down') {
            timelineProgress = Math.min(100, timelineProgress + SCROLL_STEP);
        } else if (direction === 'up') {
            timelineProgress = Math.max(0, timelineProgress - SCROLL_STEP);
        } else {
            timelineProgress = 0;
        }

        // Update progress bar
        if (pages.timeline.progress) {
            pages.timeline.progress.style.width = `${timelineProgress}%`;
        }

        // Update points and cards
        pages.timeline.points.forEach((point, index) => {
            const markPosition = index * 33.33;
            if (timelineProgress >= markPosition) {
                point.classList.add('active');
                pages.timeline.cards[index]?.classList.add('active');
            } else {
                point.classList.remove('active');
                pages.timeline.cards[index]?.classList.remove('active');
            }
        });

        timelineComplete = timelineProgress >= 100;
        return timelineComplete;
    }

    // Handle Page Transitions
    function handleTransition(direction) {
        if (direction === 'down') {
            switch(currentPage) {
                case 1: // Split panels
                    pages.splitLeft.style.transform = 'translateX(-100%)';
                    pages.splitRight.style.transform = 'translateX(100%)';
                    break;
                case 2: // About to Work Experience
                    pages.page2.style.transform = 'translateY(-100%)';
                    break;
                case 3: // Work Experience to Projects
                    if (timelineComplete) {
                        pages.page3.style.transform = 'translateX(-100%)';
                        pages.page4.style.transform = 'translateX(0)';
                    } else {
                        return false; // Prevent transition if timeline not complete
                    }
                    break;
                case 4: // Projects to Contact
                    pages.page4.style.transform = 'translateX(-100%)';
                    pages.page5.style.transform = 'translateY(0)';
                    break;
            }
        } else {
            switch(currentPage) {
                case 2: // Back to split panels
                    pages.splitLeft.style.transform = 'translateX(0)';
                    pages.splitRight.style.transform = 'translateX(0)';
                    break;
                case 3: // Back to About
                    pages.page2.style.transform = 'translateY(0)';
                    break;
                case 4: // Back to Work Experience
                    pages.page3.style.transform = 'translateX(0)';
                    pages.page4.style.transform = 'translateX(100%)';
                    timelineComplete = false;
                    timelineProgress = 0;
                    updateTimeline('reset');
                    break;
                case 5: // Back to Projects
                    pages.page5.style.transform = 'translateY(100%)';
                    pages.page4.style.transform = 'translateX(0)';
                    break;
            }
        }
        return true;
    }

    // Main Scroll Handler
    function handleScroll(event) {
        const now = Date.now();
        if (now - lastScrollTime < 800) return;
        lastScrollTime = now;

        if (isAnimating) return;
        
        const direction = event.deltaY > 0 ? 'down' : 'up';
        
        // Handle Work Experience Timeline
        if (currentPage === 3 && !timelineComplete && direction === 'down') {
            updateTimeline(direction);
            return;
        }

        // Handle Page Transitions
        if (direction === 'down' && currentPage < totalPages) {
            if (handleTransition('down')) {
                isAnimating = true;
                currentPage++;
            }
        } else if (direction === 'up' && currentPage > 1) {
            isAnimating = true;
            handleTransition('up');
            currentPage--;
        }

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Touch Support
    let touchStartY = 0;
    
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (isAnimating) return;
        
        const touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) > 50) {
            handleScroll({ deltaY: deltaY });
            touchStartY = touchEndY;
        }
    }

    // Initialize
    function init() {
        // Set initial states
        if (pages.page4) {
            pages.page4.style.transform = 'translateX(100%)';
        }
        
        // Reset timeline
        timelineProgress = 0;
        timelineComplete = false;
        
        if (pages.timeline.progress) {
            pages.timeline.progress.style.width = '0';
        }

        // Event Listeners
        window.addEventListener('wheel', handleScroll);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
    }

    // Start the application
    init();
});