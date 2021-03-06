window.defer.push(() => {
  window.NativeUtils.merge(window, window.NativeUtils);
  let lastScrollTop = 0,
    toggle = 0,
    anchor = 0,
    scroll = 0;
  const w = window,
    scrollSpy = () => {
      if (w.getViewportDimension().w < 960) {
        const st = w.getScrollPosition().y;

        if (
          w.oneDOM(".menu") &&
          st > lastScrollTop &&
          st > w.oneDOM(".menu").clientHeight * 2
        ) {
          w.addClass(w.oneDOM(".menu"), "folded");
        } else {
          w.removeClass(w.oneDOM(".menu"), "folded");
        }
        lastScrollTop = st;
      } else {
        w.removeClass(w.oneDOM(".menu"), "folded");
      }
      w.lazyLoad();
    };

  w.NProgress.start();
  new w.Gumshoe("[data-gumshoe] a", {
    // Active classes
    navClass: "active", // applied to the nav list item
    contentClass: "active", // applied to the content

    // Nested navigation
    nested: false, // if true, add classes to parents of active link
    nestedClass: "active", // applied to the parent items

    // Offset & reflow
    offset: 0, // how far from the top of the page to activate a content area
    reflow: false, // if true, listen for reflows

    // Event support
    events: true // if true, emit custom events
  });
  scroll = new w.SmoothScroll();
  w.on(
    w.oneDOM("[data-gumshoe]"),
    "click",
    e => {
      e.preventDefault();
      toggle = e.target.closest("[data-scroll]");
      anchor = toggle ? w.oneDOM(toggle.hash) : false;
      if (!anchor || !toggle || toggle.tagName.toLowerCase() !== "a") {
        return;
      }
      scroll.animateScroll(anchor, toggle, {});
    },
    false
  );
  scrollSpy();
  w.on(w, "scroll resize", scrollSpy);
  w.on(w.allDOM(".row,.flex"), "scroll", scrollSpy);
  w.lazyLoad();
  w.interactiveMD();
  w.NProgress.done();
});
window.tmp = window.runDefer ? window.runDefer() : () => {};
window.Reflect.deleteProperty(window, "tmp");
