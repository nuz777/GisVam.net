import { db } from './firebase-config.js';
import { ref, push, get, child } from 'firebase/database';

const NEQUI_NUMBER = '304 606 81 13';
const WHATSAPP_NUMBER = '573046068113';

let allReviews = {};
let currentModalProductId = null;
let selectedRating = 0;

async function loadProducts() {
  try {
    const res = await fetch('/products.json');
    if (!res.ok) throw new Error('No se pudieron cargar los productos');
    products = await res.json();
  } catch (err) {
    console.error('Error loading products:', err);
    products = [];
  }
}

let products = [];

function loadCart() {
  try {
    const data = localStorage.getItem('minaShop_cart');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveCart() {
  localStorage.setItem('minaShop_cart', JSON.stringify(cart));
}

let cart = loadCart();

function formatPrice(amount) {
  return '$' + amount.toLocaleString('es-CO');
}

function addToCart(productId) {
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  updateCartBadge();
  renderCart();
  saveCart();
  const cartBtn = document.getElementById('cart-btn');
  cartBtn.classList.remove('cart-bounce');
  void cartBtn.offsetWidth;
  cartBtn.classList.add('cart-bounce');
  showToast('Producto agregado al carrito', 'success');
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  updateCartBadge();
  renderCart();
  saveCart();
}

function updateCartQuantity(productId, delta) {
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCartBadge();
  renderCart();
  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  const totalEl = document.getElementById('cart-total');

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">El carrito está vacío</p>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return '';
      return `
        <div class="cart-item">
          <img class="cart-item-img" src="${product.images[0]}" alt="${product.name}" loading="lazy">
          <div class="cart-item-info">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">${formatPrice(product.price)}</div>
            <div class="cart-item-controls">
              <button class="cart-item-qty-btn" data-cart-dec="${product.id}">−</button>
              <span class="cart-item-qty">${item.quantity}</span>
              <button class="cart-item-qty-btn" data-cart-inc="${product.id}">+</button>
              <button class="cart-item-remove" data-cart-remove="${product.id}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  totalEl.textContent = formatPrice(getCartTotal());

  container.querySelectorAll('[data-cart-inc]').forEach((btn) => {
    btn.addEventListener('click', () => updateCartQuantity(Number(btn.dataset.cartInc), 1));
  });
  container.querySelectorAll('[data-cart-dec]').forEach((btn) => {
    btn.addEventListener('click', () => updateCartQuantity(Number(btn.dataset.cartDec), -1));
  });
  container.querySelectorAll('[data-cart-remove]').forEach((btn) => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.cartRemove)));
  });
}

function toggleCart(open) {
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  panel.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function calcDiscount(original, current) {
  return Math.round((1 - current / original) * 100);
}

function getSecondsToMidnight() {
  const now = new Date();
  return Math.floor((24 * 60 * 60 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds())));
}

function formatCountdown(totalSec) {
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function updateDealTimers() {
  const secs = getSecondsToMidnight();
  const text = formatCountdown(secs);
  document.querySelectorAll('.deal-timer-display').forEach((el) => {
    el.textContent = text;
  });
}

function renderStars(rating) {
  let html = '<span class="stars">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += '<span class="star star-filled">★</span>';
    } else if (i === Math.floor(rating) + 1 && rating % 1 >= 0.3) {
      html += '<span class="star star-half">★</span>';
    } else {
      html += '<span class="star star-empty">★</span>';
    }
  }
  html += '</span>';
  return html;
}

function renderInteractiveStars(current) {
  let html = '<span class="interactive-stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star-interactive${i <= current ? ' active' : ''}" data-star="${i}">★</span>`;
  }
  html += '</span>';
  return html;
}

//admin de fechas

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const day = d.getDate();
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

async function loadAllReviews() {
  try {
    const snap = await get(ref(db, 'reviews'));
    if (snap.exists()) {
      allReviews = snap.val();
    } else {
      allReviews = {};
    }
  } catch (err) {
    console.error('Error loading reviews:', err);
    allReviews = {};
  }
}

function getReviewStats(productId) {
  const reviews = allReviews[productId];
  if (!reviews) return { avg: 0, count: 0 };
  const arr = Object.values(reviews);
  if (arr.length === 0) return { avg: 0, count: 0 };
  const sum = arr.reduce((s, r) => s + r.rating, 0);
  return { avg: Math.round((sum / arr.length) * 10) / 10, count: arr.length };
}

function getEffectiveRating(product) {
  const stats = getReviewStats(product.id);
  if (stats.count === 0) return { rating: product.rating, reviewCount: product.reviewCount };
  return { rating: stats.avg, reviewCount: stats.count };
}

async function submitReview(productId, name, rating, comment) {
  await push(ref(db, `reviews/${productId}`), {
    name: name.trim(),
    rating,
    comment: comment.trim(),
    date: Date.now()
  });
  await loadAllReviews();
}

function renderReviewsList(productId) {
  const reviews = allReviews[productId];
  if (!reviews) return '<p class="reviews-empty">No hay reseñas aún. Sé el primero en comentar.</p>';
  const arr = Object.values(reviews).sort((a, b) => b.date - a.date);
  return arr.map(r => `
    <div class="review-card">
      <div class="review-card-header">
        <span class="review-card-name">${r.name}</span>
        <span class="review-card-date">${formatDate(r.date)}</span>
      </div>
      <div class="review-card-stars">${renderStars(r.rating)}</div>
      <p class="review-card-text">${r.comment}</p>
    </div>
  `).join('');
}

function renderReviewForm(productId) {
  return `
    <form class="review-form" id="review-form">
      <input type="text" class="review-input" id="review-name" placeholder="Tu nombre" maxlength="40" required>
      <div class="review-rating-row">
        <label class="review-rating-label">Calificación</label>
        <div class="review-form-stars" id="review-stars">${renderInteractiveStars(0)}</div>
      </div>
      <textarea class="review-input review-textarea" id="review-comment" placeholder="Escribe tu reseña..." maxlength="500" rows="3" required></textarea>
      <button type="submit" class="review-submit-btn" id="review-submit">Publicar reseña</button>
    </form>
  `;
}

function bindReviewForm(productId) {
  const form = document.getElementById('review-form');
  const starsContainer = document.getElementById('review-stars');
  if (!form || !starsContainer) return;

  selectedRating = 0;
  let lastHover = 0;

  starsContainer.addEventListener('click', (e) => {
    const star = e.target.closest('.star-interactive');
    if (!star) return;
    selectedRating = Number(star.dataset.star);
    lastHover = selectedRating;
    starsContainer.innerHTML = renderInteractiveStars(selectedRating);
    const clickedStar = starsContainer.querySelector(`.star-interactive[data-star="${selectedRating}"]`);
    if (clickedStar) {
      clickedStar.classList.add('star-active-pop');
    }
  });

  starsContainer.addEventListener('mouseover', (e) => {
    const star = e.target.closest('.star-interactive');
    if (!star) return;
    const hoverVal = Number(star.dataset.star);
    if (hoverVal === lastHover) return;
    lastHover = hoverVal;
    starsContainer.innerHTML = renderInteractiveStars(hoverVal);
  });

  starsContainer.addEventListener('mouseleave', () => {
    lastHover = 0;
    starsContainer.innerHTML = renderInteractiveStars(selectedRating);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('review-name').value.trim();
    const comment = document.getElementById('review-comment').value.trim();

    if (!name) { showToast('Escribe tu nombre', 'error'); return; }
    if (selectedRating === 0) { showToast('Selecciona una calificación', 'error'); return; }
    if (!comment) { showToast('Escribe un comentario', 'error'); return; }

    const btn = document.getElementById('review-submit');
    btn.disabled = true;
    btn.textContent = 'Publicando...';

    try {
      await submitReview(productId, name, selectedRating, comment);
      const stats = getReviewStats(productId);
      const section = document.getElementById('reviews-section');
      if (section) {
        section.innerHTML = `
          <div class="reviews-summary">
            <span class="reviews-avg updated">${stats.avg}</span>
            <span class="reviews-avg-label">${renderStars(stats.avg)} <span class="rating-count">${stats.count} reseña${stats.count !== 1 ? 's' : ''}</span></span>
          </div>
          ${renderReviewForm(productId)}
          <div class="reviews-list">${renderReviewsList(productId)}</div>
        `;
        bindReviewForm(productId);
      }
      updateCardRating(productId);
      showToast('¡Reseña publicada!', 'success');
    } catch (err) {
      console.error('Error submitting review:', err);
      showToast('Error al publicar. Intenta de nuevo.', 'error');
      btn.disabled = false;
      btn.textContent = 'Publicar reseña';
    }
  });
}

function updateCardRating(productId) {
  const stats = getReviewStats(productId);
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const effective = stats.count > 0
    ? { rating: stats.avg, reviewCount: stats.count }
    : { rating: product.rating, reviewCount: product.reviewCount };

  const card = document.querySelector(`.product-card[data-id="${productId}"]`);
  if (!card) return;
  const ratingEl = card.querySelector('.product-rating');
  if (ratingEl) {
    ratingEl.innerHTML = `${renderStars(effective.rating)} <span class="rating-count">(${effective.reviewCount})</span>`;
  }
}

let carouselStates = new Map();

function renderProducts(list) {
  const data = list || products;
  const grid = document.getElementById('products-grid');
  grid.innerHTML = data
    .map(
      (p) => `
      <div class="product-card" data-id="${p.id}">
        <span class="discount-badge">-${calcDiscount(p.originalPrice, p.deal ? p.deal.flashPrice : p.price)}%</span>
        <div class="carousel" data-product-id="${p.id}">
          <div class="carousel-track" id="track-${p.id}">
            ${p.images
              .map(
                (img, i) =>
                  `<div class="carousel-slide">
                <img src="${img}" alt="${p.name} - imagen ${i + 1}" width="400" height="400" loading="lazy" onerror="this.parentElement.innerHTML='<div class=img-placeholder>📷</div>'">
              </div>`
              )
              .join('')}
          </div>
          ${p.images.length > 1
            ? `
            <button class="carousel-btn carousel-prev" data-action="prev" data-id="${p.id}" aria-label="Anterior">&lsaquo;</button>
            <button class="carousel-btn carousel-next" data-action="next" data-id="${p.id}" aria-label="Siguiente">&rsaquo;</button>
            <div class="carousel-dots">
              ${p.images
                .map(
                  (_, i) =>
                    `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-dot="${i}" data-id="${p.id}" aria-label="Imagen ${i + 1}"></button>`
                )
                .join('')}
            </div>
            `
            : ''}
        </div>
        <div class="product-info">
          ${p.deal ? `
          <div class="deal-banner deal-banner--card">
            <div class="deal-head">
              <span class="deal-icon">🔥</span>
              <span class="deal-label">HOY</span>
              <span class="deal-flash-price">${formatPrice(p.deal.flashPrice)}</span>
            </div>
            <div class="deal-timer" data-timer-id="${p.id}">
              <span class="deal-timer-label">Termina en</span>
              <span class="deal-timer-display" id="timer-${p.id}">--:--:--</span>
            </div>
          </div>
          ` : ''}
          <h3 class="product-name">${p.name}</h3>
          <p class="product-description">${p.description}</p>
          ${p.size ? `<div class="size-badge">Talla ${p.size}</div>` : ''}
          <div class="product-rating" data-rating-id="${p.id}">${renderStars(getEffectiveRating(p).rating)} <span class="rating-count">(${getEffectiveRating(p).reviewCount})</span></div>
          <div class="product-pricing">
            <span class="product-price${p.deal ? ' deal-price' : ''}">${formatPrice(p.deal ? p.deal.flashPrice : p.price)}</span>
            <span class="product-original-price">${formatPrice(p.originalPrice)}</span>
            <span class="product-discount-text">-${calcDiscount(p.originalPrice, p.deal ? p.deal.flashPrice : p.price)}%</span>
          </div>
          <div class="product-actions">
            <button class="buy-btn" data-buy="${p.id}">Comprar ahora</button>
            <button class="add-cart-btn" data-cart-add="${p.id}">+ Agregar</button>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  data.forEach((p) => carouselStates.set(p.id, 0));

  bindCarouselEvents();
  bindBuyEvents();
}

function bindCarouselEvents() {
  document.querySelectorAll('.carousel-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      const state = carouselStates.get(id);
      const product = products.find((p) => p.id === id);
      if (!product) return;
      const max = product.images.length - 1;
      let next = action === 'next' ? state + 1 : state - 1;
      if (next < 0) next = max;
      if (next > max) next = 0;
      carouselStates.set(id, next);
      updateCarousel(id, next);
    });
  });

  document.querySelectorAll('.carousel-dot').forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(dot.dataset.id);
      const idx = Number(dot.dataset.dot);
      carouselStates.set(id, idx);
      updateCarousel(id, idx);
    });
  });

  document.querySelectorAll('.carousel').forEach((carousel) => {
    enableSwipe(carousel,
      () => {
        const btn = carousel.querySelector('.carousel-next');
        if (btn) btn.click();
      },
      () => {
        const btn = carousel.querySelector('.carousel-prev');
        if (btn) btn.click();
      }
    );
  });
}

function enableSwipe(el, onLeft, onRight) {
  let startX = 0;
  let startY = 0;

  el.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) onRight();
    else onLeft();
  }, { passive: true });
}

function updateCarousel(id, index) {
  const track = document.getElementById(`track-${id}`);
  if (!track) return;
  track.style.transform = `translateX(-${index * 100}%)`;

  const dots = document.querySelectorAll(`.carousel-dot[data-id="${id}"]`);
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}

function bindBuyEvents() {
  document.querySelectorAll('[data-buy]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.buy);
      const product = products.find((p) => p.id === id);
      if (product) openBuyModal(product);
    });
  });

  document.getElementById('products-grid').addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    const card = e.target.closest('.product-card');
    if (!card) return;
    const id = Number(card.dataset.id);
    const product = products.find((p) => p.id === id);
    if (product) openBuyModal(product);
  });
}

let modalCarouselIndex = 0;

function openBuyModal(product) {
  const modal = document.getElementById('buy-modal');
  const body = document.getElementById('modal-body');
  modalCarouselIndex = 0;

  const slidesHtml = product.images
    .map(
      (img, i) =>
        `<div class="carousel-slide">
          <img src="${img}" alt="${product.name} - imagen ${i + 1}" loading="lazy" onerror="this.innerHTML='<div class=img-placeholder>📷</div>'">
        </div>`
    )
    .join('');

  const thumbnailsHtml = product.images
    .map(
      (img, i) =>
        `<button class="modal-thumb${i === 0 ? ' active' : ''}" data-thumb="${i}">
          <img src="${img}" alt="${product.name} - miniatura ${i + 1}">
        </button>`
    )
    .join('');

  body.innerHTML = `
    <div class="modal-gallery">
      <div class="carousel carousel-modal" data-modal-carousel>
        <div class="carousel-track" id="modal-track">
          ${slidesHtml}
        </div>
        ${product.images.length > 1
          ? `
          <button class="carousel-btn carousel-prev" data-modal-prev aria-label="Anterior">&lsaquo;</button>
          <button class="carousel-btn carousel-next" data-modal-next aria-label="Siguiente">&rsaquo;</button>
          `
          : ''}
      </div>
      ${product.images.length > 1
        ? `<div class="modal-thumbnails">${thumbnailsHtml}</div>`
        : ''}
    </div>
    <div class="modal-content">
      <h2 class="modal-product-name">${product.name}</h2>
      ${product.size ? `<div class="size-badge">Talla ${product.size}</div>` : ''}
      <div class="modal-rating" id="modal-rating-display">${renderStars(getEffectiveRating(product).rating)} <span class="rating-count">${getEffectiveRating(product).rating} (${getEffectiveRating(product).reviewCount} reseñas)</span></div>
      <div class="modal-pricing">
        <span class="modal-product-price${product.deal ? ' deal-price' : ''}">${formatPrice(product.deal ? product.deal.flashPrice : product.price)}</span>
        <span class="modal-original-price">${formatPrice(product.originalPrice)}</span>
        <span class="modal-discount-text">-${calcDiscount(product.originalPrice, product.deal ? product.deal.flashPrice : product.price)}%</span>
      </div>
      ${product.deal ? `
      <div class="deal-banner" style="margin-bottom:14px">
        <div class="deal-head">
          <span class="deal-icon">🔥</span>
          <span class="deal-label">HOY</span>
          <span class="deal-flash-price">${formatPrice(product.deal.flashPrice)}</span>
        </div>
        <div class="deal-timer" data-timer-id="${product.id}">
          <span class="deal-timer-label">Termina en</span>
          <span class="deal-timer-display" id="timer-${product.id}">--:--:--</span>
        </div>
      </div>
      ` : ''}
      <p class="modal-product-description">${product.description}</p>

      <div class="modal-divider"></div>

      <p class="modal-section-title">Reseñas</p>
      <div id="reviews-section">
        <p class="reviews-loading">Cargando reseñas...</p>
      </div>

      <div class="modal-divider"></div>

      <p class="modal-section-title">Datos de pago</p>
      <div class="nequi-box">
        <p class="nequi-label">Número de Nequi</p>
        <p class="nequi-number" id="nequi-display">${NEQUI_NUMBER}</p>
        <button class="copy-btn" id="copy-nequi">📋 Copiar número</button>
      </div>

      <button class="whatsapp-btn" id="whatsapp-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Contactar por WhatsApp
      </button>

      <p class="modal-footer-text">Después del pago, envíanos el comprobante por WhatsApp</p>
    </div>
  `;

  document.getElementById('modal-cart-float').innerHTML = `
    <button class="add-cart-btn modal-float-btn" data-cart-add="${product.id}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      Agregar al carrito
    </button>
  `;
  document.getElementById('modal-cart-float').classList.add('has-float');

  modal.classList.add('open');

  bindModalCarousel(product);
  document.getElementById('copy-nequi').addEventListener('click', () => {
    const cleanNum = NEQUI_NUMBER.replace(/\s/g, '');
    navigator.clipboard.writeText(cleanNum).then(() => {
      const btn = document.getElementById('copy-nequi');
      btn.textContent = '✅ ¡Copiado!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '📋 Copiar número';
        btn.classList.remove('copied');
      }, 2500);
    }).catch(() => {
      showToast('No se pudo copiar, copia manual: ' + NEQUI_NUMBER, 'error');
    });
  });

  document.getElementById('whatsapp-btn').addEventListener('click', () => {
    const msg = encodeURIComponent(
      `Hola! Quiero comprar *${product.name}* por ${formatPrice(product.price)}. ¿Cómo hago para pagarlo? 🙌`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  });

  currentModalProductId = product.id;
  const stats = getReviewStats(product.id);
  const section = document.getElementById('reviews-section');
  if (section) {
    section.innerHTML = `
      <div class="reviews-summary">
        <span class="reviews-avg">${stats.count > 0 ? stats.avg : '--'}</span>
        <span class="reviews-avg-label">${stats.count > 0 ? renderStars(stats.avg) : ''} <span class="rating-count">${stats.count} reseña${stats.count !== 1 ? 's' : ''}</span></span>
      </div>
      ${renderReviewForm(product.id)}
      <div class="reviews-list">${renderReviewsList(product.id)}</div>
    `;
    bindReviewForm(product.id);
  }
}

function bindModalCarousel(product) {
  const track = document.getElementById('modal-track');
  if (!track) return;

  function update(index) {
    modalCarouselIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    const gallery = track.closest('.modal-gallery');
    if (gallery) {
      const thumbs = gallery.querySelectorAll('.modal-thumb');
      thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
    }
  }

  const prev = document.querySelector('[data-modal-prev]');
  const next = document.querySelector('[data-modal-next]');

  if (prev) {
    prev.addEventListener('click', () => {
      let i = modalCarouselIndex - 1;
      if (i < 0) i = product.images.length - 1;
      update(i);
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      let i = modalCarouselIndex + 1;
      if (i >= product.images.length) i = 0;
      update(i);
    });
  }

  document.querySelectorAll('.modal-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      update(Number(thumb.dataset.thumb));
    });
  });

  const modalCarousel = document.querySelector('[data-modal-carousel]');
  if (modalCarousel) {
    enableSwipe(modalCarousel,
      () => {
        const nextBtn = document.querySelector('[data-modal-next]');
        if (nextBtn) nextBtn.click();
      },
      () => {
        const prevBtn = document.querySelector('[data-modal-prev]');
        if (prevBtn) prevBtn.click();
      }
    );
  }
}

function closeModal() {
  document.getElementById('buy-modal').classList.remove('open');
}

function initTheme() {
  const saved = localStorage.getItem('minaShop_theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('minaShop_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  await loadProducts();
  await loadAllReviews();
  renderProducts();
  updateDealTimers();
  setInterval(updateDealTimers, 1000);

  if (!sessionStorage.getItem('welcomeDismissed')) {
    document.getElementById('welcome-modal').classList.add('open');
  }
  document.getElementById('welcome-close').addEventListener('click', () => {
    document.getElementById('welcome-modal').classList.remove('open');
    sessionStorage.setItem('welcomeDismissed', '1');
  });
  document.getElementById('welcome-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('welcome-modal').classList.remove('open');
      sessionStorage.setItem('welcomeDismissed', '1');
    }
  });

  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  function doSearch() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      renderProducts();
      return;
    }
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    renderProducts(filtered);
  }

  searchInput.addEventListener('input', doSearch);
  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  document.getElementById('modal-close').addEventListener('click', closeModal);

  document.getElementById('buy-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      const grid = document.getElementById('products-grid');
      grid.classList.toggle('list-view', view === 'list');
    });
  });

  document.getElementById('cart-btn').addEventListener('click', () => toggleCart(true));
  document.getElementById('cart-close').addEventListener('click', () => toggleCart(false));
  document.getElementById('cart-overlay').addEventListener('click', () => toggleCart(false));

  document.getElementById('cart-checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) return;
    const items = cart
      .map((item) => {
        const p = products.find((prod) => prod.id === item.productId);
        if (!p) return '';
        return `• ${item.quantity}x ${p.name} - ${formatPrice(p.price * item.quantity)}`;
      })
      .join('\n');
    const total = formatPrice(getCartTotal());
    const msg = encodeURIComponent(
      `Hola! Quiero comprar:\n${items}\n\nTotal: ${total}\n¿Cómo hago para pagarlo? 🙌`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  });

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-cart-add]');
    if (addBtn) {
      e.stopPropagation();
      addToCart(Number(addBtn.dataset.cartAdd));
    }
  });

  updateCartBadge();
  renderCart();
});

function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.className = 'toast show' + (type === 'success' ? ' success' : '');
  toast.innerHTML = type === 'success'
    ? '<span class="toast-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>' + message
    : message;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
