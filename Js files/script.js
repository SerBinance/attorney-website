document.addEventListener("DOMContentLoaded", function () {

  const headerMain = document.getElementById("headerMain");
  const headerSpacer = document.getElementById("headerSpacer");

  const navToggler = document.getElementById("navToggler");
  const menuMain = document.getElementById("menuMain");

  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  /* ============================
     Sticky Header
  ============================ */

  function sizeHeaderSpacer() {
    if (headerMain && headerSpacer) {
      const height = headerMain.offsetHeight;
      headerSpacer.style.height = height + "px";
      document.documentElement.style.setProperty("--nav-height", height + "px");
    }
  }

  function updateScrolledState() {
    if (!headerMain) return;

    if (window.scrollY > 100) {
      headerMain.classList.add("is-scrolled");
    } else {
      headerMain.classList.remove("is-scrolled");
    }
  }

  sizeHeaderSpacer();
  updateScrolledState();

  window.addEventListener("resize", sizeHeaderSpacer);
  window.addEventListener("scroll", updateScrolledState);



  /* ============================
     Mobile Menu
  ============================ */

  if (navToggler && menuMain) {

    navToggler.addEventListener("click", function () {

      const isOpen = menuMain.classList.toggle("show");

      navToggler.setAttribute(
        "aria-expanded",
        isOpen
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );

      // When closing the mobile menu, also collapse any open submenus
      if (!isOpen) {
        dropdownToggles.forEach(function (toggle) {

          const id = toggle.getAttribute("aria-controls");

          const submenu = document.getElementById(id);

          if (submenu) {

            submenu.classList.remove("show");

            toggle.setAttribute("aria-expanded", "false");

          }

        });
      }

    });

  }



  /* ============================
     Mobile Dropdowns
  ============================ */

  dropdownToggles.forEach(function (toggle) {

    toggle.addEventListener("click", function (e) {

      if (window.innerWidth >= 992) return;

      e.preventDefault();

      e.stopPropagation();

      const targetId = toggle.getAttribute("aria-controls");

      const submenu = document.getElementById(targetId);

      const isOpen = submenu.classList.contains("show");



      dropdownToggles.forEach(function (item) {

        const id = item.getAttribute("aria-controls");

        const menu = document.getElementById(id);

        if (menu) {

          menu.classList.remove("show");

          item.setAttribute("aria-expanded", "false");

        }

      });



      if (!isOpen) {

        submenu.classList.add("show");

        toggle.setAttribute("aria-expanded", "true");

      }

    });

  });



  /* ============================
     Desktop Click Outside
  ============================ */

  document.addEventListener("click", function (e) {

    if (!menuMain.contains(e.target)) {

      dropdownToggles.forEach(function (toggle) {

        const id = toggle.getAttribute("aria-controls");

        const submenu = document.getElementById(id);

        if (submenu) {

          submenu.classList.remove("show");

          toggle.setAttribute("aria-expanded", "false");

        }

      });

    }

  });



  /* ============================
     Close Mobile Menu
     when resizing
  ============================ */

  window.addEventListener("resize", function () {

    if (window.innerWidth >= 992) {

      menuMain.classList.remove("show");

      document.body.classList.remove("menu-open");

      navToggler.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });



  /* ============================
     Reviews Carousel (mobile)
  ============================ */

  const reviewsGrid = document.getElementById("reviewsGrid");

  if (reviewsGrid) {

    const reviewCards = Array.from(reviewsGrid.querySelectorAll(".review-card"));
    const prevBtn = document.querySelector(".review-nav-prev");
    const nextBtn = document.querySelector(".review-nav-next");
    const dotsWrap = document.getElementById("reviewsDots");

    let currentIndex = 0;

    // Build the dot indicators
    if (dotsWrap) {
      reviewCards.forEach(function (_, i) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot";
        dot.setAttribute("aria-label", "Go to review " + (i + 1));
        dot.addEventListener("click", function () {
          currentIndex = i;
          updateCarousel();
        });
        dotsWrap.appendChild(dot);
      });
    }

    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".dot")) : [];

    function isMobile() {
      return window.innerWidth <= 767;
    }

    function updateCarousel() {
      if (!isMobile()) {
        reviewsGrid.style.transform = "";
        return;
      }

      reviewsGrid.style.transform = "translateX(-" + (currentIndex * 100) + "%)";

      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    function goNext() {
      currentIndex = (currentIndex + 1) % reviewCards.length;
      updateCarousel();
    }

    function goPrev() {
      currentIndex = (currentIndex - 1 + reviewCards.length) % reviewCards.length;
      updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener("click", goNext);
    if (prevBtn) prevBtn.addEventListener("click", goPrev);

    // Swipe support
    let touchStartX = 0;

    reviewsGrid.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    reviewsGrid.addEventListener("touchend", function (e) {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;

      if (Math.abs(diff) > 40) {
        diff < 0 ? goNext() : goPrev();
      }
    }, { passive: true });

    window.addEventListener("resize", updateCarousel);

    updateCarousel();

  }



  /* ============================
     FAQ Accordion
  ============================ */

  const faqToggles = document.querySelectorAll(".faq-toggle");

  faqToggles.forEach(function (toggle) {

    toggle.addEventListener("click", function () {

      const panel = document.getElementById(toggle.getAttribute("aria-controls"));
      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      // Close every other panel first (accordion: only one open at a time)
      faqToggles.forEach(function (other) {
        if (other !== toggle) {
          other.setAttribute("aria-expanded", "false");
          const otherPanel = document.getElementById(other.getAttribute("aria-controls"));
          if (otherPanel) otherPanel.style.maxHeight = null;
        }
      });

      // Toggle the clicked one
      toggle.setAttribute("aria-expanded", String(!isOpen));

      if (!isOpen && panel) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else if (panel) {
        panel.style.maxHeight = null;
      }

    });

  });

  // Keep an open panel's height correct if the window is resized
  // (e.g. text reflows to more/fewer lines on rotation)
  window.addEventListener("resize", function () {
    document.querySelectorAll('.faq-toggle[aria-expanded="true"]').forEach(function (toggle) {
      const panel = document.getElementById(toggle.getAttribute("aria-controls"));
      if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
    });
  });

});