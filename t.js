gsap.registerPlugin(ScrollTrigger);

// === 1. HERO INTRO: "Slow Pop Out" ===
// This runs once when the page loads. 
// The text pops out and STAYS there.
gsap.fromTo(".hero h1, .hero p", 
    {
        scale: 0.5,    // Start small
        opacity: 0     // Start invisible
    },
    {
        scale: 1,      // End normal size
        opacity: 1,    // End fully visible
        duration: 2.5, // Slow cinematic pop
        ease: "back.out(1.7)", // The "bouncy" effect
        stagger: 0.2
    }
);

// (I removed the "Scroll Animation" section here so the text stays put)


// === 2. SKILLS BOXES (Stagger Effect) ===
// These still pop up when you scroll to them
gsap.from(".skill-box", {
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".skills-boxes",
        start: "top 75%", 
        toggleActions: "play none none reverse"
    }
});


// === 3. WHEEL SECTION (Fade In) ===
gsap.from(".wheel-page", {
    opacity: 0,
    duration: 1.5,
    scrollTrigger: {
        trigger: ".wheel-page",
        start: "top 60%",
        toggleActions: "play none none reverse"
    }
});


// === 4. PROJECT SECTION (Pin & Reveal) ===
gsap.to(".project .content", {
    y: 0,
    opacity: 1,
    duration: 1,
    scrollTrigger: {
        trigger: ".project",
        start: "top 60%",
        toggleActions: "play none none reverse"
    }
});

// Pins the project section so you can read it before scrolling past
ScrollTrigger.create({
    trigger: ".project",
    start: "top top",
    pin: true,
    end: "+=100%"
});

// === 5. CONTACT ANIMATION (Fixed) ===
// We use fromTo to FORCE them to stay visible (opacity: 1)
gsap.fromTo(".contact h2, .social-btn", 
    {
        y: 50,          // Start position (below)
        opacity: 0      // Start invisible
    },
    {
        y: 0,           // End position (normal)
        opacity: 1,     // End fully visible
        duration: 1,
        stagger: 0.2,   // One by one
        scrollTrigger: {
            trigger: ".contact",
            start: "top 90%", // Start animation slightly earlier
            toggleActions: "play none none none" // <--- THIS FIXES IT (Never reverse)
        }
    }
);