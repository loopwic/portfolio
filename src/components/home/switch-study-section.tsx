import { SwitchModelViewer } from "@/components/home/switch-model-viewer";
import { HOME_SECTIONS } from "@/lib/site-data";

export const SwitchStudySection = () => (
  <section
    aria-labelledby="switch-study-title"
    className="switch-study-section relative flex min-h-svh items-center overflow-hidden border-foreground/12 border-t px-3 py-12 md:px-8 md:py-16"
    data-motion-section=""
    id={HOME_SECTIONS[3]}
  >
    <h2 className="sr-only" id="switch-study-title">
      Cherry MX switch
    </h2>

    <div className="relative mx-auto w-full max-w-[1120px]" data-motion-item="">
      <SwitchModelViewer />

      <a
        className="switch-model-credit absolute right-3 bottom-1 z-10 font-mono text-3xs uppercase tracking-[0.14em] text-foreground/42 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground md:right-5 md:bottom-3"
        href="https://sketchfab.com/3d-models/cherry-mx-switches-71e8e1687abc4a8fbef195ab09581287"
        rel="noreferrer"
        target="_blank"
      >
        BlackCube · CC BY 4.0
      </a>
    </div>
  </section>
);
