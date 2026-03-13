import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  revealTransition();

  function revealTransition() {
    return new Promise((resolve) => {
      gsap.set(".transition-overlay", { scaleY: 1, transformOrigin: "top" });
      gsap.to(".transition-overlay", {
        scaleY: 0,
        duration: 0.6,
        stagger: -0.1,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  function animateTransition() {
    return new Promise((resolve) => {
      gsap.set(".transition-overlay", { scaleY: 0, transformOrigin: "bottom" });
      gsap.to(".transition-overlay", {
        scaleY: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  function closeMenuIfOpen() {
    const menuToggleBtn = document.querySelector(".menu-toggle-btn");
    if (menuToggleBtn && menuToggleBtn.classList.contains("menu-open")) {
      menuToggleBtn.click();
    }
  }

  function isSamePage(href) {
    if (!href || href === "#" || href === "") return true;

    // Normalize paths: strip trailing slashes and index.html
    function normalize(path) {
      path = path.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
      return path;
    }

    const currentNorm = normalize(window.location.pathname);
    const hrefNorm = normalize(new URL(href, window.location.href).pathname);

    return currentNorm === hrefNorm;
  }

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (
        href &&
        (href.startsWith("http") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:"))
      ) {
        return;
      }

      if (isSamePage(href)) {
        event.preventDefault();
        closeMenuIfOpen();
        return;
      }

      event.preventDefault();

      animateTransition().then(() => {
        window.location.href = href;
      });
    });
  });
});
