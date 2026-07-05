const NEQUI_NUMBER = '304 606 81 13';
const WHATSAPP_NUMBER = '573046068113';

const products = [
  {
    id: 1,
    name: 'Camiseta versátil de moda con estampado de gato de bolsillo',
    originalPrice: 59000,
    price: 35000,
    rating: 4.8,
    reviewCount: 234,
    description: 'Camiseta de alta calidad con estampado único de gatito en el bolsillo frontal. Confeccionada en algodón suave y transpirable, ideal para el día a día. Cuello redondo reforzado, costuras resistentes y corte recto que favorece todo tipo de cuerpo. Fácil de combinar con jeans, shorts o faldas. Disponible en varias tallas. Lavable a máquina sin perder su forma ni color.',
    images: [
      '/img/camisetas/image.webp',
      '/img/camisetas/camiseta.webp',
      '/img/camisetas/camiseta2.webp',
    ],
  },
  {
    id: 2,
    name: 'Camiseta de manga corta para hombre Dragón',
    originalPrice: 61900,
    price: 34900,
    rating: 4.6,
    reviewCount: 189,
    description: 'Camiseta de manga corta con llamativo estampado completo de dragón chino en colores de contraste. Confeccionada en tela suave y fresca, perfecta para el verano. Cuello redondo clásico, mangas cortas con costuras reforzadas y dobladillo duradero. Estilo moderno y versátil que funciona tanto para looks casuales como para ocasiones especiales. Un excelente regalo para los amantes de la cultura asiática y el diseño único. Lavar en frío recomendado.',
    images: [
      '/img/camisetas/camiseta3.webp',
      '/img/camisetas/camiseta4.webp',
    ],
  },
  {
    id: 3,
    name: 'Camiseta de hombre estilo americano moderno',
    originalPrice: 129900,
    price: 38900,
    rating: 4.7,
    reviewCount: 312,
    description: 'Camiseta de hombre con estilo americano moderno, diseño minimalista y corte contemporáneo. Confeccionada en algodón premium de alta gramaje para mayor durabilidad y confort. Costuras dobles en mangas y laterales, cuello reforzado que no se deforma con los lavados. Ideal para uso diario, oficina o salidas casuales. Disponible en多种 colores clásicos. Tela anti-pilling que mantiene su aspecto impecable lavado tras lavado.',
    images: [
      '/img/camisetas/camiseta5.webp',
      '/img/camisetas/camiseta6.webp',
      '/img/camisetas/camiseta7.webp',
    ],
  },
  {
    id: 4,
    name: 'Audifonos inalámbricos con cable',
    originalPrice: 219900,
    price: 35900,
    rating: 4.5,
    reviewCount: 156,
    description: 'Reloj inteligente deportivo con pantalla táctil HD a color. Monitoreo las 24 horas de frecuencia cardíaca, oxímetro de sangre (SpO2), análisis de sueño y medición de estrés. Más de 100 modos deportivos incluyendo running, natación, ciclismo y yoga. Resistente al agua IP68. Batería de larga duración hasta 15 días en uso normal. Compatible con Android y iOS. Incluye notificaciones de llamadas, mensajes y redes sociales. Podómetro, calorímetro y recordatorio de actividad sedentaria integrados.',
    images: [
      '/img/tecnologia/image1.webp',
      '/img/tecnologia/image2.webp',
    ],
  },
  {
    id: 5,
    name: 'bocchi Camiseta negra',
    originalPrice: 79900,
    price: 33000,
    rating: 4.9,
    reviewCount: 445,
    description: 'Camiseta premium confeccionada en algodón peinado 100% de alta calidad. Tejido de 180 gramos que brinda la combinación perfecta entre suavidad y durabilidad. Corte moderno y entallado que estiliza la figura. Costuras reforzadas en todos los puntos de tensión, cuello ribeteado que mantiene su forma original. Libre de químicos irritantes, hipoalergénica y transpirable. Disponible en múltiples tallas. Resistente a múltiples lavados sin encogerse ni destejerse. Hecha con procesos de producción sostenibles.',
    images: [
      '/img/camisetas/camiseta8.webp',
      '/img/camisetas/camiseta9.webp',
    ],
  },
  {
    id: 6,
    name: 'LCamiseta de estilo de terror anime',
    originalPrice: 99900,
    price: 30000,
    rating: 4.4,
    reviewCount: 98,
    description: 'Lámpara LED inteligente con control desde app móvil compatible con iOS y Android. Más de 16 millones de colores para crear el ambiente perfecto en cualquier habitación. Sincronización con música en tiempo real gracias a su micrófono integrado — las luces bailan al ritmo de tu playlist favorita. Modos preestablecidos: lectura, descanso, fiesta y atardecer. Temporizador programable y control por voz compatible con asistentes virtuales. Fácil instalación, solo rosca en un socket estándar E27. Iluminación suave sin parpadeo que cuida tu vista.',
    images: [
      '/img/camisetas/camiseta10.webp',
      '/img/camisetas/camiseta11.webp',
    ],
  },
  {
    id: 7,
    name: 'Polo de moda de manga corta para hombre',
    originalPrice: 159900,
    price: 35000,
    rating: 4.7,
    reviewCount: 267,
    description: 'Kit completo de maquillaje profesional con 48 piezas ideal tanto para principiantes como para expertas. Incluye paleta de 32 sombras con acabados mate, brillante y satinado, 8 labiales de larga duración, 6 brochas profesionales con cerdas suaves y un espejo de bolsillo. Los pigmentos son altamente concentrados para máxima intensidad de color con mínima aplicación. Fórmula hipoalergénica libre de parabenos y fragancias. Estuche compacto con organizador integrado, perfecto para llevar a cualquier lugar. Crea desde looks naturales hasta maquillajes artísticos.',
    images: [
      '/img/camisetas/camiseta12.webp',
      '/img/camisetas/camiseta13.webp',
    ],
  },
  {
    id: 8,
    name: 'Polo de moda de manga corta para hombre Verde',
    originalPrice: 89900,
    price: 36900,
    rating: 4.6,
    reviewCount: 203,
    description: 'Cargador inalámbrico 3 en 1 con diseño compacto y elegante perfecto para tu mesa de noche o escritorio. Carga simultáneamente tu teléfono inteligente (compatible con carga rápida Qi hasta 15W), tus auriculares Bluetooth y tu reloj inteligente. Tecnología de detección inteligente de objetos extraños, protección contra sobrecarga, sobrecalentamiento y cortocircuitos. Base antideslizante con LED indicador de estado. Compatible con todas las fundas delgadas (menos de 5mm). Incluye adaptador de corriente USB-C de 30W. Diseño minimalista que combina con cualquier decoración.',
    images: [
      '/img/camisetas/camiseta14.webp',
      '/img/camisetas/camiseta15.webp',
    ],
  },
];

let cart = [];

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
  showToast('Producto agregado al carrito', 'success');
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  updateCartBadge();
  renderCart();
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

let carouselStates = new Map();

function renderProducts(list) {
  const data = list || products;
  const grid = document.getElementById('products-grid');
  grid.innerHTML = data
    .map(
      (p) => `
      <div class="product-card" data-id="${p.id}">
        <span class="discount-badge">-${calcDiscount(p.originalPrice, p.price)}%</span>
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
          <h3 class="product-name">${p.name}</h3>
          <p class="product-description">${p.description}</p>
          <div class="product-rating">${renderStars(p.rating)} <span class="rating-count">(${p.reviewCount})</span></div>
          <div class="product-pricing">
            <span class="product-price">${formatPrice(p.price)}</span>
            <span class="product-original-price">${formatPrice(p.originalPrice)}</span>
            <span class="product-discount-text">-${calcDiscount(p.originalPrice, p.price)}%</span>
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
      <div class="modal-rating">${renderStars(product.rating)} <span class="rating-count">${product.rating} (${product.reviewCount} reseñas)</span></div>
      <div class="modal-pricing">
        <span class="modal-product-price">${formatPrice(product.price)}</span>
        <span class="modal-original-price">${formatPrice(product.originalPrice)}</span>
        <span class="modal-discount-text">-${calcDiscount(product.originalPrice, product.price)}%</span>
      </div>
      <p class="modal-product-description">${product.description}</p>

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

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

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
  toast.textContent = message;
  toast.className = 'toast show' + (type === 'success' ? ' success' : '');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
