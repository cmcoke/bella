// Registers the ScrollTrigger plugin so GSAP can use it for scroll-based animations.
gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes the navigation animations and behaviors.
 */
const initNavigation = () => {
  // Converts all navigation links inside ".main-nav" into an array.
  const mainNavLinks = gsap.utils.toArray(".main-nav a");

  // Creates a reversed copy of the navigation links (used for upward scrolling).
  const mainNavLinksRev = gsap.utils.toArray(".main-nav a").reverse();

  /**
   * Adds a small hover-out animation:
   * When the mouse leaves a link, add a class, then remove it after 300ms.
   */
  mainNavLinks.forEach(link => {
    // Adds a "mouseleave" event listener to each nav link.
    link.addEventListener("mouseleave", () => {
      // Adds the class that triggers a CSS animation.
      link.classList.add("animate-out");

      // Removes the animation class after 300ms so it can play again later.
      setTimeout(() => {
        link.classList.remove("animate-out");
      }, 300);
    });
  });

  /**
   * Creates a GSAP animation for the nav links depending on scroll direction.
   *
   * direction = 1   → scrolling down
   * direction = -1  → scrolling up
   */
  const navAnimation = direction => {
    // Determines whether user is scrolling downward.
    const scrollingDown = direction === 1;

    // If scrolling down → animate normal order,
    // If scrolling up → animate reversed order.
    const links = scrollingDown ? mainNavLinks : mainNavLinksRev;

    // Returns a GSAP tween that fades and shifts links.
    return gsap.to(links, {
      duration: 0.3, // Animation duration for each link.
      stagger: 0.05, // Delay between each link's animation.
      autoAlpha: () => (scrollingDown ? 0 : 1), // Fade out when scrolling down, fade in when scrolling up.
      y: () => (scrollingDown ? 20 : 0), // Move links down (fade out) or reset to default.
      ease: "power4.out" // Smooth easing curve.
    });
  };

  /**
   * Creates a ScrollTrigger that monitors scroll position and triggers animations.
   */
  ScrollTrigger.create({
    start: 100, // Animation starts once user scrolls 100px.
    end: "bottom bottom-=200", // Ends 200px before reaching page bottom.

    toggleClass: {
      targets: "body", // Applies class to the <body> element.
      className: "has-scrolled" // A class that can change nav background, etc.
    },

    // When scrolling forward (downward) past the start point.
    onEnter: ({ direction }) => navAnimation(direction),

    // When scrolling backward (upward) past the start point.
    onLeaveBack: ({ direction }) => navAnimation(direction)

    // markers: true // Shows GSAP ScrollTrigger markers (for debugging).
  });
};

/**
 * Initializes the tilt effect for the header section.
 */
const initHeaderTilt = () => {
  // Selects the <header> element in the DOM
  // and attaches a listener for mouse movement inside it.
  // Each time the mouse moves, the moveImages() function is triggered.
  document.querySelector("header").addEventListener("mousemove", moveImages);
};

/**
 * Handles mouse movement inside the header and applies
 * 3D parallax + tilt animations to images based on cursor position.
 */
const moveImages = e => {
  // Extracts the mouse position relative to the element (offsetX/Y)
  // and the element the mouse is interacting with (target).
  const { offsetX, offsetY, target } = e;

  // Retrieves the pixel dimensions of the element being hovered.
  const { clientWidth, clientHeight } = target;

  // Converts the mouse X position into a normalized value:
  // left side = negative, center = 0, right side = positive.
  const xPos = offsetX / clientWidth - 0.5;

  // Converts the mouse Y position into a normalized value:
  // top = negative, middle = 0, bottom = positive.
  const yPos = offsetY / clientHeight - 0.5;

  // Retrieves all images on the *left* side of the header
  // and converts the NodeList into a proper array.
  const leftImage = gsap.utils.toArray(".hg__left .hg__image");

  // Retrieves all images on the *right* side of the header.
  const rightImage = gsap.utils.toArray(".hg__right .hg__image");

  // Creates a function that increases motion strength
  // based on each image's index (deeper layers move more).
  const modifier = index => index * 1.2 + 0.5;

  /**
   * Applies parallax movement and 3D rotation to left-side images.
   */
  leftImage.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2, // Smooth animation duration.
      x: xPos * 20 * modifier(index), // Horizontal parallax movement.
      y: yPos * 30 * modifier(index), // Vertical parallax movement.
      rotationY: xPos * 40, // Tilt left/right based on mouse X.
      rotationX: yPos * 10, // Tilt forward/back based on mouse Y.
      ease: "power3.out" // Soft easing curve for natural motion.
    });
  });

  /**
   * Applies mirrored parallax motion to right-side images.
   * Only the vertical movement is inverted for symmetry.
   */
  rightImage.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2, // Smooth animation duration.
      x: xPos * 20 * modifier(index), // Horizontal parallax movement.
      y: -yPos * 30 * modifier(index), // Mirrored vertical movement.
      rotationY: xPos * 40, // Tilt left/right.
      rotationX: yPos * 10, // Tilt forward/back.
      ease: "power3.out" // Smooth easing.
    });
  });

  /**
   * Moves the decorative background circle for deeper parallax effect.
   */
  gsap.to(".decor__circle", {
    duration: 1.7, // Slightly slower for a distant-layer feel.
    x: 100 * xPos, // Large horizontal shift for strong parallax.
    y: 120 * yPos, // Large vertical shift for depth.
    ease: "power4.out" // Very smooth easing for background motion.
  });
};

// Selects all elements with the class "rg__column" and stores them as a NodeList
const sections = document.querySelectorAll(".rg__column");

/**
 * Initializes the hover reveal animations by preparing each section and
 * attaching the appropriate event listeners.
 */
const initHoverReveal = () => {
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
 * Runs once after everything on the page has finished loading.
 */
const init = () => {
  initNavigation(); // Sets up all navigation animations and scroll triggers.
  initHeaderTilt(); // Sets up the header tilt effect.

  /**
   * Sets up the responsive hover reveal behavior (desktop only).
   * This ensures hover animations only run after the page is fully loaded.
   */
  mq.addEventListener("change", handleWidthChange); // Listen for viewport changes
  handleWidthChange(mq); // Run immediately on load
};

/**
 * Waits for the entire page (HTML, images, fonts, etc.) to fully load.
 * Once loaded, the init() function is called.
 */
window.addEventListener("load", () => {
  init(); // Starts the main initialization process.
});

/**
 * This script watches for screen-width changes using matchMedia.
 * When the viewport is 768px or wider, hover-based reveal animations (initHoverReveal)
 * are activated. When below 768px, all GSAP animations are cleared and event listeners
 * are removed to prevent hover effects on mobile devices.
 */

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
const handleWidthChange = e => {
  // If the media query *matches*, meaning viewport is >= 768px, enable the hover reveal animation
  if (e.matches) {
    initHoverReveal();
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
