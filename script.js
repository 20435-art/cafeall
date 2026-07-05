/* =========================================================
   Bean Voyage — script.js
   ข้อมูลสินค้าจำลอง (พร้อมเปลี่ยนไปดึงจาก Database / API ในอนาคต)
   ========================================================= */

const products = [
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    country: "Ethiopia",
    roast: "Light Roast",
    roastValue: 15,
    weight: "250 g",
    price: 450,
    image: "images/ethiopia.jpg",
    description: "เมล็ดกาแฟกลิ่นดอกไม้ ให้รสชาติผลไม้และความหวานธรรมชาติ ปลูกในพื้นที่สูงของแคว้นเยอร์กาเชฟ ขึ้นชื่อเรื่องความหอมคล้ายมะลิและเบอร์รี่"
  },
  {
    id: 2,
    name: "Colombia Supremo",
    country: "Colombia",
    roast: "Medium Roast",
    roastValue: 50,
    weight: "250 g",
    price: 420,
    image: "images/colombia.jpg",
    description: "รสชาติสมดุล หอมคาราเมลอ่อนๆ พร้อมความเปรี้ยวนุ่มนวลแบบผลไม้ตระกูลส้ม เหมาะสำหรับดื่มได้ทุกวัน"
  },
  {
    id: 3,
    name: "Brazil Santos",
    country: "Brazil",
    roast: "Medium Roast",
    roastValue: 55,
    weight: "250 g",
    price: 380,
    image: "images/brazil.jpg",
    description: "กาแฟบอดี้หนัก กลิ่นถั่วและช็อกโกแลต ความขมน้อย เหมาะกับการชงเอสเพรสโซหรือดื่มกับนม"
  },
  {
    id: 4,
    name: "Kenya AA",
    country: "Kenya",
    roast: "Light Roast",
    roastValue: 20,
    weight: "250 g",
    price: 480,
    image: "images/kenya.jpg",
    description: "เมล็ดเกรดพรีเมียม รสเปรี้ยวสดใสคล้ายผลเบอร์รี่และมะเขือเทศ ตามด้วยความหวานคล้ายไวน์"
  },
  {
    id: 5,
    name: "Guatemala Antigua",
    country: "Guatemala",
    roast: "Dark Roast",
    roastValue: 85,
    weight: "250 g",
    price: 460,
    image: "images/guatemala.jpg",
    description: "กาแฟจากดินภูเขาไฟ กลิ่นสโมกกี้ รสเข้มข้น ทิ้งท้ายด้วยความหวานคล้ายดาร์กช็อกโกแลต"
  },
  {
    id: 6,
    name: "Thailand Arabica",
    country: "Thailand",
    roast: "Medium Roast",
    roastValue: 45,
    weight: "250 g",
    price: 350,
    image: "images/thailand.jpg",
    description: "อาราบิก้าปลูกบนดอยทางภาคเหนือของไทย กลิ่นหอมอ่อนๆ รสชาติกลมกล่อม เปรี้ยวน้อย เหมาะกับคนเริ่มดื่มกาแฟดำ"
  }
];

/* =========================================================
   STATE
   ========================================================= */
let cart = [];          // [{ id, qty }]
let currentFilter = "all";

const CART_KEY = "bv_cart";

/* =========================================================
   CART: localStorage helpers
   ========================================================= */
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadCart() {
  const raw = localStorage.getItem(CART_KEY);
  cart = raw ? JSON.parse(raw) : [];
}

function addToCart(id, qty = 1) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart();
  updateCartBadge();
  renderToast("เพิ่มลงตะกร้าแล้ว");
}

function removeCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartBadge();
  renderCartView();
}

function updateQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeCart(id);
    return;
  }
  saveCart();
  updateCartBadge();
  renderCartView();
}

function calculateTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

function cartItemCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  document.getElementById("cartBadge").textContent = cartItemCount();
}

/* =========================================================
   VISUAL HELPERS (bean icon generated in CSS/SVG — no external images needed)
   ========================================================= */
const roastClassMap = {
  "Light Roast": "roast-light",
  "Medium Roast": "roast-medium",
  "Dark Roast": "roast-dark"
};

function beanSVG(size = 64) {
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true">
    <path d="M12 26c0-9 4-16 8-16s8 7 8 16-4 10-8 10-8-1-8-10z" fill="#FFF8E7"/>
    <path d="M20 11v18" stroke="#4E342E" stroke-width="1.6"/>
  </svg>`;
}

function originTag(country) {
  return `<span class="origin-tag">${country}</span>`;
}

function roastGauge(roastValue, roastLabel) {
  return `
    <div class="roast-gauge">
      <div class="roast-gauge-track">
        <div class="roast-gauge-marker" style="left:${roastValue}%"></div>
      </div>
      <div class="roast-gauge-label">
        <span>Light</span><span>Medium</span><span>Dark</span>
      </div>
    </div>`;
}

/* =========================================================
   RENDER: Product Card
   ========================================================= */
function productCardHTML(p) {
  const roastClass = roastClassMap[p.roast] || "roast-medium";
  return `
    <article class="product-card">
      <div class="product-visual ${roastClass}">
        ${originTag(p.country)}
        ${beanSVG(60)}
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <div class="product-meta">
          <span>${p.country}</span>
          <span>${p.roast}</span>
          <span>${p.weight}</span>
        </div>
        <div class="product-price">฿${p.price.toLocaleString()}</div>
        <div class="product-actions">
          <button class="btn btn-ghost" data-detail="${p.id}">ดูรายละเอียด</button>
          <button class="btn btn-primary" data-add="${p.id}">เพิ่มลงตะกร้า</button>
        </div>
      </div>
    </article>`;
}

/* =========================================================
   RENDER: Product Grids (home featured + products page)
   ========================================================= */
function loadProducts() {
  // Featured grid on home (first 6, or fewer if list is shorter)
  const featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid) {
    featuredGrid.innerHTML = products.slice(0, 6).map(productCardHTML).join("");
  }

  // Full products grid with filtering
  renderProductsGrid();
}

function renderProductsGrid() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  const filtered = currentFilter === "all"
    ? products
    : products.filter(p => p.roast === currentFilter);
  grid.innerHTML = filtered.length
    ? filtered.map(productCardHTML).join("")
    : `<p style="grid-column:1/-1;color:var(--brown-soft);">ไม่พบสินค้าในหมวดนี้</p>`;
}

/* =========================================================
   RENDER: Product Detail
   ========================================================= */
function showProductDetail(id) {
  window.location.hash = `#/product/${id}`;
}

function renderDetailView(id) {
  const product = products.find(p => p.id === Number(id));
  const wrap = document.getElementById("detailWrap");
  if (!product) {
    wrap.innerHTML = `<p>ไม่พบสินค้านี้</p>`;
    return;
  }
  const roastClass = roastClassMap[product.roast] || "roast-medium";

  wrap.innerHTML = `
    <a href="#/products" class="back-link">&larr; กลับไปหน้าสินค้าทั้งหมด</a>
    <div class="detail-grid">
      <div class="detail-visual ${roastClass}">
        ${beanSVG(130)}
      </div>
      <div class="detail-info">
        <h1>${product.name}</h1>
        <div class="detail-price">฿${product.price.toLocaleString()}</div>
        <div class="detail-meta-row">
          <span>ประเทศ: ${product.country}</span>
          <span>ระดับคั่ว: ${product.roast}</span>
          <span>ขนาด: ${product.weight}</span>
        </div>
        ${roastGauge(product.roastValue, product.roast)}
        <p class="detail-desc">${product.description}</p>
        <div class="detail-actions">
          <button class="btn btn-primary" data-add="${product.id}">เพิ่มลงตะกร้า</button>
          <a href="#/cart" class="btn btn-ghost">ไปที่ตะกร้า</a>
        </div>
      </div>
    </div>`;
}

/* =========================================================
   RENDER: Cart View
   ========================================================= */
function renderCartView() {
  const wrap = document.getElementById("cartWrap");
  if (!wrap) return;

  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <p>ยังไม่มีสินค้าในตะกร้าของคุณ</p>
        <a href="#/products" class="btn btn-primary" style="margin-top:1rem;">เลือกซื้อเมล็ดกาแฟ</a>
      </div>`;
    return;
  }

  const itemsHTML = cart.map(item => {
    const p = products.find(prod => prod.id === item.id);
    if (!p) return "";
    const roastClass = roastClassMap[p.roast] || "roast-medium";
    const lineTotal = p.price * item.qty;
    return `
      <div class="cart-item">
        <div class="cart-item-visual ${roastClass}">${beanSVG(32)}</div>
        <div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-unit">฿${p.price.toLocaleString()} / ${p.weight}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" data-decrease="${p.id}">&minus;</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-increase="${p.id}">&plus;</button>
        </div>
        <div style="text-align:right;">
          <div class="cart-item-total">฿${lineTotal.toLocaleString()}</div>
          <button class="remove-btn" data-remove="${p.id}">ลบ</button>
        </div>
      </div>`;
  }).join("");

  const total = calculateTotal();

  wrap.innerHTML = `
    ${itemsHTML}
    <div class="cart-summary">
      <div class="cart-summary-row"><span>จำนวนสินค้า</span><span>${cartItemCount()} ชิ้น</span></div>
      <div class="cart-summary-total"><span>ยอดรวมทั้งหมด</span><span>฿${total.toLocaleString()}</span></div>
      <a href="#/checkout" class="btn btn-primary btn-full">ดำเนินการสั่งซื้อ</a>
    </div>`;
}

/* =========================================================
   RENDER: Checkout View
   ========================================================= */
function renderCheckoutView() {
  const wrap = document.getElementById("checkoutWrap");
  if (!wrap) return;

  if (cart.length === 0) {
    wrap.innerHTML = `<p>ตะกร้าของคุณว่างเปล่า <a href="#/products" style="color:var(--green-deep);text-decoration:underline;">เลือกซื้อสินค้า</a></p>`;
    return;
  }

  const lines = cart.map(item => {
    const p = products.find(prod => prod.id === item.id);
    if (!p) return "";
    return `<div class="order-line"><span>${p.name} x${item.qty}</span><span>฿${(p.price * item.qty).toLocaleString()}</span></div>`;
  }).join("");

  const total = calculateTotal();

  wrap.innerHTML = `
    <form class="checkout-form" id="checkoutForm" novalidate>
      <div class="form-row">
        <label for="custName">ชื่อผู้สั่ง</label>
        <input type="text" id="custName" name="custName" required placeholder="กรอกชื่อ-นามสกุล">
        <span class="field-error">กรุณากรอกชื่อผู้สั่ง</span>
      </div>
      <div class="form-two-col">
        <div class="form-row">
          <label for="custPhone">เบอร์โทร</label>
          <input type="tel" id="custPhone" name="custPhone" required placeholder="08x-xxx-xxxx">
          <span class="field-error">กรุณากรอกเบอร์โทร</span>
        </div>
        <div class="form-row">
          <label for="custEmail">อีเมล</label>
          <input type="email" id="custEmail" name="custEmail" required placeholder="you@email.com">
          <span class="field-error">กรุณากรอกอีเมลให้ถูกต้อง</span>
        </div>
      </div>
      <div class="form-row">
        <label for="custAddress">ที่อยู่จัดส่ง</label>
        <textarea id="custAddress" name="custAddress" rows="3" required placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"></textarea>
        <span class="field-error">กรุณากรอกที่อยู่จัดส่ง</span>
      </div>
      <div class="form-row">
        <label>วิธีจัดส่ง</label>
        <div class="radio-group">
          <label class="radio-option"><input type="radio" name="shipping" value="standard" checked> จัดส่งมาตรฐาน (2-3 วัน)</label>
          <label class="radio-option"><input type="radio" name="shipping" value="express"> จัดส่งด่วน (1 วัน)</label>
        </div>
      </div>
      <div class="form-row">
        <label>วิธีชำระเงิน</label>
        <div class="radio-group">
          <label class="radio-option"><input type="radio" name="payment" value="cod" checked> เก็บเงินปลายทาง</label>
          <label class="radio-option"><input type="radio" name="payment" value="transfer"> โอนเงินผ่านบัญชี</label>
          <label class="radio-option"><input type="radio" name="payment" value="card"> บัตรเครดิต/เดบิต</label>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-full">ยืนยันการสั่งซื้อ</button>
    </form>

    <div class="order-summary">
      <h3>สรุปคำสั่งซื้อ</h3>
      ${lines}
      <div class="order-total"><span>รวมทั้งหมด</span><span>฿${total.toLocaleString()}</span></div>
    </div>`;

  document.getElementById("checkoutForm").addEventListener("submit", handleCheckoutSubmit);
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const form = e.target;
  let valid = true;

  ["custName", "custPhone", "custEmail", "custAddress"].forEach(id => {
    const field = form.querySelector(`#${id}`);
    const errorEl = field.parentElement.querySelector(".field-error");
    const isValid = field.checkValidity() && field.value.trim() !== "";
    errorEl.style.display = isValid ? "none" : "block";
    field.style.borderColor = isValid ? "" : "#b33";
    if (!isValid) valid = false;
  });

  if (!valid) return;

  checkout();
}

/* =========================================================
   CHECKOUT: finalize order
   ========================================================= */
function checkout() {
  showSuccessModal();
  cart = [];
  saveCart();
  updateCartBadge();
}

function showSuccessModal() {
  document.getElementById("successModal").classList.add("active");
}

function hideSuccessModal() {
  document.getElementById("successModal").classList.remove("active");
  window.location.hash = "#/home";
}

/* =========================================================
   TOAST (small feedback when adding to cart)
   ========================================================= */
let toastTimer = null;
function renderToast(message) {
  let toast = document.getElementById("bvToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "bvToast";
    toast.style.cssText = `
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      background:var(--brown-dark); color:var(--cream);
      padding:.7em 1.4em; border-radius:999px; font-size:.85rem;
      box-shadow:0 8px 24px rgba(0,0,0,0.2); z-index:200; opacity:0;
      transition:opacity .25s ease; font-family:'Prompt',sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.style.opacity = "0"; }, 1600);
}

/* =========================================================
   HERO ROUTE ANIMATION (origin dots + traveling bean)
   ========================================================= */
function initRouteAnimation() {
  const path = document.getElementById("routePath");
  const dotsGroup = document.getElementById("routeDots");
  const bean = document.getElementById("travelBean");
  if (!path || !dotsGroup || !bean) return;

  const length = path.getTotalLength();
  const stops = [0, 0.22, 0.45, 0.62, 0.8, 1];
  const labels = ["Ethiopia", "Kenya", "Colombia", "Brazil", "Guatemala", "Thailand"];

  dotsGroup.innerHTML = stops.map((t, i) => {
    const pt = path.getPointAtLength(t * length);
    return `<circle class="route-dot" cx="${pt.x}" cy="${pt.y}" r="4.5"></circle>
             <text class="route-dot-label" x="${pt.x}" y="${pt.y - 10}" text-anchor="middle">${labels[i]}</text>`;
  }).join("");

  let progress = 0;
  function animate() {
    progress += 0.0032;
    if (progress > 1) progress = 0;
    const pt = path.getPointAtLength(progress * length);
    bean.setAttribute("transform", `translate(${pt.x},${pt.y})`);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* =========================================================
   ROUTER
   ========================================================= */
function router() {
  const hash = window.location.hash || "#/home";
  const [, path, param] = hash.split("/"); // "#/product/3" -> ["#","product","3"]

  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active-link"));

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  switch (path) {
    case "products":
      document.getElementById("view-products").classList.add("active");
      setActiveNav("products");
      renderProductsGrid();
      break;
    case "product":
      document.getElementById("view-detail").classList.add("active");
      renderDetailView(param);
      break;
    case "cart":
      document.getElementById("view-cart").classList.add("active");
      setActiveNav("cart");
      renderCartView();
      break;
    case "checkout":
      document.getElementById("view-checkout").classList.add("active");
      renderCheckoutView();
      break;
    default:
      document.getElementById("view-home").classList.add("active");
      setActiveNav("home");
      break;
  }

  closeMobileNav();
}

function setActiveNav(route) {
  const link = document.querySelector(`.nav-links a[data-route="${route}"]`);
  if (link) link.classList.add("active-link");
}

function closeMobileNav() {
  document.getElementById("navLinks").classList.remove("open");
}

/* =========================================================
   EVENT DELEGATION (product actions, cart actions)
   ========================================================= */
document.addEventListener("click", (e) => {
  const detailBtn = e.target.closest("[data-detail]");
  if (detailBtn) {
    showProductDetail(Number(detailBtn.dataset.detail));
    return;
  }

  const addBtn = e.target.closest("[data-add]");
  if (addBtn) {
    addToCart(Number(addBtn.dataset.add));
    return;
  }

  const incBtn = e.target.closest("[data-increase]");
  if (incBtn) {
    updateQuantity(Number(incBtn.dataset.increase), 1);
    return;
  }

  const decBtn = e.target.closest("[data-decrease]");
  if (decBtn) {
    updateQuantity(Number(decBtn.dataset.decrease), -1);
    return;
  }

  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) {
    removeCart(Number(removeBtn.dataset.remove));
    return;
  }

  const filterChip = e.target.closest("[data-filter]");
  if (filterChip) {
    document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
    filterChip.classList.add("active");
    currentFilter = filterChip.dataset.filter;
    renderProductsGrid();
    return;
  }

  if (e.target.id === "closeModalBtn") {
    hideSuccessModal();
    return;
  }

  if (e.target === document.getElementById("successModal")) {
    hideSuccessModal();
    return;
  }
});

document.getElementById("navToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

window.addEventListener("hashchange", router);

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  updateCartBadge();
  loadProducts();
  router();
  initRouteAnimation();
});
