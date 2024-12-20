import { ReactNode, useRef } from "react";
import { addClassToChildren, cn } from "../util/helpers";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ARTICLEWIDTH } from "../util/constants";
import { useSetAtom } from "jotai";
import { headerHeight } from "../context/atom";

gsap.registerPlugin(ScrollTrigger);

export function ScrollSection({
  className,
  children,
  pinType,
  id,
}: {
  children: ReactNode;
  pinType: string;
  className?: string;
  id?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const setHeaderHeight = useSetAtom(headerHeight);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const steps = section.querySelectorAll(".pinned_foreground .step");
      const backgroundElements = section.querySelectorAll(
        ".pinned_background_wrapper > *"
      );

      steps.forEach((step, index) => {
        const element = backgroundElements[index + 1];

        if (element) {
          ScrollTrigger.create({
            trigger: step,
            start: "top 90%",
            onEnter: () => {
              element.classList.add("make_visible");
            },
            onLeaveBack: () => {
              element.classList.remove("make_visible");
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  // George intro images
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !section.classList.contains("intro_section")) return;

      const steps = section.querySelectorAll(".pinned_foreground .step");
      const backgroundElements = section.querySelectorAll(
        ".pinned_background_wrapper > *"
      );

      setHeaderHeight(section.clientHeight);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: steps[1].parentElement,
            start: "top 60%",
            end: "top top",
            scrub: true,
          },
        })
        .fromTo(
          backgroundElements,
          { webkitFilter: "brightness(1)", filter: "brightness(1)" },
          {
            webkitFilter: "brightness(0.3)",
            filter: "brightness(0.3)",
            ease: "power1.inOut",
          }
        );

      gsap.timeline().fromTo(
        ".frank_img",
        { xPercent: -5 },
        {
          xPercent: 0,
          ease: "power1.inOut",
          duration: 3,
        }
      );
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || section.id !== "kk_park") return;
      const text = section.querySelector(".pinned_foreground");
      const figureWrapper = section.querySelector(".kk_park_sat_wrapper");

      // Animate zoom
      gsap
        .timeline({
          scrollTrigger: {
            trigger: text,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        })
        .fromTo(
          figureWrapper,
          { scale: 1.5 },
          { scale: 1, ease: "power1.inOut" }
        );
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || section.id !== "georgeMap") return;
    },
    { scope: sectionRef }
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        "not-prose relative grid min-h-screen w-full text-lg md:text-xl",
        pinType,
        className
      )}
    >
      {children}
    </section>
  );
}

export function ScrollBackground({
  className,
  bgClassName,
  children,
}: {
  className?: string;
  bgClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("pinned_background", className)}>
      <div className={cn("pinned_background_wrapper", bgClassName)}>
        {children}
      </div>
    </div>
  );
}

export function ScrollForeground({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("pinned_foreground mx-auto", className)}
      style={{
        width: `min(100% - 40px, ${ARTICLEWIDTH.maxWidth}px)`,
      }}
    >
      {children}
    </div>
  );
}

export function ScrollTextChapter({
  children,
  className,
  position,
  step,
  id,
}: {
  children?: ReactNode;
  className?: string;
  id?: string;
  position?: string;
  step?: boolean;
}) {
  return (
    <div className={cn("chapter_wrapper", className, position)} id={id}>
      {addClassToChildren(children, step ? "step" : "")}
    </div>
  );
}
