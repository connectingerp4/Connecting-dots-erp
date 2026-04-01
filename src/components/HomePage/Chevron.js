"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import BackgroundAnimation from "@/components/Common/BackgroundAnimation";

// Memoized SVG icons (no props, so React.memo is safe)

const Phases = React.memo(() => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path
      d="M5 20 Q10 10, 15 20 Q20 30, 25 20 Q30 10, 35 20"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M8 25 Q13 15, 18 25 Q23 35, 28 25 Q33 15, 38 25"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
));

const OuterSinusoidalWave = React.memo(() => (
  <svg
    width="600"
    height="160"
    viewBox="0 0 600 160"
    fill="none"
    className="absolute -top-10 -left-8"
  >
    <path />
    <path />
  </svg>
));

// (Keep your other memoized icons here if you actually use them in JSX)
// Example:
// const DatabaseIcon = React.memo(() => ( ... ));

export default function OfferLetter() {
  // steps: memoized so they are not recreated on every render
  const steps = useMemo(() => [
      {
        label: "Enroll",
        color: "#34D399",
        topColored: true,
        icon: (
          <Image
            src="/chevron/enroll.avif"
            alt="Enroll"
            width={40}
            height={40}
            loading="lazy"
            className="w-10 h-10 rounded-[6px] object-cover"
          />
        ),
      },
      {
        label: "Corporate Training",
        color: "#FBBF24",
        topColored: false,
        icon: (
          <Image
            src="/chevron/corporate training.avif"
            alt="Corporate Training"
            width={40}
            height={40}
            loading="lazy"
            className="w-10 h-10 rounded-[6px] object-cover"
          />
        ),
      },
      {
        label: "Real-Time Projects",
        color: "#8B5CF6",
        topColored: true,
        icon: (
          <Image
            src="/chevron/real time project.avif"
            alt="Real-Time Projects"
            width={40}
            height={40}
            loading="lazy"
            className="w-10 h-10 rounded-[6px] object-cover"
          />
        ),
      },
      {
        label: "Interview Preparation",
        color: "#FB7185",
        topColored: false,
        icon: (
          <Image
            src="/chevron/interview prepration.avif"
            alt="Interview Preparation"
            width={40}
            height={40}
            loading="lazy"
            className="w-10 h-10 rounded-[6px] object-cover"
          />
        ),
      },
      {
        label: "Experience Alteration",
        color: "#6366F1",
        topColored: true,
        icon: (
          <Image
            src="/chevron/experience.avif"
            alt="Experience Alteration"
            width={40}
            height={40}
            loading="lazy"
            className="w-10 h-10 rounded-[6px] object-cover"
          />
        ),
      },
      {
        label: "Job Assistance",
        color: "#F59E0B",
        topColored: false,
        icon: (
          <Image
            src="/chevron/job offer.avif"
            alt="Job Assistance"
            width={40}
            height={40}
            loading="lazy"
            className="w-10 h-10 rounded-[6px] object-cover"
          />
        ),
      },
    ],
    []
  );

  // Animation state
  const [animationState, setAnimationState] = useState({
    visible: false,
    isPaused: false,
    cycleKey: 0,
  });
  const animationStartRef = useRef(Date.now());

  useEffect(() => {
    const animationDuration = 3000; // ms, must match CSS 'flow'
    const visibleDuration = 5000;
    const hiddenGap = 600;

    const timers = [];

    function startCycle() {
      setAnimationState((prev) => ({ ...prev, visible: true }));

      const now = Date.now();
      const elapsed = (now - animationStartRef.current) % animationDuration;
      const timeUntilEnd = animationDuration - elapsed;

      const pauseTimer = window.setTimeout(() => {
        setAnimationState((prev) => ({ ...prev, isPaused: true }));

        const resumeTimer = window.setTimeout(() => {
          animationStartRef.current = Date.now();
          setAnimationState((prev) => ({
            visible: false,
            isPaused: false,
            cycleKey: prev.cycleKey + 1,
          }));
        }, visibleDuration);
        timers.push(resumeTimer);
      }, timeUntilEnd);
      timers.push(pauseTimer);

      const nextTimer = window.setTimeout(
        () => startCycle(),
        timeUntilEnd + visibleDuration + hiddenGap
      );
      timers.push(nextTimer);
    }

    startCycle();

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const { visible, isPaused, cycleKey } = animationState;

  // Helper function to split label into two lines for better mobile display
  const splitLabelIntoTwo = (text) => {
    const words = text.trim().split(/\s+/);
    if (words.length === 1) return [words[0], null];
    if (words.length === 2) return [words[0], words[1]];

    const total = text.length;
    let bestIdx = 0;
    let bestDiff = Infinity;
    let cum = 0;
    for (let i = 0; i < words.length - 1; i++) {
      cum += words[i].length + 1;
      const diff = Math.abs(cum - total / 2);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }
    const first = words.slice(0, bestIdx + 1).join(" ");
    const second = words.slice(bestIdx + 1).join(" ");
    return [first, second];
  };

  return (
    <div
      id="chevron-area"
      className="chevron-root min-h-[520px] relative overflow-visible"
      style={{ paddingBottom: "12px", contain: "layout style paint" }}
    >
      <BackgroundAnimation />

      {/* Section heading */}
      <div className="containerCH">
        <h2>Training To Placement Approach</h2>
        <div className="titleUnderline" />
      </div>

      {/* Outer Sinusoidal Wave Background */}
      <div className="chevron-wave-wrapper absolute top-[46%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <OuterSinusoidalWave />
      </div>

      {/* Center Content - Icon Row */}
      <div className="chevron-content-wrapper absolute top-[46%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative flex items-center gap-6 w-max"
          style={{ transform: "scale(1.25)", transformOrigin: "center" }}
        >
          {/* Mid-row animated wave */}
          <svg
            key={cycleKey}
            width="700"
            height="120"
            viewBox="0 0 600 120"
            className={`wave absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none ${
              isPaused ? "paused" : ""
            }`}
          >
            {(() => {
              const starts = [6, 110, 214, 318, 422, 526];
              const ends = [74, 178, 282, 386, 490, 594];
              const colors = [
                "#34D399",
                "#FBBF24",
                "#8B5CF6",
                "#FB7185",
                "#6366F1",
                "#F59E0B",
              ];
              const segs = [];
              for (let i = 0; i < 6; i++) {
                const startX = starts[i];
                const endX = ends[i];
                const dirFlag = i % 2 === 0 ? 1 : 0;

                if (i > 0) {
                  const prevEnd = ends[i - 1];
                  segs.push(
                    <path
                      key={`conn-${i}`}
                      d={`M${prevEnd} 60 L${startX} 60`}
                      stroke={colors[i]}
                      strokeWidth="30"
                      fill="none"
                      strokeLinecap="round"
                      className="wave-seg"
                      style={{ "--delay": `${i * 0.15}s` }}
                    />
                  );
                }

                segs.push(
                  <path
                    key={`arc-${i}`}
                    d={`M${startX} 60 A34 34 0 0 ${dirFlag} ${endX} 60`}
                    stroke={colors[i]}
                    strokeWidth="30"
                    fill="none"
                    strokeLinecap="round"
                    className="wave-seg"
                    style={{ "--delay": `${i * 0.15}s` }}
                  />
                );
              }
              return segs;
            })()}

            <path
              d="M6 66 A34 34 0 0 1 74 66 A34 34 0 0 1 110 66 A34 34 0 0 1 178 66 A34 34 0 0 1 214 66 A34 34 0 0 1 282 66 A34 34 0 0 1 318 66 A34 34 0 0 1 386 66 A34 34 0 0 1 422 66 A34 34 0 0 1 490 66 A34 34 0 0 1 526 66 A34 34 0 0 1 594 66"
              stroke="rgba(2,6,23,0.06)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Icons row */}
          <div className="flex items-center gap-6 relative z-10">
            {steps.map((s, idx) => (
              <div
                key={s.label}
                className="icon-item relative w-20 h-20"
                style={{ "--delay": `${idx * 0.15}s` }}
              >
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  className="absolute inset-0"
                >
                  <path
                    className="semi-top"
                    d="M6 40 A34 34 0 0 1 74 40"
                    stroke={s.topColored ? s.color : "#E5E7EB"}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    className="semi-bottom"
                    d="M74 40 A34 34 0 0 1 6 40"
                    stroke={s.topColored ? "#E5E7EB" : s.color}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    className="semi-right"
                    d="M40 6 A34 34 0 0 1 40 74"
                    stroke={idx % 2 === 0 ? s.color : "#E5E7EB"}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    className="semi-left"
                    d="M40 74 A34 34 0 0 1 40 6"
                    stroke={idx % 2 === 0 ? "#E5E7EB" : s.color}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="icon-inner w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg z-10 text-black">
                    {s.icon}
                  </div>
                </div>

                <div
                  className={`label-arrow absolute left-1/2 transform -translate-x-1/2 ${
                    s.topColored ? "arrow-top" : "arrow-bottom"
                  }`}
                  aria-hidden="true"
                >
                  {s.topColored ? (
                    <svg
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0 L14 8 H0 L7 0 Z" fill={s.color} />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="8"
                      viewBox="0 0 14 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0 L14 0 L7 8 Z" fill={s.color} />
                    </svg>
                  )}
                </div>

                <div
                  className={`label absolute left-1/2 transform -translate-x-1/2 ${
                    s.topColored ? "-top-12 label-top" : "-bottom-12 label-bottom"
                  } ${visible ? "label-visible" : ""}`}
                  style={{
                    background: s.color,
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: 8,
                    transition: "opacity 180ms ease, transform 180ms ease",
                  }}
                >
                  {(() => {
                    const [first, second] = splitLabelIntoTwo(s.label);
                    if (!second) return <span className="label-line">{first}</span>;
                    return (
                      <span className="label-multiline">
                        <span className="label-line-first">{first}</span>
                        <span className="label-line-second">{second}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      

      {/* Inline styles for sequential animation and hover behaviour */}
      <style>{`
        .icon-item { opacity: 1; transform: translateY(0); }
        .icon-inner { transition: transform 180ms ease; }
        .icon-item:hover .icon-inner { transform: scale(1.06); }

        /* labels: common base */
        .label { opacity: 0; pointer-events: none; white-space: nowrap; font-weight: 600; font-size: 12px; }
        .label-visible { opacity: 1; pointer-events: auto; transform: translateY(0) !important; }

        /* reveal from above (for top-colored semicircles) */
        .label-top { transform: translateY(-8px); }
        /* reveal from below (for bottom-colored semicircles) */
        .label-bottom { transform: translateY(8px); }

        /* small arrow indicators positioned near the circle border center */
        .label-arrow { width: 14px; height: 8px; pointer-events: none; z-index: 11; left: 50%; }
        /* place arrow slightly outside the circle border and nudge right */
        .label-arrow.arrow-top { top: -8px; transform: translate(-30%, -140%); }
        .label-arrow.arrow-bottom { bottom: -8px; transform: translate(-30%, 140%); }

        /* Wave segments: always visible; flowing stroke animation keeps motion without changing shape */
        .wave-seg { opacity: 1; transition: opacity 260ms ease; stroke-linecap: round; }
        /* Use stroke-dasharray on the whole wave to create a flowing effect (desktop) */
        .wave path { stroke-dasharray: 120; animation: flow 3s linear infinite; }
        /* Pause wave flow after the current cycle completes */
        .wave.paused path { animation-play-state: paused; }
        @keyframes flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -240; } }

        /* Alternative animation used when the wave is rotated for mobile - reverse direction so motion reads "up/down" instead of left/right */
        @keyframes flow-vertical { from { stroke-dashoffset: 0; } to { stroke-dashoffset: 240; } }

        /* Responsive: mobile vertical layout (stack entire component vertically) */
        @media (max-width: 640px) {
          /* outer wrapper becomes a vertical column centered */
          .relative.flex.items-center.gap-6.w-max { display: flex; flex-direction: column; align-items: center; justify-content: center !important; width: 100% !important; gap: 1rem; transform: scale(0.95) !important; padding: 8px; }

          /* inner icons container becomes a column so each icon stacks */
          .flex.items-center.gap-6.relative.z-10 { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 0.8rem !important; }

          /* make icon-item a fixed row container so label columns line up consistently and circle sits left */
          .icon-item { width: 260px !important; height: 80px !important; display: flex !important; align-items: center !important; justify-content: flex-start !important; padding: 0 12px !important; box-sizing: border-box !important; overflow: visible !important; }

          /* keep icon-inner size small and ensure it's above the SVG ring */
          .icon-inner { width: 56px !important; height: 56px !important; z-index: 20 !important; }

          /* place the SVG circle as a fixed block on the left instead of absolute full-width; on mobile override the .absolute helper so it doesn't stretch */
          .icon-item > svg { position: relative !important; width: 80px !important; height: 80px !important; flex: 0 0 80px !important; margin-right: 8px !important; display: block !important; }
          /* in case the svg has utility classes like "absolute inset-0", target that explicitly to ensure it becomes static in layout */
          .icon-item > svg.absolute { position: relative !important; left: auto !important; top: auto !important; transform: none !important; }

          /* the wrapper that previously covered the whole item should be static and confined to the SVG area and center its contents */
          .icon-item > .absolute { position: static !important; width: 80px !important; height: 80px !important; display: flex !important; align-items: center !important; justify-content: center !important; left: auto !important; top: auto !important; transform: none !important; }

          /* ensure the white inner circle is centered inside the SVG block and not offset by transforms */
          .icon-item > .absolute .icon-inner { position: relative !important; margin: 0 !important; left: auto !important; top: auto !important; transform: none !important; }

          /* Hide arrows on mobile */
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label-arrow { display: none !important; }

          /* Uniform small boxed labels: fixed height, centered text, same padding for all items */
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label {
            position: absolute;
            top: 50% !important;
            transform: translateY(-50%) !important; /* ensure no translateX left from desktop */
            font-size: 12px !important;
            white-space: nowrap;
            padding: 6px 10px !important; /* keep same padding as desktop look */
            border-radius: 8px !important;
            min-width: 140px !important;
            height: 36px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
            opacity: 0.98 !important;
          }

          /* Align labels into two symmetric columns relative to item center so positions match across all rows */
          /* right-column (odd items) */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) .label { left: calc(50% + 64px) !important; right: auto !important; text-align: left !important; transform: translateY(-50%) !important; }
          /* left-column (even items) */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) .label { right: calc(50% + 64px) !important; left: auto !important; text-align: right !important; transform: translateY(-50%) !important; }

          /* Ensure top/bottom offsets are neutralized (we position horizontally) */
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label-top,
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label-bottom {
            top: 50% !important;
            transform: translateY(-50%) !important;
          }

          /* rotate and size the wave so it runs vertically behind the stacked icons and keep it centered */
          .wave {
            transform: rotate(90deg) translate(0, 0) !important;
            width: 360px !important;
            height: 700px !important;
            left: 50% !important;
            top: 50% !important;
            transform-origin: center center !important;
          }

          /* On mobile use a reversed dash offset animation so flow reads along the vertical axis naturally */
          .wave path { stroke-dasharray: 120 !important; animation: flow-vertical 3s linear infinite !important; }
          .wave.paused path { animation-play-state: paused !important; }

          /* reduce stroke widths so proportions feel correct on mobile */
          .wave path { stroke-width: 24 !important; }
          .icon-item svg path { stroke-width: 8 !important; }

          /* Strong mobile fixes: hide the rotated wave to avoid misalignment, and force SVG + inner circle to act as a left-aligned block */
          .wave {
            display: block !important;
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) rotate(90deg) !important;
            transform-origin: center center !important;
            width: 360px !important;
            height: 700px !important;
            margin: 0 !important;
            z-index: 40 !important; /* sit above ring but below white icon */
            pointer-events: none !important;
          }
        }

        /* On mobile show left/right semicircles and hide top/bottom so the ring appears split vertically */
        .icon-item svg .semi-top, .icon-item svg .semi-bottom { display: none !important; }
        .icon-item svg .semi-left, .icon-item svg .semi-right { display: block !important; }

        /* Nudge the ring slightly left so the colored half sits outside the white inner circle like the reference */
        .icon-item > svg { margin-right: 12px !important; transform: translateX(0) !important; }

        /* Ensure the SVG block and inner icon are vertically centered inside the row */
        .icon-item { align-items: center !important; }
        .icon-item > .absolute, .icon-item > svg { display: flex !important; align-items: center !important; justify-content: center !important; }

        /* Center the stacked icons column and place labels to the sides outside the centered ring */
        @media (max-width: 640px) {
          /* constrain and center the icons column */
          .flex.items-center.gap-6.relative.z-10 { width: 260px !important; margin: 0 auto !important; display: flex !important; flex-direction: column !important; align-items: stretch !important; gap: 0.8rem !important; }

          /* ensure each row uses the full column width and centers the ring block */
          .icon-item { width: 260px !important; margin: 0 auto !important; display: flex !important; align-items: center !important; justify-content: flex-start !important; position: relative !important; height: 88px !important; }

          /* position svg at left of the row and keep inner circle centered over it; shift ring block to the right */
          .icon-item > svg { margin-right: 8px !important; flex: 0 0 80px !important; transform: translateX(20px) !important; }
          .icon-item > svg.absolute { transform: translateX(20px) !important; }

          /* move the inner wrapper with the SVG so centers remain aligned */
          .icon-item > .absolute { left: 20px !important; top: 0 !important; width: 80px !important; height: 80px !important; }

          /* place labels outside the centered ring block, odd -> right, even -> left (increased gap to account for shifted ring) */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) .label { left: calc(100% + 28px) !important; right: auto !important; text-align: left !important; }
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) .label { right: calc(100% + 28px) !important; left: auto !important; text-align: right !important; }

          /* ensure labels vertically centered relative to the row */
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label { top: 50% !important; transform: translateY(-50%) !important; }
        }

        /* Strong final override: ensure rings are centered in mobile viewport and cancel conflicting transforms/margins */
        @media (max-width: 640px) {
          .flex.items-center.gap-6.relative.z-10 { width: 100% !important; display: flex !important; align-items: center !important; flex-direction: column !important; }

          /* center each row and place the ring exactly in the middle */
          .flex.items-center.gap-6.relative.z-10 > .icon-item { justify-content: center !important; padding: 0 !important; }

          /* cancel previous absolute/translate rules and center svg and inner wrapper using margin auto */
          .flex.items-center.gap-6.relative.z-10 > .icon-item > svg,
          .flex.items-center.gap-6.relative.z-10 > .icon-item > svg.absolute,
          .flex.items-center.gap-6.relative.z-10 > .icon-item > .absolute {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            margin: 0 auto !important;
            width: 80px !important;
            height: 80px !important;
            display: block !important;
            z-index: 30 !important; /* below wave */
            pointer-events: none !important; /* allow clicks to pass to the icon beneath */
          }

          /* ensure white inner circle remains centered and placed under the SVG ring */
          .flex.items-center.gap-6.relative.z-10 > .icon-item > .absolute { z-index: 20 !important; }
          .flex.items-center.gap-6.relative.z-10 > .icon-item > .absolute .icon_inner { margin: 0 auto !important; position: relative !important; transform: none !important; z-index: 10 !important; }

          /* MOBILE: hide arrow pointers and tighten label sizing so headings fit in one line */
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label-arrow { display: none !important; }
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label {
            font-size: 11px !important;
            padding: 4px 8px !important;
            min-width: 0 !important;
            max-width: 150px !important;
            height: 32px !important;
            line-height: 1 !important;
          }
        }

        /* Consolidated mobile override: center SVG ring and white icon precisely and fix selector typo */
        @media (max-width: 640px) {
          /* Ensure the icon column stretches and rows are centered */
          .flex.items-center.gap-6.relative.z-10 { width: 100% !important; display: flex !important; align-items: center !important; flex-direction: column !important; gap: 0.8rem !important; margin: 0 auto !important; }

          /* Make each row a stable relative container and center its contents */
          .flex.items-center.gap-6.relative.z-10 > .icon-item {
            position: relative !important;
            width: 260px !important;
            height: 88px !important;
            margin: 0 auto !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }

          /* Absolutely center the ring SVG inside the row so its center matches the white icon center */
          .flex.items-center.gap-6.relative.z-10 > .icon-item > svg,
          .flex.items-center.gap-6.relative.z-10 > .icon-item > svg.absolute,
          .flex.items-center.gap-6.relative.z-10 > .icon-item svg.absolute.inset-0 {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 80px !important;
            height: 80px !important;
            margin: 0 !important;
            display: block !important;
            z-index: 60 !important; /* visually on top */
            pointer-events: none !important; /* clicks go through to icon */
          }

          /* Absolutely center the inner wrapper (contains the white circle) beneath the SVG ring */
          .flex.items-center.gap-6.relative.z-10 > .icon-item > .absolute {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 80px !important;
            height: 80px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 !important;
            z-index: 50 !important; /* below the ring SVG */
          }

          /* Ensure the visible white circle is centered and slightly smaller so ring appears around it */
          .flex.items-center.gap-6.relative.z-10 > .icon-item > .absolute .icon-inner {
            width: 56px !important;
            height: 56px !important;
            position: relative !important;
            margin: 0 !important;
            transform: none !important;
            z-index: 40 !important; /* below the svg ring */
          }

          /* Labels: keep to the side of the centered ring */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) .label { left: calc(50% + 64px) !important; right: auto !important; text-align: left !important; }
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) .label { right: calc(50% + 64px) !important; left: auto !important; text-align: right !important; }

          /* Hide arrows and tighten label styling */
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label-arrow { display: none !important; }
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label {
            font-size: 11px !important;
            padding: 4px 8px !important;
            min-width: 0 !important;
            max-width: 150px !important;
            height: 32px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            justify-content: center !important;
          }
        }

        /* Final mobile label placement: keep headings close to rings for all rows */
        @media (max-width: 640px) {
          /* Ensure labels are absolutely positioned relative to each row's center */
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label {
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            font-size: 11px !important;
            padding: 4px 8px !important;
            max-width: 160px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            box-sizing: border-box !important;
          }

          /* Place odd items' labels to the immediate right of the ring, even items to the immediate left */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) .label {
            left: calc(50% + 80px) !important; /* increased to 72px to avoid overlap */
            right: auto !important;
            text-align: left !important;
          }
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) .label {
            right: calc(50% + 40px) !important; /* match odd offset */
            left: auto !important;
            text-align: right !important;
          }
        }

        /* Uniform mobile label spacing: ensure labels never overlap rings and sit at the same distance */
        @media (max-width: 640px) {
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label {
            /* Positioning */
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important; /* cancel translateX from markup */

            /* Sizing + truncation */
            font-size: 11px !important;
            padding: 6px 10px !important;
            max-width: 160px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            box-sizing: border-box !important;

            /* Visual stack */
            z-index: 70 !important; /* above ring */
            pointer-events: auto !important;
          }

          /* Consistent horizontal offset from the ring center; adjust 72px if you want closer/farther */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) .label {
            left: calc(50% + 80px) !important; /* increased offset */
            right: auto !important;
            text-align: left !important;
          }
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) .label {
            right: calc(50% + 80px) !important; /* match odd offset */
            left: auto !important;
            text-align: right !important;
          }
        }

        /* Ensure both sides use same horizontal offset on mobile (override earlier rules) */
        @media (max-width: 640px) {
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) .label {
            left: calc(50% + 90px) !important;
            right: auto !important;
            text-align: left !important;
          }
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) .label {
            right: calc(50% + 10px) !important; /* match odd offset */
            left: auto !important;
            text-align: right !important;
          }
        }

        /* Multiline label structure - keep single-line by default but allow stacking on mobile */
        .label-multiline { display: inline-flex; flex-direction: row; align-items: center; gap: 4px; }
        .label-line-first, .label-line-second { display: inline-block; }

        /* Mobile: force the split into two stacked lines and align per side */
        @media (max-width: 640px) {
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label .label-multiline {
            display: inline-flex !important;
            flex-direction: column !important;
            align-items: center !important; /* default center, overridden per side below */
            gap: 0 !important;
            line-height: 1 !important;
            white-space: normal !important; /* allow wrapping within the two lines */
            max-width: 120px !important; /* ensure the box is narrow enough to force two lines */
            overflow: visible !important;
            text-overflow: clip !important;
          }

          .flex.items-center.gap-6.relative.z-10 > .icon-item .label { max-width: 160px !important; }

          /* Right-side labels (odd items) left-align the two lines so text starts near the ring */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) .label .label-multiline {
            align-items: flex-start !important;
            text-align: left !important;
          }

          /* Left-side labels (even items) right-align the two lines */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) .label .label-multiline {
            align-items: flex-end !important;
            text-align: right !important;
          }

          .flex.items-center.gap-6.relative.z-10 > .icon-item .label .label-line-first {
            font-size: 11px !important;
            font-weight: 600 !important;
            display: block !important;
            line-height: 1.05 !important;
            white-space: normal !important;
          }
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label .label-line-second {
            font-size: 11px !important;
            font-weight: 700 !important;
            display: block !important;
            margin-top: 2px !important;
            line-height: 1 !important;
            white-space: normal !important;
          }
        }

        /* Final clean mobile-only wave override: enable a vertical flowing wave behind stacked icons without altering desktop layout or icon positions */
        @media (max-width: 640px) {
          .wave {
            display: block !important;
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) rotate(90deg) !important;
            transform-origin: center center !important;
            width: 360px !important;
            height: 700px !important;
            margin: 0 !important;
            z-index: 40 !important; /* sit above ring but below white icon */
            pointer-events: none !important;
          }

          /* Move the whole chevron lower on the page so top rings no longer overlap the heading */
          .chevron-wave-wrapper,
          .chevron-content-wrapper {
            top: 58% !important; /* shift slightly upward from 62% */
          }

          /* Reduce vertical gap between rings so the column remains compact after shifting down */
          .chevron-content-wrapper .flex.items-center.gap-6.relative.z-10 {
            gap: 12px !important; /* tighter, consistent gap */
          }

          /* Slightly reduce row height so stacked rings fit without overlapping heading */
          .chevron-content-wrapper .flex.items-center.gap-6.relative.z-10 > .icon-item {
            height: 86px !important;
          }

          /* Increase safe space under the heading by adding a small top padding to wrapper container (non-invasive) */
          .chevron-root { padding-top: 18px !important; }
        }

        /* Disable all animations and transitions on mobile to provide a static experience */
        @media (max-width: 640px) {
          
         }
        @media (max-width: 640px) { 
          /* Hide the sinusoidal wave entirely on mobile */
          .wave { display: none !important; }
          .wave path { display: none !important; }

          /* Stop SVG stroke dash animations used for the wave */
          .wave path { animation: none !important; transition: none !important; stroke-dasharray: 0 !important; }
          .wave { animation: none !important; }

          /* Prevent any transform/scale transitions on icons */
          .icon-inner { transition: none !important; }
          .icon-item:hover .icon-inner { transform: none !important; }

          /* Disable label transitions so they appear/disappear instantly */
          .label { transition: none !important; animation: none !important; }
          .label-multiline, .label-line-first, .label-line-second { transition: none !important; }
        }

       /* MOBILE ONLY: Straight vertical line override - DO NOT affect desktop */
@media (max-width: 640px) {
  /* Force all rings into perfect straight vertical alignment */
  .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) > svg,
  .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) > svg.absolute,
  .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) svg.absolute.inset-0,
  .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) > svg,
  .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) > svg.absolute,
  .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) svg.absolute.inset-0 {
    transform: translate(-50%, -50%) !important;
  }
  
  /* Remove vertical offsets */
  .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd),
  .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) {
    transform: translateY(0) !important;
  }
  
  /* Remove overlapping margins */
  .flex.items-center.gap-6.relative.z-10 > .icon-item:not(:first-child) {
    margin-top: 0 !important;
  }
  
  /* Consistent gap */
  .flex.items-center.gap-6.relative.z-10 {
    gap: 1.5rem !important;
  }
}

        /* Inline heading styles for the section title */
        .containerCH {
          padding: 14px 20px 8px 20px; /* reduced vertical padding */
          margin: 12px auto; /* reduced top/bottom margin */
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 1800px;
          width: 97.5%;
          padding-bottom: 16px; /* smaller bottom gap */
        }

         .containerCH h2 {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: 4px;
          text-shadow:
            0 0 0px #fff,
            0 0 10px #fff,
            0 0 10px #0073e6,
            0 0 20px #182e4a,
            0 0 20px #182e4a,
            0 0 30px #182e4a,
            0 0 30px #182e4a;
          background: linear-gradient(90deg, #fff 35%, rgba(3, 163, 196, 1) 49%, #fff 62%);
          -webkit-background-clip: text;
          color: transparent;
          text-align: center;
        }

        .titleUnderline {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #a76b2e, #f18436);
          margin: 12px auto 12px; /* tighten spacing under title */
          border-radius: 2px;
          margin-bottom: 1rem;
        }

        /* Mobile: ensure the section heading fits on one line and remains readable */
        @media (max-width: 640px) {
          .containerCH h2 {
            font-size: clamp(1rem, 4.5vw, 1.25rem) !important;
            letter-spacing: 1px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            line-height: 1 !important;
            padding: 0 12px !important; /* small horizontal padding so text doesn't touch screen edges */
          }

          /* Restore original container spacing and root padding/min-height for mobile so mobile view is unchanged */
          .chevron-root {
            min-height: 700px !important; /* restore previous taller min-height on mobile */
            padding-bottom: 50px !important; /* restore previous bottom spacing */
          }
          .containerCH {
            padding: 20px !important;
            margin: 20px auto !important;
            padding-bottom: 50px !important;
          }
          .titleUnderline { margin-bottom: 2rem !important; margin-top: 15px !important; }
        }

        /* Desktop: ensure labels stay centered above/below the circle and arrows align exactly beneath/above them.
           Problem: earlier .label-top/.label-bottom rules overwrote the horizontal translate from the utility classes
           resulting in labels being shifted to one side and the arrow not centered. We add a desktop-only override
           that preserves translateX(-50%) while applying the desired Y offsets and centers the arrow SVG. This
           does not affect mobile rules which use calc() offsets. */
        @media (min-width: 641px) {
          .label { left: 50% !important; }
          .label-top { transform: translate(-50%, -8px) !important; }
          .label-bottom { transform: translate(-50%, 8px) !important; }
          .label-visible { transform: translate(-50%, 0) !important; }

          /* Center the small arrow under/above the label */
          .label-arrow { left: 50% !important; transform: translateX(-50%) !important; position: absolute; }
          .label-arrow.arrow-top { top: -10px !important; transform: translateX(-50%) translateY(-120%) !important; }
          .label-arrow.arrow-bottom { bottom: -10px !important; transform: translateX(-50%) translateY(120%) !important; }
        }

        /* Tablet-specific tuning: make the 6th item (Job Assistance) smaller and reduce its label text/padding */
        @media (min-width: 641px) and (max-width: 1024px) {
          /* keep the container the same size as other icons on tablet so the white circle fits */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(6) {
            width: 80px !important;
            height: 80px !important;
            padding: 0 !important;
          }
          /* make the white inner circle match other items */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(6) .icon-inner {
            width: 80px !important;
            height: 80px !important;
          }
          /* keep image size as-is (no other changes requested) */
        }

        /* Final mobile centering fixes: force wrappers to truly center, cancel inline scale that caused overflow, and constrain widths */
        @media (max-width: 640px) {
          /* Prevent horizontal overflow on small screens */
          .chevron-root { overflow-x: hidden !important; padding-left: 0 !important; padding-right: 0 !important; }

          /* Center the absolute wrappers exactly in the viewport and constrain their width */
          .chevron-wave-wrapper,
          .chevron-content-wrapper {
            position: absolute !important;
            left: 50% !important;
            right: auto !important;
            top: 46% !important; /* keep the vertical position chosen for desktop */
            transform: translate(-50%, -50%) !important; /* force true centering */
            width: 100% !important;
            max-width: 420px !important; /* limit column width to avoid large right gap */
            display: flex !important;
            justify-content: center !important;
            margin: 0 auto !important;
            pointer-events: none !important;
          }
            

          /* Ensure the inner flex that had an inline scale is reset and centered */
          .chevron-content-wrapper .relative.flex {
            width: 100% !important;
            max-width: 360px !important;
            margin: 0 auto !important;
            transform: none !important; /* cancel inline style transform: scale(1.25) */
            padding: 0 12px !important;
            box-sizing: border-box !important;
            justify-content: center !important;
          }

          /* Make icon rows center and not stretch beyond the constrained column */
          .chevron-content-wrapper .flex.items-center.gap-6.relative.z-10 {
            width: 100% !important;
            margin: 0 auto !important;
            align-items: center !important;
            gap: 0.6rem !important;
            justify-content: center !important;
          }
          
           /* Balanced mobile label placement: odd items to the right of the ring, even items to the left.
              Use conservative offsets so labels stay close to the ring and never overlap it. */
          .flex.items-center.gap-6.relative.z-10 > .icon-item { position: relative !important; }
          .flex.items-center.gap-6.relative.z-10 > .icon-item .label {
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            max-width: 160px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            z-index: 75 !important; /* keep labels above rings */
            pointer-events: none !important;
          }
            
          /* Odd items (1,3,5...) — place label to the right of the centered ring */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(odd) .label {
            left: calc(50% + 60px) !important; /* keep close to ring */
            right: auto !important;
            text-align: left !important;
          }
          /* Even items (2,4,6...) — place label to the left of the centered ring */
          .flex.items-center.gap-6.relative.z-10 > .icon-item:nth-child(even) .label {
            right: calc(50% + 60px) !important; /* keep close to ring */
            left: auto !important;
            text-align: right !important;
          }

          /* Mobile: nudge entire chevron down and tighten inter-ring spacing to avoid overlapping header */
          /* Move the whole chevron lower on the page so top rings no longer overlap the heading */
          .chevron-wave-wrapper,
          .chevron-content-wrapper {
            top: 58% !important; /* shift slightly upward from 62% */
          }

          /* Reduce vertical gap between rings so the column remains compact after shifting down */
          .chevron-content-wrapper .flex.items-center.gap-6.relative.z-10 {
            gap: 12px !important; /* tighter, consistent gap */
          }

          /* Slightly reduce row height so stacked rings fit without overlapping heading */
          .chevron-content-wrapper .flex.items-center.gap-6.relative.z-10 > .icon-item {
            height: 86px !important;
          }

          /* Increase safe space under the heading by adding a small top padding to wrapper container (non-invasive) */
          .chevron-root { padding-top: 18px !important; }
        }

        /* Tablet 768px only: restore right/down shift (as requested) */
        @media (width: 768px) {
          .chevron-wave-wrapper,
          .chevron-content-wrapper {
            width: calc(100% - 16px) !important;
            max-width: 760px !important;
            /* shift the whole component a bit to the right and slightly down (only at 768px) */
            left: calc(50% + 38px) !important; /* move right by ~36px */
            top: calc(46% + 24px) !important; /* move down by ~24px */
            transform: translate(-50%, -50%) !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
          }

          .chevron-content-wrapper .relative.flex {
            max-width: 720px !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
            transform: none !important;
          }

          .chevron-content-wrapper .flex.items-center.gap-6.relative.z-10 {
            gap: 1rem !important;
            justify-content: center !important;
          }

          .chevron-root {
            padding-left: 8px !important;
            padding-right: 8px !important;
            overflow-x: hidden !important;
          }
        }

        /* Laptop 1024px only: slightly reduce horizontal padding and constrain wrappers to eliminate right-side gap */
        @media (width: 1024px) {
          /* target with higher specificity so this exact-width tweak reliably overrides utility classes */
          #chevron-area .chevron-wave-wrapper,
          #chevron-area .chevron-content-wrapper {
             /* move a little less far to the right at exact 1024px (reduced from previous extreme) */
             width: calc(100% - 64px) !important;
             max-width: 820px !important;
             padding-left: 12px !important;
             padding-right: 12px !important;
             /* center then shift right by a reduced amount */
             left: 50% !important;
             transform: translate(-50%, -50%) translateX(110px) !important; /* reduced nudge */
             /* keep layout stable */
             display: flex !important;
             justify-content: flex-start !important;
           }

          /* Prevent inner flex from growing too wide at 1024px */
          .chevron-content-wrapper .relative.flex {
            max-width: 760px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
            transform: none !important;
          }

          /* Slightly tighten the gap between icons on 1024px to reduce perceived overflow */
          .chevron-content-wrapper .flex.items-center.gap-6.relative.z-10 {
            gap: 1rem !important;
            justify-content: flex-start !important;
          }

          /* Small root padding and height adjustment only at 1024px to avoid page-level horizontal scroll and give component a bit more vertical space */
          .chevron-root {
            padding-left: 12px !important;
            padding-right: 12px !important;
            overflow-x: hidden !important;
            min-height: 620px !important; /* slightly increased height */
          }
            
        }
      `}</style>
    </div>
  );
}