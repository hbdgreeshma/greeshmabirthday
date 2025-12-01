// --- CONFIGURATION ---
const balloonColors = ['#ff4d88', '#ff9a9e', '#ffd700', '#ffffff', '#e0c3fc'];
const candyEmojis = ['🍬', '🍭', '🍫', '🧁', '🍥', '🍩', '✨'];
let candlesBlown = 0;
const totalCandles = 3;

// --- ELEMENTS ---
const giftBox = document.getElementById('gift-box');
const introOverlay = document.getElementById('intro-overlay');
const partyContainer = document.getElementById('party-container');
const instructionText = document.getElementById('instruction-text');
const candyFloor = document.getElementById('candy-floor');
const audio = document.getElementById('bday-song');

// --- 0. GOLDEN CURSOR TRAIL ---
document.addEventListener('mousemove', function(e) {
    const trail = document.createElement('div');
    trail.className = 'trail';
    trail.style.left = e.pageX + 'px';
    trail.style.top = e.pageY + 'px';
    document.body.appendChild(trail);
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0.5)';
    }, 10);
    setTimeout(() => {
        trail.remove();
    }, 300);
});

// --- 1. INTRO: OPEN SURPRISE ---
giftBox.addEventListener('click', () => {
    audio.play().catch(e => console.log("Audio requires interaction"));
    
    gsap.to('.glass-vault', { scale: 1.5, opacity: 0, duration: 0.5, ease: "power2.in" });
    gsap.to('#intro-overlay', { opacity: 0, duration: 1, delay: 0.4, onComplete: () => {
        introOverlay.style.display = 'none';
        partyContainer.classList.remove('hidden');
        initParty();
    }});
    
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: balloonColors });
});

// --- 2. START THE SHOW ---
function initParty() {
    // Text Animations
    gsap.from('.party-title', { y: 100, opacity: 0, duration: 1.5, ease: "power4.out" });
    gsap.from('.name-highlight', { scale: 0.5, opacity: 0, duration: 1.5, delay: 0.3, ease: "back.out(1.7)" });
    gsap.from('.subtitle', { opacity: 0, duration: 1.5, delay: 1 });

    // 3D Elements Entry
    gsap.from('.cake-section', { scale: 0, rotation: -45, opacity: 0, duration: 1.5, delay: 0.5, ease: "elastic.out(1, 0.75)" });
    gsap.from('.left-panel', { x: -200, opacity: 0, duration: 1.2, delay: 0.8, ease: "power2.out" });
    gsap.from('.right-panel', { x: 200, opacity: 0, duration: 1.2, delay: 0.8, ease: "power2.out" });
    
    gsap.from('.bottom-quote-area', { y: 100, opacity: 0, duration: 1, delay: 1.5 });

    scatterCandies();
    
    // Initialize 3D Tilt
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
    });
}

// --- 3. CANDLE INTERACTION ---
function blowCandle(candleElement) {
    if (candleElement.classList.contains('out')) return; 
    candleElement.classList.add('out');
    candlesBlown++;

    const rect = candleElement.getBoundingClientRect();
    confetti({
        particleCount: 30, spread: 40, startVelocity: 20,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
        colors: ['#ffd700', '#ffffff'], gravity: 0.5, ticks: 50
    });

    if (candlesBlown === totalCandles) {
        triggerFinale();
    }
}

// --- 4. THE GRAND FINALE ---
function triggerFinale() {
    gsap.to(instructionText, { opacity: 0, duration: 0.3, onComplete: () => {
        instructionText.innerHTML = "✨ WISHES SEALED IN THE STARS ✨";
        instructionText.classList.add('celebrate');
        gsap.to(instructionText, { opacity: 1, scale: 1.1, duration: 0.5, ease: "elastic.out" });
    }});

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 0, colors: balloonColors };

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}

// --- 5. CANDY FLOOR DECOR ---
function scatterCandies() {
    for (let i = 0; i < 40; i++) {
        const candy = document.createElement('div');
        candy.classList.add('candy');
        candy.innerText = candyEmojis[Math.floor(Math.random() * candyEmojis.length)];
        candy.style.left = `${Math.random() * 100}%`;
        const scale = 0.5 + Math.random() * 0.8;
        const rotation = Math.random() * 360;
        candy.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        
        candyFloor.appendChild(candy);
        
        // Gentle Floating at Bottom
        gsap.to(candy, {
            y: -30, // Reduced movement so it doesn't fly into photo
            rotation: rotation + 50,
            duration: 3 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}