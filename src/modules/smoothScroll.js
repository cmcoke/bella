import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scrollbar from "smooth-scrollbar";

let bodyScrollBar;

export const initSmoothScrollBar = () => {
  const viewport = document.querySelector("#viewport");
  if (!viewport) return;

  // 1. If a scrollbar already exists, destroy it cleanly
  if (bodyScrollBar) {
    bodyScrollBar.destroy();
  }

  // 2. Initialize new scrollbar
  bodyScrollBar = Scrollbar.init(viewport, {
    damping: 0.07,
    renderByPixels: true
  });

  // 3. Sync with GSAP
  bodyScrollBar.track.xAxis.element.remove();

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        bodyScrollBar.scrollTop = value;
      }
      return bodyScrollBar.scrollTop;
    }
  });

  bodyScrollBar.addListener(ScrollTrigger.update);

  // Global access for ScrollTo module if needed
  window.sb = bodyScrollBar;
};

/**
 * Helper to get the current scrollbar instance
 */
export const getScrollBar = () => bodyScrollBar;

/**
 * Enables smooth scrolling when clicking navigation links in the fixed menu (How We Work section).
 * Each link smoothly scrolls the page to its corresponding section using
 * Smooth Scrollbar's scrollIntoView method.
 */

export const initScrollTo = () => {
  const links = document.querySelectorAll(".fixed-nav a");
  links.forEach(link => {
    // Standardize: remove existing listener if possible (or just use one-time logic)
    link.onclick = e => {
      e.preventDefault();
      const target = link.getAttribute("href");
      const targetEl = document.querySelector(target);
      if (targetEl && bodyScrollBar) {
        bodyScrollBar.scrollIntoView(targetEl, { damping: 0.07, offsetTop: 100 });
      }
    };
  });
};
