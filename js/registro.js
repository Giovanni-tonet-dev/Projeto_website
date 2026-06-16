// ============================================
// REGISTRO.JS — Cadastro de contas via localStorage
// ============================================

const form          = document.getElementById('registerForm');
const nameInput     = document.getElementById('name');
const emailInput    = document.getElementById('email');
const passInput     = document.getElementById('password');
const confirmInput  = document.getElementById('confirm');
const termsCheck    = document.getElementById('terms');
const togglePass    = document.getElementById('togglePass');
const toggleConfirm = document.getElementById('toggleConfirm');
const eyeIcon       = document.getElementById('eyeIcon');
const eyeIconConf   = document.getElementById('eyeIconConfirm');
const submitBtn     = document.getElementById('submitBtn');
const btnText       = document.getElementById('btnText');
const spinner       = document.getElementById('spinner');
const strengthBar   = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');

// ── Ícones SVG olho ──
const EYE_OPEN = `
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
`;
const EYE_CLOSED = `
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
`;

function makeToggle(btn, input, icon) {
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    icon.innerHTML = show ? EYE_CLOSED : EYE_OPEN;
    btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  });
}
makeToggle(togglePass,    passInput,    eyeIcon);
makeToggle(toggleConfirm, confirmInput, eyeIconConf);

// ── Força da senha ──
const STRENGTH_LEVELS = [
  { label: '',         cls: '' },
  { label: 'Fraca',    cls: 's1' },
  { label: 'Razoável', cls: 's2' },
  { label: 'Boa',      cls: 's3' },
  { label: 'Forte',    cls: 's4' },
];
function measureStrength(pwd) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8)           s++;
  if (/[A-Z]/.test(pwd))         s++;
  if (/[0-9]/.test(pwd))         s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}
function updateStrength(pwd) {
  const l = measureStrength(pwd);
  strengthBar.className = 'strength-bar' + (l > 0 ? ' ' + STRENGTH_LEVELS[l].cls : '');
  strengthLabel.textContent = STRENGTH_LEVELS[l].label;
}
passInput.addEventListener('input', () => updateStrength(passInput.value));

// ── Validações ──
function validateName(v) {
  if (!v.trim()) return 'O nome é obrigatório.';
  if (v.trim().split(' ').length < 2) return 'Informe o nome completo.';
  return '';
}
function validateEmail(v) {
  if (!v.trim()) return 'O e-mail é obrigatório.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Informe um e-mail válido.';
  return '';
}
function validatePassword(v) {
  if (!v) return 'A senha é obrigatória.';
  if (v.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
  return '';
}
function validateConfirm(v) {
  if (!v) return 'Confirme a senha.';
  if (v !== passInput.value) return 'As senhas não coincidem.';
  return '';
}
function validateTerms() {
  if (!termsCheck.checked) return 'Você precisa aceitar os termos para continuar.';
  return '';
}
function showError(fieldId, message) {
  const field   = document.getElementById('field-' + fieldId);
  const errorEl = document.getElementById('error-' + fieldId);
  if (!field || !errorEl) return;
  errorEl.textContent = message;
  field.classList.toggle('has-error', !!message);
}

[
  [nameInput,    'name',     () => validateName(nameInput.value)],
  [emailInput,   'email',    () => validateEmail(emailInput.value)],
  [passInput,    'password', () => validatePassword(passInput.value)],
  [confirmInput, 'confirm',  () => validateConfirm(confirmInput.value)],
].forEach(([el, id, fn]) => {
  el.addEventListener('blur',  () => showError(id, fn()));
  el.addEventListener('input', () => {
    if (document.getElementById('field-' + id).classList.contains('has-error'))
      showError(id, fn());
  });
});

// ── Lógica: salva conta no localStorage ──
function emailAlreadyExists(email) {
  const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  return accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase());
}
function saveAccount(name, email, password) {
  const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  accounts.push({ name, email, password });
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

// ── Envio do formulário ──
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const errors = {
    name:     validateName(nameInput.value),
    email:    validateEmail(emailInput.value),
    password: validatePassword(passInput.value),
    confirm:  validateConfirm(confirmInput.value),
    terms:    validateTerms(),
  };
  Object.entries(errors).forEach(([id, msg]) => showError(id, msg));
  if (Object.values(errors).some(Boolean)) return;

  if (emailAlreadyExists(emailInput.value.trim())) {
    showError('email', 'Este e-mail já está cadastrado.');
    return;
  }

  setLoading(true);
  await delay(800);

  saveAccount(
    nameInput.value.trim(),
    emailInput.value.trim(),
    passInput.value
  );

  sessionStorage.setItem('loggedUser', JSON.stringify({
    name:  nameInput.value.trim(),
    email: emailInput.value.trim(),
  }));

  btnText.textContent = 'Conta criada!';
  await delay(600);
  window.location.href = '../index.html';
});

// ── Utilitários ──
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  spinner.classList.toggle('active', isLoading);
  if (isLoading) btnText.textContent = 'Criando conta…';
}
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}
