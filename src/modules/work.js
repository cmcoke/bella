import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Scrollbar from "smooth-scrollbar";
import { updateBodyColor } from "@modules/utils.js";

/**
 * Handles scroll-based interactions for the page sections (“stages”).
 * - Pins the fixed navigation bar as the user scrolls.
 * - Highlights the active navigation item based on scroll position.
 * - Updates the background color when entering each stage.
 */
export const initWork = () => {
  const nav = document.querySelector(".fixed-nav");
  const stopTrigger = document.querySelector("#stage4");

  // If these don't exist, stop the function immediately
  if (!nav || !stopTrigger) return;

  // Creates a ScrollTrigger that pins the navigation bar while scrolling.
  ScrollTrigger.create({
    trigger: ".fixed-nav", // Element whose scroll position activates the pin.
    start: "top center", // When `.fixed-nav` reaches the center of the viewport.
    // endTrigger: "#stage4", // The pin lasts until reaching the final stage.
    endTrigger: stopTrigger,
    end: "center center", // Ends when `#stage4`’s center aligns with viewport center.
    pin: true, // Enables pinning behavior (locks `.fixed-nav` in place).
    pinReparent: true // Avoids layout issues by temporarily moving the pinned element.
  });

  // Helper function that returns the viewport height.
  const getVh = () => {
    const vh = Math.max(
      document.documentElement.clientHeight || 0, // Height from document root.
      window.innerHeight || 0 // Height from window.
    );
    return vh; // Returns the calculated viewport height.
  };

  // Loops through all `.stage` sections on the page.
  gsap.utils.toArray(".stage").forEach((stage, index) => {
    // Selects the corresponding navigation list items.
    const navLinks = gsap.utils.toArray(".fixed-nav li");

    // Creates a ScrollTrigger for each individual stage.
    ScrollTrigger.create({
      trigger: stage, // The current stage section.
      start: "top center", // Activation when the stage hits viewport center.
      end: () => `+=${stage.clientHeight + getVh() / 10}`,
      // End dynamically calculated: stage height + 10% of viewport for smoothness.

      toggleClass: {
        targets: navLinks[index], // Navigation item to activate.
        className: "is-active" // Class applied while this stage is active.
      },

      // When scrolling forward into this stage: update background color.
      onEnter: () => updateBodyColor(stage.dataset.color),

      // When scrolling backward into this stage: update background color again.
      onEnterBack: () => updateBodyColor(stage.dataset.color)
    });
  });
};
