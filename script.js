// SPA Navigation Logic
function navigateTo(pageId) {
    document.querySelectorAll('.spa-page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
        window.location.hash = pageId;
    } else {
        document.getElementById('page-home').classList.add('active');
        window.location.hash = 'home';
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        const target = link.getAttribute('data-target');
        if(target && pageId.startsWith(target)) {
            link.classList.add('text-brand-600');
            link.classList.remove('text-gray-600');
        } else if(target) {
            link.classList.remove('text-brand-600');
            link.classList.add('text-gray-600');
        }
    });

    document.getElementById('mobile-menu').classList.add('hidden');
    triggerRevealsForActivePage();
}

window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1) || 'home';
    navigateTo(hash);
});
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'home';
    navigateTo(hash);
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md');
        backToTop.classList.remove('opacity-0', 'invisible', 'translate-y-4');
    } else {
        navbar.classList.remove('shadow-md');
        backToTop.classList.add('opacity-0', 'invisible', 'translate-y-4');
    }
});

// Mobile Menu Toggle
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Intersection Observer for Animations
const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
const revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, revealOptions);

function triggerRevealsForActivePage() {
    const revealElements = document.querySelectorAll('.spa-page.active .reveal:not(.active), .spa-page.active .reveal-left:not(.active), .spa-page.active .reveal-right:not(.active)');
    revealElements.forEach(el => revealObserver.observe(el));
}

// Animated Counters
const speed = 200;
const counterObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCount();
            observer.unobserve(counter);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));

// Testimonial Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot-indicator');

function changeSlide(index) {
    if(!slides.length) return;
    slides[currentSlide].classList.add('hidden');
    dots[currentSlide].classList.remove('bg-brand-600');
    dots[currentSlide].classList.add('bg-gray-300');
    
    currentSlide = index;
    
    slides[currentSlide].classList.remove('hidden');
    dots[currentSlide].classList.remove('bg-gray-300');
    dots[currentSlide].classList.add('bg-brand-600');
}
if(slides.length) {
    setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        changeSlide(next);
    }, 5000);
}

// FAQ Accordion
document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const icon = this.querySelector('i');
        
        document.querySelectorAll('.faq-answer').forEach(ans => {
            if(ans !== answer) ans.style.maxHeight = null;
        });
        document.querySelectorAll('.faq-btn i').forEach(i => {
            if(i !== icon) i.style.transform = "rotate(0deg)";
        });

        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            icon.style.transform = "rotate(0deg)";
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
            icon.style.transform = "rotate(180deg)";
        }
    });
});

// Alerts
function showAlert(message) {
    const alertModal = document.getElementById('custom-alert');
    const alertBox = document.getElementById('custom-alert-box');
    document.getElementById('custom-alert-msg').innerText = message;
    
    alertModal.classList.remove('opacity-0', 'pointer-events-none');
    alertBox.classList.remove('scale-95');
    alertBox.classList.add('scale-100');
}

function closeAlert() {
    const alertModal = document.getElementById('custom-alert');
    const alertBox = document.getElementById('custom-alert-box');
    
    alertBox.classList.remove('scale-100');
    alertBox.classList.add('scale-95');
    setTimeout(() => {
        alertModal.classList.add('opacity-0', 'pointer-events-none');
    }, 300);
}

// Form Handling
function handleAppointmentSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('app-name').value;
    setTimeout(() => {
        showAlert(`Thank you ${name}, your appointment request has been received. Our front desk will confirm your slot shortly.`);
        e.target.reset();
        navigateTo('home');
    }, 500);
}

function handleContactSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
        showAlert(`Message sent successfully! We will get back to you soon.`);
        e.target.reset();
    }, 500);
}