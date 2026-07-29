"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import Lenis from "lenis";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  ArrowDown,
  Menu,
  X,
  ExternalLink,
  GraduationCap,
  Award,
  Trophy,
  Sun,
  Moon,
} from "lucide-react";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiHtml5,
  SiCss,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGreensock,
  SiSupabase,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiRazorpay,
  SiDocker,
} from "react-icons/si";
import { FaJava, FaDatabase, FaCode } from "react-icons/fa";
import { TbApi } from "react-icons/tb";

// ==========================================
// 1. THEME TOGGLE COMPONENT
// ==========================================
function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />; 

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-secondary transition-all border border-border"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  );
}


interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
}

function AntigravityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, radius: 160 });
  const isScrollingRef = useRef(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let scrollTimeout: NodeJS.Timeout;
    
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    // Configurable parameters
    const maxParticles = isMobile ? 12 : 45;
    const connectionDistance = 90;
    const connectionDistanceSq = connectionDistance * connectionDistance; // Optimization
    const minSpeed = 0.25;
    const maxSpeed = 3.0;
    const baseDriftSpeed = 0.5;

    // Define colors based on the active theme
    const isDark = resolvedTheme === "dark";
    const colors = isDark 
      ? [
          "rgba(115, 222, 255, 0.4)", 
          "rgba(167, 139, 250, 0.35)", 
          "rgba(45, 212, 191, 0.3)",  
          "rgba(255, 255, 255, 0.2)",  
        ]
      : [
          "rgba(2, 132, 199, 0.4)",   
          "rgba(124, 58, 237, 0.35)", 
          "rgba(13, 148, 136, 0.3)",  
          "rgba(15, 23, 42, 0.2)",    
        ];

    const glowColorStart = isDark ? "rgba(115, 222, 255, 0.05)" : "rgba(2, 132, 199, 0.05)";
    const glowColorMid = isDark ? "rgba(167, 139, 250, 0.02)" : "rgba(124, 58, 237, 0.02)";
    const lineColor = isDark ? "115, 222, 255" : "2, 132, 199";

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const width = canvas.width;
      const height = canvas.height;
      const isMobileSize = typeof window !== "undefined" && window.innerWidth < 768;

      for (let i = 0; i < maxParticles; i++) {
        // Larger bubbles
        const maxRadius = isMobileSize ? 9 : 14;
        const minRadius = isMobileSize ? 4 : 6;
        const radius = Math.random() * (maxRadius - minRadius) + minRadius;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const glowColor = color.replace(/[\d\.]+\)$/, "0.06)"); // Pre-calculated to prevent heavy regex per frame
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * baseDriftSpeed,
          vy: (Math.random() - 0.5) * baseDriftSpeed,
          radius,
          color,
          glowColor,
        });
      }
    };

    // Scroll listener: Temporarily disable heavy math to keep scrolling buttery smooth
    const handleScroll = () => {
      isScrollingRef.current = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150); 
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const mouse = mouseRef.current;
      const mouseRadiusSq = mouse.radius * mouse.radius;

      // Draw cursor glow
      if (mouse.active) {
        const glowGradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 1.5
        );
        glowGradient.addColorStop(0, glowColorStart);
        glowGradient.addColorStop(0.5, glowColorMid);
        glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

  
      if (!isScrollingRef.current && !isMobile) {
        ctx.beginPath();
        ctx.strokeStyle = isDark ? "rgba(115, 222, 255, 0.08)" : "rgba(2, 132, 199, 0.08)";
        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectionDistanceSq) {
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
            }
          }
        }
        ctx.stroke();
      }

     
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            const push = force * 0.45;
            p.vx += Math.cos(angle) * push;
            p.vy += Math.sin(angle) * push;
          }
        }

        p.vx *= 0.96;
        p.vy *= 0.96;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        if (speed < minSpeed) {
          const angle = Math.random() * Math.PI * 2;
          p.vx += Math.cos(angle) * 0.1;
          p.vy += Math.sin(angle) * 0.1;
        }

        if (p.x < 0) { p.x = 0; p.vx *= -1; } 
        else if (p.x > width) { p.x = width; p.vx *= -1; }

        if (p.y < 0) { p.y = 0; p.vy *= -1; } 
        else if (p.y > height) { p.y = height; p.vy *= -1; }

        // Draw bubble body (solid semi-transparent fill)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Premium Glossy Specular Highlight (small offset light dot to look like 3D glass/water bubble)
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.75)";
        ctx.fill();

        // Draw bubble outer glow using the pre-generated color (no regexp)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor; 
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(scrollTimeout);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ transform: "translateZ(0)" }} // Force GPU hardware acceleration
    />
  );
}


function ProfessionalBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background">
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--foreground) 1px, transparent 1px),
            linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)'
        }}
      />
      {/* Accent Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
    </div>
  );
}

// ==========================================
// 3. NAVBAR COMPONENT
// ==========================================
const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/40 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <motion.a
          href="#"
          className="text-lg font-bold tracking-tight text-foreground"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          AD<span className="text-primary">.</span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-[13px] transition-colors duration-300 ${
                      isActive
                        ? "font-semibold text-primary"
                        : "font-medium text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
          {/* Desktop Theme Toggle */}
          <div className="pl-4 border-l border-border/50 flex items-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            className="text-foreground p-2 -mr-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/40"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`block text-sm transition-colors duration-300 ${
                        isActive
                          ? "font-semibold text-primary"
                          : "font-medium text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ==========================================
// 4. HERO COMPONENT
// ==========================================
function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="p-3.5 rounded-full border border-border/60 bg-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300"
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      {icon}
    </motion.a>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)/4%,_transparent_50%)]" />
      
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-[5.5rem] lg:text-[7rem] font-bold text-foreground mb-4 tracking-tight leading-[1.05] text-balance"
        >
          Ashit Debnath.
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-[3.5rem] lg:text-[4.5rem] font-semibold text-muted-foreground mb-8 tracking-tight leading-[1.1] text-balance"
        >
          CSE UNDERGRADUATE.<br className="hidden md:inline" />
          
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal tracking-tight"
        >
          I'm a final-year Computer Science & Engineering student graduating in 2027, learning full-stack web development. I focus on building real-life projects.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 mb-14"
        >
          <SocialLink href="https://github.com/Ashiiiit" icon={<Github size={18} />} label="GitHub" />
          <SocialLink href="https://linkedin.com/in/ashit2306" icon={<Linkedin size={18} />} label="LinkedIn" />
          <SocialLink href="mailto:ashitdebnath23006@gmail.com" icon={<Mail size={18} />} label="Email" />
          <SocialLink href="tel:+919933286505" icon={<Phone size={18} />} label="Phone" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.15em]"
          >
            <span>Explore</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={14} />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 5. ABOUT COMPONENT
// ==========================================
function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section id="about" className="py-32 px-6 relative">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-12">
            <span className="w-8 h-0.5 bg-primary" />
            <h2 className="text-xs font-semibold text-primary tracking-[0.2em] uppercase">
              About
            </h2>
          </div>

          <div className="grid md:grid-cols-[1.8fr,1fr] gap-16 md:gap-24">
            <div className="space-y-8">
              <p className="text-muted-foreground leading-relaxed text-base font-normal tracking-tight">
                I am a aspiring developer who tries to create user-centric applications. Trying to create a strong foundation in both frontend design and backend engineering, I enjoy learning useful and implementing real-life projects.
              </p>

              <p className="text-muted-foreground leading-relaxed text-base font-normal tracking-tight">
                Currently pursuing my Bachelor of Technology in Computer Science at the{" "}
                <span className="text-foreground font-semibold">Government Engineering College Thrissur</span>{" "}
                (KTU).
              </p>

              <p className="text-muted-foreground leading-relaxed text-base font-normal tracking-tight">
                Beyond coding, I am constantly exploring, and refining my skills.
              </p>
            </div>

            <div className="space-y-10 border-t border-border/40 pt-8 md:border-t-0 md:pt-0 md:pl-10 md:border-l md:border-border/40">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-[0.25em]">
                  Currently
                </h3>
                <p className="text-foreground font-semibold text-base">B.Tech CSE Student</p>
                <p className="text-sm text-muted-foreground font-medium mt-1">GEC Thrissur (KTU)</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-[0.25em]">
                  Core Focus Areas
                </h3>
                <ul className="space-y-3">
                  {["Full-Stack Development", "Modern UI/UX Designs", "Real-time Distributed Systems", "Robust API Engineering"].map((item) => (
                    <li key={item} className="text-sm font-medium text-foreground flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 6. SKILLS COMPONENT
// ==========================================
const skillCategories = [
  {
    title: "Languages",
    skills: [
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Java", icon: FaJava, color: "#ED8B00" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "HTML", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS", icon: SiCss, color: "#1572B6" },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "var(--foreground)" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "GSAP", icon: SiGreensock, color: "#88CE02" },
    ],
  },
  {
    title: "Backend & Databases",
    skills: [
      { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "SQL", icon: FaDatabase, color: "#00758F" },
      { name: "REST APIs", icon: TbApi, color: "#FF6C37" },
    ],
  },
  {
    title: "Other",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "var(--foreground)" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Razorpay", icon: SiRazorpay, color: "#0066FF" },
      { name: "Full-Stack", icon: FaCode, color: "#14B8A6" },
    ],
  },
];

function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section id="skills" className="py-32 px-6 bg-background/60 border-y border-border/40">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-16">
            <span className="w-8 h-0.5 bg-primary" />
            <h2 className="text-xs font-semibold text-primary tracking-[0.2em] uppercase">
              Technical Skills
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 sm:p-8 bg-card/75 backdrop-blur-xl border border-border/40 rounded-3xl hover:border-foreground/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500"
              >
                <h3 className="text-lg font-semibold text-foreground tracking-tight mb-6">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {category.skills.map((skill, skillIndex) => {
                    const Icon = skill.icon;
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: categoryIndex * 0.1 + skillIndex * 0.05,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className="group relative flex items-center justify-center w-14 h-14 bg-secondary/40 rounded-2xl border border-border/50 hover:border-primary/40 hover:bg-secondary transition-all duration-300 hover:scale-105 cursor-pointer"
                        title={skill.name}
                      >
                        <Icon
                          className="w-6 h-6 transition-colors duration-300"
                          style={{ color: skill.color }}
                        />
                        <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-semibold bg-foreground text-background rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-sm">
                          {skill.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 7. PROJECTS COMPONENT
// ==========================================
const projects = [
  {
    title: "Marathon Registration Portal",
    description:
      "Engineered a production-grade full-stack registration platform for the official ATAL Marathon × Meraki'26 event. Successfully handled 580+ active participants with secure payment integration and real-time database management.",
    tech: ["React.js", "Next.js", "Supabase", "PostgreSQL", "Razorpay", "GSAP"],
    highlights: [
      "580+ active participants",
      "Secure payment integration",
      "Real-time database",
      "Premium animations",
    ],
    
    github: "https://github.com/Ashiiiit/college-marathon",
  },
  {
    title: "Financial Expense Tracker",
    description:
      "Solves personal budgeting challenges by providing clear visual breakdowns of spending habits and tracking recurring expenses in real time.",
    tech: ["React.js", "Vite", "Tailwind CSS", "FastAPI", "Python", "SQLite"],
    highlights: [
      "Responsive React.js Frontend",
      "Robust FastAPI Backend",
      "Secure SQLite Persistence",
      "Modern UI/UX Design",
    ],
    
    github: "https://github.com/Ashiiiit/mini-projectS6",
  },
];

function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-16">
            <span className="w-8 h-0.5 bg-primary" />
            <h2 className="text-xs font-semibold text-primary tracking-[0.2em] uppercase">
              Featured Projects
            </h2>
          </div>

          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-card/75 backdrop-blur-xl border border-border/40 rounded-3xl p-5 sm:p-8 md:p-12 hover:border-foreground/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/8 transition-colors duration-500" />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-3 relative z-10">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-muted-foreground hover:text-foreground border border-border/60 hover:border-foreground/35 transition-all bg-transparent rounded-full"
                      aria-label="View on GitHub"
                    >
                      <Github size={18} />
                    </a>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed text-base font-normal tracking-tight mb-8 max-w-3xl">
                  {project.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-8 border-t border-border/40 pt-8">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-[0.2em]">
                      Key Highlights
                    </h4>
                    <ul className="space-y-3">
                      {project.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="text-sm font-medium text-foreground flex items-center gap-3"
                        >
                          <span className="w-1.5 h-1.5 bg-primary/85 rounded-full" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-[0.2em]">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-xs font-semibold bg-secondary/50 text-foreground border border-border/45 rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 8. EDUCATION & ACHIEVEMENTS COMPONENT
// ==========================================
const education = [
  {
    degree: "Bachelor of Technology in Computer Science",
    institution: "Government Engineering College Thrissur (KTU)",
    period: "Expected Graduation: 2027",
    score: "CGPA: 6.96",
    icon: GraduationCap,
  },
  {
    degree: "Class XII (CBSE)",
    institution: "Kendriya Vidyalaya",
    period: "2023",
    score: "Score: 85.4%",
    icon: GraduationCap,
  },
];

const achievements = [
  {
    title: "Python Certification",
    issuer: "Udemy",
    link: "https://ude.my/UC-4a4bef6b-6df1-4abb-80d2-afea8deb3250",
    icon: Award,
  },
  {
    title: "First Prize in Bug Hunt",
    issuer: "FOSS GECT",
    icon: Trophy,
  },
  {
    title: "Production Application Deployment",
    issuer: "Shipped a live application handling active users and transactions",
    icon: Award,
  },
];

function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section id="education" className="py-32 px-6 bg-background/60 border-y border-border/40">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Education Section */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-16">
              <span className="w-8 h-0.5 bg-primary" />
              <h2 className="text-xs font-semibold text-primary tracking-[0.2em] uppercase">
                Education
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col xs:flex-row gap-4 xs:gap-6 p-5 sm:p-8 bg-card/75 backdrop-blur-xl border border-border/40 rounded-3xl hover:border-foreground/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300"
                >
                  <div className="p-3.5 bg-secondary/50 rounded-2xl h-fit border border-border/50 w-fit mx-auto xs:mx-0">
                    <edu.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 text-center xs:text-left">
                    <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">
                      {edu.degree}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium mb-4">{edu.institution}</p>
                    <div className="flex flex-wrap gap-4 text-xs font-semibold justify-center xs:justify-start">
                      <span className="text-muted-foreground">{edu.period}</span>
                      <span className="text-primary font-mono">{edu.score}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications & Achievements Section */}
          <div>
            <div className="flex items-center gap-4 mb-16">
              <span className="w-8 h-0.5 bg-primary" />
              <h2 className="text-xs font-semibold text-primary tracking-[0.2em] uppercase">
                Achievements
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="p-5 sm:p-6 bg-card/75 backdrop-blur-xl border border-border/40 rounded-3xl hover:border-foreground/10 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-500 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-secondary/50 rounded-xl border border-border/50">
                      <achievement.icon className="w-5 h-5 text-primary" />
                    </div>
                    {achievement.link && (
                      <a
                        href={achievement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors p-2"
                        aria-label={`View ${achievement.title} certificate`}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
                    {achievement.title}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">{achievement.issuer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 9. CONTACT COMPONENT
// ==========================================
const contactInfo = [
  {
    label: "Email",
    value: "ashitdebnath23006@gmail.com",
    href: "mailto:ashitdebnath23006@gmail.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "call",
    href: "tel:+919933286505",
    icon: Phone,
  },
  {
    label: "GitHub",
    value: "github.com/Ashiiiit",
    href: "https://github.com/Ashiiiit",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/ashit2306",
    href: "https://linkedin.com/in/ashit2306",
    icon: Linkedin,
  },
];

function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section id="contact" className="py-32 px-6 relative z-10">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="w-8 h-0.5 bg-primary" />
            <h2 className="text-xs font-semibold text-primary tracking-[0.2em] uppercase">
              Get in Touch
            </h2>
            <span className="w-8 h-0.5 bg-primary" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight mb-6 leading-tight max-w-2xl mx-auto text-balance">
            Let&apos;s connect.
          </h1>
          
          <p className="text-muted-foreground leading-relaxed text-base font-normal tracking-tight mb-16 max-w-lg mx-auto text-balance">
             
            Feel free to reach out through any of these channels to connect.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {contactInfo.map((contact, index) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-5 p-5 bg-card/75 backdrop-blur-xl border border-border/40 rounded-3xl hover:border-foreground/10 hover:bg-secondary/40 transition-all duration-300 group shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:scale-[1.01]"
              >
                <div className="p-3 bg-secondary/50 rounded-2xl border border-border/50 group-hover:bg-primary/10 transition-colors duration-300">
                  <contact.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{contact.label}</p>
                  <p className="text-foreground font-semibold text-base group-hover:text-primary transition-colors mt-0.5">
                    {contact.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// 10. FOOTER COMPONENT
// ==========================================
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-border/40 bg-background/50 backdrop-blur-xl relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs text-muted-foreground font-semibold uppercase tracking-wider"
          >
            © {currentYear} Ashit Debnath. 
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <a
              href="https://github.com/Ashiiiit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-muted-foreground hover:text-foreground border border-border/60 hover:border-foreground/35 transition-all bg-transparent rounded-full hover:scale-105"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com/in/ashit2306"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-muted-foreground hover:text-foreground border border-border/60 hover:border-foreground/35 transition-all bg-transparent rounded-full hover:scale-105"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
  href="mailto:ashitdebnath23006@gmail.com"
  className="inline-flex items-center justify-center p-3 text-muted-foreground hover:text-foreground border border-border/60 hover:border-foreground/35 transition-all bg-transparent rounded-full hover:scale-105"
  aria-label="Email"
>
  <Mail size={16} />
</a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN PAGE EXPORT
// ==========================================
export default function Home() {
  useEffect(() => {
    // Initialize Lenis for smooth momentum-based scrolling
    const lenis = new Lenis({
      duration: 1.8, // Increased scroll duration to make it exceptionally slow, smooth, and luxurious
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom Apple-style ease-out curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.65, // Lower wheel multiplier to yield a constant, slow, and highly controlled speed
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Support smooth scrolling for in-page anchors
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: 0, duration: 1.2 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-transparent overflow-x-hidden selection:bg-primary/30 selection:text-foreground">
      <ProfessionalBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
