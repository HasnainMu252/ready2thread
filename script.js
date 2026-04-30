const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const year = document.getElementById("year");
const revealElements = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioCards = document.querySelectorAll(".portfolio-card");
const faqItems = document.querySelectorAll(".faq-item");
const quoteForm = document.getElementById("quoteForm");
const formMessage = document.getElementById("formMessage");
const quoteModal = document.getElementById("quoteModal");
const quoteOpenButtons = document.querySelectorAll(".quote-open");
const quoteCloseButtons = document.querySelectorAll("[data-close-quote]");
const quoteSteps = document.querySelectorAll(".quote-step");
const quoteProgress = document.getElementById("quoteProgress");
const quoteStepCount = document.getElementById("quoteStepCount");
const prevStepButton = document.getElementById("prevStep");
const nextStepButton = document.getElementById("nextStep");
const submitQuoteButton = document.getElementById("submitQuote");
let currentQuoteStep = 0;

year.textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
  backToTop.classList.toggle("show", window.scrollY > 500);
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuToggle.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("active");
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight - 80) {
      element.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    portfolioCards.forEach((card) => {
      const category = card.dataset.category;
      if (filter === "all" || category === filter) {
        card.classList.remove("hidden");
        setTimeout(() => card.classList.add("active"), 50);
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

faqItems.forEach((item) => {
  const button = item.querySelector("button");

  button.addEventListener("click", () => {
    faqItems.forEach((faq) => {
      if (faq !== item) faq.classList.remove("active");
    });

    item.classList.toggle("active");
  });
});

const updateQuoteStep = () => {
  quoteSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentQuoteStep);
  });

  const totalSteps = quoteSteps.length;
  const progressWidth = ((currentQuoteStep + 1) / totalSteps) * 100;

  quoteProgress.style.width = `${progressWidth}%`;
  quoteStepCount.textContent = `Step ${currentQuoteStep + 1} of ${totalSteps}`;

  prevStepButton.style.display = currentQuoteStep === 0 ? "none" : "inline-flex";
  nextStepButton.style.display = currentQuoteStep === totalSteps - 1 ? "none" : "inline-flex";
  submitQuoteButton.style.display = currentQuoteStep === totalSteps - 1 ? "inline-flex" : "none";
  formMessage.textContent = "";
};

const openQuoteModal = (event) => {
  if (event) event.preventDefault();
  quoteModal.classList.add("open");
  quoteModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  currentQuoteStep = 0;
  updateQuoteStep();
};

const closeQuoteModal = () => {
  quoteModal.classList.remove("open");
  quoteModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const validateCurrentStep = () => {
  const activeStep = quoteSteps[currentQuoteStep];
  const requiredFields = activeStep.querySelectorAll("[required]");

  for (const field of requiredFields) {
    if (!field.value.trim()) {
      field.focus();
      formMessage.textContent = "Please fill the required field before moving next.";
      return false;
    }
  }

  return true;
};

quoteOpenButtons.forEach((button) => {
  button.addEventListener("click", openQuoteModal);
});

quoteCloseButtons.forEach((button) => {
  button.addEventListener("click", closeQuoteModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && quoteModal.classList.contains("open")) {
    closeQuoteModal();
  }
});

prevStepButton.addEventListener("click", () => {
  if (currentQuoteStep > 0) {
    currentQuoteStep--;
    updateQuoteStep();
  }
});

nextStepButton.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentQuoteStep < quoteSteps.length - 1) {
    currentQuoteStep++;
    updateQuoteStep();
  }
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  const formData = new FormData(quoteForm);
  const name = formData.get("name") || "there";

  formMessage.textContent = `Thank you, ${name}! Your free quote request has been saved in the browser demo. Connect this form with Formspree, EmailJS, WhatsApp API, or your backend to receive orders.`;
  quoteForm.reset();
  currentQuoteStep = 0;

  setTimeout(() => {
    updateQuoteStep();
    closeQuoteModal();
  }, 2200);
});

updateQuoteStep();
