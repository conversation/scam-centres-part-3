import { ReactNode, useRef } from "react";
import { addClassToChildren, cn } from "../util/helpers";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ARTICLEWIDTH,
  mapLocations,
  LayerType,
  Layer,
  LayerTypes,
} from "../util/constants";
import { useAtomValue, useSetAtom } from "jotai";
import { headerHeight, mapInstance } from "../context/atom";
import { PaintSpecification } from "mapbox-gl";

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
  const georgeMap = useAtomValue(mapInstance);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section ) return;

      const steps = section.querySelectorAll(".pinned_foreground .step");
      const backgroundElements = section.querySelectorAll(
        ".pinned_background_wrapper > *"
      );
      const backgroundImageElements = section.querySelectorAll(
        ".pinned_background_wrapper img"
      );
      const foregroundElement = section.querySelectorAll(".foregroundElement");

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

      if (backgroundImageElements.length && section.id !== "kk_park") {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: foregroundElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          })
          .to(backgroundImageElements, { scale: 1.5, ease: "power1.inOut" });
      }
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

      setHeaderHeight(section.clientHeight - window.innerHeight);

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

      gsap
        .timeline({
          scrollTrigger: {
            trigger: steps[1].parentElement,
            start: "top top",
            end: "top top-=100%",
            scrub: true,
          },
        })
        .fromTo(section, { alpha: 1 }, { alpha: 0 });

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

  // KK Park
  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || section.id !== "kk_park") return;
      const text = section.querySelector(".pinned_foreground");
      const backgroundImages = section.querySelectorAll(
        ".kk_park_sat_wrapper img"
      );

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
          backgroundImages,
          { scale: 1.5 },
          { scale: 1, ease: "power1.inOut" }
        );
    },
    { scope: sectionRef }
  );

  // George map
  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || section.id !== "georgeMap") return;

      const steps = section.querySelectorAll(".pinned_foreground .step");

      function setLayerOpacity(layer: Layer): void {
        const layerTypes: LayerTypes = {
          fill: ["fill-opacity"],
          line: ["line-opacity"],
          circle: ["circle-opacity", "circle-stroke-opacity"],
          symbol: ["icon-opacity", "text-opacity"],
          raster: ["raster-opacity"],
          "fill-extrusion": ["fill-extrusion-opacity"],
          heatmap: ["heatmap-opacity"],
        };

        const mapLayer = georgeMap!.getLayer(layer.layer);

        if (!mapLayer) return;

        const layerType = mapLayer.type as LayerType;

        if (!layerTypes[layerType]) {
          console.error(`Unsupported layer type: "${layerType}"`);
          return;
        }

        const paintProps = layerTypes[layerType];

        paintProps.forEach((prop) => {
          if (layer.duration) {
            const transitionProp =
              `${prop}-transition` as keyof PaintSpecification;
            const options = { duration: layer.duration };
            georgeMap!.setPaintProperty(layer.layer, transitionProp, options);
          }

          const validProp = prop as keyof PaintSpecification;

          georgeMap!.setPaintProperty(layer.layer, validProp, layer.opacity);
        });
      }

      steps.forEach((step, index, steps) => {
        const nextStep = steps[index + 1]; // Get the next step

        ScrollTrigger.create({
          trigger: step,
          start: "top 90%",
          endTrigger: nextStep ? nextStep : step,
          end: nextStep ? "top 90%" : "bottom 90%",
          onToggle: (element) => {
            const mapLocation = mapLocations[index];

            if (!mapLocation) return;

            if (element.isActive) {
              georgeMap!.flyTo({
                ...mapLocation.centerLocation,
                zoom: mapLocation.centerLocation.zoom,
              });

              if (mapLocation.onChapterEnter) {
                mapLocation.onChapterEnter.forEach(setLayerOpacity);
              }

              if (mapLocation.rotateAnimation) {
                georgeMap!.once("moveend", () => {
                  const rotateNumber = georgeMap!.getBearing();
                  const rotationBearing =
                    mapLocation.rotationDirection === "CCW"
                      ? ((rotateNumber + 180) % 360) + 1
                      : ((rotateNumber + 180) % 360) - 1;
                  georgeMap!.rotateTo(rotationBearing, {
                    duration: 200000,
                    easing: function (t) {
                      return Math.sin((t * Math.PI) / 2);
                    },
                  });
                });
              }
            } 
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [georgeMap] }
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
