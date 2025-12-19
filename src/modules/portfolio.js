import { gsap } from "gsap";
import { updateBodyColor } from "@modules/utils.js";

const select = e => document.querySelector(e);
const allLinks = gsap.utils.toArray(".portfolio__categories a");
const largeImage = select(".portfolio__image--l");
const smallImage = select(".portfolio__image--s");
const lInside = select(".portfolio__image--l .image_inside");
const sInside = select(".portfolio__image--s .image_inside");

/**
 * Initializes all hover and movement interactions for the portfolio section.
 * - Fades/changes preview images when hovering links.
 * - Highlights the active link and dims the others.
 * - Updates background color based on hovered category.
 * - Moves preview images vertically based on mouse position (parallax effect).
 */
export const initPortfolio = () => {
  // Loops through every portfolio category link.
  allLinks.forEach(link => {
    // Runs hover animation when mouse enters the link.
    link.addEventListener("mouseenter", createPortfolioHover);

    // Runs reset animation when mouse leaves the link.
    link.addEventListener("mouseleave", createPortfolioHover);

    // Runs movement animation when the mouse moves over the link.
    link.addEventListener("mousemove", createPortfolioMove);
  });
};

/**
 * Handles hover-in and hover-out animations for each portfolio link.
 */
const createPortfolioHover = e => {
  // If mouse is entering the link
  if (e.type === "mouseenter") {
    // Extract the custom data attributes (color + image URLs).
    const { color, imagelarge, imagesmall } = e.target.dataset;

    // Collect all links except the hovered one (to dim them out).
    const allSiblings = allLinks.filter(item => item !== e.target);

    // Create a GSAP timeline for the animation sequence.
    const tl = gsap.timeline({
      // Update page background color as soon as animation starts.
      onStart: () => updateBodyColor(color)
    });

    tl.set(lInside, { backgroundImage: `url(${imagelarge})` }) // Apply large image URL immediately.
      .set(sInside, { backgroundImage: `url(${imagesmall})` }) // Apply small image URL immediately.
      .to([largeImage, smallImage], { autoAlpha: 1 }) // Fade both images in.
      .to(allSiblings, { color: "#fff", autoAlpha: 0.2 }, 0) // Dim all non-hovered links.
      .to(e.target, { color: "#fff", autoAlpha: 1 }, 0); // Brighten the hovered link.
  }

  // If mouse is leaving the link
  else if (e.type === "mouseleave") {
    // Create a GSAP timeline for resetting visuals.
    const tl = gsap.timeline({
      // Return background color to default.
      onStart: () => updateBodyColor("#ACB7AE")
    });

    tl.to([largeImage, smallImage], { autoAlpha: 0 }) // Fade both images out.
      .to(allLinks, { color: "#000000", autoAlpha: 1 }, 0); // Reset link colors + opacity.
  }
};

/**
 * Moves the floating images vertically to create a smooth parallax effect.
 */
const createPortfolioMove = e => {
  const { clientY } = e; // Get vertical mouse position.

  // Move large image (smaller movement = deeper layer).
  gsap.to(largeImage, {
    duration: 1.2,
    y: getPortfolioOffset(clientY) / 6,
    ease: "power3.out"
  });

  // Move small image (larger movement = closer layer).
  gsap.to(smallImage, {
    duration: 1.5,
    y: getPortfolioOffset(clientY) / 3,
    ease: "power3.out"
  });
};

/**
 * Calculates how far the images should move based on mouse position.
 */
const getPortfolioOffset = clientY => {
  // Measures the height of the category area and subtracts the mouse Y position.
  return -(select(".portfolio__categories").clientHeight - clientY);
};
