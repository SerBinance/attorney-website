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

});