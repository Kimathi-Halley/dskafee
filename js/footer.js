document.addEventListener("DOMContentLoaded", () => {
  const isContactPage = document.querySelector(".page.contact-page");
  if (isContactPage) return;

  const footer = document.querySelector("footer");
  const explosionContainer = document.querySelector(".explosion-container");
  let hasExploded = false;

  const config = {
    gravity: 0.25,
    friction: 0.99,
    imageSize: 100,
    horizontalForce: 20,
    verticalForce: 15,
    rotationSpeed: 10,
    resetDelay: 500,
  };

  // Caribbean country ISO codes — SVGs served from flag-icons CDN
  const caribbeanCodes = [
    'ag', // Antigua & Barbuda
    'dm', // Dominica
    'kn', // St. Kitts & Nevis
    'gd', // Grenada
    'bb', // Barbados
    'gy', // Guyana
    'jm', // Jamaica
    'tt', // Trinidad & Tobago
    'lc', // St. Lucia
    'bs', // Bahamas
    'ht', // Haiti
    'do', // Dominican Republic
    'vc', // St. Vincent & the Grenadines
    'sr', // Suriname
    'bz', // Belize
    'cu', // Cuba
    'ky', // Cayman Islands
  ];
  const FLAG_DIR = '/images/flags';
  const imagePaths = caribbeanCodes.map((code) => `${FLAG_DIR}/${code}.svg`);
  const imageParticleCount = imagePaths.length;

  let imagesReady = false;
  Promise.all(
    imagePaths.map(
      (path) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = path;
        })
    )
  ).then(() => {
    imagesReady = true;
    checkFooterPosition();
  });

  const createParticles = () => {
    explosionContainer.innerHTML = "";

    imagePaths.forEach((path) => {
      const particle = document.createElement("img");
      particle.src = path;
      particle.classList.add("explosion-particle-img");
      particle.style.width = `${config.imageSize}px`;
      explosionContainer.appendChild(particle);
    });
  };

  class Particle {
    constructor(element) {
      this.element = element;
      this.x = 0;
      this.y = 0;
      this.vx = (Math.random() - 0.5) * config.horizontalForce;
      this.vy = -config.verticalForce - Math.random() * 10;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
    }

    update() {
      this.vy += config.gravity;
      this.vx *= config.friction;
      this.vy *= config.friction;
      this.rotationSpeed *= config.friction;

      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }
  }

  const explode = () => {
    if (hasExploded) return;
    if (!imagesReady) return;
    hasExploded = true;

    createParticles();

    const particleElements = document.querySelectorAll(
      ".explosion-particle-img"
    );
    const particles = Array.from(particleElements).map(
      (element) => new Particle(element)
    );

    let animationId;

    const animate = () => {
      particles.forEach((particle) => particle.update());
      animationId = requestAnimationFrame(animate);

      if (
        particles.every(
          (particle) => particle.y > explosionContainer.offsetHeight / 2
        )
      ) {
        cancelAnimationFrame(animationId);
        // Hide particles after animation ends
        setTimeout(() => {
          particles.forEach((particle) => {
            particle.element.style.opacity = "0";
          });
        }, 1000);
      }
    };

    animate();
  };

  const checkFooterPosition = () => {
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (footerRect.top > viewportHeight + 100) {
      hasExploded = false;
    }

    if (!hasExploded && footerRect.top <= viewportHeight + 250) {
      explode();
    }
  };

  let checkTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(checkFooterPosition, 5);
  });

  window.addEventListener("resize", () => {
    hasExploded = false;
  });

  createParticles();
  setTimeout(checkFooterPosition, 500);

  // Social icon hover effects
  const socialIcons = document.querySelectorAll(".social-icon");
  
  socialIcons.forEach((icon) => {
    const originalClass = icon.className;
    const fillClass = icon.getAttribute("data-fill");
    
    icon.addEventListener("mouseenter", () => {
      icon.className = fillClass;
    });
    
    icon.addEventListener("mouseleave", () => {
      icon.className = originalClass;
    });
  });
});
