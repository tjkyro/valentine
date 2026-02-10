// Audio initialization
const audio = document.getElementById('bg-music');
audio.volume = 0.5;

function tryPlay() {
    audio.play().catch(() => {
        // Autoplay blocked - user must click manually
        console.log("Autoplay blocked, waiting for user interaction");
    });
    // Remove listeners once we've tried
    document.body.removeEventListener('click', tryPlay);
    document.body.removeEventListener('keydown', tryPlay);
}

document.body.addEventListener('click', tryPlay);
document.body.addEventListener('keydown', tryPlay);

// DOM element references
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const mainCard = document.getElementById('main-card');
const celebrationDiv = document.getElementById('celebration');
const confettiContainer = document.getElementById('confetti-container');

// Array of messages to cycle through
const messages = [
    "Oh sorry the yes button is the green one lol",
    "Are you sure?",
    "Really sure??",
    "Give me one chance CAMILLY 😭",
    "Don't do me like that meu bem💔",
    "Okay... but what if I say please?",
    "Last chance 😳",
    "You're breaking my heart amor",
    "Okay what if I delete all the embarrassing photos of you?",
    "Pookie please? 🥺",
    "This is lowkey why Jamaican mangoes are better than Brazillian Mangoes",
    "Pretty please with a cherry on top? 🍒"
];

let messageIndex = 0;
let yesScale = 1;
const MAX_SCALE = 6.2;
const SCALE_STEP = 0.2; // How much it grows each time

// Helper to get random number within range
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Check if two rectangles overlap with a buffer
function isOverlapping(rect1, rect2, buffer = 20) {
    return !(rect1.right + buffer < rect2.left ||
        rect1.left > rect2.right + buffer ||
        rect1.bottom + buffer < rect2.top ||
        rect1.top > rect2.bottom + buffer);
}

// Function to move the "No" button
function moveNoButton() {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get button dimensions
    const btnRect = noBtn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    // Get "Yes" button position to avoid overlap
    const yesRect = yesBtn.getBoundingClientRect();

    // Calculate max possible positions (keeping button fully onscreen with padding)
    const padding = 20;
    const maxX = viewportWidth - btnWidth - padding;
    const maxY = viewportHeight - btnHeight - padding;
    const minX = padding;
    const minY = padding;

    let newX, newY;
    let attempts = 0;
    let safePositionFound = false;

    // Try to find a non-overlapping position
    while (attempts < 50 && !safePositionFound) {
        newX = getRandomNumber(minX, maxX);
        newY = getRandomNumber(minY, maxY);

        // Create a temporary rect for the proposed new position
        const proposedRect = {
            left: newX,
            top: newY,
            right: newX + btnWidth,
            bottom: newY + btnHeight,
            width: btnWidth,
            height: btnHeight
        };

        // Check if it overlaps with the Yes button
        if (!isOverlapping(proposedRect, yesRect)) {
            safePositionFound = true;
        }
        attempts++;
    }

    // Apply new position
    // Use fixed positioning relative to viewport to ensure it jumps anywhere
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;

    // Reset transform to avoid conflicts if previously centered
    noBtn.style.transform = 'none';
}

// Function to handle "No" button click
function handleNoClick() {
    // 1. Move the button
    moveNoButton();

    // 2. Change text
    noBtn.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;

    // 3. Shake animation
    noBtn.classList.add('shake');
    // Remove class after animation ends to allow re-triggering
    setTimeout(() => {
        noBtn.classList.remove('shake');
    }, 400); // Match animation duration in CSS

    // 4. Grow "Yes" button
    if (yesScale < MAX_SCALE) {
        yesScale += SCALE_STEP;
        yesBtn.style.transform = `scale(${yesScale})`;
    }
}

// Function to handle "Yes" button click
function handleYesClick() {
    // Hide main card
    mainCard.classList.add('hidden');

    // Show celebration
    celebrationDiv.classList.remove('hidden');

    // Trigger confetti
    startConfetti();
}

// Confetti logic
function startConfetti() {
    const emojis = ['❤️', '💖', '💘', '💝', '💓', '🍫', '🌹', '🎀', '✨'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        createConfettiPiece(emojis);
    }
}

function createConfettiPiece(emojis) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Randomize starting position and animation properties
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's'; // 2-5s fall
    confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
    confetti.style.opacity = Math.random();

    confettiContainer.appendChild(confetti);

    // Remove after animation to clean DOM
    confetti.addEventListener('animationend', () => {
        confetti.remove();
    });
}

// Event Listeners
noBtn.addEventListener('click', handleNoClick);
noBtn.addEventListener('mouseover', () => {
    // Optional: Make it move on hover too for extra difficulty/fun?
    // The prompt only asked for click behavior for movement, but hover is a common trope.
    // I'll stick to click as requested in "Behavior" section: "If they click 'No': The 'No' button should move..."
    // But then "Each 'No' click should change the text..."
    // Wait, if it moves on click, can they ever click it?
    // Usually these "impossible to click" buttons move on hover.
    // But the prompt specifically says "If they click 'No': The 'No' button should move...".
    // This implies they CAN click it, and THEN it moves.
    // So I will stick to click.
});

yesBtn.addEventListener('click', handleYesClick);

// Accessible keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // If celebration is not visible, trigger yes
        if (celebrationDiv.classList.contains('hidden')) {
            handleYesClick();
        }
    }
});
