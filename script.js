/* ─── Ready2Thread – Optimized Fixed Script ───────────── */
"use strict";

/* ─── Utilities ───────────────────────────────────────── */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ─── DOM Refs ────────────────────────────────────────── */
const header         = $(".site-header");
const menuToggle     = $("#menuToggle");
const navLinks       = $("#navLinks");
const backToTop      = $("#backToTop");
const yearEl         = $("#year");

const quoteModal     = $("#quoteModal");
const quoteForm      = $("#quoteForm");
const formMessage    = $("#formMessage");
const quoteSteps     = $$(".quote-step");
const quoteProgress  = $("#quoteProgress");
const quoteStepCount = $("#quoteStepCount");
const prevBtn        = $("#prevStep");
const nextBtn        = $("#nextStep");
const submitBtn      = $("#submitQuote");

const portfolioGrid  = $("#portfolioGrid");
const paginationEl   = $("#portfolioPagination");
const filterBtns     = $$(".filter-btn");

const exitPopup      = $("#exitPopup");
const popupOverlay   = $("#popupOverlay");

/* ─── State ───────────────────────────────────────────── */
let currentStep = 0;
let currentFilter = "all";
let currentPage = 1;
const PER_PAGE = 8;

let popupShown = false;
let scrollPopupShown = false;

if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Body Lock Safe Helpers ──────────────────────────── */
function lockBody() {
  document.body.classList.add("modal-lock");
  document.body.style.overflow = "hidden";
}

function unlockBody() {
  const quoteOpen = quoteModal?.classList.contains("open");
  const popupOpen = exitPopup?.classList.contains("open");

  if (!quoteOpen && !popupOpen) {
    document.body.classList.remove("modal-lock");
    document.body.style.overflow = "";
  }
}

/* ─── Header Scroll ───────────────────────────────────── */
const onScroll = () => {
  const y = window.scrollY;

  header?.classList.toggle("scrolled", y > 40);
  backToTop?.classList.toggle("show", y > 500);

  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (
    exitPopup &&
    scrollHeight > 0 &&
    !scrollPopupShown &&
    !popupShown &&
    y > scrollHeight * 0.38
  ) {
    scrollPopupShown = true;
    setTimeout(showExitPopup, 600);
  }
};

window.addEventListener("scroll", onScroll, { passive: true });

/* ─── Menu Toggle ─────────────────────────────────────── */
menuToggle?.addEventListener("click", () => {
  const open = navLinks?.classList.toggle("open");
  menuToggle.classList.toggle("active", !!open);
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

$$(".nav-links a").forEach((a) => {
  a.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    menuToggle?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ─── Reveal Animation ────────────────────────────────── */
if ("IntersectionObserver" in window) {
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$(".reveal").forEach((el) => revealObs.observe(el));
} else {
  $$(".reveal").forEach((el) => el.classList.add("active"));
}

/* ─── FAQ ─────────────────────────────────────────────── */
$$(".faq-item").forEach((item) => {
  item.querySelector("button")?.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");
    $$(".faq-item").forEach((f) => f.classList.remove("active"));
    if (!isOpen) item.classList.add("active");
  });
});

/* ─── Exit Popup ──────────────────────────────────────── */
function showExitPopup() {
  if (popupShown || !exitPopup) return;

  popupShown = true;
  exitPopup.classList.add("open");
  lockBody();
}

function closeExitPopup() {
  if (!exitPopup) return;

  exitPopup.classList.remove("open");
  unlockBody();
}

if (exitPopup) {
  setTimeout(() => {
    if (!popupShown) showExitPopup();
  }, 8000);

  exitPopup.querySelector(".popup-close")?.addEventListener("click", closeExitPopup);
  exitPopup.querySelector(".popup-skip")?.addEventListener("click", closeExitPopup);
  popupOverlay?.addEventListener("click", closeExitPopup);

  exitPopup.querySelector(".popup-cta")?.addEventListener("click", () => {
    closeExitPopup();
    openQuoteModal();
  });
}

/* ─── Quote Modal ─────────────────────────────────────── */
function updateStep() {
  if (!quoteSteps.length) return;

  const total = quoteSteps.length;

  quoteSteps.forEach((step, i) => {
    step.classList.toggle("active", i === currentStep);
  });

  if (quoteProgress) {
    quoteProgress.style.width = `${((currentStep + 1) / total) * 100}%`;
  }

  if (quoteStepCount) {
    quoteStepCount.textContent = `Step ${currentStep + 1} of ${total}`;
  }

  if (prevBtn) {
    prevBtn.style.display = currentStep === 0 ? "none" : "inline-flex";
  }

  if (nextBtn) {
    nextBtn.style.display = currentStep === total - 1 ? "none" : "inline-flex";
  }

  if (submitBtn) {
    submitBtn.style.display = currentStep === total - 1 ? "inline-flex" : "none";
  }

  if (formMessage) {
    formMessage.textContent = "";
  }
}

function validateStep() {
  const active = quoteSteps[currentStep];
  if (!active) return true;

  const requiredFields = active.querySelectorAll("[required]");

  for (const field of requiredFields) {
    if (!field.value.trim()) {
      field.focus();

      if (formMessage) {
        formMessage.textContent = "Please fill the required field.";
      }

      return false;
    }
  }

  return true;
}

function openQuoteModal(e) {
  e?.preventDefault();

  if (!quoteModal) return;

  quoteModal.classList.add("open");
  quoteModal.setAttribute("aria-hidden", "false");
  lockBody();

  currentStep = 0;
  updateStep();
}

function closeQuoteModal() {
  if (!quoteModal) return;

  quoteModal.classList.remove("open");
  quoteModal.setAttribute("aria-hidden", "true");
  unlockBody();
}

$$(".quote-open").forEach((btn) => {
  btn.addEventListener("click", openQuoteModal);
});

$$("[data-close-quote]").forEach((btn) => {
  btn.addEventListener("click", closeQuoteModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeQuoteModal();
    closeExitPopup();
  }
});

prevBtn?.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateStep();
  }
});

nextBtn?.addEventListener("click", () => {
  if (validateStep() && currentStep < quoteSteps.length - 1) {
    currentStep++;
    updateStep();
  }
});

quoteForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateStep()) return;

  const formData = new FormData(quoteForm);
  const name = formData.get("name") || "there";

  if (formMessage) {
    formMessage.textContent = `🎉 Thank you, ${name}! We'll get back to you shortly.`;
  }

  quoteForm.reset();
  currentStep = 0;

  setTimeout(() => {
    updateStep();
    closeQuoteModal();
  }, 1800);
});

/* ─── Portfolio Data ──────────────────────────────────── */
const portfolioData = [
  ["logo", "Logo Digitizing", "Corporate Shirt Logo"],
  ["patch", "Custom Patch", "Badge Patch Design"],
  ["vector", "Vector Conversion", "Raster to Vector Artwork"],
  ["cap", "Cap Digitizing", "Front Cap Embroidery"],
  ["logo", "Machine File", "DST / PES / EMB Files"],
  ["patch", "Premium Patch", "3D Puff Patch Style"],
  ["vector", "Vector Art", "Clean Vector Design"],
  ["cap", "Hat Embroidery", "Cap Side Logo"],
  ["logo", "Brand Logo", "Business Logo Digitizing"],
  ["patch", "Patch Design", "Uniform Badge Patch"],
  ["vector", "Artwork Redraw", "Logo Vector Redraw"],
  ["cap", "Cap Logo", "Structured Cap Embroidery"],
  ["logo", "Logo File", "Left Chest Logo"],
  ["patch", "Custom Patch", "Round Patch Design"],
  ["vector", "Vector Service", "Print Ready Vector"],
  ["cap", "Hat Logo", "Flat Cap Embroidery"],
  ["logo", "Embroidery Logo", "Premium Brand Logo"],
  ["patch", "Patch Work", "Jacket Patch Design"],
  ["vector", "Vector Conversion", "Clean Line Artwork"],
  ["cap", "Cap Embroidery", "Premium Cap Logo"],
];

function getFiltered() {
  if (currentFilter === "all") return portfolioData;
  return portfolioData.filter((item) => item[0] === currentFilter);
}

function renderPortfolio() {
  if (!portfolioGrid || !paginationEl) return;

  const items = getFiltered();
  const start = (currentPage - 1) * PER_PAGE;
  const slice = items.slice(start, start + PER_PAGE);

  portfolioGrid.innerHTML = slice
    .map((item) => {
      const idx = portfolioData.indexOf(item) + 1;

      return `
        <article class="portfolio-card reveal active" data-category="${item[0]}">
          <div class="portfolio-img-wrap">
            <img 
              src="./Assets/1 (${idx}).jpeg" 
              class="portfolio-img" 
              width="550" 
              height="300" 
              loading="lazy" 
              alt="${item[2]}"
              onerror="this.src='./Assets/placeholder.jpeg'"
            >
            <div class="portfolio-overlay">
              <span class="portfolio-tag">${item[1]}</span>
            </div>
          </div>

          <div class="portfolio-content">
            <span class="portfolio-cat">${item[1]}</span>
            <h3>${item[2]}</h3>
          </div>
        </article>
      `;
    })
    .join("");

  renderPagination(items.length);
}

function renderPagination(total) {
  if (!paginationEl) return;

  const pages = Math.ceil(total / PER_PAGE);

  if (pages <= 1) {
    paginationEl.innerHTML = "";
    return;
  }

  let html = `
    <button class="page-btn" ${currentPage === 1 ? "disabled" : ""} data-page="prev">
      ‹
    </button>
  `;

  for (let i = 1; i <= pages; i++) {
    html += `
      <button class="page-btn ${currentPage === i ? "active" : ""}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  html += `
    <button class="page-btn" ${currentPage === pages ? "disabled" : ""} data-page="next">
      ›
    </button>
  `;

  paginationEl.innerHTML = html;
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter || "all";
    currentPage = 1;

    renderPortfolio();
  });
});

paginationEl?.addEventListener("click", (e) => {
  const btn = e.target.closest(".page-btn");

  if (!btn || btn.disabled) return;

  const page = btn.dataset.page;
  const totalPages = Math.ceil(getFiltered().length / PER_PAGE);

  if (page === "prev" && currentPage > 1) {
    currentPage--;
  } else if (page === "next" && currentPage < totalPages) {
    currentPage++;
  } else if (!isNaN(Number(page))) {
    currentPage = Number(page);
  }

  renderPortfolio();

  portfolioGrid?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

/* ─── Counter Animation ───────────────────────────────── */
function animateCounters() {
  $$(".stat-number[data-target]").forEach((el) => {
    if (el.dataset.animated === "true") return;

    el.dataset.animated = "true";

    const target = Number(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || "";

    let count = 0;
    const step = Math.max(target / 60, 1);

    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = Math.floor(count) + suffix;

      if (count >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      }
    }, 25);
  });
}

const statsSection = $(".stats-strip");

if (statsSection && "IntersectionObserver" in window) {
  const statsObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounters();
          statsObs.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  statsObs.observe(statsSection);
}

/* ─── Init ────────────────────────────────────────────── */
updateStep();
renderPortfolio();