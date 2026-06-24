/* =========================================================================
   MIA Retail Solutions — Core site script (reconstructed)
   Handles: header scroll state, mega menus, mobile navigation, consultation
   modal, hero slideshow, and the "realizacije" background slider.
   ========================================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initHeaderScroll();
    initMegaMenus();
    initMobileNav();
    initMegaFeatureSwap();
    initMiaPopup();
    initContactForm();
    initHeroSlideshow();
    initRealizacijeSlider();
  });

  /* ----------------------------------------------------------------------
     1. Header scroll state — adds .scrolled to #siteHeader after scrolling
     ---------------------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 20) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------------------------------------------------------------
     2. Mega menus — open on hover (desktop) and toggle on click (touch)
     ---------------------------------------------------------------------- */
  function initMegaMenus() {
    var items = document.querySelectorAll(".nav-item.has-mega");
    if (!items.length) return;

    items.forEach(function (item) {
      var link = item.querySelector(".nav-link");

      // Hover (desktop)
      item.addEventListener("mouseenter", function () {
        closeAllMega();
        item.classList.add("is-open");
      });
      item.addEventListener("mouseleave", function () {
        item.classList.remove("is-open");
      });

      // Click / keyboard (touch + accessibility)
      if (link) {
        link.addEventListener("click", function (e) {
          // Only intercept when it acts as a menu trigger (href="#" or none)
          var href = link.getAttribute("href");
          if (!href || href === "#") {
            e.preventDefault();
            var isOpen = item.classList.contains("is-open");
            closeAllMega();
            if (!isOpen) item.classList.add("is-open");
          }
        });
      }
    });

    // Close on outside click / Escape
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-item.has-mega")) closeAllMega();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllMega();
    });

    function closeAllMega() {
      items.forEach(function (i) { i.classList.remove("is-open"); });
    }
  }

  /* ----------------------------------------------------------------------
     3. Mobile navigation — toggle a slide-in panel built from .nav-list
     ---------------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector(".mobile-menu-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    if (document.querySelector(".mnav")) return; // guard against double init

    var CHEVRON = '<svg class="mnav-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
    var ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

    // ---- Backdrop overlay (separate element for clean fade) ----
    var backdrop = document.createElement("div");
    backdrop.className = "mnav-backdrop";
    document.body.appendChild(backdrop);

    // ---- Drawer shell ----
    var drawer = document.createElement("aside");
    drawer.className = "mnav";
    drawer.setAttribute("aria-label", "Mobilna navigacija");

    var head = document.createElement("div");
    head.className = "mnav-head";
    head.innerHTML =
      '<span class="mnav-head-title">Meni</span>' +
      '<button class="mnav-close" aria-label="Zatvori meni">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>' +
      '</button>';
    drawer.appendChild(head);

    var body = document.createElement("nav");
    body.className = "mnav-body";
    drawer.appendChild(body);

    var idx = 0; // running index for staggered animation delays

    function makeRow(el) {
      el.classList.add("mnav-row");
      el.style.setProperty("--i", idx++);
      return el;
    }

    // Build an accordion section from a mega-menu LI
    function buildAccordion(li, label) {
      var section = document.createElement("div");
      makeRow(section);
      section.className += " mnav-acc";

      var trigger = document.createElement("button");
      trigger.className = "mnav-acc-trigger";
      trigger.type = "button";
      trigger.setAttribute("aria-expanded", "false");
      trigger.innerHTML = '<span>' + label + '</span>' + CHEVRON;
      section.appendChild(trigger);

      var panel = document.createElement("div");
      panel.className = "mnav-acc-panel";
      var panelInner = document.createElement("div");
      panelInner.className = "mnav-acc-inner";
      panel.appendChild(panelInner);
      section.appendChild(panel);

      // Source items: prefer .mega-item (rjesenja) then .mega-card (proizvodi)
      var items = li.querySelectorAll(".mega-item, .mega-card");
      items.forEach(function (src) {
        var href = src.getAttribute("href");
        if (!href || href === "#") return;
        var strong = src.querySelector("strong");
        var small = src.querySelector("small");
        var thumbImg = src.querySelector(".mega-card-thumb img");
        var dataImg = src.getAttribute("data-img");
        var imgSrc = thumbImg ? thumbImg.getAttribute("src") : dataImg;

        var sub = document.createElement("a");
        sub.className = "mnav-sub";
        sub.setAttribute("href", href);
        var thumbHtml = imgSrc
          ? '<span class="mnav-sub-thumb" style="background-image:url(\'' + imgSrc + '\')"></span>'
          : '<span class="mnav-sub-thumb mnav-sub-thumb--blank"></span>';
        sub.innerHTML =
          thumbHtml +
          '<span class="mnav-sub-text">' +
            '<strong>' + (strong ? strong.textContent.trim() : src.textContent.trim()) + '</strong>' +
            (small ? '<small>' + small.textContent.trim() + '</small>' : '') +
          '</span>';
        panelInner.appendChild(sub);
      });

      // "View all" link for the section
      var allHref = (label.indexOf("Proizvodi") > -1) ? null : null;
      void allHref;

      trigger.addEventListener("click", function () {
        var isOpen = section.classList.contains("is-open");
        // close siblings (single-open accordion)
        var others = body.querySelectorAll(".mnav-acc.is-open");
        others.forEach(function (o) {
          if (o !== section) {
            o.classList.remove("is-open");
            var p = o.querySelector(".mnav-acc-panel");
            var t = o.querySelector(".mnav-acc-trigger");
            if (p) p.style.maxHeight = "0px";
            if (t) t.setAttribute("aria-expanded", "false");
          }
        });
        if (isOpen) {
          section.classList.remove("is-open");
          panel.style.maxHeight = "0px";
          trigger.setAttribute("aria-expanded", "false");
        } else {
          section.classList.add("is-open");
          panel.style.maxHeight = panelInner.scrollHeight + "px";
          trigger.setAttribute("aria-expanded", "true");
        }
      });

      return section;
    }

    var lis = nav.querySelectorAll(".nav-list > .nav-item");
    lis.forEach(function (li) {
      var a = li.querySelector("a.nav-link") || li.querySelector("a");
      if (!a) return;
      var mega = li.querySelector(".mega-menu");
      var label = (a.textContent || "").replace(/\s+/g, " ").trim();
      if (mega) {
        body.appendChild(buildAccordion(li, label));
      } else {
        var href = a.getAttribute("href");
        if (!href || href === "#") return;
        var row = document.createElement("a");
        makeRow(row);
        row.className += " mnav-link";
        row.setAttribute("href", href);
        if (a.classList.contains("is-current")) row.classList.add("is-current");
        row.innerHTML = '<span>' + label + '</span>';
        body.appendChild(row);
      }
    });

    // Footer: CTA + contact line
    var foot = document.createElement("div");
    foot.className = "mnav-foot";
    makeRow(foot);
    foot.innerHTML =
      '<a class="mnav-cta" href="kontakt.html">Zatra\u017eite ponudu ' + ARROW + '</a>' +
      '<a class="mnav-phone" href="tel:+38267038777">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>' +
        '+382 67 038 777</a>';
    body.appendChild(foot);

    document.body.appendChild(drawer);

    function openNav() {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      document.body.classList.add("nav-open");
      toggle.classList.add("is-active");
      toggle.setAttribute("aria-expanded", "true");
    }
    function closeNav() {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      if (drawer.classList.contains("is-open")) closeNav();
      else openNav();
    });
    backdrop.addEventListener("click", closeNav);
    head.querySelector(".mnav-close").addEventListener("click", closeNav);
    body.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("a");
      if (link) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) closeNav();
    });
  }

  /* ----------------------------------------------------------------------
     4. Mega feature swap — hovering a .mega-item updates the promo card
     ---------------------------------------------------------------------- */
  function initMegaFeatureSwap() {
    var feature = document.getElementById("megaFeatureRjesenja");
    if (!feature) return;
    var img = feature.querySelector(".mega-feature-img");
    var title = feature.querySelector(".mega-feature-title");
    var desc = feature.querySelector(".mega-feature-desc");
    var ctaLink = feature.querySelector(".mega-feature-cta");

    var items = document.querySelectorAll(".mega-menu--rjesenja .mega-item");
    items.forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        items.forEach(function (i) { i.classList.remove("is-active"); });
        item.classList.add("is-active");

        var di = item.getAttribute("data-img");
        var dt = item.getAttribute("data-title");
        var dd = item.getAttribute("data-desc");
        if (di && img) {
          if (img.tagName === "IMG") img.src = di;
          else img.style.backgroundImage = "url('" + di + "')";
        }
        if (dt && title) title.textContent = dt;
        if (dd && desc) desc.textContent = dd;
        var href = item.getAttribute("href");
        if (href && ctaLink) ctaLink.setAttribute("href", href);
      });
    });
  }

  /* ----------------------------------------------------------------------
     5. Consultation modal — open via [data-modal-open] / CTA, close on overlay
     ---------------------------------------------------------------------- */
  function initMiaPopup() {
    var modal = document.getElementById("consultModal");
    if (!modal) return;

    var form = document.getElementById("miapopForm");
    var steps = Array.prototype.slice.call(modal.querySelectorAll(".miapop-step"));
    var fill = document.getElementById("miapopProgressFill");
    var stepNum = document.getElementById("miapopStepNum");
    var backBtn = document.getElementById("miapopBack");
    var nextBtn = document.getElementById("miapopNext");
    var submitBtn = document.getElementById("miapopSubmit");
    var errorBox = document.getElementById("miapopError");
    var successBox = document.getElementById("miapopSuccess");
    var interestInput = document.getElementById("miapopInterest");
    var chips = Array.prototype.slice.call(modal.querySelectorAll(".miapop-chip"));
    var progressWrap = modal.querySelector(".miapop-progress");
    var headEl = modal.querySelector(".miapop-head");
    var current = 1;
    var total = steps.length;
    var SHOWN_KEY = "miaPopupShown";

    var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    function showStep(n) {
      current = Math.max(1, Math.min(total, n));
      steps.forEach(function (s) {
        s.classList.toggle("active", parseInt(s.getAttribute("data-step"), 10) === current);
      });
      if (fill) fill.style.width = (current / total * 100) + "%";
      if (stepNum) stepNum.textContent = current;
      backBtn.hidden = current === 1;
      nextBtn.hidden = current === total;
      submitBtn.hidden = current !== total;
      hideError();
    }
    function showError(msg) { if (errorBox) { errorBox.textContent = msg; errorBox.classList.add("show"); } }
    function hideError() { if (errorBox) { errorBox.classList.remove("show"); errorBox.textContent = ""; } }

    function validateStep(n) {
      if (n === 1) {
        if (!interestInput.value) { showError("Molimo izaberite \u0161ta vas zanima."); return false; }
      }
      if (n === 2) {
        var name = (document.getElementById("miapopName").value || "").trim();
        if (!name) { showError("Molimo unesite va\u0161e ime."); return false; }
      }
      if (n === 3) {
        var phone = (document.getElementById("miapopPhone").value || "").trim();
        var email = (document.getElementById("miapopEmail").value || "").trim();
        if (!phone && !email) { showError("Ostavite telefon ili email da vas kontaktiramo."); return false; }
        if (email && !EMAIL_RE.test(email)) { showError("Email adresa nije ispravna."); return false; }
      }
      return true;
    }

    function open() {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      try { sessionStorage.setItem(SHOWN_KEY, "1"); } catch (e) {}
    }

    // Chip selection
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("selected"); });
        chip.classList.add("selected");
        interestInput.value = chip.getAttribute("data-value");
        hideError();
      });
    });

    nextBtn.addEventListener("click", function () { if (validateStep(current)) showStep(current + 1); });
    backBtn.addEventListener("click", function () { showStep(current - 1); });

    // Close triggers
    modal.querySelectorAll("[data-pop-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("active")) close(); });

    // Submit via AJAX to serverless function
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateStep(total)) return;

      var payload = {
        interest: interestInput.value,
        name: (document.getElementById("miapopName").value || "").trim(),
        company: (document.getElementById("miapopCompany").value || "").trim(),
        phone: (document.getElementById("miapopPhone").value || "").trim(),
        email: (document.getElementById("miapopEmail").value || "").trim(),
        message: (document.getElementById("miapopMessage").value || "").trim(),
        website: (document.getElementById("miapopHp").value || "").trim(),
        page: location.pathname.split("/").pop() || "index.html"
      };

      submitBtn.disabled = true;
      var oldLabel = submitBtn.innerHTML;
      submitBtn.innerHTML = "Slanje...";

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) {
        return r.json().catch(function () { return { ok: r.ok }; });
      }).then(function (data) {
        if (data && data.ok) {
          form.style.display = "none";
          if (progressWrap) progressWrap.style.display = "none";
          if (headEl) headEl.style.display = "none";
          if (successBox) successBox.hidden = false;
          try { sessionStorage.setItem(SHOWN_KEY, "1"); } catch (e) {}
        } else {
          showError((data && data.error) || "Do\u0161lo je do gre\u0161ke. Poku\u0161ajte ponovo.");
          submitBtn.disabled = false;
          submitBtn.innerHTML = oldLabel;
        }
      }).catch(function () {
        showError("Trenutno nije mogu\u0107e poslati upit. Poku\u0161ajte kasnije ili nas pozovite.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = oldLabel;
      });
    });

    // Manual open triggers (existing CTAs keep working)
    document.querySelectorAll("[data-modal-open], .js-open-modal").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); open(); });
    });
    window.MIA_openConsultModal = open;

    showStep(1);

    // Scroll trigger: fire once per session at ~60% scroll depth.
    // Only auto-open on PRODUCT pages (proizvodi-*.html). The popup can still be
    // opened manually elsewhere via window.MIA_openConsultModal().
    var path = (location.pathname.split("/").pop() || "").toLowerCase();
    var isProductPage = path.indexOf("proizvodi") === 0;
    var alreadyShown = false;
    try { alreadyShown = sessionStorage.getItem(SHOWN_KEY) === "1"; } catch (e) {}
    if (isProductPage && !alreadyShown) {
      var triggered = false;
      var onScrollPop = function () {
        if (triggered) return;
        var doc = document.documentElement;
        var scrollable = doc.scrollHeight - doc.clientHeight;
        if (scrollable <= 0) return;
        var pct = (window.scrollY || doc.scrollTop) / scrollable;
        if (pct >= 0.6) {
          triggered = true;
          window.removeEventListener("scroll", onScrollPop);
          open();
        }
      };
      window.addEventListener("scroll", onScrollPop, { passive: true });
    }
  }

  /* ----------------------------------------------------------------------
     6. Hero slideshow — cross-fade background slides
     ---------------------------------------------------------------------- */
  function initHeroSlideshow() {
    var slides = document.querySelectorAll(".hero-slideshow .hero-slide");
    if (slides.length < 2) return;
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove("active");
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add("active");
    }, 5000);
  }

  /* ----------------------------------------------------------------------
     7. Realizacije slider — background slides + clickable dots
     ---------------------------------------------------------------------- */
  function initRealizacijeSlider() {
    var slides = document.querySelectorAll(".realizacije .slider-slide");
    var dots = document.querySelectorAll(".realizacije .slider-dot");
    if (!slides.length) return;
    var idx = 0;
    var timer = null;

    function show(n) {
      slides.forEach(function (s) { s.classList.remove("active"); });
      dots.forEach(function (d) { d.classList.remove("active"); });
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add("active");
      if (dots[idx]) dots[idx].classList.add("active");
    }
    function next() { show(idx + 1); }
    function start() { timer = setInterval(next, 4500); }
    function stop() { if (timer) clearInterval(timer); }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { stop(); show(i); start(); });
    });

    show(0);
    start();
  }

  /* ----------------------------------------------------------------------
     8. Contact page form (#contactForm) — AJAX submit to /api/contact
     ---------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var errorEl = document.getElementById("contactError");
    var successEl = document.getElementById("contactSuccess");
    var submitBtn = document.getElementById("contactSubmit");
    var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }
    function showError(msg) {
      if (!errorEl) return;
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;

      var name = val("c-name");
      var email = val("c-email");
      var phone = val("c-phone");
      if (!name) { showError("Molimo unesite ime i prezime."); return; }
      if (!phone && !(email && EMAIL_RE.test(email))) {
        showError("Unesite telefon ili ispravan email da vam se javimo.");
        return;
      }

      var payload = {
        name: name,
        company: val("c-company"),
        email: email,
        phone: phone,
        interest: val("c-type"),
        message: val("c-msg"),
        website: val("c-website"),
        page: location.pathname.split("/").pop() || "kontakt.html"
      };

      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = "0.7"; }

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
          if (res.ok && res.data && res.data.ok) {
            form.hidden = true;
            if (successEl) successEl.hidden = false;
          } else {
            showError((res.data && res.data.error) || "Došlo je do greške. Pokušajte ponovo.");
            if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = "1"; }
          }
        })
        .catch(function () {
          showError("Trenutno nije moguće poslati upit. Pokušajte ponovo ili nas pozovite.");
          if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = "1"; }
        });
    });
  }
})();


/* ===== PRODUCT GALLERY + LIGHTBOX (core pattern) ===== */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".pcard[data-gallery]"));
    if (!cards.length) return;

    // Build lightbox DOM once
    var lb = document.createElement("div");
    lb.className = "plightbox";
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<div class="plightbox-stage">' +
        '<button class="plightbox-close" aria-label="Zatvori">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<button class="plightbox-nav plightbox-prev" aria-label="Prethodna">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>' +
        '</button>' +
        '<img class="plightbox-img" src="" alt="">' +
        '<button class="plightbox-nav plightbox-next" aria-label="Sljedeća">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</button>' +
        '<div class="plightbox-caption"></div>' +
        '<div class="plightbox-thumbs"></div>' +
      '</div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector(".plightbox-img");
    var lbCap = lb.querySelector(".plightbox-caption");
    var lbThumbs = lb.querySelector(".plightbox-thumbs");
    var btnClose = lb.querySelector(".plightbox-close");
    var btnPrev = lb.querySelector(".plightbox-prev");
    var btnNext = lb.querySelector(".plightbox-next");

    var imgs = [], title = "", idx = 0;

    function parseGallery(card) {
      try { return JSON.parse(card.getAttribute("data-gallery")) || []; }
      catch (e) { return []; }
    }
    function renderThumbs() {
      lbThumbs.innerHTML = "";
      if (imgs.length < 2) { lbThumbs.style.display = "none"; return; }
      lbThumbs.style.display = "flex";
      imgs.forEach(function (src, i) {
        var t = document.createElement("div");
        t.className = "plightbox-thumb" + (i === idx ? " active" : "");
        t.innerHTML = '<img src="' + src + '" alt="">';
        t.addEventListener("click", function () { idx = i; update(); });
        lbThumbs.appendChild(t);
      });
    }
    function update() {
      if (!imgs.length) return;
      lbImg.src = imgs[idx];
      lbImg.alt = title;
      var counter = imgs.length > 1 ? ' <span class="lb-counter">(' + (idx + 1) + '/' + imgs.length + ')</span>' : "";
      lbCap.innerHTML = "<strong>" + title + "</strong>" + counter;
      var multi = imgs.length > 1;
      btnPrev.style.display = multi ? "" : "none";
      btnNext.style.display = multi ? "" : "none";
      lbThumbs.querySelectorAll(".plightbox-thumb").forEach(function (t, i) { t.classList.toggle("active", i === idx); });
    }
    function open(card, startIdx) {
      imgs = parseGallery(card);
      title = card.getAttribute("data-title") || "";
      idx = startIdx || 0;
      if (!imgs.length) return;
      renderThumbs();
      update();
      lb.classList.add("active");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("active");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    function next() { idx = (idx + 1) % imgs.length; update(); }
    function prev() { idx = (idx - 1 + imgs.length) % imgs.length; update(); }

    cards.forEach(function (card) {
      var media = card.querySelector(".pcard-media");
      if (media) media.addEventListener("click", function () { open(card, 0); });
      var cardThumbs = Array.prototype.slice.call(card.querySelectorAll(".pcard-thumb"));
      cardThumbs.forEach(function (th, i) {
        th.addEventListener("click", function (e) {
          e.stopPropagation();
          open(card, i);
        });
      });
    });

    btnClose.addEventListener("click", close);
    btnNext.addEventListener("click", next);
    btnPrev.addEventListener("click", prev);
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("plightbox-stage")) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("active")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    });

    var sx = 0;
    lbImg.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lbImg.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
    }, { passive: true });
  });
})();
