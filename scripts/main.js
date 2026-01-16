document.addEventListener('DOMContentLoaded', () => {
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
});
