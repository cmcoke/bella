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
 * Runs once after everything on the page has finished loading.
 */
const init = () => {
  initNavigation(); // Sets up all navigation animations and scroll triggers.
};

/**
 * Waits for the entire page (HTML, images, fonts, etc.) to fully load.
 * Once loaded, the init() function is called.
 */
window.addEventListener("load", () => {
  init(); // Starts the main initialization process.
});
