import { gsap } from "gsap";

/**
 * Updates the CSS custom property controlling the page background color.
 * Using GSAP here allows for a smooth transition between colors.
 */
export const updateBodyColor = color => {
  // Using GSAP to animate the variable (smoother than instant setProperty)
  gsap.to("html", {
    "--bcg-fill-color": color,
    duration: 0.8,
    ease: "power2.out"
  });
};

export const resetToDefaultColor = () => {
  document.documentElement.style.setProperty("--bcg-fill-color", "var(--bcg-green)");
};
