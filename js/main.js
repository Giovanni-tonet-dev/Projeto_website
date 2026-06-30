/* ============================================
   MAIN.JS — Lógica principal do TechCell
   ============================================ */

// ── Estado Global ──────────────────────────────────────────────
const STATE = {
  carrinho: JSON.parse(localStorage.getItem('tc_carrinho') || '[]'),
  favoritos: JSON.parse(localStorage.getItem('tc_favoritos') || '[]'),
};

function salvarEstado() {
  localStorage.setItem('tc_carrinho', JSON.stringify(STATE.carrinho));
  localStorage.setItem('tc_favoritos', JSON.stringify(STATE.favoritos));
}

// ── Toast ───────────────────────────────────────────────────────
function showToast(msg, tipo = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = tipo;
  // trigger reflow
  toast.offsetHeight;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Carrinho ────────────────────────────────────────────────────
function adicionarAoCarrinho(produto) {
  const idx = STATE.carrinho.findIndex(p => p.id === produto.id);
  if (idx >= 0) {
    STATE.carrinho[idx].qtd++;
  } else {
    STATE.carrinho.push({ ...produto, qtd: 1 });
  }
  salvarEstado();
  atualizarBadgeCarrinho();
  showToast(`✓ ${produto.nome} adicionado ao carrinho!`);
}

function removerDoCarrinho(id) {
  STATE.carrinho = STATE.carrinho.filter(p => p.id !== id);
  salvarEstado();
  atualizarBadgeCarrinho();
  renderizarCarrinho();
}

function atualizarQtdCarrinho(id, delta) {
  const item = STATE.carrinho.find(p => p.id === id);
  if (!item) return;
  item.qtd = Math.max(1, item.qtd + delta);
  salvarEstado();
  renderizarCarrinho();
}

function limparCarrinho() {
  STATE.carrinho = [];
  salvarEstado();
  atualizarBadgeCarrinho();
  renderizarCarrinho();
}

function atualizarBadgeCarrinho() {
  const total = STATE.carrinho.reduce((acc, p) => acc + p.qtd, 0);
  document.querySelectorAll('.badge-carrinho').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function renderizarCarrinho() {
  const container = document.getElementById('carrinho-lista');
  const resumo = document.getElementById('carrinho-total');
  if (!container) return;

  if (STATE.carrinho.length === 0) {
    container.innerHTML = `
      <div class="carrinho-vazio">
        <span>🛒</span>
        <p>Seu carrinho está vazio.</p>
        <a href="../index.html" class="btn-continuar">Continuar comprando</a>
      </div>`;
    if (resumo) resumo.innerHTML = '';
    return;
  }

  container.innerHTML = STATE.carrinho.map(item => `
    <div class="carrinho-item" data-id="${item.id}">
      <img src="${item.img}" alt="${item.nome}">
      <div class="carrinho-item-info">
        <h4>${item.nome}</h4>
        <span class="carrinho-item-preco">${formatarPreco(item.preco)}</span>
      </div>
      <div class="carrinho-item-qtd">
        <button onclick="atualizarQtdCarrinho('${item.id}', -1)">−</button>
        <span>${item.qtd}</span>
        <button onclick="atualizarQtdCarrinho('${item.id}', 1)">+</button>
      </div>
      <span class="carrinho-item-subtotal">${formatarPreco(item.preco * item.qtd)}</span>
      <button class="carrinho-item-remove" onclick="removerDoCarrinho('${item.id}')" aria-label="Remover">✕</button>
    </div>
  `).join('');

  const total = STATE.carrinho.reduce((acc, p) => acc + p.preco * p.qtd, 0);
  if (resumo) {
    resumo.innerHTML = `
      <div class="resumo-linha"><span>Subtotal</span><span>${formatarPreco(total)}</span></div>
      <div class="resumo-linha"><span>Frete</span><span class="gratis">Grátis</span></div>
      <div class="resumo-linha total"><span>Total</span><span>${formatarPreco(total)}</span></div>
      <button class="btn-finalizar" onclick="finalizarCompra()">Finalizar Compra</button>
      <button class="btn-limpar" onclick="limparCarrinho()">Limpar Carrinho</button>
    `;
  }
}

function finalizarCompra() {
  if (STATE.carrinho.length === 0) return;
  showToast('🎉 Pedido realizado com sucesso!');
  limparCarrinho();
}

// ── Favoritos ───────────────────────────────────────────────────
function toggleFavorito(id, nome) {
  const idx = STATE.favoritos.indexOf(id);
  if (idx >= 0) {
    STATE.favoritos.splice(idx, 1);
    showToast(`💔 ${nome} removido dos favoritos`, 'error');
  } else {
    STATE.favoritos.push(id);
    showToast(`❤️ ${nome} adicionado aos favoritos!`);
  }
  salvarEstado();
  atualizarBotoesVavorito();
}

function atualizarBotoesVavorito() {
  document.querySelectorAll('[data-fav]').forEach(btn => {
    const id = btn.dataset.fav;
    btn.classList.toggle('ativo', STATE.favoritos.includes(id));
    btn.textContent = STATE.favoritos.includes(id) ? '❤️' : '🤍';
  });
}

// ── Busca ────────────────────────────────────────────────────────
function iniciarBusca() {
  const inputs = document.querySelectorAll('.navbar__search input');
  inputs.forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) {
          window.location.href = `pages/site_celulares_vender.html?q=${encodeURIComponent(q)}`;
        }
      }
    });
  });
}

// ── Filtros na página de celulares ──────────────────────────────
function iniciarFiltros() {
  const btns = document.querySelectorAll('.filtro-btn');
  const cards = document.querySelectorAll('.produto-card[data-categoria]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      const cat = btn.dataset.filtro;
      cards.forEach(card => {
        const show = cat === 'todos' || card.dataset.categoria === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

// ── Busca na URL (página de celulares) ──────────────────────────
function filtrarPorURL() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (!q) return;
  const input = document.querySelector('.navbar__search input');
  if (input) input.value = q;
  const cards = document.querySelectorAll('.produto-card');
  cards.forEach(card => {
    const nome = card.querySelector('.produto-card__nome')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.produto-card__desc')?.textContent.toLowerCase() || '';
    card.style.display = (nome.includes(q.toLowerCase()) || desc.includes(q.toLowerCase())) ? '' : 'none';
  });
}

// ── Favoritos: renderizar página ─────────────────────────────────
function renderizarFavoritos() {
  const container = document.getElementById('favoritos-lista');
  if (!container) return;
  const TODOS = obterCatalogoProdutos();
  const favs = TODOS.filter(p => STATE.favoritos.includes(p.id));

  if (favs.length === 0) {
    container.innerHTML = `
      <div class="carrinho-vazio">
        <span>🤍</span>
        <p>Você não tem favoritos ainda.</p>
        <a href="../index.html" class="btn-continuar">Explorar produtos</a>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="produtos-grid">${favs.map(p => criarCardHTML(p)).join('')}</div>`;
  atualizarBotoesVavorito();
}

// ── Catálogo de produtos ─────────────────────────────────────────
function obterCatalogoProdutos() {
  return [
    { id: 'iphone17', nome: 'iPhone 17 Pro', preco: 9499, desc: 'Chip A19, câmera 50MP, tela Super Retina XDR.', img: '../img/tela_iphone17.png', categoria: 'smartphone', badge: 'Novo', stars: 5 },
    { id: 'galaxy_s25', nome: 'Samsung Galaxy S25', preco: 6799, desc: 'Tela AMOLED 6.2", Snapdragon 8 Elite, 5G.', img: '../img/galaxy_S25.png', categoria: 'smartphone', badge: 'Destaque', stars: 5 },
    { id: 'xiaomi17', nome: 'Xiaomi 14 Ultra', preco: 5299, desc: 'Câmera Leica, 200MP, carregamento 120W.', img: '../img/xiomi.png', categoria: 'smartphone', badge: 'Oferta', stars: 4 },
    { id: 'ipad_air', nome: 'iPad Air M2', preco: 6799, desc: 'Tela Liquid Retina, chip M2, suporte ao Apple Pencil.', img: '../img/ipad_air.png', categoria: 'tablet', badge: '', stars: 5 },
    { id: 'galaxy_tab', nome: 'Galaxy Tab S10', preco: 5299, desc: 'AMOLED 11", S Pen incluída, bateria 10.090mAh.', img: '../img/galaxy_tab_s10.png', categoria: 'tablet', badge: '', stars: 4 },
    { id: 'pad7pro', nome: 'Xiaomi Pad 7 Pro', preco: 3499, desc: 'Snapdragon 8s Gen 3, tela 11.2" 144Hz.', img: '../img/pad7pro.png', categoria: 'tablet', badge: 'Novo', stars: 4 },
    { id: 'capa_iphone', nome: 'Capa iPhone 17 Pro', preco: 149, desc: 'Proteção resistente a quedas com MagSafe.', img: '../img/capa_iphone.png', categoria: 'acessorio', badge: '', stars: 4 },
    { id: 'capa_samsung', nome: 'Capa Galaxy S25', preco: 99, desc: 'Silicone premium com revestimento antiderrapante.', img: '../img/capa_samsung.png', categoria: 'acessorio', badge: 'Oferta', stars: 4 },
    { id: 'capa_xiaomi', nome: 'Capa Xiaomi 14', preco: 79, desc: 'TPU transparente, proteção nas quinas.', img: '../img/capa_xiaomi.png', categoria: 'acessorio', badge: '', stars: 3 },
  ];
}

function criarCardHTML(p) {
  const eFav = STATE.favoritos.includes(p.id);
  const stars = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);
  const badgeHTML = p.badge
    ? `<span class="produto-card__badge ${p.badge.toLowerCase()}">${p.badge}</span>`
    : '';
  const precoOriginal = p.badge === 'Oferta'
    ? `<span class="produto-card__preco-original">${formatarPreco(p.preco * 1.15)}</span>` : '';

  return `
    <article class="produto-card" data-categoria="${p.categoria}">
      <div class="produto-card__img-wrap">
        <a href="#">
          <img src="${p.img}" alt="${p.nome}" loading="lazy">
        </a>
        ${badgeHTML}
        <button class="produto-card__fav ${eFav ? 'ativo' : ''}"
          data-fav="${p.id}"
          onclick="toggleFavorito('${p.id}', '${p.nome}')"
          aria-label="Favoritar">
          ${eFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="produto-card__info">
        <h3 class="produto-card__nome">${p.nome}</h3>
        <p class="produto-card__desc">${p.desc}</p>
        <div class="produto-card__stars" aria-label="${p.stars} estrelas">${stars}</div>
        <div>
          ${precoOriginal}
          <span class="produto-card__preco">${formatarPreco(p.preco)}</span>
        </div>
        <button class="btn-comprar"
          onclick='adicionarAoCarrinho(${JSON.stringify({ id: p.id, nome: p.nome, preco: p.preco, img: p.img })})'>
          Adicionar ao carrinho
        </button>
      </div>
    </article>`;
}

// ── Utilitários ─────────────────────────────────────────────────
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ── Inicializar ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  atualizarBadgeCarrinho();
  atualizarBotoesVavorito();
  iniciarBusca();
  iniciarFiltros();
  filtrarPorURL();
  renderizarCarrinho();
  renderizarFavoritos();
});
