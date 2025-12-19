import { gsap } from "gsap";

const sections = document.querySelectorAll(".rg__column");

/**
 * Initializes the hover reveal animations by preparing each section and
 * attaching the appropriate event listeners.
 */
export const initValues = () => {
  // Loop through every section element
  sections.forEach(section => {
    // Store the elements needed for animation directly on the section object
    section.imageBlock = section.querySelector(".rg__image"); // Wrapper for the image
    section.image = section.querySelector(".rg__image img"); // Actual image element
    section.mask = section.querySelector(".rg__image--mask"); // Mask covering the image
    section.text = section.querySelector(".rg__text"); // Container for the text
    section.textCopy = section.querySelector(".rg__text--copy"); // Main text content
    section.textMask = section.querySelector(".rg__text--mask"); // Mask covering the text
    section.textP = section.querySelector(".rg__text--mask p"); // Inner <p> element inside text mask

    // Move the image block and text mask upward (hidden) using yPercent
    gsap.set([section.imageBlock, section.textMask], { yPercent: -101 });

    // Move the image mask and inner <p> downward (hidden)
    gsap.set([section.mask, section.textP], { yPercent: 100 });

    // Slightly scale the image up for a zoom-in effect
    gsap.set(section.image, { scale: 1.2 });

    // Add both hover events to this section
    section.addEventListener("mouseenter", createHoverReveal);
    section.addEventListener("mouseleave", createHoverReveal);
  });
};

/**
 * Helper function: returns the height of the text content container.
 */
const getTextHeight = textCopy => {
  return textCopy.clientHeight; // Returns the pixel height used to calculate movement distance
};

/**
 * Creates the hover reveal animation timeline depending on whether
 * the mouse enters or leaves a section.
 */
const createHoverReveal = e => {
  // Destructure and access the stored animated elements from the hovered section
  const { imageBlock, mask, text, textCopy, textMask, textP, image } = e.target;

  // Create a GSAP timeline with default animation settings
  const tl = gsap.timeline({
    defaults: {
      duration: 0.7, // Every animation lasts 0.7 seconds unless overridden
      ease: "power4.out" // Smooth deceleration easing
    }
  });

  // If the user hovers over the section
  if (e.type === "mouseenter") {
    tl.to([mask, imageBlock, textMask, textP], { yPercent: 0 }) // Uncover image & text
      .to(text, { y: () => -getTextHeight(textCopy) / 2 }, 0) // Move text upward based on its height
      .to(image, { duration: 1.1, scale: 1 }, 0); // Scale image down to normal size
  }

  // If the user leaves the section
  else if (e.type === "mouseleave") {
    tl.to([mask, textP], { yPercent: 100 }) // Slide masks downward to hide again
      .to([imageBlock, textMask], { yPercent: -101 }, 0) // Slide image block & text mask up out of view
      .to(text, { y: 0 }, 0) // Reset text position
      .to(image, { scale: 1.2 }, 0); // Zoom image back out
  }
};

// Create a MediaQueryList object that tracks when the viewport is >= 768px
const mq = window.matchMedia("(min-width: 768px)");

/**
 * Resets GSAP-related properties and removes inline styles from a list of elements.
 */
const resetProps = elements => {
  gsap.killTweensOf("*"); // Immediately stop all GSAP tweens globally to prevent leftover animations

  /**
   * If the array contains elements, loop through each one and clear
   * any inline GSAP-applied CSS properties (transform, opacity, etc.).
   */
  if (elements.length) {
    elements.forEach(el => {
      el && gsap.set(el, { clearProps: "all" }); // Only run if `el` exists; clears all inline properties
    });
  }
};

/**
 * Handles what should happen when the screen width enters or leaves the min-width condition.
 * Runs whenever the media query match status changes.
 */
const handleWidthChange = mq => {
  // If the media query *matches*, meaning viewport is >= 768px, enable the hover reveal animation
  if (mq.matches) {
    initValues();
  } else {
    // Otherwise, the viewport is smaller (mobile sizes)

    /**
     * Loop through each section and remove mouse-based reveal interactions,
     * since hover effects are not suitable for touch devices.
     */
    sections.forEach(section => {
      section.removeEventListener("mouseenter", createHoverReveal); // Remove hover-in event
      section.removeEventListener("mouseleave", createHoverReveal); // Remove hover-out event

      // Extract related elements for clearing GSAP properties
      const { imageBlock, mask, text, textCopy, textMask, textP, image } = section;

      // Reset all GSAP inline styles for these elements
      resetProps([imageBlock, mask, text, textCopy, textMask, textP, image]);
    });
  }
};

// first page load
handleWidthChange(mq);

/**
 * Sets up the responsive hover reveal behavior (desktop only).
 * This ensures hover animations only run after the page is fully loaded.
 */
mq.addEventListener("change", handleWidthChange);
