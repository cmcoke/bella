import { gsap } from "gsap";
import imagesLoaded from "imagesloaded";

const select = e => document.querySelector(e);
const selectAll = e => document.querySelectorAll(e);

const loader = select(".loader");
const loaderInner = select(".loader .inner");
const progressBar = select(".loader .progress");
const loaderContent = select(".loader__content");

// Initial Setup: Hide content and collapse loader immediately
gsap.set(loader, { autoAlpha: 1 });
gsap.set(loaderContent, { autoAlpha: 0 });
gsap.set(loaderInner, { scaleY: 0.005, transformOrigin: "bottom" });

const progressTween = gsap.to(progressBar, {
  paused: true,
  scaleX: 0,
  ease: "none",
  transformOrigin: "right"
});

/**
 * prepareLoader
 * Called by Barba's 'once' hook.
 */
export const prepareLoader = onSiteReady => {
  const container = select("#main");
  const imgLoad = imagesLoaded(container);
  const imageCount = imgLoad.images.length;
  let loadedImageCount = 0;

  imgLoad.on("progress", () => {
    loadedImageCount++;
    gsap.to(progressTween, {
      progress: loadedImageCount / imageCount,
      duration: 0.3
    });
  });

  imgLoad.on("done", () => {
    // 1. Hide the progress bar
    gsap.to(progressBar, {
      autoAlpha: 0,
      duration: 0.4,
      // 2. Start the entrance animation sequence
      onComplete: () => initLoader(onSiteReady)
    });
  });
};

/**
 * initLoader
 * The actual animation sequence of the loader intro.
 */
const initLoader = onCompleteCallback => {
  const image = select(".loader__image img");
  const mask = select(".loader__image--mask");
  const lines = selectAll(".loader__title--mask");

  const tlLoaderIn = gsap.timeline({
    id: "tlLoaderIn",
    defaults: { duration: 1.1, ease: "power2.out" },
    onComplete: () => document.body.classList.remove("is-loading")
  });

  tlLoaderIn.set(loaderContent, { autoAlpha: 1 }).to(loaderInner, { scaleY: 1, ease: "power2.inOut" }).addLabel("revealImage").from(mask, { yPercent: 100 }, "revealImage-=0.6").from(image, { yPercent: -80 }, "revealImage-=0.6").from(".loader__title--mask span", { yPercent: 100, stagger: 0.1 }, "revealImage-=0.4");

  const tlLoaderOut = gsap.timeline({
    id: "tlLoaderOut",
    defaults: { duration: 1.1, ease: "power2.inOut" },
    delay: 1,
    onComplete: () => {
      // 3. THIS IS THE MOMENT: The loader is gone, turn on the site JS
      if (onCompleteCallback) onCompleteCallback();
    }
  });

  tlLoaderOut.to(lines, { yPercent: -500, stagger: 0.2 }, 0).to([loader, loaderContent], { yPercent: -100 }, 0.2).from("#main", { y: 150 }, 0.2);

  const master = gsap.timeline();
  master.add(tlLoaderIn).add(tlLoaderOut);
};
