document.addEventListener('DOMContentLoaded', () => {
    // Mobile Hamburger Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');

            // Toggle icon between 'menu' and 'x' (optional refinement)
            const icon = mobileBtn.querySelector('i'); // Assumes Lucide <i> tag
            if (navLinks.classList.contains('active')) {
                // You might want to switch icon here or just toggle class for CSS handling
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Enhanced smooth scroll with navbar offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // CCTV Camera Follow Cursor
    const cameraHead = document.querySelector('.camera-head');
    if (cameraHead) {
        document.addEventListener('mousemove', (e) => {
            const rect = cameraHead.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const degree = angle * (180 / Math.PI);

            cameraHead.style.transform = `rotate(${degree}deg)`;
        });
    }

    // Stacked Cards Interactivity
    const stackedCards = document.querySelectorAll('.stacked-card');
    stackedCards.forEach(card => {
        card.addEventListener('click', () => {
            const parent = card.parentElement;
            parent.appendChild(card); // Move clicked card to end
        });
    });

    // AI Platform Stacking logic
    const aiStackCards = document.querySelectorAll('.stack-card');
    if (aiStackCards.length > 0) {
        window.addEventListener('scroll', () => {
            aiStackCards.forEach((card, index) => {
                if (index < aiStackCards.length - 1) {
                    const nextCard = aiStackCards[index + 1];
                    const nextRect = nextCard.getBoundingClientRect();
                    const triggerPoint = window.innerHeight * 0.8;
                    const finishPoint = window.innerHeight * 0.2;

                    if (nextRect.top < triggerPoint) {
                        const progress = Math.max(0, Math.min(1, (triggerPoint - nextRect.top) / (triggerPoint - finishPoint)));
                        card.style.opacity = 1 - (progress * 0.7);
                        card.style.transform = `scale(${1 - (progress * 0.05)}) translateY(${-progress * 30}px)`;
                        card.style.filter = `blur(${progress * 4}px)`;
                    } else {
                        card.style.opacity = 1;
                        card.style.transform = 'scale(1) translateY(0)';
                        card.style.filter = 'blur(0px)';
                    }
                }
            });
        });
    }

    // Global Glow Effect for Bento Cards
    document.querySelectorAll('.hover-glow-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
