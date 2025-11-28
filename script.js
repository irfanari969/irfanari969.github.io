const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const typingElement = document.getElementById('typingText');
const scrollProgress = document.getElementById('scrollProgress');
const scrollTopBtn = document.getElementById('scrollTop');
const techBtn = document.getElementById('techBtn');
const projectsBtn = document.getElementById('projectsBtn');
const techModal = document.getElementById('techModal');
const projectsModal = document.getElementById('projectsModal');
const closeTech = document.getElementById('closeTech');
const closeProjects = document.getElementById('closeProjects');


let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const easing = 0.15;

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    targetX = e.clientX;
    targetY = e.clientY;
});

function updateCursorPosition() {
    currentX += (targetX - currentX) * easing;
    currentY += (targetY - currentY) * easing;

    cursorFollower.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px)`;
    
    requestAnimationFrame(updateCursorPosition);
}

if (window.innerWidth > 768) {
    updateCursorPosition();
}


const texts = ['Editor ', 'Aspiring Backend Developer.'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }

    const speed = isDeleting ? 50 : 100;
    setTimeout(type, speed);
}

setTimeout(type, 1000);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight > 0) {
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }

    if (scrollTop > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn && scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .section-title').forEach(el => {
    observer.observe(el);
});


const counters = document.querySelectorAll('.stat-number');
let hasRun = false;

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasRun) {
            hasRun = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCounter();
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 }); 

document.querySelector('.stats') && counterObserver.observe(document.querySelector('.stats'));


function createParticles() {
    const header = document.getElementById('header');
    if (!header) return;
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        header.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createParticles);


function toggleModal(modalElement, forceClose = false) {
    if (!modalElement) return;

    const isCurrentlyOpen = modalElement.style.display === 'block';

    if (forceClose || isCurrentlyOpen) {
        modalElement.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        if(modalElement === techModal) toggleModal(projectsModal, true);
        if(modalElement === projectsModal) toggleModal(techModal, true);

        modalElement.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

techBtn && techBtn.addEventListener('click', () => toggleModal(techModal));
projectsBtn && projectsBtn.addEventListener('click', () => toggleModal(projectsModal));

closeTech && closeTech.addEventListener('click', () => toggleModal(techModal, true));
closeProjects && closeProjects.addEventListener('click', () => toggleModal(projectsModal, true));

window.addEventListener('click', (e) => {
    if (e.target === techModal) {
        toggleModal(techModal, true);
    }
    if (e.target === projectsModal) {
        toggleModal(projectsModal, true);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        toggleModal(techModal, true);
        toggleModal(projectsModal, true);
    }
});