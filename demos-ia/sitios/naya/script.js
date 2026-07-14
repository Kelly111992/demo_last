const body = document.body;
const menuTrigger = document.querySelector("[data-menu-trigger]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const cart = document.querySelector("[data-cart]");
const cartBackdrop = document.querySelector("[data-cart-backdrop]");
const addButtons = document.querySelectorAll("[data-add-to-cart]");
const cartOpenButtons = document.querySelectorAll("[data-cart-open]");
const cartCloseButtons = document.querySelectorAll("[data-cart-close]");
const cartCounts = document.querySelectorAll("[data-cart-count]");
const cartQuantity = document.querySelector("[data-cart-quantity]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartItem = document.querySelector("[data-cart-item]");
const cartLive = document.querySelector("[data-cart-live]");
const checkoutButton = document.querySelector("[data-checkout]");
const heroVideo = document.querySelector("[data-hero-video]");

const state = {
  quantity: 0,
  price: 690,
};

function setBodyLock() {
  const shouldLock = mobileMenu?.hasAttribute("data-open") || cart?.hasAttribute("data-open");
  body.classList.toggle("is-locked", shouldLock);
}

function setMenu(open) {
  if (!menuTrigger || !mobileMenu) return;
  menuTrigger.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
  mobileMenu.toggleAttribute("data-open", open);
  setBodyLock();
}

function setCart(open) {
  if (!cart || !cartBackdrop) return;
  cart.setAttribute("aria-hidden", String(!open));
  cart.toggleAttribute("data-open", open);
  cartBackdrop.hidden = !open;
  setBodyLock();

  if (open) {
    requestAnimationFrame(() => cart.querySelector("[data-cart-close]")?.focus());
  }
}

function updateCart() {
  const total = state.quantity * state.price;

  cartCounts.forEach((count) => {
    count.textContent = String(state.quantity);
  });

  if (cartQuantity) cartQuantity.textContent = String(state.quantity);
  if (cartTotal) cartTotal.textContent = `$${total.toLocaleString("es-MX")} MXN`;
  if (cartEmpty) cartEmpty.hidden = state.quantity > 0;
  if (cartItem) cartItem.hidden = state.quantity === 0;
  if (checkoutButton) checkoutButton.disabled = state.quantity === 0;
  if (cartLive) cartLive.textContent = `Kit Esencial agregado. Hay ${state.quantity} ${state.quantity === 1 ? "artículo" : "artículos"} en tu bolsa.`;
}

menuTrigger?.addEventListener("click", () => {
  setMenu(menuTrigger.getAttribute("aria-expanded") !== "true");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

cartOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMenu(false);
    setCart(true);
  });
});

cartCloseButtons.forEach((button) => {
  button.addEventListener("click", () => setCart(false));
});

cartBackdrop?.addEventListener("click", () => setCart(false));

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.quantity += 1;
    updateCart();
    setCart(true);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setMenu(false);
  setCart(false);
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("aria-controls");
    const target = targetId ? document.getElementById(targetId) : null;
    const willOpen = button.getAttribute("aria-expanded") !== "true";

    document.querySelectorAll(".faq-item button").forEach((otherButton) => {
      const otherId = otherButton.getAttribute("aria-controls");
      const otherTarget = otherId ? document.getElementById(otherId) : null;
      otherButton.setAttribute("aria-expanded", "false");
      if (otherTarget) otherTarget.hidden = true;
    });

    button.setAttribute("aria-expanded", String(willOpen));
    if (target) target.hidden = !willOpen;
  });
});

const newsletter = document.querySelector("[data-newsletter]");
const newsletterStatus = document.querySelector("[data-newsletter-status]");

newsletter?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = newsletter.elements.email;

  if (!email.checkValidity()) {
    newsletterStatus.textContent = "Escribe un correo válido para continuar.";
    email.setAttribute("aria-invalid", "true");
    email.focus();
    return;
  }

  email.removeAttribute("aria-invalid");
  newsletterStatus.textContent = "Gracias. Tu correo quedó registrado en esta demostración.";
  newsletter.reset();
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function applyMotionPreference() {
  if (!heroVideo) return;
  if (reduceMotion.matches) {
    heroVideo.pause();
  } else {
    heroVideo.play().catch(() => {});
  }
}

applyMotionPreference();
reduceMotion.addEventListener("change", applyMotionPreference);

const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8%" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

updateCart();
