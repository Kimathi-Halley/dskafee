import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isAboutPage = document.querySelector(".page.about-page");
  if (!isAboutPage) return;

  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstances = [];

  const initAnimations = () => {
    scrollTriggerInstances.forEach((instance) => {
      if (instance) instance.kill();
    });
    scrollTriggerInstances = [];

    // Testimonial brick wall — desktop only
    if (window.innerWidth > 1000) {
      const testimonialsTrack = document.querySelector(".testimonials-track");

      if (testimonialsTrack) {
        const cards = document.querySelectorAll(".testimonial-card");

        // Start cards scaled down
        gsap.set(cards, { scale: 0 });

        // Calculate how far the track needs to scroll
        const trackWidth = testimonialsTrack.scrollWidth;
        const viewportWidth = window.innerWidth;
        const moveDistance = trackWidth - viewportWidth + 100;

        // Scale scroll duration with track width so it doesn't scroll into empty space
        const scrollDuration = Math.max(moveDistance * 1.5, window.innerHeight * 2);

        const testimonialST = ScrollTrigger.create({
          trigger: ".testimonials",
          start: "top top",
          end: `+=${scrollDuration}px`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(testimonialsTrack, {
              x: -moveDistance * self.progress,
            });
          },
        });
        scrollTriggerInstances.push(testimonialST);

        // Scale cards in with stagger
        cards.forEach((card, index) => {
          const cardST = gsap.to(card, {
            scale: 1,
            duration: 1,
            delay: index * 0.05,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ".testimonials",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
          scrollTriggerInstances.push(cardST.scrollTrigger);
        });
      }
    }

    if (window.innerWidth > 1000) {
      const portraitAnimation = gsap.to(".about-hero-portrait", {
        y: -200,
        rotation: -25,
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      scrollTriggerInstances.push(portraitAnimation.scrollTrigger);

      const tag1Animation = gsap.to("#tag-1", {
        y: -300,
        rotation: -45,
        scrollTrigger: {
          trigger: ".about-copy",
          start: "top bottom",
          end: "bottom+=100% top",
          scrub: 1,
        },
      });
      scrollTriggerInstances.push(tag1Animation.scrollTrigger);

      const tag2Animation = gsap.to("#tag-2", {
        y: -150,
        rotation: 70,
        scrollTrigger: {
          trigger: ".about-copy",
          start: "top bottom",
          end: "bottom+=100% top",
          scrub: 1,
        },
      });
      scrollTriggerInstances.push(tag2Animation.scrollTrigger);

      const tag3Animation = gsap.to("#tag-3", {
        y: -400,
        rotation: 120,
        scrollTrigger: {
          trigger: ".about-copy",
          start: "top bottom",
          end: "bottom+=100% top",
          scrub: 1,
        },
      });
      scrollTriggerInstances.push(tag3Animation.scrollTrigger);

      const tag4Animation = gsap.to("#tag-4", {
        y: -350,
        rotation: -60,
        scrollTrigger: {
          trigger: ".about-copy",
          start: "top bottom",
          end: "bottom+=100% top",
          scrub: 1,
        },
      });
      scrollTriggerInstances.push(tag4Animation.scrollTrigger);

      const tag5Animation = gsap.to("#tag-5", {
        y: -200,
        rotation: 100,
        scrollTrigger: {
          trigger: ".about-copy",
          start: "top bottom",
          end: "bottom+=100% top",
          scrub: 1,
        },
      });
      scrollTriggerInstances.push(tag5Animation.scrollTrigger);
    }
  };

  initAnimations();

  window.addEventListener("resize", () => {
    initAnimations();
  });
});
