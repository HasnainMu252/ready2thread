const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const header = $(".site-header");
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
const backToTop = $("#backToTop");
const year = $("#year");

const quoteModal = $("#quoteModal");
const quoteForm = $("#quoteForm");
const formMessage = $("#formMessage");
const quoteSteps = $$(".quote-step");
const quoteProgress = $("#quoteProgress");
const quoteStepCount = $("#quoteStepCount");
const prevStepButton = $("#prevStep");
const nextStepButton = $("#nextStep");
const submitQuoteButton = $("#submitQuote");

const portfolioGrid = $("#portfolioGrid");
const pagination = $("#portfolioPagination");
const filterBtns = $$(".filter-btn");

let currentQuoteStep = 0;
let currentFilter = "all";
let currentPage = 1;
const cardsPerPage = 8;

if (year) year.textContent = new Date().getFullYear();

/* Header + Back to Top */
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 40);
  backToTop?.classList.toggle("show", window.scrollY > 500);
});

menuToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
  menuToggle.classList.toggle("active");
});

$$(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    menuToggle?.classList.remove("active");
  });
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* Reveal Animation */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

$$(".reveal").forEach((el) => revealObserver.observe(el));

/* FAQ */
$$(".faq-item").forEach((item) => {
  const button = item.querySelector("button");

  button?.addEventListener("click", () => {
    $$(".faq-item").forEach((faq) => {
      if (faq !== item) faq.classList.remove("active");
    });

    item.classList.toggle("active");
  });
});

/* Quote Modal */
function updateQuoteStep() {
  if (!quoteSteps.length) return;

  quoteSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentQuoteStep);
  });

  const totalSteps = quoteSteps.length;
  const progressWidth = ((currentQuoteStep + 1) / totalSteps) * 100;

  if (quoteProgress) quoteProgress.style.width = `${progressWidth}%`;
  if (quoteStepCount) {
    quoteStepCount.textContent = `Step ${currentQuoteStep + 1} of ${totalSteps}`;
  }

  if (prevStepButton) {
    prevStepButton.style.display = currentQuoteStep === 0 ? "none" : "inline-flex";
  }

  if (nextStepButton) {
    nextStepButton.style.display =
      currentQuoteStep === totalSteps - 1 ? "none" : "inline-flex";
  }

  if (submitQuoteButton) {
    submitQuoteButton.style.display =
      currentQuoteStep === totalSteps - 1 ? "inline-flex" : "none";
  }

  if (formMessage) formMessage.textContent = "";
}

function openQuoteModal(event) {
  event?.preventDefault();

  quoteModal?.classList.add("open");
  quoteModal?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  currentQuoteStep = 0;
  updateQuoteStep();
}

function closeQuoteModal() {
  quoteModal?.classList.remove("open");
  quoteModal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function validateCurrentStep() {
  const activeStep = quoteSteps[currentQuoteStep];
  if (!activeStep) return true;

  const requiredFields = activeStep.querySelectorAll("[required]");

  for (const field of requiredFields) {
    if (!field.value.trim()) {
      field.focus();
      if (formMessage) {
        formMessage.textContent = "Please fill the required field before moving next.";
      }
      return false;
    }
  }

  return true;
}

$$(".quote-open").forEach((button) => {
  button.addEventListener("click", openQuoteModal);
});

$$("[data-close-quote]").forEach((button) => {
  button.addEventListener("click", closeQuoteModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && quoteModal?.classList.contains("open")) {
    closeQuoteModal();
  }
});

prevStepButton?.addEventListener("click", () => {
  if (currentQuoteStep > 0) {
    currentQuoteStep--;
    updateQuoteStep();
  }
});

nextStepButton?.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentQuoteStep < quoteSteps.length - 1) {
    currentQuoteStep++;
    updateQuoteStep();
  }
});

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  const formData = new FormData(quoteForm);
  const name = formData.get("name") || "there";

  if (formMessage) {
    formMessage.textContent = `Thank you, ${name}! Your quote request has been submitted.`;
  }

  quoteForm.reset();
  currentQuoteStep = 0;

  setTimeout(() => {
    updateQuoteStep();
    closeQuoteModal();
  }, 1800);
});

/* Portfolio Data */
const portfolioData = [
  ["logo", "Logo Digitizing", "Corporate Shirt Logo", "Clean left chest digitizing for uniform embroidery."],
  ["patch", "Custom Patch", "Badge Patch Design", "Patch-ready layout with bold border and crisp detail."],
  ["vector", "Vector Conversion", "Raster to Vector Artwork", "Low-resolution image converted into print-ready vector."],
  ["cap", "Cap Digitizing", "Front Cap Embroidery", "Optimized stitching flow for curved cap placement."],
  ["logo", "Machine File", "DST / PES / EMB Files", "Stitch-ready embroidery formats for production."],
  ["patch", "Premium Patch", "3D Puff Patch Style", "Bold raised effect for standout apparel branding."],
  ["vector", "Vector Art", "Clean Vector Design", "Sharp artwork prepared for embroidery and printing."],
  ["cap", "Hat Embroidery", "Cap Side Logo", "Professional stitch setup for cap side placement."],
  ["logo", "Brand Logo", "Business Logo Digitizing", "Neat and production-ready logo embroidery file."],
  ["patch", "Patch Design", "Uniform Badge Patch", "Durable patch artwork with clean stitch borders."],
  ["vector", "Artwork Redraw", "Logo Vector Redraw", "Pixelated artwork converted into sharp clean lines."],
  ["cap", "Cap Logo", "Structured Cap Embroidery", "Balanced stitching for front crown embroidery."],
  ["logo", "Logo File", "Left Chest Logo", "Small logo digitizing with readable stitch detail."],
  ["patch", "Custom Patch", "Round Patch Design", "Clean circular patch with bold embroidered edges."],
  ["vector", "Vector Service", "Print Ready Vector", "High-quality vector file for print and embroidery."],
  ["cap", "Hat Logo", "Flat Cap Embroidery", "Smooth stitch layout for clean cap branding."],
  ["logo", "Embroidery Logo", "Premium Brand Logo", "Detailed stitch file for professional brand apparel."],
  ["patch", "Patch Work", "Jacket Patch Design", "Strong patch style made for jackets and hoodies."],
  ["vector", "Vector Conversion", "Clean Line Artwork", "Converted design with smooth outlines and detail."],
  ["cap", "Cap Embroidery", "Premium Cap Logo", "Production-ready cap logo with proper stitch density."]
];

function getFilteredItems() {
  return currentFilter === "all"
    ? portfolioData
    : portfolioData.filter((item) => item[0] === currentFilter);
}

function renderPortfolio() {
  if (!portfolioGrid || !pagination) return;

  const items = getFilteredItems();
  const start = (currentPage - 1) * cardsPerPage;
  const paginatedItems = items.slice(start, start + cardsPerPage);

  portfolioGrid.innerHTML = paginatedItems
    .map((item) => {
      const imageNumber = portfolioData.indexOf(item) + 1;

      return `
        <article class="portfolio-card reveal active" data-category="${item[0]}">
          <img
            src="./Assets/1 (${imageNumber}).jpeg"
            class="portfolio-img"
            width="550"
            height="300"
            loading="lazy"
            alt="${item[2]}"
          >
          <div class="portfolio-content">
            <span>${item[1]}</span>
            <h3>${item[2]}</h3>
            <p>${item[3]}</p>
          </div>
        </article>
      `;
    })
    .join("");

  renderPagination(items.length);
}

function renderPagination(totalItems) {
  if (!pagination) return;

  const totalPages = Math.ceil(totalItems / cardsPerPage);
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  let buttons = `
    <button class="page-btn" ${currentPage === 1 ? "disabled" : ""} data-page="prev">‹</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    buttons += `
      <button class="page-btn ${currentPage === i ? "active" : ""}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  buttons += `
    <button class="page-btn" ${currentPage === totalPages ? "disabled" : ""} data-page="next">›</button>
  `;

  pagination.innerHTML = buttons;
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter || "all";
    currentPage = 1;

    renderPortfolio();
  });
});

pagination?.addEventListener("click", (event) => {
  const button = event.target.closest(".page-btn");
  if (!button || button.disabled) return;

  const page = button.dataset.page;
  const totalPages = Math.ceil(getFilteredItems().length / cardsPerPage);

  if (page === "prev" && currentPage > 1) currentPage--;
  else if (page === "next" && currentPage < totalPages) currentPage++;
  else if (!Number.isNaN(Number(page))) currentPage = Number(page);

  renderPortfolio();
});

updateQuoteStep();
renderPortfolio();