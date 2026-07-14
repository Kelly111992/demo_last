const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const nav = $(".main-nav");
$("[data-menu]")?.addEventListener("click", () => nav?.classList.toggle("open"));
$$('.main-nav a').forEach((link) => link.addEventListener('click', () => nav?.classList.remove('open')));

const searchPanel = $("[data-search-panel]");
$("[data-search]")?.addEventListener("click", () => searchPanel?.classList.toggle("hidden"));
searchPanel?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = $("#site-search")?.value.trim();
  $("[data-search-result]").textContent = value ? `Resultados sugeridos para “${value}”: herramienta eléctrica, consumibles y accesorios.` : "";
});

const cart = [];
const overlay = $("[data-overlay]");
const formatMoney = (value) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);

function renderCart() {
  const count = cart.length;
  const badge = $("[data-cart-count]");
  badge.textContent = count;
  badge.classList.toggle("hidden", !count);
  $("[data-drawer-count]").textContent = `(${count})`;
  $("[data-empty]").classList.toggle("hidden", !!count);
  $("[data-cart-items]").classList.toggle("hidden", !count);
  $("[data-cart-total]").classList.toggle("hidden", !count);
  $("[data-total]").textContent = formatMoney(cart.reduce((sum, item) => sum + item.price, 0));
  $("[data-cart-items]").innerHTML = cart.map((item, index) => `<div class="cart-item"><div class="cart-thumb"><img src="${item.image}" alt=""></div><div><h3>${item.brand} ${item.name}</h3><p>${formatMoney(item.price)}</p></div><button data-remove="${index}" aria-label="Eliminar ${item.brand} ${item.name}">×</button></div>`).join("");
  $$('[data-remove]').forEach((button) => button.addEventListener('click', () => { cart.splice(Number(button.dataset.remove), 1); renderCart(); }));
}

$$('[data-add]').forEach((button) => button.addEventListener('click', () => {
  const product = button.closest('.product-card');
  cart.push({ brand: product.dataset.brand, name: product.dataset.name, price: Number(product.dataset.price), image: product.dataset.image });
  renderCart();
  overlay.classList.remove('hidden');
}));
$("[data-cart-open]")?.addEventListener("click", () => overlay?.classList.remove("hidden"));
$("[data-cart-close]")?.addEventListener("click", () => overlay?.classList.add("hidden"));
overlay?.addEventListener("click", (event) => { if (event.target === overlay) overlay.classList.add("hidden"); });

const videoModal = $("[data-video-modal]");
const modalVideo = $("video", videoModal);
$$('[data-video-open]').forEach((button) => button.addEventListener('click', () => {
  videoModal.classList.remove('hidden');
  modalVideo.currentTime = 0;
  modalVideo.play().catch(() => {});
}));
$("[data-video-close]")?.addEventListener("click", () => {
  modalVideo.pause();
  videoModal.classList.add("hidden");
});

$$('form').forEach((form) => {
  if (!form.matches('[data-search-panel]')) form.addEventListener('submit', (event) => event.preventDefault());
});

renderCart();
