/**
 * Defines an initialization function, which will be called once
 * after the page has fully loaded.
 */
const init = () => {};

/**
 * Adds an event listener to the window object that waits
 * for the entire page (including images, stylesheets, etc.)
 * to finish loading. Once the "load" event fires, it calls init().
 */
window.addEventListener("load", () => {
  init();
});
