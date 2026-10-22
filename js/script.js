document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const createIcons = () => window.lucide?.createIcons();

  createIcons();

  const flipScene = $("#heroFlipScene");
  const flipCard = $("#heroFlipCard");
  if (flipScene && flipCard) {
    const flip = () => flipCard.classList.toggle("flipped");
    flipScene.addEventListener("click", flip);
    flipScene.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        flip();
      }
    });
  }

  const menuToggle = $("#menuToggle");
  const nav = $("#nav");
  const navLinks = nav ? [...nav.querySelectorAll("a")] : [];
  if (menuToggle && nav) {
    const setMenuOpen = (isOpen) => {
      nav.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      menuToggle.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;
      createIcons();
    };

    menuToggle.addEventListener("click", () => setMenuOpen(!nav.classList.contains("open")));
    navLinks.forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
  }

  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
  } else {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
  }

  const filterButtons = document.querySelectorAll(".filter");
  const projectCards = document.querySelectorAll(".project-card");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      projectCards.forEach((card) => {
        const shouldShow = button.dataset.filter === "all" || card.dataset.category === button.dataset.filter;
        card.classList.toggle("hidden", !shouldShow);
      });
    });
  });

  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`Hi Shafi,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);
      const formNote = $("#formNote");

      if (formNote) {
        formNote.textContent = "Your email app should open with the message prepared. Review it and press Send.";
      }
      window.location.href = `mailto:muhammed.mihsshafi05@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
});
