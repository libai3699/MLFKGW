function analyticsEvents() {
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            const category = link.href.includes(".pdf") ? "PDF Download" : "Link Click";
            if (category === "Link Click") {
                ARTISAN.analytics.sendEvent("select_content", {
                    content_type: category,
                    item_id: `${link.text} | ${link.href}`
                });
            }
        });
    });
}

function smoothScroll(target, timeout) {
    const el = document.querySelector(target);
    if (el) {
        const header = document.querySelector("header"),
            secondaryNav = document.querySelector("#secondary-nav"),
            pageTitle = document.querySelector("#page-title");
        setTimeout(() => {
            window.scrollTo({
                behavior: "smooth",
                top: (window.matchMedia("(min-width: 992px)").matches) ?
                    (el.offsetTop - (header.offsetHeight + secondaryNav.offsetHeight + pageTitle.offsetHeight) + 1) :
                    (el.offsetTop - (header.offsetHeight + secondaryNav.offsetHeight) + 1)
            });
        }, timeout);
    }
}

function scrollSpy() {
    const nav = document.querySelector("#secondary-nav"),
        navItems = nav.querySelectorAll("a"),
        header = document.querySelector("header"),
        pageTitle = document.querySelector("#page-title");

    window.addEventListener("scroll", () => {
        document.querySelectorAll("main section[id], main .section").forEach(section => {
            const rect = section.getBoundingClientRect(),
                offsetHeight = header.offsetHeight + nav.offsetHeight + pageTitle.offsetHeight;
            if (rect.top <= offsetHeight && rect.bottom > offsetHeight) {
                navItems.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${section.id}`);
                });
            }
        });
    }, { passive: true });
}

function mainNavigation() {
    const el = document.getElementById("offcanvas-navigation");
    if (!el) return;

    const mainNav = document.getElementById("main-nav"),
        bgImages = document.querySelectorAll("#nav-images > span"),
        navId = parseInt(document.body.dataset.navId, 10); // converts to number value

    const setActiveImage = () => {
            bgImages[navId || 0].classList.add("active");
        },
        resetActiveImage = () => {
            bgImages.forEach(img => {
                img.classList.remove("active");
            });
        };


    // init images
    setActiveImage();

    fetch("/content/artisanpartners/en_us/sustainability/navigation.html").then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("Network response was not ok");
        }
    }).then(html => {

        // insert navigation
        mainNav.querySelector("[data-id='dynamic-content']").innerHTML = html;

        // set to nav img to page default when mouse leaves main nav
        mainNav.querySelector("ul").addEventListener("mouseleave", (event) => {
            resetActiveImage();
            setActiveImage();
        });

        // change active image when mousing over accordion items
        mainNav.querySelectorAll("#main-nav-accordion > li").forEach(item => {
            item.addEventListener("mouseenter", (event) => {
                resetActiveImage();
                bgImages[parseInt(event.target.dataset.navId, 10)|0].classList.add("active");
            });
        });

        // handle link if clicking from the same page
        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", (event) => {
                if (document.location.href.includes(event.target.href.split("#")[0])) {
                    event.preventDefault();
                    const target = event.target.hash ? event.target.hash : "body";
                    smoothScroll(target, 50);
                    bootstrap.Offcanvas.getInstance(el).hide();
                }
            });
        });

        // open section according item that corresponds to the page, if applicable
        el.addEventListener("show.bs.offcanvas", (event) => {
            if (navId) {
                const activeItem = mainNav.querySelector(".accordion-item[data-nav-id='" + navId + "']");
                if (activeItem) {
                    const activeItem_button = activeItem.querySelector(".accordion-button"),
                        activeItem_collapse = activeItem.querySelector(".accordion-collapse");
                    activeItem_button.classList.remove("collapsed");
                    activeItem_button.ariaExpanded = "true";
                    activeItem_collapse.classList.add("show");
                }
            }
        });

    }).catch(error => {
        console.error("Error fetching navigation content:", error);
    });

}

function setSecondaryNavPosition(el) {
    if (window.matchMedia("(min-width: 992px)").matches) {
        el.style.top = document.querySelector("header").offsetHeight + document.querySelector("#page-title").offsetHeight + "px";
    }
}

function secondaryNav() {
    const el = document.getElementById("secondary-nav");
    if (!el) return;

    setSecondaryNavPosition(el);
    window.addEventListener("resize", () => setSecondaryNavPosition(el), 100);

    // init scroll spy
    scrollSpy();

    // if page url contains a hash, scroll to that section on page load
    if (window.location.hash) {
        smoothScroll(window.location.hash, 250);
    }

    // smooth scroll for secondary nav links
    el.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            smoothScroll(event.target.getAttribute("href"), 0);
        });
    });
}

function fadeIn() {
    const targetElements = document.querySelectorAll('.fade-in, .fade-in.first, .fade-in.second, .fade-in.third');
    const options = {
        root: null, // defaults to the browser viewport
        rootMargin: '0px',
        threshold: .3 // 1.0 means 100% of the element must be visible
    };
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            const VIEWING = "viewing";
            if (entry.isIntersecting) {
                entry.target.classList.add(VIEWING);
                // Optional: Stop observing the element once it's in view
                observer.unobserve(entry.target);
            } else {
                entry.target.classList.remove(VIEWING);
            }
        });
    };
    const observer = new IntersectionObserver(callback, options);
    targetElements.forEach(target => {
        observer.observe(target);
    });
}

(() => {
    analyticsEvents();
    fadeIn();
})();

ARTISAN.utils.loadScript("body", "/etc/clientlibs/bootstrap/5.3.8/js/scripts.js", () => {
    // load scripts that need Bootstrap here:
    mainNavigation();
    secondaryNav();
});
