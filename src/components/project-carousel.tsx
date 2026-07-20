"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type ImageValue = string | { src?: string; alt?: string };

export interface CarouselProject {
  title: string;
  summary: string;
  stack: string[];
  link: string;
  github: string;
  image: ImageValue;
  imageAlt: string;
  gallery?: Array<{
    src: ImageValue;
    alt: string;
  }>;
}

interface ProjectCarouselProps {
  items: CarouselProject[];
}

const srcOf = (value: ImageValue) => (typeof value === "string" ? value : value?.src || "");

export default function ProjectCarousel({ items }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = items[activeIndex] ?? items[0];
  const previewItems = useMemo(() => items.map((item, index) => ({ ...item, index })), [items]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur sm:p-5">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeProject.title}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[16/11] w-full"
            >
              <Image
                src={srcOf(activeProject.image)}
                alt={activeProject.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/80 backdrop-blur">
            Project preview
          </div>
        </div>

        <div className="relative mt-5 h-40 overflow-hidden sm:h-44">
          {previewItems.map((item, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;
            const distance = Math.abs(offset);
            const shift = offset * 122;
            const scale = isActive ? 1 : Math.max(0.76, 0.94 - distance * 0.06);
            const opacity = isActive ? 1 : Math.max(0.28, 0.75 - distance * 0.24);
            const rotate = offset * 7;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5 shadow-[0_14px_50px_rgba(0,0,0,0.28)] transition duration-300"
                style={{
                  transform: `translate(${shift}px, ${isActive ? 0 : distance * 14}px) translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
                  opacity,
                  zIndex: isActive ? 20 : 20 - distance,
                }}
                aria-label={`View ${item.title}`}
              >
                <Image
                  src={srcOf(item.image)}
                  alt={item.imageAlt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      <motion.article
        key={activeProject.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 backdrop-blur sm:p-8"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          {activeIndex + 1} / {items.length}
        </p>
        <h3 className="mt-3 text-3xl font-semibold text-white">{activeProject.title}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-300">{activeProject.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {activeProject.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-cyan-200">
          <a href={activeProject.link} className="inline-flex items-center gap-2 transition hover:text-white">
            Live preview <ArrowUpRight size={14} />
          </a>
          <a href={activeProject.github} className="inline-flex items-center gap-2 transition hover:text-white">
            GitHub <ArrowUpRight size={14} />
          </a>
        </div>
      </motion.article>
    </div>
  );
}
