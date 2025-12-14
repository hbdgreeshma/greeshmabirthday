// CONFIG
const balloonColors = ['#ff4d88', '#ff9a9e', '#ffd700', '#ffffff', '#e0c3fc'];
const candyEmojis = ['🍬', '🍭', '🍫', '🧁', '🍥', '🍩', '✨'];

// CINEMATIC SOUL LINES
const compliments = [
    "If happiness was a person, it would look exactly like you. ✨",
    "You aren't just a star. You are the whole damn sky. 🌌",
    "Some souls are made of magic. Yours is the strongest I've found. 🦋",
    "You make the world quieter and the music louder just by being here. 🎵",
    "In a room full of art, I would still stare at you. 🖼️",
    "You are the poem the world wrote when it was feeling beautiful. ✍️",
    "Thank you for being the brightest color in my black and white world. 🌈",
    "Your laugh is my favorite soundtrack. 🎶",
    "You don't just exist, Greeshma. You shine. 🌟",
    "The universe took its time creating you. And it shows. ⏳"
];

let candlesBlown = 0;
const totalCandles = 3;

// ELEMENTS
const giftBox = document.getElementById('gift-box');
const introOverlay = document.getElementById('intro-overlay');
const partyContainer = document.getElementById('party-container');
const instructionText = document.getElementById('instruction-text');
const candyFloor = document.getElementById('candy-floor');
const audio = document.getElementById('bday-song');

// 0. GOLDEN CURSOR TRAIL (PC ONLY)
if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', function(e) {
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = e.pageX + 'px'; trail.style.top = e.pageY + 'px';
        document.body.appendChild(trail);
        setTimeout(() => { trail.style.opacity = '0'; trail.style.transform = 'scale(0.5)'; }, 10);
        setTimeout(() => { trail.remove(); }, 300);
    });
}

// 1. MAGICAL BACKGROUND GENERATOR
const magicContainer = document.getElementById('magic-container');
const magicEmojis = ['✨', '💖', '🌸', '⭐', '🦋'];
function createMagicParticle() {
    const particle = document.createElement('div');
    particle.classList.add('magic-particle');
    particle.innerText = magicEmojis[Math.floor(Math.random() * magicEmojis.length)];
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
    const duration = Math.random() * 5 + 5;
    particle.style.setProperty('--duration', duration + 's');
    magicContainer.appendChild(particle);
    setTimeout(() => { particle.remove(); }, duration * 1000);
}
setInterval(createMagicParticle, 400);

// 2. INTRO: OPEN SURPRISE
giftBox.addEventListener('click', () => {
    audio.play().catch(e => console.log("Audio requires interaction"));
    gsap.to('.glass-vault', { scale: 1.5, opacity: 0, duration: 0.5, ease: "power2.in" });
    gsap.to('#intro-overlay', { opacity: 0, duration: 1, delay: 0.4, onComplete: () => {
        introOverlay.style.display = 'none';
        partyContainer.classList.remove('hidden');
        gsap.set(".content-wrapper", { visibility: "visible" });
        initParty();
    }});
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: balloonColors });
});

// 3. START SHOW
function initParty() {
    gsap.to(".content-wrapper", { opacity: 1, duration: 1 });
    gsap.from('.party-title', { y: 50, opacity: 0, duration: 1.5, delay: 0.5, ease: "power4.out" });
    gsap.from('.name-highlight', { scale: 0.5, opacity: 0, duration: 1.5, delay: 0.8, ease: "back.out(1.7)" });
    gsap.from('.subtitle', { opacity: 0, duration: 1.5, delay: 1.5 });
    
    gsap.from('.cake-section', { scale: 0, rotation: -45, opacity: 0, duration: 1.5, delay: 0.5, ease: "elastic.out(1, 0.75)" });
    gsap.from('.left-panel', { x: -50, opacity: 0, duration: 1.2, delay: 1, ease: "power2.out" });
    gsap.from('.right-panel', { x: 50, opacity: 0, duration: 1.2, delay: 1, ease: "power2.out" });
    gsap.from('.bottom-quote-area', { y: 50, opacity: 0, duration: 1, delay: 1.5 });

    scatterCandies();
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), { max: 15, speed: 400, glare: true, "max-glare": 0.5 });
}

// 4. CANDLES
function blowCandle(candleElement) {
    if (candleElement.classList.contains('out')) return; 
    candleElement.classList.add('out');
    candlesBlown++;
    const rect = candleElement.getBoundingClientRect();
    confetti({ particleCount: 30, spread: 40, startVelocity: 20, origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight }, colors: ['#ffd700', '#ffffff'], gravity: 0.5 });

    if (candlesBlown === totalCandles) {
        triggerFinale();
    }
}

// 5. FINALE
function triggerFinale() {
    gsap.to(instructionText, { opacity: 0, duration: 0.3, onComplete: () => {
        instructionText.innerHTML = "✨ WISHES SEALED IN THE STARS ✨";
        instructionText.classList.add('celebrate');
        gsap.to(instructionText, { opacity: 1, scale: 1.1, duration: 0.5, ease: "elastic.out" });
    }});
    const interval = setInterval(function() {
        confetti({ particleCount: 50, spread: 100, origin: { y: 0.6 }, colors: balloonColors });
    }, 1500);
}

// 6. COMPLIMENTS
function generateCompliment() {
    const textElement = document.getElementById('compliment-text');
    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    textElement.style.opacity = 0;
    setTimeout(() => {
        textElement.innerHTML = randomCompliment;
        textElement.style.opacity = 1;
        const btn = document.getElementById('compliment-btn');
        const rect = btn.getBoundingClientRect();
        confetti({ particleCount: 15, spread: 40, startVelocity: 10, origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight }, colors: ['#ff4d88', '#ffffff'] });
    }, 200);
}

// 7. CANDY FLOOR
function scatterCandies() {
    for (let i = 0; i < 40; i++) {
        const candy = document.createElement('div');
        candy.classList.add('candy');
        candy.innerText = candyEmojis[Math.floor(Math.random() * candyEmojis.length)];
        candy.style.left = `${Math.random() * 100}%`;
        const scale = 0.5 + Math.random() * 0.8; const rotation = Math.random() * 360;
        candy.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        candyFloor.appendChild(candy);
        gsap.to(candy, { y: -30, rotation: rotation + 50, duration: 3 + Math.random() * 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
}