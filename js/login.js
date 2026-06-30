/* ============================================
   LOGIN.JS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('loginForm');
  const toggleBtn = document.getElementById('togglePass');
  const passInput = document.getElementById('password');
  const spinner   = document.getElementById('spinner');
  const btnText   = document.getElementById('btnText');

  // Mostrar/ocultar senha
  if (toggleBtn && passInput) {
    toggleBtn.addEventListener('click', () => {
      const visible = passInput.type === 'text';
      passInput.type = visible ? 'password' : 'text';
      toggleBtn.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
      document.getElementById('eyeIcon').setAttribute('data-hidden', String(visible));
    });
  }

  // Submissão com validação
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('password').value;
      let ok = true;

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'Insira um e-mail válido.');
        ok = false;
      }
      if (!senha || senha.length < 6) {
        showFieldError('password', 'A senha deve ter pelo menos 6 caracteres.');
        ok = false;
      }
      if (!ok) return;

      // Simular carregamento
      setLoading(true);
      await delay(1200);
      setLoading(false);

      // Simular autenticação (qualquer credencial válida entra)
      localStorage.setItem('tc_user', JSON.stringify({ email }));
      window.location.href = '../index.html';
    });
  }

  function showFieldError(field, msg) {
    const errEl = document.getElementById(`error-${field}`);
    const fieldEl = document.getElementById(`field-${field}`);
    if (errEl) errEl.textContent = msg;
    if (fieldEl) fieldEl.classList.add('has-error');
  }

  function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.field').forEach(el => el.classList.remove('has-error'));
  }

  function setLoading(on) {
    if (spinner) spinner.style.display = on ? 'inline-block' : 'none';
    if (btnText)  btnText.style.display = on ? 'none' : 'inline';
    form.querySelector('button[type=submit]').disabled = on;
  }
});

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
