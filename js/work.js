import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";

document.addEventListener("DOMContentLoaded", () => {
  const isWorkPage = document.querySelector(".page.work-page");
  if (!isWorkPage) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Hero note asterisk — tap toggle (hover handled in CSS on desktop)
  const noteTrigger = document.querySelector(".work-header-note-trigger");
  if (noteTrigger) {
    noteTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = noteTrigger.getAttribute("aria-expanded") === "true";
      noteTrigger.setAttribute("aria-expanded", open ? "false" : "true");
    });
    document.addEventListener("click", () => {
      noteTrigger.setAttribute("aria-expanded", "false");
    });
  }


  let scrollTriggerInstances = [];

  const initHeaderAnimations = () => {
    gsap.set(".work-profile-icon", { scale: 0 });
    gsap.set(".work-header-arrow-icon", { scale: 0 });

    const feastText = SplitText.create(".work-header-content > p", {
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

  // Accordion: each category starts collapsed, clicking its header expands it.
  // Single-open — clicking another header collapses the rest. Clicking the open
  // header collapses it.
  const initAccordion = () => {
    // Slide h2 between left-aligned (expanded) and centered (collapsed).
    // We can't animate text-align or justify-content, so we use transform: x
    // measured at runtime. Preserves the exact same visual endpoints.
    const setHeaderAlignment = (category, collapsed, animated) => {
      const header = category.querySelector(".menu-category-header");
      const h2 = header?.querySelector("h2");
      if (!h2) return;
      // Measure from the neutral (x=0) position
      gsap.set(h2, { x: 0 });
      const headerW = header.getBoundingClientRect().width;
      const h2W = h2.getBoundingClientRect().width;
      const centerOffset = Math.max(0, (headerW - h2W) / 2);
      const target = collapsed ? centerOffset : 0;
      if (animated) {
        gsap.to(h2, {
          x: target,
          duration: 0.45,
          ease: "power2.inOut",
        });
      } else {
        gsap.set(h2, { x: target });
      }
    };

    const categories = document.querySelectorAll(".menu-category");

    categories.forEach((category) => {
      const header = category.querySelector(".menu-category-header");
      const grid = category.querySelector(".menu-category-grid");
      if (!header || !grid) return;

      // Wrap the grid in a body div so we can animate grid-template-rows.
      if (!category.querySelector(".menu-category-body")) {
        const body = document.createElement("div");
        body.className = "menu-category-body";
        grid.parentNode.insertBefore(body, grid);
        body.appendChild(grid);
      }

      category.classList.add("collapsed");

      header.addEventListener("click", () => {
        const willOpen = category.classList.contains("collapsed");

        // Close others (animate their titles back to center too)
        categories.forEach((c) => {
          if (c !== category && !c.classList.contains("collapsed")) {
            c.classList.add("collapsed");
            setHeaderAlignment(c, true, true);
          }
        });

        if (willOpen) {
          category.classList.remove("collapsed");
          setHeaderAlignment(category, false, true);
          gsap.set(category.querySelectorAll(".work-item"), {
            opacity: 1,
            y: 0,
            scale: 1,
          });
        } else {
          category.classList.add("collapsed");
          setHeaderAlignment(category, true, true);
        }

        // Layout changed — recalc ScrollTrigger positions AFTER the accordion
        // transition settles. Calling refresh() immediately while other
        // categories are still mid-intro-animation can cancel those timelines.
        clearTimeout(window.__menuRefreshTimer);
        window.__menuRefreshTimer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 500);

        // Auto-scroll the opened category into view. Defer until the collapse/
        // expand transitions settle so lenis reads the correct target position.
        if (willOpen) {
          clearTimeout(window.__menuScrollTimer);
          window.__menuScrollTimer = setTimeout(() => {
            if (window.lenis && typeof window.lenis.scrollTo === "function") {
              window.lenis.scrollTo(category, {
                offset: -80,
                duration: 0.9,
              });
            } else {
              category.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 480);
        }
      });
    });

    // Set initial centered alignment on all collapsed headers (no animation)
    const alignAll = () => {
      categories.forEach((c) => {
        setHeaderAlignment(c, c.classList.contains("collapsed"), false);
      });
    };
    // Run after layout is stable
    requestAnimationFrame(alignAll);

    // Re-measure on resize so the center offset stays correct
    window.addEventListener("resize", alignAll);
  };

  initHeaderAnimations();
  initAnimations();
  initAccordion();

  window.addEventListener("resize", () => {
    initAnimations();
  });
});
