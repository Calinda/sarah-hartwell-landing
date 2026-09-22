document.addEventListener("DOMContentLoaded", () => {
    // Mobile navigation
    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");
    const menuIcon = menuButton?.querySelector("img");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pageRegions = document.querySelectorAll("main, .site-footer");
    const mobileMenuTransitionDuration = reducedMotion.matches
        ? 0
        : 280;
    let menuCloseTimer;

    const setMobileMenuState = (isOpen, returnFocus = false, focusFirstLink = false) => {
        if (!menuButton || !mobileMenu || !menuIcon) return;

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));
        mobileMenu.classList.toggle("is-open", isOpen);
        window.clearTimeout(menuCloseTimer);

        if (isOpen) {
            document.body.classList.add("menu-open");
            pageRegions.forEach((region) => {
                region.inert = true;
            });
        } else {
            menuCloseTimer = window.setTimeout(() => {
                document.body.classList.remove("menu-open");
                pageRegions.forEach((region) => {
                    region.inert = false;
                });
            }, mobileMenuTransitionDuration);
        }

        menuIcon.src = isOpen
            ? "assets/images/icon-close.svg"
            : "assets/images/icon-menu-bar.svg";

        if (isOpen && focusFirstLink) {
            mobileMenu.querySelector("a")?.focus();
        } else if (returnFocus) {
            menuButton.focus();
        }
    };

    menuButton?.addEventListener("click", (event) => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        const openedWithKeyboard = event.detail === 0;
        setMobileMenuState(!isOpen, false, openedWithKeyboard);
    });

    mobileMenu?.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            setMobileMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
            setMobileMenuState(false, true);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767 && menuButton?.getAttribute("aria-expanded") === "true") {
            setMobileMenuState(false);
        }
    });

    // Testimonials slider
    const testimonialsSlider = document.querySelector(".testimonials__slider");

    if (testimonialsSlider && typeof Swiper !== "undefined") {
        new Swiper(testimonialsSlider, {
            loop: true,
            speed: reducedMotion.matches ? 0 : 300,
            slidesPerView: 1,
            spaceBetween: 16,
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            pagination: {
                el: ".testimonials__pagination",
                clickable: true,
            },
            breakpoints: {
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                },
            },
        });
    }

    // FAQ accordion
    const toggleList = document.querySelector(".toggle-list");

    toggleList?.addEventListener("click", (event) => {
        const trigger = event.target.closest(".toggle-list__trigger");

        if (!trigger) return;

        const current = trigger.closest(".toggle-list__item");
        if (!current) return;

        const isOpen = current.classList.contains("is-open");

        toggleList.querySelectorAll(".toggle-list__item").forEach((item) => {
            item.classList.remove("is-open");
            item.querySelector(".toggle-list__trigger")?.setAttribute("aria-expanded", "false");
            item.querySelector(".toggle-list__content")?.setAttribute("aria-hidden", "true");
        });

        if (!isOpen) {
            current.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
            current.querySelector(".toggle-list__content")?.setAttribute("aria-hidden", "false");
        }
    });
});
