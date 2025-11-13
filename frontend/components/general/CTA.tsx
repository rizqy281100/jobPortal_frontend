"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-14 lg:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
        <div className="grid items-center gap-8 p-6 md:grid-cols-2 md:p-10 lg:p-12">
          {/* Left: copy + button */}
          <div>
            <h2 className="text-3xl font-extrabold text-white dark:text-white leading-tight md:text-4xl">
              Stand out to leading recruiters
              <br className="hidden md:block text-white dark:text-white" />{" "}
              nationwide
            </h2>
            <p className="mt-3 max-w-xl text-white dark:text-white">
              Compete in the biggest skill contest and get noticed by top
              companies. Win prizes and unlock exclusive opportunities.
            </p>

            <div className="mt-6">
              <Button
                asChild
                size="lg"
                className="h-12 min-w-[160px] bg-amber-300 text-black hover:bg-amber-200"
              >
                <Link href="/learn-more">Tell me more</Link>
              </Button>
            </div>
          </div>

          {/* Right: 3-column vertical marquee (each column ≥ 5 logos) */}
          <div className="relative">
            <div className="rounded-[28px] bg-primary-foreground/10 p-4 backdrop-blur">
              <div className="grid grid-cols-3 gap-3 rounded-2xl bg-primary-foreground/10 p-3">
                <MarqueeColumn
                  direction="up"
                  speed={18}
                  slugs={[
                    "google",
                    "microsoft",
                    "amazon",
                    "apple",
                    "adobe",
                    "ibm",
                  ]}
                />
                <MarqueeColumn
                  direction="down"
                  speed={20}
                  slugs={[
                    "slack",
                    "notion",
                    "atlassian",
                    "jira",
                    "asana",
                    "linear",
                  ]}
                />
                <MarqueeColumn
                  direction="up"
                  speed={22}
                  slugs={[
                    "github",
                    "gitlab",
                    "docker",
                    "kubernetes",
                    "postgresql",
                    "redis",
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* corner pills (well, this is optional) */}
        <div className="pointer-events-none absolute -right-8 top-6 hidden h-24 w-24 rounded-[28px] bg-primary-foreground/15 md:block" />
        <div className="pointer-events-none absolute right-20 top-6 hidden h-24 w-24 rounded-[28px] bg-primary-foreground/15 md:block" />
      </div>

      {/* keyframes */}
      <style jsx>{`
        @keyframes marqueeColUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes marqueeColDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

/** ===== Marquee Column (vertical) ===== */
function MarqueeColumn({
  slugs,
  speed = 20,
  direction = "up",
}: {
  slugs: string[];
  speed?: number; // seconds
  direction?: "up" | "down";
}) {
  const list = [...slugs, ...slugs];

  return (
    <div
      className="relative h-[230px] overflow-hidden rounded-xl ring-1 ring-primary-foreground/15 bg-background/60"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        className="absolute inset-0 flex flex-col gap-3"
        style={{
          animation: `${
            direction === "up" ? "marqueeColUp" : "marqueeColDown"
          } ${speed}s linear infinite`,
        }}
      >
        {list.map((slug, i) => (
          <div
            key={`${slug}-${i}`}
            className="flex items-center justify-center"
          >
            <Tile src={`https://svgl.app/library/${slug}.svg`} alt={slug} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Single logo tile (56x56) ===== */
function Tile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-background text-primary shadow-sm ring-1 ring-border dark:ring-white/10">
      <img
        src={src}
        alt={alt}
        className="h-7 w-7 object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
