import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  const heroImg = document.querySelector(".hero-img img");
  const heroImages = [
    "hero-colorful-table-setting-glasses.webp",
    "hero-outdoor-dining-green-chairs-v2.webp",
    "hero-full-outdoor-dining-green-chairs-wide.webp",
    "hero-dining-area-wide-tropical.webp",
    "hero-patio-sun-sculpture-green-chairs.webp",
    "hero-dawnes-soleil-kafe-sign.webp",
    "hero-kafe-exterior-tropical-entrance.webp",
    "hero-bar-signs-ti-trou-gorge.webp",
    "hero-patio-dining-lush-palms.webp",
    "hero-indoor-booth-blue-table-yellow-wall.webp",
  ];
  let currentImageIndex = 0;
  let scrollTriggerInstance = null;

  setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    heroImg.src = `${import.meta.env.BASE_URL}images/hero/${heroImages[currentImageIndex]}`;
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
