// 1. HERO FADE-IN
gsap.to(".hero h1", { opacity: 1, duration: 2, y: 0, ease: "power2.out" });
gsap.to(".hero p", { opacity: 1, duration: 2, delay: 0.5, ease: "power2.out" });


// 2. PROJECT CAROUSEL POSITIONING
const carousel = document.getElementById('projectCarousel');
const tiles = document.querySelectorAll('.tile');
const totalTiles = tiles.length;
const angleStep = 360 / totalTiles;

// Responsive Radius: If mobile, smaller circle. If desktop, wider circle.
let radius = window.innerWidth < 768 ? 250 : 400;

function setTilePositions() {
    radius = window.innerWidth < 768 ? 250 : 400;

    tiles.forEach((tile, index) => {
        // Calculate the angle for this tile
        const angle = index * angleStep;
        
        // Apply the transform: Rotate Y-axis, then push out (Translate Z)
        tile.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    });
}

// Run initially
setTilePositions();

// Re-calculate if user resizes window
window.addEventListener('resize', setTilePositions);
