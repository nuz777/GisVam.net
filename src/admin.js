const ADMIN_PASSWORD = 'minashop2026';
const GITHUB_REPO = 'nuz777/GisVam.net';
const GITHUB_FILE = 'public/products.json';

let adminToken = localStorage.getItem('minashop_admin_token');
let logoTapCount = 0;
let logoTapTimer = null;
let logoNavTimeout = null;
let adminProducts = [];
let adminSha = null;

function initAdminTap() {
  document.querySelectorAll('.logo').forEach((logo) => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      logoTapCount++;
      clearTimeout(logoTapTimer);
      clearTimeout(logoNavTimeout);
      logoTapTimer = setTimeout(() => { logoTapCount = 0; }, 5000);

      if (logoTapCount >= 6) {
        logoTapCount = 0;
        e.stopPropagation();
        openAdmin();
      } else {
        const href = logo.getAttribute('href') || '/';
        logoNavTimeout = setTimeout(() => { window.location.href = href; }, 300);
      }
    });
  });
}

function promptPassword() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.innerHTML = `
      <div class="admin-modal">
        <h3>Panel de Admin</h3>
        <p>Ingresa la contrasena:</p>
        <input type="password" id="admin-pw-input" placeholder="Contrasena" autocomplete="off">
        <div class="admin-modal-actions">
          <button class="admin-btn admin-btn-cancel" id="admin-pw-cancel">Cancelar</button>
          <button class="admin-btn admin-btn-primary" id="admin-pw-submit">Entrar</button>
        </div>
        <p class="admin-error" id="admin-pw-error"></p>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById('admin-pw-input');
    setTimeout(() => input.focus(), 100);

    document.getElementById('admin-pw-cancel').onclick = () => { overlay.remove(); resolve(false); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.remove(); resolve(false); } });

    document.getElementById('admin-pw-submit').onclick = () => {
      if (input.value === ADMIN_PASSWORD) {
        overlay.remove();
        resolve(true);
      } else {
        document.getElementById('admin-pw-error').textContent = 'Contrasena incorrecta';
        input.value = '';
        input.focus();
      }
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('admin-pw-submit').click();
      if (e.key === 'Escape') { overlay.remove(); resolve(false); }
    });
  });
}

function promptToken() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    overlay.innerHTML = `
      <div class="admin-modal">
        <h3>GitHub Token</h3>
        <p>Ingresa tu Personal Access Token de GitHub:</p>
        <input type="password" id="admin-token-input" placeholder="ghp_..." autocomplete="off">
        <div class="admin-modal-actions">
          <button class="admin-btn admin-btn-cancel" id="admin-token-cancel">Cancelar</button>
          <button class="admin-btn admin-btn-primary" id="admin-token-submit">Guardar</button>
        </div>
        <p class="admin-error" id="admin-token-error"></p>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = document.getElementById('admin-token-input');
    setTimeout(() => input.focus(), 100);

    document.getElementById('admin-token-cancel').onclick = () => { overlay.remove(); resolve(null); };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.remove(); resolve(null); } });

    document.getElementById('admin-token-submit').onclick = async () => {
      const token = input.value.trim();
      if (!token) {
        document.getElementById('admin-token-error').textContent = 'Ingresa un token';
        return;
      }
      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
          headers: { Authorization: `token ${token}` },
        });
        if (res.ok || res.status === 404) {
          adminToken = token;
          localStorage.setItem('minashop_admin_token', token);
          overlay.remove();
          resolve(token);
        } else {
          document.getElementById('admin-token-error').textContent = 'Token invalido';
        }
      } catch {
        document.getElementById('admin-token-error').textContent = 'Error de conexion';
      }
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('admin-token-submit').click();
      if (e.key === 'Escape') { overlay.remove(); resolve(null); }
    });
  });
}

async function fetchLocalProducts() {
  try {
    const res = await fetch('/products.json');
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchGitHubProducts() {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
    headers: { Authorization: `token ${adminToken}` },
  });
  if (res.status === 404) return null;
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('minashop_admin_token');
    adminToken = null;
    throw new Error('Token invalido. Abre el admin de nuevo y ingresa uno nuevo.');
  }
  if (!res.ok) throw new Error('Error al cargar desde GitHub');
  const data = await res.json();
  return { products: JSON.parse(atob(data.content)), sha: data.sha };
}

async function loadAdminProducts() {
  const gh = await fetchGitHubProducts();
  if (gh) {
    adminProducts = gh.products;
    adminSha = gh.sha;
  } else {
    adminProducts = await fetchLocalProducts();
    adminSha = null;
  }
}

async function saveToGitHub(message) {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(adminProducts, null, 2))));
  const body = { message, content };
  if (adminSha) body.sha = adminSha;
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
    method: 'PUT',
    headers: { Authorization: `token ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al guardar en GitHub');
  }
  const data = await res.json();
  adminSha = data.content.sha;
  return data;
}

async function openAdmin() {
  if (!adminToken) {
    const auth = await promptPassword();
    if (!auth) return;
    if (!adminToken) {
      const token = await promptToken();
      if (!token) return;
    }
  }
  showAdminPanel();
}

function showAdminPanel() {
  const overlay = document.createElement('div');
  overlay.className = 'admin-overlay';
  overlay.id = 'admin-overlay';
  overlay.innerHTML = `
    <div class="admin-panel">
      <div class="admin-panel-header">
        <h2>Admin - MinaShop</h2>
        <button class="admin-close-btn" id="admin-close">&times;</button>
      </div>
      <div class="admin-tabs">
        <button class="admin-tab active" data-tab="list">Productos</button>
        <button class="admin-tab" data-tab="add">Agregar nuevo</button>
      </div>
      <div class="admin-tab-body">
        <div id="admin-tab-list" class="admin-tab-content">
          <p class="admin-loading">Cargando productos...</p>
        </div>
        <div id="admin-tab-add" class="admin-tab-content" style="display:none"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  overlay.querySelector('#admin-close').onclick = closeAdmin;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAdmin(); });

  overlay.querySelectorAll('.admin-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      overlay.querySelectorAll('.admin-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const name = tab.dataset.tab;
      document.getElementById('admin-tab-list').style.display = name === 'list' ? '' : 'none';
      document.getElementById('admin-tab-add').style.display = name === 'add' ? '' : 'none';
      if (name === 'add') renderProductForm();
    });
  });

  loadAdminList();
}

function closeAdmin() {
  const overlay = document.getElementById('admin-overlay');
  if (overlay) overlay.remove();
  document.body.style.overflow = '';
}

async function loadAdminList() {
  const container = document.getElementById('admin-tab-list');
  try {
    await loadAdminProducts();
    if (adminProducts.length === 0) {
      container.innerHTML = '<p class="admin-empty">No hay productos. Agrega el primero!</p>';
      return;
    }
    renderProductList(container);
  } catch (err) {
    container.innerHTML = `<p class="admin-error">${err.message}</p>`;
  }
}

function renderProductList(container) {
  container.innerHTML = `<div class="admin-product-list">${adminProducts.map((p) => `
    <div class="admin-product-item">
      <img class="admin-product-thumb" src="${p.images && p.images[0] ? p.images[0] : ''}" alt="" onerror="this.style.display='none'">
      <div class="admin-product-info">
        <div class="admin-product-name">${p.name}</div>
        <div class="admin-product-price">$${(p.price || 0).toLocaleString('es-CO')}</div>
      </div>
      <div class="admin-product-actions">
        <button class="admin-btn admin-btn-sm admin-btn-edit" data-edit="${p.id}">Editar</button>
        <button class="admin-btn admin-btn-sm admin-btn-delete" data-del="${p.id}">Eliminar</button>
      </div>
    </div>`).join('')}</div>`;

  container.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.edit);
      const p = adminProducts.find((x) => x.id === id);
      if (p) {
        document.querySelector('.admin-tab[data-tab="add"]').click();
        renderProductForm(p);
      }
    };
  });

  container.querySelectorAll('[data-del]').forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.dataset.del);
      const p = adminProducts.find((x) => x.id === id);
      if (!confirm(`Eliminar "${p ? p.name : ''}"?`)) return;
      try {
        adminProducts = adminProducts.filter((x) => x.id !== id);
        await saveToGitHub(`Delete: ${p.name}`);
        renderProductList(container);
      } catch (err) {
        alert('Error: ' + err.message);
        await loadAdminProducts();
      }
    };
  });
}

function renderProductForm(product = null) {
  const container = document.getElementById('admin-tab-add');
  const isEdit = !!product;

  container.innerHTML = `
    <form id="admin-form" class="admin-form">
      <div class="admin-form-group">
        <label>Nombre *</label>
        <input type="text" id="af-name" required value="${product ? product.name : ''}">
      </div>
      <div class="admin-form-group">
        <label>Descripcion *</label>
        <textarea id="af-desc" required rows="3">${product ? product.description : ''}</textarea>
      </div>
      <div class="admin-form-row">
        <div class="admin-form-group">
          <label>Precio original (COP) *</label>
          <input type="number" id="af-orig" required value="${product ? product.originalPrice : ''}">
        </div>
        <div class="admin-form-group">
          <label>Precio actual (COP) *</label>
          <input type="number" id="af-price" required value="${product ? product.price : ''}">
        </div>
      </div>
      <div class="admin-form-row">
        <div class="admin-form-group">
          <label>Talla</label>
          <input type="text" id="af-size" value="${product && product.size ? product.size : ''}" placeholder="Ej: M">
        </div>
        <div class="admin-form-group">
          <label>Rating</label>
          <input type="number" id="af-rating" step="0.1" min="1" max="5" value="${product ? product.rating : '4.5'}">
        </div>
        <div class="admin-form-group">
          <label>Resenas</label>
          <input type="number" id="af-reviews" value="${product ? product.reviewCount : '0'}">
        </div>
      </div>
      <div class="admin-form-group">
        <label>Precio flash (opcional)</label>
        <input type="number" id="af-flash" value="${product && product.deal ? product.deal.flashPrice : ''}" placeholder="Dejar vacio si no aplica">
      </div>
      <div class="admin-form-group">
        <label>URLs de imagenes (una por linea) *</label>
        <textarea id="af-images" required rows="4" placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg">${product && product.images ? product.images.join('\n') : ''}</textarea>
      </div>
      <div class="admin-form-actions">
        <button type="button" class="admin-btn admin-btn-cancel" id="af-cancel">Cancelar</button>
        <button type="submit" class="admin-btn admin-btn-primary" id="af-submit">${isEdit ? 'Guardar cambios' : 'Agregar producto'}</button>
      </div>
      <p class="admin-form-status" id="af-status"></p>
    </form>
  `;

  document.getElementById('af-cancel').onclick = () => {
    document.querySelector('.admin-tab[data-tab="list"]').click();
    loadAdminList();
  };

  document.getElementById('admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('af-status');
    const submitBtn = document.getElementById('af-submit');
    const imagesRaw = document.getElementById('af-images').value.trim();
    if (!imagesRaw) { status.textContent = 'Agrega al menos una imagen'; status.className = 'admin-form-status admin-error'; return; }

    const flashRaw = document.getElementById('af-flash').value;
    const productData = {
      id: product ? product.id : Date.now(),
      name: document.getElementById('af-name').value.trim(),
      description: document.getElementById('af-desc').value.trim(),
      originalPrice: Number(document.getElementById('af-orig').value),
      price: Number(document.getElementById('af-price').value),
      rating: Number(document.getElementById('af-rating').value) || 4.5,
      reviewCount: Number(document.getElementById('af-reviews').value) || 0,
      images: imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    const sizeVal = document.getElementById('af-size').value.trim();
    if (sizeVal) productData.size = sizeVal;
    if (flashRaw) productData.deal = { flashPrice: Number(flashRaw) };

    submitBtn.disabled = true;
    status.textContent = 'Guardando en GitHub...';
    status.className = 'admin-form-status admin-loading';

    try {
      if (product) {
        adminProducts = adminProducts.map((p) => (p.id === product.id ? productData : p));
      } else {
        adminProducts.push(productData);
      }
      await saveToGitHub(isEdit ? `Update: ${productData.name}` : `Add: ${productData.name}`);
      status.textContent = isEdit ? 'Actualizado!' : 'Agregado!';
      status.className = 'admin-form-status admin-success';
      setTimeout(() => {
        document.querySelector('.admin-tab[data-tab="list"]').click();
        const container = document.getElementById('admin-tab-list');
        renderProductList(container);
      }, 1000);
    } catch (err) {
      status.textContent = 'Error: ' + err.message;
      status.className = 'admin-form-status admin-error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', initAdminTap);
