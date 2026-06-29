/* ============================================================
   app.js — shared cart storage + helpers (used on every page)
   ============================================================ */

const CART_KEY = 'tagged_cart_v1';
const TAX_RATE = 0.08; // 8% flat tax, shown on the cart receipt

/* ---------- Cart storage (localStorage) ---------- */

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage || 0,
      thumbnail: product.thumbnail,
      brand: product.brand || '',
      qty,
    });
  }
  saveCart(cart);
}

function updateQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((item) => item.id !== id);
  } else {
    const item = cart.find((i) => i.id === id);
    if (item) item.qty = qty;
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  return cart;
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function discountedPrice(price, pct) {
  return price - (price * pct) / 100;
}

function cartTotals() {
  const cart = getCart();
  let subtotal = 0;
  let originalTotal = 0;
  cart.forEach((item) => {
    const unit = discountedPrice(item.price, item.discountPercentage);
    subtotal += unit * item.qty;
    originalTotal += item.price * item.qty;
  });
  const savings = originalTotal - subtotal;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  return { subtotal, originalTotal, savings, tax, total, itemCount: cart.reduce((s, i) => s + i.qty, 0) };
}

/* ---------- Shared UI bits ---------- */

function updateCartBadge() {
  const badge = document.querySelector('.cart-count');
  if (badge) badge.textContent = cartCount();
}

function money(n) {
  return '$' + n.toFixed(2);
}

function starString(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function showToast(message, linkHref, linkText) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = message;
  toast.appendChild(span);
  if (linkHref) {
    const a = document.createElement('a');
    a.href = linkHref;
    a.textContent = linkText || 'View';
    toast.appendChild(a);
  }
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
