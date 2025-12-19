import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initNavigation = () => {
  // Selects all navigation links inside ".main-nav" and returns them as an array.
  const mainNavLinks = gsap.utils.toArray(".main-nav a");

  // Creates a reversed version of the navigation links (used when scrolling upward).
  const mainNavLinksRev = gsap.utils.toArray(".main-nav a").reverse();

  /**
   * Adds a short "hover-out" animation to each navigation link.
   * When the user's mouse leaves a link, a CSS class is added briefly
   * to trigger a styled fade/slide effect.
   */
  mainNavLinks.forEach(link => {
    // Runs when the mouse leaves a specific navigation link.
    link.addEventListener("mouseleave", () => {
      // Adds a class that starts the CSS hover-out animation.
      link.classList.add("animate-out");

      // Removes the animation class after 300ms so it can play again later.
      setTimeout(() => {
        link.classList.remove("animate-out");
      }, 300);
    });
  });

  /**
   * Creates a GSAP animation that hides or shows nav links
   * depending on the scroll direction.
   *
   * direction =  1 → scrolling down
   * direction = -1 → scrolling up
   */
  const navAnimation = direction => {
    // Checks if the user is scrolling downward (true/false).
    const scrollingDown = direction === 1;

    // Chooses normal order on scroll down, reversed order on scroll up.
    const links = scrollingDown ? mainNavLinks : mainNavLinksRev;

    // Returns a GSAP tween that fades and vertically shifts the links.
    return gsap.to(links, {
      duration: 0.3, // Duration of each link’s animation.
      stagger: 0.05, // Time gap between each link’s animation.
      autoAlpha: () => (scrollingDown ? 0 : 1), // Fade out on scroll down, fade in on scroll up.
      y: () => (scrollingDown ? 20 : 0), // Move downward (hide) or reset back to original position.
      ease: "power4.out" // Smooth easing for the transition.
    });
  };

  /**
   * Sets up a ScrollTrigger that:
   * - Adds/removes a class on the <body> while scrolling,
   * - Animates the navigation links based on scroll direction,
   * - Defines the scroll range over which the nav behavior is active.
   */
  ScrollTrigger.create({
    // The section that activates the navigation behavior.
    trigger: "#main",

    // When the top of "#main" reaches 100px *above* the viewport top.
    start: "top top-=100",

    // When the bottom of "#main" reaches 200px *above* the viewport bottom.
    end: "bottom bottom-=200",

    // Adds/removes a class on <body> during the active scroll range.
    toggleClass: {
      targets: "body",
      className: "has-scrolled"
    },

    // When entering the scroll range → animate based on direction.
    onEnter: ({ direction }) => navAnimation(direction),

    // When scrolling back up into the range → animate again.
    onLeaveBack: ({ direction }) => navAnimation(direction)

    // markers: true // (Optional) debug markers for ScrollTrigger.
  });
};
