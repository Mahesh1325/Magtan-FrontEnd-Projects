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
      const mobileClose = document.getElementById("mobile-close");

      const toggleMenu = (open) => {
        if (open) {
          nav.classList.add("is-open");
          mobileToggle.setAttribute("aria-expanded", "true");
          document.body.style.overflow = "hidden"; // Prevent background scroll
        } else {
          nav.classList.remove("is-open");
          mobileToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      };

      mobileToggle.addEventListener("click", () => {
        const isOpen = nav.classList.contains("is-open");
        toggleMenu(!isOpen);
      });

      if (mobileClose) {
        mobileClose.addEventListener("click", () => toggleMenu(false));
      }

      // Close menu on scroll (only if not already locking scroll)
      window.addEventListener(
        "scroll",
        () => {
          if (nav.classList.contains("is-open") && document.body.style.overflow !== "hidden") {
            toggleMenu(false);
          }
        },
        { passive: true },
      );
    }

    // Dropdown toggles for mobile & touch devices
    const dropdowns = document.querySelectorAll(".nav-item-dropdown");
    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", (e) => {
        // If the target is a link inside the dropdown menu, let it through
        if (e.target.closest(".dropdown-menu")) return;
        
        // Prevent trigger from closing immediately due to global doc click
        e.stopPropagation();

        const wasOpen = dropdown.classList.contains("is-open");

        // Close all dropdowns
        dropdowns.forEach((d) => d.classList.remove("is-open"));

        // Toggle current if it wasn't already open
        if (!wasOpen) {
          dropdown.classList.add("is-open");
        }
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
    const headerContainer = document.querySelector(".header-container");

    // Load saved direction
    const savedDir = localStorage.getItem("direction");
    if (savedDir === "rtl") {
      document.documentElement.setAttribute("dir", "rtl");
      if (dirText) dirText.textContent = "LTR";
    }

    if (dirToggleBtn && dirText) {
      dirToggleBtn.addEventListener("click", () => {
        // Apply feedback class if container exists
        if (headerContainer) headerContainer.classList.add("nav-switching");
        
        // Also apply to auth cards if present
        const authCard = document.querySelector(".auth-card-combined");
        if (authCard) authCard.classList.add("nav-switching");

        setTimeout(() => {
          const isRtl = document.documentElement.getAttribute("dir") === "rtl";
          if (isRtl) {
            document.documentElement.removeAttribute("dir");
            localStorage.setItem("direction", "ltr");
            dirText.textContent = "RTL";
          } else {
            document.documentElement.setAttribute("dir", "rtl");
            localStorage.setItem("direction", "rtl");
            dirText.textContent = "LTR";
          }
        }, 200);

        setTimeout(() => {
          if (headerContainer) headerContainer.classList.remove("nav-switching");
          if (authCard) authCard.classList.remove("nav-switching");
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

  // 7. Simulated Authentication Logic
  const initAuth = () => {
    const isAuthenticated = localStorage.getItem("userToken") !== null;
    const inPagesDir = window.location.pathname.includes('/pages/');
    
    // Select all main CTA buttons (Header and Section CTAs)
    const ctaButtons = document.querySelectorAll(".btn-primary, .btn-sticky-mobile");
    
    ctaButtons.forEach(btn => {
      // Avoid changing small utility buttons or unrelated forms
      if (btn.closest('form') || btn.classList.contains('filter-pill') || btn.offsetWidth < 40) return;

      if (isAuthenticated) {
        // Logged In -> Action is to Book
        btn.textContent = "Book Now";
        btn.href = inPagesDir ? "booking.html" : "pages/booking.html";
      } else {
        // Logged Out -> Action is to Start (Login)
        btn.textContent = "Get Started";
        btn.href = inPagesDir ? "login.html" : "pages/login.html";
      }
    });

    // Special handling for Header (Logout icon)
    const navCta = document.querySelector(".btn-sticky-mobile, .d-none-mobile");
    if (navCta) {
      const existingLogout = document.getElementById("logout-btn");
      if (isAuthenticated) {
        if (!existingLogout) {
          const logoutBtn = document.createElement("a");
          logoutBtn.id = "logout-btn";
          logoutBtn.href = "#";
          logoutBtn.className = "nav-link";
          logoutBtn.style.display = "inline-flex";
          logoutBtn.style.alignItems = "center";
          logoutBtn.style.padding = "0.5rem";
          logoutBtn.style.color = "#ff4444"; // Modern Red
          logoutBtn.title = "Logout";
          logoutBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`;
          logoutBtn.onclick = (e) => {
            e.preventDefault();
            window.simulateLogout();
          };
          // Insert after the CTA button
          navCta.parentNode.insertBefore(logoutBtn, navCta.nextSibling);
        }
      } else if (existingLogout) {
        existingLogout.remove();
      }
    }
  };

  // Expose login/logout wrappers for the auth pages
  window.simulateLogin = () => {
    localStorage.setItem("userToken", "simulated-jwt-token-abc");
    const inPagesDir = window.location.pathname.includes('/pages/');
    window.location.replace(inPagesDir ? "booking.html" : "pages/booking.html");
  };

  window.simulateLogout = () => {
    localStorage.removeItem("userToken");
    const inPagesDir = window.location.pathname.includes('/pages/');
    window.location.replace(inPagesDir ? "login.html" : "pages/login.html");
  };

  // 8. Form Utilities
  window.togglePassword = (inputId) => {
    const input = document.getElementById(inputId);
    const btn = input.nextElementSibling;
    if (input.type === "password") {
      input.type = "text";
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    } else {
      input.type = "password";
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    }
  };

  // Initialize core functions
  initTheme();
  initMobileMenu();
  initDir();
  initScrollReveal();
  initNumberCounters();
  initTextReading();
  initAuth();
});
