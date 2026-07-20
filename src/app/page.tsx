"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  Globe2,
  Layers3,
  Mail,
  PenTool,
  Rocket,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
  Workflow,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import ContactPortrait from "@/components/contact-portrait";
import ProjectCarousel from "@/components/project-carousel";
import RippleBackground from "@/components/ripple-background";

// EDIT: Navigation items
const navItems = ["About", "Skills", "Projects", "Experience", "Contact"];

// EDIT: Skills section
const skills = [
  {
    title: "Frontend",
    icon: Code2,
    items: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend",
    icon: Layers3,
    items: ["Node.js", "Express", "REST APIs", "Authentication", "Realtime systems"],
  },
  {
    title: "Data & Cloud",
    icon: Database,
    items: ["MongoDB", "AWS", "Vercel"],
  },
  {
    title: "AI & 3D",
    icon: BrainCircuit,
    items: ["OpenAI integrations", "Three.js", "Blender", "Shaders", "WebGL"],
  },
];

// EDIT: Projects section
const projects = [
  {
    title: "Arashi-Pokedex",
    summary:
      "A comprehensive, modern React application for exploring all Pokémon across generations using the official PokeAPI.",
    stack: ["React 18", "CSS3", "Vite 5", "PokeAPI","Axios"],
    link: "https://arashi-pokedex.netlify.app/",
    github: "https://github.com/Sayandip6/Pokedex",
    image: "/projects/arashi-pokedex-cover.png",
    imageAlt: "Arashi Pokedex project cover placeholder",
    gallery: [
      {
        src: "/projects/gallery/arashi-pokedex-overview.png",
        alt: "Arashi Pokedex overview placeholder",
      },
      {
        src: "/projects/gallery/arashi-pokedex-dex-detail.svg",
        alt: "Arashi Pokedex dex detail placeholder",
      },
      {
        src: "/projects/gallery/arashi-pokedex-mobile-view.svg",
        alt: "Arashi Pokedex mobile view placeholder",
      },
    ],
  },
  {
    title: "smart_hire_nexus",
    summary:
      "A full-stack, enterprise-grade job portal application built with the MERN stack.",
    stack: ["React", "Node.js", "MongoDB", "Express.js"],
    link: "https://smart-hire-nexus.netlify.app/",
    github: "https://github.com/Sayandip6/smart_hire_nexus",
    image: "/projects/smart-hire-nexus-cover.png",
    imageAlt: "Smart Hire Nexus project cover placeholder",
    gallery: [
      {
        src: "/projects/gallery/smart-hire-nexus-dashboard.svg",
        alt: "Smart Hire Nexus dashboard placeholder",
      },
      {
        src: "/projects/gallery/smart-hire-nexus-candidate-list.svg",
        alt: "Smart Hire Nexus candidate list placeholder",
      },
      {
        src: "/projects/gallery/smart-hire-nexus-mobile-view.svg",
        alt: "Smart Hire Nexus mobile view placeholder",
      },
    ],
  },
  {
    title: "Quiz-Hub",
    summary:
      "A simple quiz platform for basic HTML/CSS/JavaScript concepts and general knowledge.",
    stack: ["HTML 5", "JavaScript", "CSS3"],
    link: "https://sayandip6.github.io/Sayandip6-Quiz-Hub/",
    github: "https://github.com/Sayandip6/Sayandip6-Quiz-Hub",
    image: "/projects/quiz-hub-cover.png",
    imageAlt: "Quiz Hub project cover placeholder",
    gallery: [
      {
        src: "/projects/gallery/quiz-hub-quiz-flow.svg",
        alt: "Quiz Hub quiz flow placeholder",
      },
      {
        src: "/projects/gallery/quiz-hub-results-screen.svg",
        alt: "Quiz Hub results screen placeholder",
      },
      {
        src: "/projects/gallery/quiz-hub-mobile-view.svg",
        alt: "Quiz Hub mobile view placeholder",
      },
    ],
  },
];

// EDIT: Timeline/Experience section
const timeline = [
   {
    role: "Batchelor in Computer Application (BCA)",
    company: "B.P.Poddar Institute of Management & Technology",
    period: "2023 — current",
    blurb:
      "Focused on building strong foundation and learning new things to elivate my skills.",
  },
  {
    role: "Full Stack Developer",
    company: "Ardent Computech",
    period: "2025 — 2025",
    blurb:
      "Building award-style product experiences for startups and agencies, combining fast APIs with polished frontend systems.",
  },

];

const SHINY_KEYFRAMES_ID = "shiny-hero-keyframes";

function ShinyHeroText({ text }: { text: string }) {
  const shellStyle: CSSProperties = {
    position: "relative",
    display: "inline-block",
    boxSizing: "border-box",
    whiteSpace: "normal",
    color: "inherit",
  };

  const shineLayerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    color: "#78FF83",
    pointerEvents: "none",
    WebkitMaskImage:
      "linear-gradient(to right, transparent 30%, #000 50%, transparent 70%)",
    maskImage:
      "linear-gradient(to right, transparent 30%, #000 50%, transparent 70%)",
    WebkitMaskSize: "150% auto",
    maskSize: "150% auto",
    animation: "shinyHeroSweep 1.5s ease-in-out infinite",
  };

  return (
    <span style={shellStyle}>
      <style
        id={SHINY_KEYFRAMES_ID}
        dangerouslySetInnerHTML={{
          __html: `@keyframes shinyHeroSweep {
            0% { -webkit-mask-position: 200%; mask-position: 200%; }
            100% { -webkit-mask-position: -100%; mask-position: -100%; }
          }`,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{text}</span>
      <span style={shineLayerStyle} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

function TiltSkillCard({
  title,
  icon: Icon,
  items,
  delay,
}: {
  title: string;
  icon: LucideIcon;
  items: string[];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x);
  const ySpring = useSpring(y);
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;
  const rotationRange = 32.5;
  const halfRotationRange = rotationRange / 2;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (event.clientX - rect.left) * rotationRange;
    const mouseY = (event.clientY - rect.top) * rotationRange;
    const rotationX = (mouseY / height - halfRotationRange) * -1;
    const rotationY = mouseX / width - halfRotationRange;
    x.set(rotationX);
    y.set(rotationY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="group relative rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur transition hover:border-cyan-400/30"
    >
      <div
        style={{
          transform: "translateZ(48px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <Icon size={20} />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export default function Home() {
  const [isPointerReady, setIsPointerReady] = useState(false);
  const [isRippleActive, setIsRippleActive] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 180, damping: 20, mass: 0.8 });
  const smoothY = useSpring(y, { stiffness: 180, damping: 20, mass: 0.8 });
  const contactSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updatePointerState = () => setIsPointerReady(media.matches);
    const rafId = window.requestAnimationFrame(updatePointerState);

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    if (media.matches) {
      window.addEventListener("mousemove", onMove);
    }

    media.addEventListener("change", updatePointerState);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      media.removeEventListener("change", updatePointerState);
    };
  }, [x, y]);

  useEffect(() => {
    const sentinel = contactSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRippleActive(!entry.isIntersecting);
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="relative isolate min-h-screen overflow-x-hidden text-slate-100"
      style={{
        background: "linear-gradient(135deg, var(--hero-bg-primary) 0%, var(--hero-bg-primary) 45%, var(--hero-bg-primary) 100%)",
        color: "var(--text-primary)"
      }}
    >
      <RippleBackground active={isRippleActive} />

      {isPointerReady ? (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-50 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/70 bg-cyan-300/10 shadow-[0_0_45px_rgba(34,211,238,0.25)]"
          style={{ x: smoothX, y: smoothY }}
        />
      ) : null}

      <header 
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          backgroundColor: "var(--header-bg)",
          borderColor: "var(--header-border)",
          color: "var(--header-text)"
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">

          {/* EDIT: Header branding */}
          <a 
            href="#home" 
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--header-logo-color)" }}
          >
            Sayandip / Dev
          </a>
          <nav className="hidden items-center gap-6 text-sm md:flex" style={{ color: "var(--header-text)" }}>
            {navItems.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="transition"
                style={{
                  color: "var(--header-text)",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--header-link-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--header-text)")}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="home" className="relative z-10">
        <section className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 py-24 sm:px-8 lg:px-10">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.04, 1] }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute left-[8%] top-[10%] h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
            />
            <motion.div
              animate={{ y: [0, 24, 0], x: [0, -10, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* EDIT: Hero status badge */}
            <div 
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
              style={{
                backgroundColor: "var(--hero-badge-bg)",
                borderColor: "var(--hero-badge-border)",
                color: "var(--hero-badge-text)"
              }}
            >
              <Sparkles size={16} />
              Available for freelance and product collaborations
            </div>
            {/* EDIT: Hero headline */}
            <h1 
              className="text-4xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ color: "var(--hero-text-primary)" }}
            >
              <ShinyHeroText text="I craft EYE-catching, high-performing digital experiences for ambitious brands." />
            </h1>
            
            {/* EDIT: Hero subheading */}
            <p 
              className="mt-6 max-w-2xl text-lg leading-8 sm:text-xl"
              style={{ color: "var(--hero-text-secondary)" }}
            >
              I’m a Full Stack MERN developer blending React, Three.js, AI integrations, and thoughtful backend systems into polished, memorable products.
            </p>
            
            {/* EDIT: CTA buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--btn-primary-bg)",
                  color: "var(--btn-primary-text)"
                }}
              >
                Explore projects <ArrowUpRight size={16} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition"
                style={{
                  backgroundColor: "var(--btn-secondary-bg)",
                  borderColor: "var(--btn-secondary-border)",
                  color: "var(--btn-secondary-text)"
                }}
              >
                Let’s build together
              </a>
            </div>
          </motion.div>

          {/* EDIT: Hero stat cards */}
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              { label: "Core stack", value: "MERN • AI • 3D" },
              { label: "Focus", value: "Performance first" },
              { label: "Delivery", value: "Fast, polished, scalable" },
            ].map((item) => (
              <div 
                key={item.label} 
                className="rounded-2xl border p-4 backdrop-blur"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)"
                }}
              >
                <p className="text-sm" style={{ color: "var(--card-label-text)" }}>{item.label}</p>
                <p className="mt-2 text-lg font-medium" style={{ color: "var(--card-value-text)" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="rounded-[2rem] border p-8 backdrop-blur"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderColor: "var(--card-border)"
              }}
            >
              {/* EDIT: About section title */}
              <p className="text-sm uppercase tracking-[0.3em]" style={{ color: "var(--primary-color)" }}>About</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
                Crafting Digital Experiences.
              </h2>
              {/* EDIT: About section description */}
              <p className="mt-6 text-lg leading-8" style={{ color: "var(--text-secondary)" }}>
                I&apos;m a Full Stack Developer specializing in the MERN stack, building clean, scalable, and responsive web applications. I enjoy solving problems and creating impactful digital experiences.
              </p>
              <p className="mt-4 text-lg leading-8" style={{ color: "var(--text-secondary)" }}>
              I believe great software should be fast, intuitive, and engaging. I enjoy building full-stack applications and interactive experiences while continuously learning and refining every project.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="rounded-[2rem] border p-8 backdrop-blur"
              style={{
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                borderColor: "var(--card-border)"
              }}
            >
              {/* EDIT: Signature traits section */}
              <div className="flex items-center gap-3" style={{ color: "var(--primary-color)" }}>
                <Rocket size={18} />
                <span className="text-sm uppercase tracking-[0.25em]">Signature traits</span>
              </div>
              <div className="mt-8 space-y-4">
                {[
                  "Calm thinker who values clarity and craft",
                  "Polished, high-performance product experiences",
                  "Thoughtful AI features and API integrations",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <BadgeCheck className="mt-0.5 text-cyan-300" size={18} />
                    <p className="text-sm leading-7 text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

            {/* EDIT: Skills section header */}
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Skills</p>
              <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">A stack tuned for modern product teams.</h2>
            </div>
            <p className="max-w-xl text-slate-300">
              I would love to know your opinion about my work.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill, index) => (
              <TiltSkillCard
                key={skill.title}
                title={skill.title}
                icon={skill.icon}
                items={skill.items}
                delay={index * 0.06}
              />
            ))}
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

            {/* EDIT: Projects section header */}
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Projects</p>
              <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Selected work with depth and delight.</h2>
            </div>
            <p className="max-w-xl text-slate-300">
              Each build is designed to balance business goals, storytelling, and engineering quality without sacrificing feel.
            </p>
          </div>

          <ProjectCarousel items={projects} />
        </section>

        {/* EDIT: Experience section */}
        <section id="experience" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Experience & Education</p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">A steady path shaped by craft and curiosity.</h2>
          </div>

          <div className="space-y-4">
            {timeline.map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-cyan-200">
                    <Workflow size={16} />
                    <span className="text-sm uppercase tracking-[0.25em]">{item.period}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-white">{item.role}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.company}</p>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-slate-300">{item.blurb}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <div ref={contactSentinelRef} aria-hidden="true" className="h-px w-full" />
        <section id="contact" className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-slate-900/80 to-fuchsia-500/15 p-8 backdrop-blur sm:p-10"
          >
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Contact</p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Let’s create something unforgettable.</h2>
                <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
                  If you need a polished product experience, a custom web platform, or a thoughtful AI-enabled feature, I’d love to talk.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="mailto:sayandipnskrar@gmail.com" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/15">
                    <Mail size={16} /> sayandipnskrar@gmail.com
                  </a>
                  <a href="https://github.com/Sayandip6" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/15">
                    <ArrowUpRight size={16} /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/sayandip-naskar-9a4031375/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/15">
                    <ArrowUpRight size={16} /> LinkedIn
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                <ContactPortrait
                  src="/portraits/sayandip-portrait.png"
                  alt="Animated self-portrait placeholder"
                />

                {/* EDIT: Services list */}
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6">
                  <div className="flex items-center gap-3 text-cyan-200">
                    <PenTool size={18} />
                    <span className="text-sm uppercase tracking-[0.25em]">What I can help with</span>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "Full stack builds", icon: Globe2 },
                      { title: "AI-driven features", icon: BrainCircuit },
                      { title: "Immersive interfaces", icon: Cpu },
                      { title: "Reliable deployment", icon: ShieldCheck },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-cyan-200">
                            <Icon size={16} />
                            <p className="text-sm font-medium text-white">{item.title}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* EDIT: Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400 sm:px-8 lg:px-10">
        Designed and developed by Sayandip.
      </footer>
    </div>
  );
}
