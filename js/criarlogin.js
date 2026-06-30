/* ============================================
   CRIARLOGIN.JS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('criarForm');
  if (!form) return;

  // Força da senha
  const senhaInput = document.getElementById('senha');
  const forceBar   = document.getElementById('forca-bar');
  const forceText  = document.getElementById('forca-text');

  if (senhaInput && forceBar) {
    senhaInput.addEventListener('input', () => {
      const v = senhaInput.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;

      const levels = ['', 'Fraca', 'Média', 'Forte', 'Muito forte'];
      const colors = ['', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'];
      forceBar.style.width   = `${score * 25}%`;
      forceBar.style.background = colors[score] || '#e2e8f0';
      if (forceText) forceText.textContent = levels[score] || '';
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const nome   = document.getElementById('nome')?.value.trim();
    const email  = document.getElementById('email').value.trim();
    const senha  = document.getElementById('senha').value;
    const conf   = document.getElementById('confirmar').value;
    let ok = true;

    if (nome !== undefined && nome.length < 2) {
      showFieldError('nome', 'Informe seu nome completo.'); ok = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('email', 'Insira um e-mail válido.'); ok = false;
    }
    if (!senha || senha.length < 6) {
      showFieldError('senha', 'A senha deve ter pelo menos 6 caracteres.'); ok = false;
    }
    if (senha !== conf) {
      showFieldError('confirmar', 'As senhas não coincidem.'); ok = false;
    }
    if (!ok) return;

    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Criando conta…';
    await delay(1200);

    localStorage.setItem('tc_user', JSON.stringify({ email, nome }));
    window.location.href = '../index.html';
  });

  function showFieldError(field, msg) {
    const errEl = document.getElementById(`error-${field}`);
    const fieldEl = document.getElementById(`field-${field}`);
    if (errEl)   errEl.textContent = msg;
    if (fieldEl) fieldEl.classList.add('has-error');
  }
  function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.field').forEach(el => el.classList.remove('has-error'));
  }
});

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
