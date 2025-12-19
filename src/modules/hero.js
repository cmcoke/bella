import { gsap } from "gsap";

/**
 * Initializes the tilt effect for the images in hero section.
 */
export const initHero = () => {
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
