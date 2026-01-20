const typedText = new Typed(".text", {
    strings: ["Developer","Web Designer", "Photographer", "App developer"],
    typeSpeed: 60,
    backSpeed: 50,
    backDelay: 1000,
    loop: true
});

const menuToggle = document.getElementById('menuToggle');
const menubar = document.getElementById('menubar');
const menuItems = document.querySelectorAll('.menu-items li');
const container = document.querySelector('.main-container');

menuToggle.addEventListener('click', function(event) {
    menubar.style.transform = 'translateX(0px)';
    menubar.style.opacity = '1';
    menubar.style.transition = '0.6s';
    container.style.transition = '0.6s';
    container.style.filter = 'blur(5px)';
    event.stopPropagation(); // Prevent click from propagating to document

    menubar.classList.toggle('open'); // Toggle class to control menu animation

    if (menubar.classList.contains('open')) {
        animateMenuItems(menuItems); // Animate menu items when menu opens
    } else {
        resetMenuItems(menuItems); // Reset menu items when menu closes
    }
});

document.addEventListener('click', function(event) {
    if (!menubar.contains(event.target) && !menuToggle.contains(event.target)) {
        menubar.style.transform = 'translateX(-100%)'; // or however you want to hide the menubar
        container.style.filter = 'blur(0px)';
        menubar.classList.remove('open'); // Remove 'open' class to reset menu animation
        resetMenuItems(menuItems); // Reset menu items when menu closes
    }
});

function animateMenuItems(menuItems) {
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate'); // Add class to animate each menu item with delay
        }, index * 150); // Adjust the delay between each menu item (100 milliseconds in this example)
    });
}

function resetMenuItems(menuItems) {
    menuItems.forEach((item) => {
        item.classList.remove('animate'); // Remove 'animate' class to reset menu item animation
    });
}

function shuffleSkills() {
    var radialBars = document.querySelectorAll('.radial-bars .radial-bar');
    var container = document.querySelector('.radial-bars');

    // Create an array of the skills
    var skillsArray = Array.from(radialBars);

    // Hide the skills by reducing opacity gradually
    radialBars.forEach((skill, index) => {
        setTimeout(() => {
            skill.style.opacity = 0; // Start with 0 opacity
        }, index); // Adjust the delay between each skill disappearing (100 milliseconds in this example)
    });

    // Shuffle the array after all skills have faded out
    setTimeout(() => {
        // Shuffle the array
        skillsArray.sort(() => Math.random() - 0.5);

        // Append the shuffled skills back to the container
        skillsArray.forEach((skill, index) => {
            setTimeout(() => {
                skill.style.opacity = 1; // Gradually increase opacity
                container.appendChild(skill);
            }, index); // Adjust the delay between each skill appearing (100 milliseconds in this example)
        });
    }, radialBars.length * 200); // Wait for all skills to fade out before shuffling
}

// Shuffle the skills every 5 seconds (adjust the interval as needed)
setInterval(shuffleSkills, 6000);
