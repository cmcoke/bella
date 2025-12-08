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

/**
 * Runs once after everything on the page has finished loading.
 */
const init = () => {
  initNavigation(); // Sets up all navigation animations and scroll triggers.
  initHeaderTilt(); // Sets up the header tilt effect.
};

/**
 * Waits for the entire page (HTML, images, fonts, etc.) to fully load.
 * Once loaded, the init() function is called.
 */
window.addEventListener("load", () => {
  init(); // Starts the main initialization process.
});
