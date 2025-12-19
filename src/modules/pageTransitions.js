import barba from "@barba/core";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prepareLoader } from "@modules/loader";

// Import all your modules
import { initNavigation } from "@modules/navigation.js";
import { initHero } from "@modules/hero.js";
import { initValues } from "@/modules/values";
import { initPortfolio } from "@modules/portfolio";
import { initImageParallax } from "@modules/imageParallax.js";
import { initWork } from "@modules/work.js";
import { initSmoothScrollBar, initScrollTo } from "@modules/smoothScroll.js";

/**
 * Re-initializes all JavaScript for the current page content.
 */
const initAllModules = () => {
  // 1. Always kill existing ScrollTriggers before re-initializing
  // This prevents memory leaks and overlapping triggers.
  ScrollTrigger.getAll().forEach(t => t.kill());

  // 2. Run all initializations
  initSmoothScrollBar();
  initNavigation();
  initHero();
  initValues();
  initPortfolio();
  initImageParallax();
  initWork();
  initScrollTo();

  // 3. Refresh ScrollTrigger to calculate new page height
  ScrollTrigger.refresh();
};

const pageTransitionIn = container => {
  const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power1.inOut" } });
  // Reference your loader elements here
  tl.set(".loader .inner", { autoAlpha: 0 }).fromTo(".loader", { yPercent: -100 }, { yPercent: 0 }).fromTo(".loader__mask", { yPercent: 80 }, { yPercent: 0 }, 0).to(container, { y: 150 }, 0);
  return tl;
};

const pageTransitionOut = container => {
  const tl = gsap.timeline({
    defaults: { duration: 0.8, ease: "power1.inOut" },
    onComplete: () => initAllModules() // CRITICAL: Re-init JS here
  });
  tl.to(".loader", { yPercent: 100 }).to(".loader__mask", { yPercent: -80 }, 0).from(container, { y: -150 }, 0);
  return tl;
};

export const initPageTransitions = () => {
  // Set up Barba hooks
  barba.hooks.before(() => document.documentElement.classList.add("is-transitioning"));
  barba.hooks.after(() => document.documentElement.classList.remove("is-transitioning"));
  barba.hooks.enter(() => window.scrollTo(0, 0));

  barba.init({
    transitions: [
      {
        once() {
          // This is where your prepareLoader goes!
          prepareLoader(() => {
            initAllModules();
          });
        },
        async leave({ current }) {
          await pageTransitionIn(current.container);
        },
        enter({ next }) {
          pageTransitionOut(next.container);
        }
      }
    ]
  });
};
