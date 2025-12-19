import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Initializes a parallax scrolling effect for images inside elements
 *  that use the `.with-parallax` class.
 */
export const initImageParallax = () => {
  // Converts all elements matching ".with-parallax" into an array for easy looping
  gsap.utils.toArray(".with-parallax").forEach(section => {
    // Selects the <img> inside the current parallax-enabled section
    const image = section.querySelector("img");

    // Animates the image vertically as the user scrolls
    gsap.to(image, {
      yPercent: 20, // Moves the image 20% downward relative to its own height
      ease: "none", // Removes easing so motion stays linear during scroll
      scrollTrigger: {
        trigger: section, // The animation is tied to this section's scroll position
        start: "top bottom", // Animation starts when the section's top enters the bottom of the viewport
        scrub: true // Syncs the animation to scrolling for a smooth parallax effect
        // markers: true             // Optional: shows start/end points for debugging
      }
    });
  });
};
