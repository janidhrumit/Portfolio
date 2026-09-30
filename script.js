// Dynamic Typed Text in Hero Section
if (document.querySelector(".text")) {
    const typedText = new Typed(".text", {
        strings: ["Developer", "Web Designer", "Software Engineer", "App Developer"],
        typeSpeed: 60,
        backSpeed: 50,
        backDelay: 1200,
        loop: true
    });
}

// Mobile Sidebar Navigation Toggle
const menuToggle = document.getElementById('menuToggle');
const menubar = document.getElementById('menubar');
const menuItems = document.querySelectorAll('.menu-items li');
const mainContainer = document.querySelector('.main-container');

if (menuToggle && menubar) {
    menuToggle.addEventListener('click', function (event) {
        event.stopPropagation();
        menubar.classList.toggle('open');

        if (menubar.classList.contains('open')) {
            menubar.style.transform = 'translateX(0px)';
            menubar.style.opacity = '1';
            menubar.style.transition = '0.5s ease-in-out';
            if (mainContainer) mainContainer.style.filter = 'blur(5px)';
            animateMenuItems(menuItems);
        } else {
            closeSidebar();
        }
    });

    document.addEventListener('click', function (event) {
        if (menubar.classList.contains('open') && !menubar.contains(event.target) && !menuToggle.contains(event.target)) {
            closeSidebar();
        }
    });
}

function closeSidebar() {
    if (!menubar) return;
    menubar.style.transform = 'translateX(-100%)';
    menubar.style.opacity = '0';
    menubar.classList.remove('open');
    if (mainContainer) mainContainer.style.filter = 'blur(0px)';
    resetMenuItems(menuItems);
}

function animateMenuItems(items) {
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, index * 100);
    });
}

function resetMenuItems(items) {
    items.forEach((item) => {
        item.classList.remove('animate');
    });
}

// Close sidebar on clicking menu link
menuItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
        link.addEventListener('click', () => {
            closeSidebar();
        });
    }
});

// Scroll Spy: Update Active Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.header .navbar a, .menu-items a');
    let currentSectionId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 180;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id') || '';
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
});

// Skills Radial Bar Shuffling
function shuffleSkills() {
    const radialBars = document.querySelectorAll('.radial-bars .radial-bar');
    const container = document.querySelector('.radial-bars');
    if (!container || radialBars.length === 0) return;

    const skillsArray = Array.from(radialBars);

    radialBars.forEach((skill, index) => {
        setTimeout(() => {
            skill.style.opacity = '0';
        }, index * 80);
    });

    setTimeout(() => {
        skillsArray.sort(() => Math.random() - 0.5);
        skillsArray.forEach((skill, index) => {
            setTimeout(() => {
                skill.style.opacity = '1';
                container.appendChild(skill);
            }, index * 80);
        });
    }, radialBars.length * 120);
}

// Run skill shuffle every 8 seconds safely
setInterval(shuffleSkills, 8000);

// Contact Form Handler & Firestore Database Connection
let isSubmitting = false;

async function sendEmail(event) {
    if (event) event.preventDefault();

    // Prevent duplicate concurrent submissions
    if (isSubmitting) return false;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn') || document.querySelector('.contact-form input[type="submit"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Field validation
    if (!name || !email || !message) {
        showToast('Please fill in your name, email, and message.', 'error');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return false;
    }

    // Check if Firebase keys have been configured
    if (typeof isFirebaseConfigured === 'function' && !isFirebaseConfigured()) {
        showToast('Firebase connected! Please paste your Firebase API keys in src/firebase-config.js.', 'warning');
        return false;
    }

    isSubmitting = true;

    // Set loading state on submit button
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.value = 'Saving to Database...';
    }

    try {
        if (typeof saveContactMessage === 'function') {
            await saveContactMessage({
                name: name,
                email: email,
                subject: subject || 'Portfolio Contact Inquiry',
                message: message
            });

            showToast(`Thank you, ${name}! Your message has been stored in the database.`, 'success');

            // Reset form on success
            const form = document.getElementById('contactForm');
            if (form) form.reset();
        } else {
            throw new Error('Firestore helper function is unavailable.');
        }
    } catch (error) {
        console.error('Firestore submission error:', error);

        if (error.message === 'CONFIG_PLACEHOLDER') {
            showToast('Please add your Firebase project API keys in src/firebase-config.js.', 'warning');
        } else if (error.code === 'permission-denied') {
            showToast('Permission denied: Please update your Firestore Security Rules in Firebase Console.', 'error');
        } else {
            showToast(`Unable to save message: ${error.message || 'Network error'}`, 'error');
        }
    } finally {
        isSubmitting = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.value = 'Send Message';
        }
    }

    return false;
}

// Toast notification helper supporting success, warning, and error types
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;

    if (type === 'error') {
        toast.style.borderColor = '#ff4757';
        toast.style.boxShadow = '0 0 20px rgba(255, 71, 87, 0.6)';
    } else if (type === 'warning') {
        toast.style.borderColor = '#f39c12';
        toast.style.boxShadow = '0 0 20px rgba(243, 156, 18, 0.6)';
    } else {
        toast.style.borderColor = '#0ef';
        toast.style.boxShadow = '0 0 20px rgba(0, 238, 255, 0.6)';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// Bind contact form submit event listener
const contactFormElement = document.getElementById('contactForm');
if (contactFormElement) {
    contactFormElement.addEventListener('submit', sendEmail);
}


