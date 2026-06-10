// ============================================
// LOGIN — SCRIPT.JS
// Usa localStorage para verificar contas
// cadastradas pelo register.html
// ============================================

const form       = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passInput  = document.getElementById('password');
const togglePass = document.getElementById('togglePass');
const eyeIcon    = document.getElementById('eyeIcon');
const submitBtn  = document.getElementById('submitBtn');
const btnText    = document.getElementById('btnText');
const spinner    = document.getElementById('spinner');

// ── Ícones SVG olho ──────────────────────────────────────────────────────────
const EYE_OPEN = `
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
`;
const EYE_CLOSED = `
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
           a18.45 18.45 0 0 1 5.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8
           a18.5 18.5 0 0 1-2.16 3.19"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
`;

// ── Toggle visibilidade da senha ─────────────────────────────────────────────
togglePass.addEventListener('click', () => {
  const isPassword = passInput.type === 'password';
  passInput.type = isPassword ? 'text' : 'password';
  eyeIcon.innerHTML = isPassword ? EYE_CLOSED : EYE_OPEN;
  togglePass.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
});

// ── Validações ────────────────────────────────────────────────────────────────
function validateEmail(v) {
  if (!v.trim()) return 'O e-mail é obrigatório.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Informe um e-mail válido.';
  return '';
}
function validatePassword(v) {
  if (!v) return 'A senha é obrigatória.';
  if (v.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
  return '';
}
function showError(fieldId, message) {
  const field   = document.getElementById('field-' + fieldId);
  const errorEl = document.getElementById('error-' + fieldId);
  errorEl.textContent = message;
  field.classList.toggle('has-error', !!message);
}

emailInput.addEventListener('blur',  () => showError('email',    validateEmail(emailInput.value)));
passInput.addEventListener('blur',   () => showError('password', validatePassword(passInput.value)));
emailInput.addEventListener('input', () => {
  if (document.getElementById('field-email').classList.contains('has-error'))
    showError('email', validateEmail(emailInput.value));
});
passInput.addEventListener('input', () => {
  if (document.getElementById('field-password').classList.contains('has-error'))
    showError('password', validatePassword(passInput.value));
});

// ── Lógica real: busca conta no localStorage ──────────────────────────────────
function findAccount(email, password) {
  const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  return accounts.find(
    acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
  );
}

// ── Envio do formulário ───────────────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailErr = validateEmail(emailInput.value);
  const passErr  = validatePassword(passInput.value);
  showError('email',    emailErr);
  showError('password', passErr);
  if (emailErr || passErr) return;

  setLoading(true);

  // Pequeno delay para dar feedback visual
  await delay(800);

  const account = findAccount(emailInput.value.trim(), passInput.value);

  if (!account) {
    showError('password', 'E-mail ou senha incorretos.');
    setLoading(false);
    return;
  }

  // Salva sessão do usuário logado
  sessionStorage.setItem('loggedUser', JSON.stringify({ name: account.name, email: account.email }));

  btnText.textContent = 'Entrando…';

  // Redireciona para a home após breve pausa
  await delay(600);
  window.location.href = 'index.html';
});

// ── Utilitários ───────────────────────────────────────────────────────────────
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  spinner.classList.toggle('active', isLoading);
  if (!isLoading) btnText.textContent = 'Entrar';
}
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}