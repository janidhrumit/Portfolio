function startEverything() {
    // 1. Play the music
    const audio = document.getElementById('birthday-song');
    audio.play().catch(error => {
        console.log("Audio play failed: ", error);
    });

    // 2. Transition the pages
    document.getElementById('page1').classList.add('fade-out');
    
    setTimeout(() => {
        document.getElementById('page1').style.display = 'none';
        document.getElementById('page2').classList.remove('hidden');
        document.getElementById('page2').classList.add('fade-in');
        
        // 3. Optional: Create a little heart shower
        createHeartShower();
    }, 800);
}

function createHeartShower() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerText = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '100vh';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.transition = 'transform 3s linear, opacity 3s';
            heart.style.zIndex = '1000';
            document.body.appendChild(heart);

            // Animate up
            setTimeout(() => {
                heart.style.transform = `translateY(-120vh) translateX(${Math.random() * 50 - 25}px)`;
                heart.style.opacity = '0';
            }, 100);

            // Remove from DOM
            setTimeout(() => heart.remove(), 3000);
        }, i * 200);
    }
}