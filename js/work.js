import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";

document.addEventListener("DOMContentLoaded", () => {
  const isWorkPage = document.querySelector(".page.work-page");
  if (!isWorkPage) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  let scrollTriggerInstances = [];

  const initHeaderAnimations = () => {
    gsap.set(".work-profile-icon", { scale: 0 });
    gsap.set(".work-header-arrow-icon", { scale: 0 });

    const feastText = SplitText.create(".work-header-content p", {
      type: "lines",
      mask: "lines",
    });

    const titleText = SplitText.create(".work-header-title h1", {
      type: "lines",
      mask: "lines",
    });

    gsap.set([feastText.lines, titleText.lines], {
      y: "120%",
    });

    const headerTl = gsap.timeline({ delay: 0.75 });

    headerTl.to(".work-profile-icon", {
      scale: 1,
      duration: 1,
      ease: "power4.out",
    });

    headerTl.to(
      feastText.lines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
      },
      "-=0.9"
    );

    headerTl.to(
      titleText.lines,
      {
        y: "0%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      },
      "-=0.9"
    );

    headerTl.to(
      ".work-header-arrow-icon",
      {
        scale: 1,
        duration: 0.75,
        ease: "power4.out",
      },
      "-=0.9"
    );
  };

  const initAnimations = () => {
    scrollTriggerInstances.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances = [];

    gsap.set(".work-item", {
      opacity: 0,
      y: 60,
      scale: 0.95,
    });

    document.querySelectorAll(".menu-category").forEach((category) => {
      const categoryInner = category.querySelector(".menu-category-inner");
      const header = category.querySelector(".menu-category-header");
      const menuCards = category.querySelectorAll(".work-item");

      gsap.set(categoryInner, {
        opacity: 0,
        y: 100,
        scale: 0.9,
      });

      gsap.set(header, {
        opacity: 0,
        x: -50,
      });

      const trigger = ScrollTrigger.create({
        trigger: category,
        start: "top 80%",
        onEnter: () => {
          const tl = gsap.timeline();

          tl.to(categoryInner, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power4.out",
          });

          tl.to(
            header,
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power4.out",
            },
            "-=0.5"
          );

          tl.to(
            menuCards,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.12,
              ease: "power4.out",
            },
            "-=0.3"
          );
        },
      });
      scrollTriggerInstances.push(trigger);
    });

    ScrollTrigger.refresh();
  };

  initHeaderAnimations();
  initAnimations();

  window.addEventListener("resize", () => {
    initAnimations();
  });
});
