// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let currentPage = 1;
    const totalPages = 5;
    let isAnimating = false;
    let lastScrollTime = 0;
    let timelineScrollPosition = 0;
    let isTimelineComplete = false;

    // Initialize elements
    const pages = {
        splitContainer: document.querySelector('.split-container'),
        splitLeft: document.querySelector('.panel-left'),
        splitRight: document.querySelector('.panel-right'),
        contentWrapper: document.querySelector('.content-wrapper'),
        page2: document.getElementById('page2'),
        page3: document.getElementById('page3'),
        page4: document.getElementById('page4'),
        page5: document.getElementById('page5')
    };

    // Debug check - make sure elements are found
    Object.entries(pages).forEach(([key, element]) => {
        if (!element) {
            console.warn(`Element ${key} not found`);
        }
    });

    // Transition Handler
    function handleTransition(direction) {
        if (direction === 'down') {
            switch(currentPage) {
                case 1:
                    if (pages.splitLeft && pages.splitRight) {
                        pages.splitLeft.style.transform = 'translateX(-100%)';
                        pages.splitRight.style.transform = 'translateX(100%)';
                        // Show content wrapper after split animation
                        setTimeout(() => {
                            pages.contentWrapper.style.display = 'block';
                        }, 800);
                    }
                    break;
                case 2:
                    if (pages.page2) {
                        pages.page2.style.transform = 'translateY(-100%)';
                    }
                    break;
                case 3:
                    if (pages.page3) {
                        pages.page3.style.transform = 'translateX(-100%)';
                    }
                    break;
                case 4:
                    if (pages.page5) {
                        pages.page5.style.transform = 'translateY(0)';
                        pages.page5.style.zIndex = '6';
                    }
                    break;
            }
        } else {
            switch(currentPage) {
                case 2:
                    if (pages.splitLeft && pages.splitRight) {
                        pages.splitLeft.style.transform = 'translateX(0)';
                        pages.splitRight.style.transform = 'translateX(0)';
                        setTimeout(() => {
                            pages.contentWrapper.style.display = 'none';
                        }, 800);
                    }
                    break;
                case 3:
                    if (pages.page2) {
                        pages.page2.style.transform = 'translateY(0)';
                    }
                    break;
                case 4:
                    if (pages.page3) {
                        pages.page3.style.transform = 'translateX(0)';
                    }
                    break;
                case 5:
                    if (pages.page5) {
                        pages.page5.style.transform = 'translateY(100%)';
                        setTimeout(() => {
                            pages.page5.style.zIndex = '1';
                        }, 800);
                    }
                    break;
            }
        }
    }

    // Timeline Scroll Handler
    function handleTimelineScroll(direction) {
        const timelineContent = document.querySelector('.timeline-content');
        const progress = document.querySelector('.timeline-progress');
        const cards = document.querySelectorAll('.timeline-card');
        
        if (direction === 'down') {
            timelineScrollPosition = Math.min(100, timelineScrollPosition + 2);
        } else {
            timelineScrollPosition = Math.max(0, timelineScrollPosition - 2);
        }

        // Update timeline position and progress
        if (timelineContent) {
            timelineContent.style.transform = `translateX(-${timelineScrollPosition}%)`;
        }
        if (progress) {
            progress.style.width = `${timelineScrollPosition}%`;
        }

        // Show cards based on progress
        cards.forEach((card, index) => {
            const threshold = (index + 1) * 25; // 25% intervals for 4 cards
            if (timelineScrollPosition >= threshold - 10) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Check if timeline is complete
        if (timelineScrollPosition >= 100) {
            isTimelineComplete = true;
        }
    }

    // Scroll Handler
    function handleScroll(event) {
        const now = Date.now();
        if (now - lastScrollTime < 800) return; // Debounce scroll events
        lastScrollTime = now;

        if (isAnimating) return;
        
        const direction = event.deltaY > 0 ? 'down' : 'up';
        
        // Handle timeline scrolling on page 3
        if (currentPage === 3 && !isTimelineComplete) {
            handleTimelineScroll(direction);
            return;
        }
        
        if (direction === 'down' && currentPage < totalPages) {
            isAnimating = true;
            handleTransition('down');
            currentPage++;
            console.log('Moving to page:', currentPage);
        } else if (direction === 'up' && currentPage > 1) {
            isAnimating = true;
            handleTransition('up');
            currentPage--;
            console.log('Moving to page:', currentPage);
        }

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Projects Page Parallax Effect
    function handleParallax(e) {
        if (currentPage !== 4) return;

        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        const items = document.querySelectorAll('.project-item');
        items.forEach(item => {
            const speed = parseFloat(item.getAttribute('data-speed'));
            const x = mouseX * 30 * speed;
            const y = mouseY * 30 * speed;
            item.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Handle resize events
    function handleResize() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
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
        
        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
            handleScroll({ deltaY: deltaY });
            touchStartY = touchEndY;
        }
    }

    // Initialize
    function init() {
        // Set initial states
        handleResize();
        
        // Event Listeners
        window.addEventListener('wheel', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        document.addEventListener('mousemove', handleParallax);
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        
        // Remove transition stopper after load
        setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 100);
    }

    // Start the application
    init();
});