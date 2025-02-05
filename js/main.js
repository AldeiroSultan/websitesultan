document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let currentPage = 1;
    const totalPages = 5;
    let isAnimating = false;
    let lastScrollTime = 0;
    let timelinePosition = 0;
    let timelineComplete = false;

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
            content: document.querySelector('.timeline-content'),
            progress: document.querySelector('.timeline-progress'),
            cards: document.querySelectorAll('.timeline-card'),
            points: document.querySelectorAll('.timeline-point'),
            sections: document.querySelectorAll('.timeline-section')
        }
    };

    // Initialize Timeline
    function initTimeline() {
        if (pages.timeline.sections) {
            pages.timeline.sections.forEach((section, index) => {
                section.style.transform = `translateX(${index * 100}%)`;
            });
        }
    }

    // Handle Timeline Scrolling
    function handleTimeline(direction) {
        const step = 5; // Increased step size for faster scrolling
        timelinePosition = direction === 'down' 
            ? Math.min(100, timelinePosition + step)
            : Math.max(0, timelinePosition - step);

        // Update progress bar
        if (pages.timeline.progress) {
            pages.timeline.progress.style.width = `${timelinePosition}%`;
        }

        // Calculate which section should be visible
        const sectionIndex = Math.floor(timelinePosition / 25);
        const offset = -(sectionIndex * 100);

        // Center the current section
        if (pages.timeline.content) {
            pages.timeline.content.style.transform = `translateX(${offset}%)`;
        }

        // Update cards and points
        pages.timeline.cards.forEach((card, index) => {
            if (index <= sectionIndex) {
                card.classList.add('active');
                pages.timeline.points[index]?.classList.add('active');
            } else {
                card.classList.remove('active');
                pages.timeline.points[index]?.classList.remove('active');
            }
        });

        // Check if timeline is complete
        if (timelinePosition >= 100) {
            timelineComplete = true;
        }
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
                        initTimeline(); // Initialize timeline when entering work experience page
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
                        timelineComplete = false;
                        timelinePosition = 0;
                        handleTimeline('up');
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

    // Projects Page Parallax Effect
    function handleParallax(e) {
        if (currentPage !== 4) return;

        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        requestAnimationFrame(() => {
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
        if (now - lastScrollTime < 800) return;
        lastScrollTime = now;

        if (isAnimating) return;
        
        const direction = event.deltaY > 0 ? 'down' : 'up';
        
        // Handle Work Experience Timeline
        if (currentPage === 3 && !timelineComplete) {
            handleTimeline(direction);
            return;
        }

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

    // Initialize Rolling Text
    function initRollingText() {
        const container = document.querySelector('.rolling-text-content');
        if (container) {
            container.innerHTML = container.innerHTML + container.innerHTML;
        }
    }

    // Event Listeners
    window.addEventListener('wheel', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleParallax);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initialize
    initRollingText();
    if (pages.contentWrapper) {
        pages.contentWrapper.style.display = 'block';
    }
});