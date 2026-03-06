/**
 * Sensory Deprivation Float Center Template
 * Main Javascript
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Toggling Logic
  const initTheme = () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const rootAttr = document.documentElement;

    // Check localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    let currentTheme = "dark"; // Defaulting to dark as requested

    if (savedTheme) {
      currentTheme = savedTheme;
    } else if (systemPrefersDark !== undefined && !systemPrefersDark) {
      currentTheme = "light";
    }

    rootAttr.setAttribute("data-theme", currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        currentTheme =
          rootAttr.getAttribute("data-theme") === "dark" ? "light" : "dark";
        rootAttr.setAttribute("data-theme", currentTheme);
        localStorage.setItem("theme", currentTheme);
        updateThemeIcon(currentTheme);
      });
    }
  };

  const updateThemeIcon = (theme) => {
    const iconElement = document.getElementById("theme-icon");
    if (!iconElement) return;

    if (theme === "dark") {
      // Sun icon for dark mode (click to light)
      iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
      // Moon icon for light mode (click to dark)
      iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  };

  // 2. Mobile Menu Logic
  const initMobileMenu = () => {
    const mobileToggle = document.getElementById("mobile-toggle");
    const nav = document.getElementById("main-nav");

    if (mobileToggle && nav) {
      mobileToggle.addEventListener("click", () => {
        const isOpen = nav.classList.contains("is-open");
        if (isOpen) {
          nav.classList.remove("is-open");
          mobileToggle.setAttribute("aria-expanded", "false");
        } else {
          nav.classList.add("is-open");
          mobileToggle.setAttribute("aria-expanded", "true");
        }
      });

      // Close menu on scroll
      window.addEventListener(
        "scroll",
        () => {
          if (nav.classList.contains("is-open")) {
            nav.classList.remove("is-open");
            mobileToggle.setAttribute("aria-expanded", "false");
          }
        },
        { passive: true },
      );
    }

    // Dropdown toggles for mobile & touch devices
    const dropdowns = document.querySelectorAll(".nav-item-dropdown");
    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", (e) => {
        // If the target is the link inside the dropdown menu, don't toggle
        if (e.target.closest(".dropdown-menu")) return;

        // Close other open dropdowns
        dropdowns.forEach((d) => {
          if (d !== dropdown) d.classList.remove("is-open");
        });

        dropdown.classList.toggle("is-open");
      });
    });

    // Close dropdowns on click outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-item-dropdown")) {
        dropdowns.forEach((dropdown) => {
          dropdown.classList.remove("is-open");
        });
      }
    });
  };

  // 3. Nav Direction Toggle Logic
  const initDir = () => {
    const dirToggleBtn = document.getElementById("dir-toggle");
    const dirText = document.getElementById("dir-text");
    // We target the header container to isolate the RTL effect to the navbar
    const headerContainer = document.querySelector(".header-container");

    if (dirToggleBtn && headerContainer && dirText) {
      dirToggleBtn.addEventListener("click", () => {
        // Apply a smooth fade out transition before snapping the layout
        headerContainer.classList.add("nav-switching");

        setTimeout(() => {
          const isRtl = headerContainer.getAttribute("dir") === "rtl";
          if (isRtl) {
            headerContainer.removeAttribute("dir");
            dirText.textContent = "RTL";
          } else {
            headerContainer.setAttribute("dir", "rtl");
            dirText.textContent = "LTR";
          }
        }, 200); // match transition duration

        // Fade back in
        setTimeout(() => {
          headerContainer.classList.remove("nav-switching");
        }, 400);
      });
    }
  };

  // 4. Scroll Reveal Animations (Modern Look)
  const initScrollReveal = () => {
    // Elements to reveal on scroll
    const revealElements = document.querySelectorAll(
      ".card, .h2-editorial-content, .h2-testimonial, .h2-metric-item, .h2-bento-item, .h2-membership-card, .cta-card, .h2-hero-image-overlay + .h2-hero-badge, .service-row",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealElements.forEach((el, index) => {
      // Apply a stagger effect if elements are siblings in a grid
      const parent = el.parentElement;
      if (parent && getComputedStyle(parent).display === "grid") {
        const staggerIndex = (Array.from(parent.children).indexOf(el) % 4) + 1;
        el.classList.add(`reveal-stagger-${staggerIndex}`);
      }

      // Immediately mark elements unrevealed if they are lower down the page
      el.classList.add("reveal-pending");
      observer.observe(el);
    });
  };

  // 5. Number Counter Animation
  const initNumberCounters = () => {
    const counters = document.querySelectorAll(".animate-counter");

    const animateCounter = (el) => {
      const targetStr = el.getAttribute("data-target") || el.innerText;
      const target = parseFloat(targetStr.replace(/,/g, ""));
      if (isNaN(target)) return;

      const isFloat = target % 1 !== 0 || targetStr.includes(".");
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          el.innerText = isFloat
            ? current.toFixed(1)
            : Math.ceil(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          el.innerText = isFloat ? target.toFixed(1) : target.toLocaleString();
        }
      };

      updateCounter();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-counting");
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => observer.observe(counter));
  };

  // 6. Text Reading Animation
  const initTextReading = () => {
    const textElements = document.querySelectorAll(".animate-text-reading");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-reading");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
    );

    textElements.forEach((el) => observer.observe(el));
  };

  // Initialize core functions
  initTheme();
  initMobileMenu();
  initDir();
  initScrollReveal();
  initNumberCounters();
  initTextReading();
});
