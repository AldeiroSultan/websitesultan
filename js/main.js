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
        page2: document.getElementById('page2'),  // About
        page3: document.getElementById('page3'),  // Work Experience
        page4: document.getElementById('page4'),  // Projects
        page5: document.getElementById('page5')   // Contact
    };

    // Debug check
    Object.entries(pages).forEach(([key, element]) => {
        if (!element) console.warn(`Element ${key} not found`);
    });

    // Show content wrapper initially
    if (pages.contentWrapper) {
        pages.contentWrapper.style.display = 'block';
    }

    // Handle forward transitions
    function transitionForward() {
        switch(currentPage) {
            case 1: // Split panels
                if (pages.splitLeft && pages.splitRight) {
                    pages.splitLeft.style.transform = 'translateX(-100%)';
                    pages.splitRight.style.transform = 'translateX(100%)';
                }
                break;
            case 2: // About to Work Experience
                if (pages.page2) {
                    pages.page2.style.transform = 'translateY(-100%)';
                }
                break;
            case 3: // Work Experience to Projects
                if (pages.page3) {
                    pages.page3.style.transform = 'translateX(-100%)';
                }
                break;
            case 4: // Projects to Contact
                if (pages.page5) {
                    pages.page5.style.transform = 'translateY(0)';
                    pages.page5.style.zIndex = '6';
                }
                break;
        }
    }

    // Handle backward transitions
    function transitionBackward() {
        switch(currentPage) {
            case 2: // Back to split panels
                if (pages.splitLeft && pages.splitRight) {
                    pages.splitLeft.style.transform = 'translateX(0)';
                    pages.splitRight.style.transform = 'translateX(0)';
                }
                break;
            case 3: // Back to About
                if (pages.page2) {
                    pages.page2.style.transform = 'translateY(0)';
                }
                break;
            case 4: // Back to Work Experience
                if (pages.page3) {
                    pages.page3.style.transform = 'translateX(0)';
                }
                break;
            case 5: // Back to Projects
                if (pages.page5) {
                    pages.page5.style.transform = 'translateY(100%)';
                    setTimeout(() => {
                        pages.page5.style.zIndex = '1';
                    }, 800);
                }
                break;
        }
    }

    // Handle Work Experience Timeline
    function handleTimeline(direction) {
        const timelineContent = document.querySelector('.timeline-content');
        const progress = document.querySelector('.timeline-progress');
        const cards = document.querySelectorAll('.timeline-card');
        const points = document.querySelectorAll('.timeline-point');
        
        if (direction === 'down') {
            timelineScrollPosition = Math.min(100, timelineScrollPosition + 2);
        } else {
            timelineScrollPosition = Math.max(0, timelineScrollPosition - 2);
        }

        if (timelineContent) {
            timelineContent.style.transform = `translateX(-${timelineScrollPosition}%)`;
        }
        if (progress) {
            progress.style.width = `${timelineScrollPosition}%`;
        }

        // Activate cards and points
        cards.forEach((card, index) => {
            const threshold = (index + 1) * 25;
            if (timelineScrollPosition >= threshold - 10) {
                card.classList.add('active');
                points[index]?.classList.add('active');
            } else {
                card.classList.remove('active');
                points[index]?.classList.remove('active');
            }
        });

        if (timelineScrollPosition >= 100) {
            isTimelineComplete = true;
        }
    }

    // Projects Page Parallax
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

    // Main Scroll Handler
    function handleScroll(event) {
        const now = Date.now();
        if (now - lastScrollTime < 800) return;
        lastScrollTime = now;

        if (isAnimating) return;
        
        const direction = event.deltaY > 0 ? 'down' : 'up';
        
        // Handle Work Experience Timeline
        if (currentPage === 3 && !isTimelineComplete) {
            handleTimeline(direction);
            return;
        }

        if (direction === 'down' && currentPage < totalPages) {
            isAnimating = true;
            transitionForward();
            currentPage++;
        } else if (direction === 'up' && currentPage > 1) {
            isAnimating = true;
            transitionBackward();
            currentPage--;
        }

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Mobile Touch Support
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

    // Event Listeners
    window.addEventListener('wheel', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleParallax);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle window resize
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });

    // Initialize page states
    if (pages.page5) {
        pages.page5.style.transform = 'translateY(100%)';
    }
});