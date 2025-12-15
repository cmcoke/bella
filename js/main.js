// Registers the ScrollTrigger plugin so GSAP can use it for scroll-based animations.
gsap.registerPlugin(ScrollTrigger, GSDevTools);

const select = e => document.querySelector(e);
const selectAll = e => document.querySelectorAll(e);

const allLinks = gsap.utils.toArray(".portfolio__categories a");
const largeImage = select(".portfolio__image--l");
const smallImage = select(".portfolio__image--s");
const lInside = select(".portfolio__image--l .image_inside");
const sInside = select(".portfolio__image--s .image_inside");
const loader = select(".loader");
const loaderInner = select(".loader .inner");
const progressBar = select(".loader .progress");

// Selects all elements with the class "rg__column" and stores them as a NodeList
const sections = document.querySelectorAll(".rg__column");

// Shows the loader immediately on page load.
gsap.set(loader, { autoAlpha: 1 });

// Sets the loader inner scale to nearly zero (collapsed state).
gsap.set(loaderInner, {
  scaleY: 0.005,
  transformOrigin: "bottom"
});

// Creates a paused GSAP tween for the progress bar scale animation.
const progressTween = gsap.to(progressBar, {
  paused: true,
  scaleX: 0,
  ease: "none",
  transformOrigin: "right"
});

// Keeps track of how many images have loaded.
let loadedImageCount = 0,
  imageCount;

// Selects the main content container where images are located.
const container = select("#main");

// Initializes imagesLoaded on the main container.
const imgLoad = imagesLoaded(container);

// Stores the total number of images to be loaded.
imageCount = imgLoad.images.length;

// Sets the progress bar to 0% initially.
updateProgress(0);

// Runs every time an image finishes loading.
imgLoad.on("progress", function () {
  // Increments the count of loaded images.
  loadedImageCount++;

  // Updates the progress bar based on current load count.
  updateProgress(loadedImageCount);
});

// Updates the progress bar animation based on load percentage.
function updateProgress(value) {
  // Animates the progress tween to match the loading ratio.
  gsap.to(progressTween, {
    progress: value / imageCount,
    duration: 0.3,
    ease: "power1.out"
  });
}

// Runs once *all* images have finished loading.
imgLoad.on("done", function () {
  // Hides the progress bar and starts the loader animation.
  gsap.set(progressBar, {
    autoAlpha: 0,
    onComplete: initLoader
  });
});

/**
 * Handles the loader entrance and exit animations.
 */
const initLoader = () => {
  // Selects loader elements needed for animation.
  const loaderInner = select(".loader .inner");
  const image = select(".loader__image img");
  const mask = select(".loader__image--mask");
  const line1 = select(".loader__title--mask:nth-child(1) span");
  const line2 = select(".loader__title--mask:nth-child(2) span");
  const lines = selectAll(".loader__title--mask");
  const loaderContent = select(".loader__content");

  /**
   * Loader entrance animation:
   * Expands loader, reveals image and text,
   * and removes loading class from the body.
   */
  const tlLoaderIn = gsap.timeline({
    id: "tlLoaderIn",
    defaults: {
      duration: 1.1,
      ease: "power2.out"
    },
    onComplete: () => select("body").classList.remove("is-loading")
  });

  tlLoaderIn
    // Makes loader content visible.
    .set(loaderContent, { autoAlpha: 1 })

    // Expands the loader vertically.
    .to(loaderInner, {
      scaleY: 1,
      transformOrigin: "bottom",
      ease: "power1.inOut"
    })

    // Adds a label to synchronize image and text reveals.
    .addLabel("revealImage")

    // Slides the image mask upward.
    .from(mask, { yPercent: 100 }, "revealImage-=0.6")

    // Slides the image slightly downward into view.
    .from(image, { yPercent: -80 }, "revealImage-=0.6")

    // Reveals title lines with a staggered animation.
    .from(
      [line1, line2],
      {
        yPercent: 100,
        stagger: 0.1
      },
      "revealImage-=0.4"
    );

  /**
   * Loader exit animation:
   * Moves text and loader off-screen and reveals the page.
   */
  const tlLoaderOut = gsap.timeline({
    id: "tlLoaderOut",
    defaults: {
      duration: 1.1,
      ease: "power2.inOut"
    },
    delay: 1
  });

  tlLoaderOut
    // Moves title text upward and out of view.
    .to(lines, { yPercent: -500, stagger: 0.2 }, 0)

    // Slides the loader off the screen.
    .to([loader, loaderContent], { yPercent: -100 }, 0.2)

    // Animates the main content into view.
    .from("#main", { y: 150 }, 0.2);

  // Master timeline that runs entrance then exit animations.
  const tlLoader = gsap.timeline();

  tlLoader.add(tlLoaderIn).add(tlLoaderOut);

  // Optional GSAP debugging UI.
  // GSDevTools.create({ paused: true });
};

// Updates the CSS custom property controlling the page background color.
const updateBodyColor = color => {
  // Alternative GSAP animation version is commented out.
  // Sets the --bcg-fill-color variable to the new color.
  document.documentElement.style.setProperty("--bcg-fill-color", color);
};

/**
 * Initializes all animations and behavior for the main navigation,
 * including hover-out effects and scroll-based hide/show animations
 * using GSAP and ScrollTrigger.
 */
const initNavigation = () => {
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

/**
 * Initializes all hover and movement interactions for the portfolio section.
 * - Fades/changes preview images when hovering links.
 * - Highlights the active link and dims the others.
 * - Updates background color based on hovered category.
 * - Moves preview images vertically based on mouse position (parallax effect).
 */
const initPortfolioHover = () => {
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

/** Initializes a parallax scrolling effect for images inside elements
 *  that use the `.with-parallax` class.
 */
const initImageParallax = () => {
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

/**
 * Handles scroll-based interactions for the page sections (“stages”).
 * - Pins the fixed navigation bar as the user scrolls.
 * - Highlights the active navigation item based on scroll position.
 * - Updates the background color when entering each stage.
 */
const initPinSteps = () => {
  // Creates a ScrollTrigger that pins the navigation bar while scrolling.
  ScrollTrigger.create({
    trigger: ".fixed-nav", // Element whose scroll position activates the pin.
    start: "top center", // When `.fixed-nav` reaches the center of the viewport.
    endTrigger: "#stage4", // The pin lasts until reaching the final stage.
    end: "center center", // Ends when `#stage4`’s center aligns with viewport center.
    pin: true, // Enables pinning behavior (locks `.fixed-nav` in place).
    pinReparent: true // Avoids layout issues by temporarily moving the pinned element.
  });

  // Helper function that returns the viewport height.
  const getVh = () => {
    const vh = Math.max(
      document.documentElement.clientHeight || 0, // Height from document root.
      window.innerHeight || 0 // Height from window.
    );
    return vh; // Returns the calculated viewport height.
  };

  // Loops through all `.stage` sections on the page.
  gsap.utils.toArray(".stage").forEach((stage, index) => {
    // Selects the corresponding navigation list items.
    const navLinks = gsap.utils.toArray(".fixed-nav li");

    // Creates a ScrollTrigger for each individual stage.
    ScrollTrigger.create({
      trigger: stage, // The current stage section.
      start: "top center", // Activation when the stage hits viewport center.
      end: () => `+=${stage.clientHeight + getVh() / 10}`,
      // End dynamically calculated: stage height + 10% of viewport for smoothness.

      toggleClass: {
        targets: navLinks[index], // Navigation item to activate.
        className: "is-active" // Class applied while this stage is active.
      },

      // When scrolling forward into this stage: update background color.
      onEnter: () => updateBodyColor(stage.dataset.color),

      // When scrolling backward into this stage: update background color again.
      onEnterBack: () => updateBodyColor(stage.dataset.color)
    });
  });
};

/**
 * Enables smooth scrolling when clicking navigation links in the fixed menu.
 * Each link smoothly scrolls the page to its corresponding section using
 * Smooth Scrollbar's scrollIntoView method.
 */

const initScrollTo = () => {
  // Converts all fixed-nav links into an array so we can loop through them.
  gsap.utils.toArray(".fixed-nav a").forEach(link => {
    // Gets the target section ID (e.g. "#stage2") from the link's href.
    const target = link.getAttribute("href");

    link.addEventListener("click", e => {
      // Prevents the browser's default jump-to-anchor behavior.
      e.preventDefault();

      // Uses Smooth Scrollbar’s scrollIntoView to smoothly scroll the page
      // to the target section, with a cushion of 100px from the top.
      bodyScrollBar.scrollIntoView(document.querySelector(target), { damping: 0.07, offsetTop: 100 });
    });
  });
};

/**
 * Initializes Smooth Scrollbar and connects it to GSAP ScrollTrigger.
 * This setup replaces the browser's native scrolling with Smooth Scrollbar
 * while ensuring ScrollTrigger animations stay perfectly in sync with it.
 */
const initSmoothScrollBar = () => {
  // Initializes Smooth Scrollbar on the #viewport element with easing ("damping").
  // Saves the scrollbar instance so it can be accessed later.
  bodyScrollBar = Scrollbar.init(document.querySelector("#viewport"), { damping: 0.07 });

  // Removes the horizontal scrollbar track entirely so only vertical scrolling is used.
  bodyScrollBar.track.xAxis.element.remove();

  // Creates a scroller proxy so ScrollTrigger uses Smooth Scrollbar's scroll position
  // instead of the browser’s native scroll position.
  ScrollTrigger.scrollerProxy(document.body, {
    // This acts as both a setter and getter for scrollTop:
    scrollTop(value) {
      if (arguments.length) {
        bodyScrollBar.scrollTop = value; // If a value is provided, set scrollbar position.
      }
      return bodyScrollBar.scrollTop; // Otherwise return current scrollbar position.
    }
  });

  // Ensures ScrollTrigger updates on every Smooth Scrollbar movement,
  // keeping animations perfectly synchronized with the custom scroll.
  bodyScrollBar.addListener(ScrollTrigger.update);
};

// Create a MediaQueryList object that tracks when the viewport is >= 768px
// const mq = window.matchMedia("(min-width: 768px)");

/**
 * Runs once after everything on the page has finished loading.
 */
const init = () => {
  initLoader();
  // initSmoothScrollBar(); // Enables Smooth Scrollbar and syncs it with ScrollTrigger.
  // initNavigation(); // Sets up all navigation animations and scroll triggers.
  // initHeaderTilt(); // Sets up the header tilt effect.
  // initPortfolioHover(); // Activates all portfolio hover interactions.
  // initImageParallax(); // Applies parallax movement to images inside designated sections.
  // initPinSteps(); // Pins the navigation and highlights active sections during scroll.
  // initScrollTo(); // Enables smooth scrolling when clicking navigation links.
  /**
   * Sets up the responsive hover reveal behavior (desktop only).
   * This ensures hover animations only run after the page is fully loaded.
   */
  // mq.addEventListener("change", handleWidthChange); // Listen for viewport changes
  // handleWidthChange(mq); // Run immediately on load
};

/**
 * Waits for the entire page (HTML, images, fonts, etc.) to fully load.
 * Once loaded, the init() function is called.
 */
// window.addEventListener("load", () => {
//   init(); // Starts the main initialization process.
// });

/**
 * This script watches for screen-width changes using matchMedia.
 * When the viewport is 768px or wider, hover-based reveal animations (initHoverReveal)
 * are activated. When below 768px, all GSAP animations are cleared and event listeners
 * are removed to prevent hover effects on mobile devices.
 */

/**
 * Resets GSAP-related properties and removes inline styles from a list of elements.
 */
// const resetProps = elements => {
//   gsap.killTweensOf("*"); // Immediately stop all GSAP tweens globally to prevent leftover animations

//   /**
//    * If the array contains elements, loop through each one and clear
//    * any inline GSAP-applied CSS properties (transform, opacity, etc.).
//    */
//   if (elements.length) {
//     elements.forEach(el => {
//       el && gsap.set(el, { clearProps: "all" }); // Only run if `el` exists; clears all inline properties
//     });
//   }
// };

/**
 * Handles what should happen when the screen width enters or leaves the min-width condition.
 * Runs whenever the media query match status changes.
 */
// const handleWidthChange = e => {
//   // If the media query *matches*, meaning viewport is >= 768px, enable the hover reveal animation
//   if (e.matches) {
//     initHoverReveal();
//   } else {
//     // Otherwise, the viewport is smaller (mobile sizes)

//     /**
//      * Loop through each section and remove mouse-based reveal interactions,
//      * since hover effects are not suitable for touch devices.
//      */
//     sections.forEach(section => {
//       section.removeEventListener("mouseenter", createHoverReveal); // Remove hover-in event
//       section.removeEventListener("mouseleave", createHoverReveal); // Remove hover-out event

//       // Extract related elements for clearing GSAP properties
//       const { imageBlock, mask, text, textCopy, textMask, textP, image } = section;

//       // Reset all GSAP inline styles for these elements
//       resetProps([imageBlock, mask, text, textCopy, textMask, textP, image]);
//     });
//   }
// };
