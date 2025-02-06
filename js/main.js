document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let currentPage = 1;
    const totalPages = 5;
    let isAnimating = false;
    let lastScrollTime = 0;

    // Timeline State Management
    let timelineProgress = 0;
    let timelineComplete = false;
    let scrollCounter = 0;
    const MARKS = [0, 33.33, 66.66, 100];
    const SCROLL_STEP = 11.11; // 33.33% / 3 scrolls

    // Initialize Elements
    const pages = {
        splitLeft: document.querySelector('.panel-left'),
        splitRight: document.querySelector('.panel-right'),
        contentWrapper: document.querySelector('.content-wrapper'),
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

        // Find nearest mark for snapping
        const nearestMark = MARKS.reduce((prev, curr) => {
            return (Math.abs(curr - timelineProgress) < Math.abs(prev - timelineProgress) ? curr : prev);
        });

        // Snap to mark if close enough
        if (Math.abs(timelineProgress - nearestMark) < SCROLL_STEP / 2) {
            timelineProgress = nearestMark;
        }

        // Update progress bar
        if (pages.timeline.progress) {
            pages.timeline.progress.style.width = `${timelineProgress}%`;
        }

        // Update points and cards
        pages.timeline.points.forEach((point, index) => {
            const markPosition = MARKS[index];
            const isAtMark = Math.abs(timelineProgress - markPosition) < 0.1;
            
            // Update point state
            if (timelineProgress >= markPosition) {
                point.classList.add('active');
            } else {
                point.classList.remove('active');
            }

            // Update card state
            const card = pages.timeline.cards[index];
            if (card && isAtMark) {
                card.classList.add('active');
            } else if (card) {
                card.classList.remove('active');
            }
        });

        // Check completion
        timelineComplete = timelineProgress >= 100;
        return timelineComplete;
    }

    // Handle Page Transitions
    function handleTransition(direction) {
        if (direction === 'down') {
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
        } else {
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
                        // Reset timeline when going back
                        timelineProgress = 0;
                        timelineComplete = false;
                        scrollCounter = 0;
                        updateTimeline('reset');
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
    }

    // Projects Page Parallax
    function handleParallax(e) {
        if (currentPage !== 4) return;

        requestAnimationFrame(() => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            const items = document.querySelectorAll('.project-item');
            items.forEach(item => {
                const speed = parseFloat(item.getAttribute('data-speed'));
                const x = mouseX * 30 * speed;
                const y = mouseY * 30 * speed;
                item.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Main Scroll Handler
    function handleScroll(event) {
        const now = Date.now();
        if (now - lastScrollTime < 300) return;
        lastScrollTime = now;

        if (isAnimating) return;
        
        const direction = event.deltaY > 0 ? 'down' : 'up';
        
        // Handle Work Experience Timeline
        if (currentPage === 3 && !timelineComplete) {
            event.preventDefault();
            const isComplete = updateTimeline(direction);
            if (!isComplete) return;
        }

        // Handle Page Transitions
        if (direction === 'down' && currentPage < totalPages) {
            isAnimating = true;
            handleTransition('down');
            currentPage++;
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

    // Event Listeners
    window.addEventListener('wheel', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleParallax);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initialize
    if (pages.contentWrapper) {
        pages.contentWrapper.style.display = 'block';
    }
});