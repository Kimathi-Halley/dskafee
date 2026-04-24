import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  const heroImg = document.querySelector(".hero-img img");

  // Auto-discover images at build time.
  // Drop landscape photos into /hero-rotation/landscape/ — shown on wide screens.
  // Drop portrait photos into /hero-rotation/portrait/ — shown on tall screens.
  // The correct set is picked based on the viewport's orientation.
  const landscapeModules = import.meta.glob(
    "/hero-rotation/landscape/*.{webp,jpg,jpeg,png,JPG,JPEG,PNG,WEBP}",
    { eager: true, query: "?url", import: "default" }
  );
  const portraitModules = import.meta.glob(
    "/hero-rotation/portrait/*.{webp,jpg,jpeg,png,JPG,JPEG,PNG,WEBP}",
    { eager: true, query: "?url", import: "default" }
  );
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const landscapeImages = shuffle(Object.values(landscapeModules));
  const portraitImages = shuffle(Object.values(portraitModules));

  // Pick the right set for the current viewport.
  // Fall back to the other set if the matching one is empty.
  const pickSet = () => {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    if (isPortrait && portraitImages.length > 0) return portraitImages;
    if (!isPortrait && landscapeImages.length > 0) return landscapeImages;
    return landscapeImages.length > 0 ? landscapeImages : portraitImages;
  };

  let heroImages = pickSet();
  let currentImageIndex = 0;
  let scrollTriggerInstance = null;

  // Set the initial hero image
  if (heroImages.length > 0) heroImg.src = heroImages[0];

  // Swap the set when orientation changes (phone rotated, window resized across breakpoint)
  window.matchMedia("(orientation: portrait)").addEventListener("change", () => {
    heroImages = pickSet();
    currentImageIndex = 0;
    if (heroImages.length > 0) heroImg.src = heroImages[0];
  });

  setInterval(() => {
    if (heroImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    heroImg.src = heroImages[currentImageIndex];
  }, 2500);

  const initAnimations = () => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".hero-img-holder",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(".hero-img", {
          y: `${-110 + 110 * progress}%`,
          scale: 0.25 + 0.75 * progress,
          rotation: -15 + 15 * progress,
        });
      },
    });
  };

  initAnimations();

  window.addEventListener("resize", () => {
    initAnimations();
  });
});
