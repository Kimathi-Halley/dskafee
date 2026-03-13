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

    const currentPath = window.location.pathname;
    const currentFileName = currentPath.split("/").pop() || "index.html";
    const hrefFileName = href.split("/").pop() || "index.html";

    // Handle home page variations
    const homeAliases = ["", "index.html", "./", ".", "/"];
    const currentIsHome = homeAliases.includes(currentFileName) || currentPath.endsWith("/");
    const hrefIsHome = homeAliases.includes(hrefFileName) || homeAliases.includes(href);

    if (currentIsHome && hrefIsHome) return true;

    if (currentFileName === hrefFileName) return true;

    return false;
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
