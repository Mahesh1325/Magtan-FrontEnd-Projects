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

      // Close menu when tapping any nav link or dropdown item (mobile/tablet only)
      const closeOnNavClick = () => {
        if (window.innerWidth <= 1023 && nav.classList.contains("is-open")) {
          toggleMenu(false);
        }
      };

      const clickableNavItems = nav.querySelectorAll(
        "a.nav-link, .dropdown-menu .dropdown-item",
      );
      clickableNavItems.forEach((el) => {
        el.addEventListener("click", closeOnNavClick);
      });

      window.addEventListener(
        "scroll",
        () => {
          if (nav.classList.contains("is-open")) {
            toggleMenu(false);
          }
        },
        { passive: true },
      );

      // Close menu on click outside
      document.addEventListener("click", (e) => {
        if (nav.classList.contains("is-open") && !nav.contains(e.target) && !mobileToggle.contains(e.target)) {
          toggleMenu(false);
        }
      });
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
    const navDirToggle = document.getElementById("nav-dir-toggle"); // inside mobile nav
    const dirText = document.getElementById("dir-text");
    const navDirText = document.getElementById("nav-dir-text"); // inside mobile nav
    const headerContainer = document.querySelector(".header-container");

    // Load saved direction
    const savedDir = localStorage.getItem("direction");
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');

    if (isAuthPage) {
      // Force LTR on auth pages for readability
      document.documentElement.setAttribute("dir", "ltr");
      if (dirText) dirText.textContent = "RTL";
      if (navDirText) navDirText.textContent = "RTL";
    } else if (savedDir === "rtl") {
      document.documentElement.setAttribute("dir", "rtl");
      if (dirText) dirText.textContent = "LTR";
      if (navDirText) navDirText.textContent = "LTR";
    }

    const applyDir = () => {
      if (headerContainer) headerContainer.classList.add("nav-switching");
      const authCard = document.querySelector(".auth-card-combined");
      if (authCard) authCard.classList.add("nav-switching");

      setTimeout(() => {
        const isRtl = document.documentElement.getAttribute("dir") === "rtl";
        if (isRtl) {
          document.documentElement.removeAttribute("dir");
          localStorage.setItem("direction", "ltr");
          if (dirText) dirText.textContent = "RTL";
          if (navDirText) navDirText.textContent = "RTL";
        } else {
          document.documentElement.setAttribute("dir", "rtl");
          localStorage.setItem("direction", "rtl");
          if (dirText) dirText.textContent = "LTR";
          if (navDirText) navDirText.textContent = "LTR";
        }
      }, 200);

      setTimeout(() => {
        if (headerContainer) headerContainer.classList.remove("nav-switching");
        if (authCard) authCard.classList.remove("nav-switching");
      }, 400);
    };

    if (dirToggleBtn) dirToggleBtn.addEventListener("click", applyDir);
    if (navDirToggle) navDirToggle.addEventListener("click", applyDir);
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

    // Special handling for Header (Logout icon) — injected into nav for mobile
    const nav = document.getElementById("main-nav");
    const existingNavLogout = document.getElementById("nav-logout-btn");
    const existingNavCtaItem = document.getElementById("nav-mobile-cta-item");

    if (nav) {
      // 1. Handle Theme Toggle inside Mobile Nav (Replacing CTA)
      if (!existingNavCtaItem) {
        const ctaItem = document.createElement("div");
        ctaItem.className = "nav-mobile-extra";
        ctaItem.id = "nav-mobile-cta-item";
        ctaItem.style.cssText = "width: 100%; padding-top: 1.5rem; margin-top: auto; border-top: 1px solid var(--theme-border/20); display: flex; justify-content: center;";
        
        // Container Pill matches the second image
        const settingsPill = document.createElement("div");
        settingsPill.style.cssText = "display: flex; align-items: center; justify-content: space-between; background: rgba(128, 128, 128, 0.1); border-radius: 99px; padding: 0.25rem 0.5rem; width: 100%; max-width: 250px;";
        
        // Relocate and re-style the Dir Toggle
        const dirBtn = document.getElementById("nav-dir-toggle");
        if (dirBtn) {
          // Reset native styles inside the pill
          dirBtn.style.cssText = "flex: 1; display: flex; align-items: center; justify-content: center; padding: 0.65rem; border: none; background: transparent; color: var(--theme-text-muted); font-size: 0.95rem; font-weight: 700; cursor: pointer; text-transform: uppercase; margin: 0;";
          
          // Remove default bottom border and padding rules applied to it globally via css
          dirBtn.classList.remove("nav-dir-toggle");
          
          // Only show text "RTL" or "LTR", remove the arrows SVG if present
          const svg = dirBtn.querySelector("svg");
          if (svg) svg.style.display = "none";
          
          settingsPill.appendChild(dirBtn);
        }

        // Create the Theme Toggle
        const themeBtnContainer = document.createElement("button");
        themeBtnContainer.type = "button";
        themeBtnContainer.style.cssText = "flex: 1; display: flex; align-items: center; justify-content: center; padding: 0.65rem; border-radius: 99px; border: none; background: var(--theme-surface); color: var(--theme-text); gap: 0.5rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1); cursor: pointer;";
        themeBtnContainer.id = "nav-theme-btn-injected";

        // Create the icon span
        const iconSpan = document.createElement("span");
        iconSpan.id = "nav-theme-icon";
        
        themeBtnContainer.appendChild(iconSpan);
        settingsPill.appendChild(themeBtnContainer);
        ctaItem.appendChild(settingsPill);

        nav.appendChild(ctaItem);

        // Add event listener to toggle theme
        themeBtnContainer.addEventListener("click", () => {
          const topLevelToggle = document.getElementById("theme-toggle");
          if (topLevelToggle) {
            topLevelToggle.click(); // Reuse existing logic
          }
        });
      }

      // Update the theme icon/text in the mobile nav when theme changes
      const updateMobileNavTheme = () => {
        const rootTheme = document.documentElement.getAttribute("data-theme") || "dark";
        const iconElement = document.getElementById("nav-theme-icon");
        if (iconElement) {
          if (rootTheme === "dark") {
            iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
          } else {
            iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
          }
        }
      };
      
      // Update immediately
      updateMobileNavTheme();
      
      // Observe html data-theme changes to sync mobile button
      const targetNode = document.documentElement;
      const config = { attributes: true, attributeFilter: ['data-theme'] };
      const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
          if (mutation.type === 'attributes') {
            updateMobileNavTheme();
          }
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);

      // 2. Handle Logout icon inside Mobile Nav
      if (isAuthenticated && !existingNavLogout) {
        const logoutItem = document.createElement("div");
        logoutItem.className = "nav-mobile-extra";
        logoutItem.id = "nav-logout-item";
        logoutItem.style.cssText = "width: 100%; padding: 0.85rem 0; border-top: 1px solid var(--theme-border/20); margin-top: 0.5rem;";
        logoutItem.innerHTML = `<a id="nav-logout-btn" href="#" class="nav-link" style="display: inline-flex; align-items: center; gap: 0.5rem; color: #ef4444; font-size: 1rem;" title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </a>`;
        logoutItem.querySelector("a").onclick = (e) => {
          e.preventDefault();
          window.simulateLogout();
        };
        nav.appendChild(logoutItem);
      } else if (!isAuthenticated && existingNavLogout) {
        existingNavLogout.closest("#nav-logout-item")?.remove();
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
