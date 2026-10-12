(() => {
  const authScreen = document.getElementById('auth-screen');
  const appShell = document.getElementById('app-shell');
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const signupTab = document.getElementById('signup-tab');
  const loginTab = document.getElementById('login-tab');
  const authIntro = document.getElementById('auth-intro');
  const signupError = document.getElementById('signup-error');
  const loginError = document.getElementById('login-error');
  const accounts = new Map(); // Memory only: demo credentials disappear when this page is closed/refreshed.
  let activeAccount = null;

  function setAuthMode(mode) {
    const creating = mode === 'signup';
    signupForm.hidden = !creating;
    loginForm.hidden = creating;
    signupTab.classList.toggle('selected', creating);
    loginTab.classList.toggle('selected', !creating);
    signupTab.setAttribute('aria-selected', String(creating));
    loginTab.setAttribute('aria-selected', String(!creating));
    document.getElementById('auth-title').innerHTML = creating ? 'A little care,<br><em>starting with you.</em>' : 'Welcome<br><em>back.</em>';
    authIntro.textContent = creating ? 'Create your account to get started. Your details help personalize your health profile.' : 'Log in to return to your personal health space.';
    signupError.hidden = true;
    loginError.hidden = true;
  }

  function showGate() {
    appShell.hidden = true;
    authScreen.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function enterApp(account) {
    activeAccount = account;
    authScreen.hidden = true;
    appShell.hidden = false;
    document.getElementById('page-title').textContent = 'AI health guide';
    document.getElementById('chat-page').hidden = false;
    document.getElementById('profile-page').hidden = true;
    document.querySelectorAll('.nav-item').forEach((item) => {
      const active = item.dataset.page === 'chat';
      item.classList.toggle('active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    document.querySelector('.avatar').textContent = account.name.trim().charAt(0).toUpperCase();
    document.getElementById('personal-greeting').textContent = `Hi ${account.name.split(/\s+/)[0]}, tell me what you’re experiencing. I can share general health information and help you think about a safe next step.`;
    document.getElementById('account-summary').replaceChildren();
    const summary = document.getElementById('account-summary');
    [[account.name, 'Name'], [`${account.age} years`, 'Age'], [account.email, 'Email'], [account.phone, 'Phone']].forEach(([value, label]) => {
      const item = document.createElement('span');
      item.innerHTML = `<strong>${label}:</strong> `;
      item.append(document.createTextNode(value));
      summary.append(item);
    });
    const fieldValues = { height: account.height, weight: account.weight, bp: '', cholesterol: '', sugar: '' };
    Object.entries(fieldValues).forEach(([id, value]) => { document.getElementById(id).value = value; });
    updateBmi();
    try { sessionStorage.removeItem('first-aid-assistant-profile-session'); } catch { /* Browser storage may be disabled. */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  signupTab.addEventListener('click', () => setAuthMode('signup'));
  loginTab.addEventListener('click', () => setAuthMode('login'));

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    signupError.hidden = true;
    if (!signupForm.reportValidity()) return;
    const data = new FormData(signupForm);
    const email = String(data.get('email')).trim().toLowerCase();
    const password = String(data.get('password'));
    if (password !== String(data.get('confirmPassword'))) {
      signupError.textContent = 'Those passwords don’t match. Please check and try again.';
      signupError.hidden = false;
      signupForm.elements.confirmPassword.focus();
      return;
    }
    if (accounts.has(email)) {
      signupError.textContent = 'An account for this email already exists in this demo session. Please log in.';
      signupError.hidden = false;
      return;
    }
    const account = {
      name: String(data.get('name')).trim(), age: String(data.get('age')),
      height: String(data.get('height')), weight: String(data.get('weight')),
      email, phone: String(data.get('phone')).trim(), password
    };
    accounts.set(email, account);
    signupForm.reset();
    enterApp(account);
  });

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loginError.hidden = true;
    if (!loginForm.reportValidity()) return;
    const data = new FormData(loginForm);
    const account = accounts.get(String(data.get('email')).trim().toLowerCase());
    if (!account || account.password !== String(data.get('password'))) {
      loginError.textContent = 'That email and password don’t match an account created in this tab. Create an account to try the demo.';
      loginError.hidden = false;
      return;
    }
    loginForm.reset();
    enterApp(account);
  });

  function logout() {
    accounts.clear();
    activeAccount = null;
    document.getElementById('conversation').querySelectorAll('.message:not(:first-child)').forEach((message) => message.remove());
    signupForm.reset();
    loginForm.reset();
    setAuthMode('signup');
    showGate();
  }
  document.getElementById('logout-button').addEventListener('click', logout);
  document.getElementById('mobile-logout')?.addEventListener('click', logout);

  document.querySelectorAll('[data-page]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.page === 'account') { setAuthMode('signup'); showGate(); return; }
    const showProfile = button.dataset.page === 'profile';
    document.getElementById('chat-page').hidden = showProfile;
    document.getElementById('profile-page').hidden = !showProfile;
    document.querySelectorAll('.nav-item').forEach((item) => {
      const active = item.dataset.page === button.dataset.page;
      item.classList.toggle('active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    document.getElementById('page-title').textContent = showProfile ? 'My health profile' : 'AI health guide';
  }));

  const chatForm = document.getElementById('chat-form');
  const prompt = document.getElementById('prompt');
  const conversation = document.getElementById('conversation');
  const charCount = document.getElementById('char-count');

  document.querySelectorAll('.prompt-chip').forEach((button) => button.addEventListener('click', () => {
    prompt.value = button.dataset.prompt;
    prompt.focus();
    updateCount();
  }));
  function updateCount() { charCount.textContent = `${prompt.value.length.toLocaleString()} / 1,200`; }
  prompt.addEventListener('input', () => {
    updateCount();
    prompt.style.height = 'auto';
    prompt.style.height = `${Math.min(prompt.scrollHeight, 130)}px`;
  });
  prompt.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      chatForm.requestSubmit();
    }
  });

  function addMessage(text, who) {
    const article = document.createElement('article');
    article.className = `message ${who === 'user' ? 'user-message' : 'assistant-message'}`;
    if (who === 'assistant') {
      const icon = document.createElement('div');
      icon.className = 'assistant-avatar';
      icon.textContent = '✚';
      article.append(icon);
    }
    const content = document.createElement('div');
    content.className = 'message-content';
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.textContent = who === 'user' ? 'YOU • JUST NOW' : 'FIRST AID ASSISTANT • JUST NOW';
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    content.append(meta, bubble);
    article.append(content);
    conversation.append(article);
    article.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function getSafetyReply(text) {
    const message = text.toLowerCase();
    const urgent = /(chest pain|can't breathe|cannot breathe|trouble breathing|difficulty breathing|not breathing|stroke|face droop|one side.*weak|unconscious|passed out|fainted|severe bleeding|heavy bleeding|suicid|overdose|poison|seizure)/i.test(message);
    if (urgent) return 'This may need urgent, in-person help. Please call your local emergency number now or ask someone nearby to call and stay with you. Do not wait for an online reply. If you can, follow the emergency dispatcher’s instructions.';
    const burn = /(burn|scald)/i.test(message);
    if (burn && /(small|minor|little|kitchen|hot water|steam)/i.test(message)) return 'For a small, recent burn, general first aid is to cool the area under cool running water for 20 minutes if available. Remove nearby jewellery or clothing only if it is not stuck to the skin. Don’t apply ice, butter, or creams, and don’t pop blisters. Seek urgent care for a large or deep burn, burns to the face, hands, genitals or major joints, chemical or electrical burns, or if you feel very unwell. I can’t assess the burn or recommend a medicine here; contact a clinician if you’re unsure.';
    return 'I can help you think through general information, but this demo is not connected to an AI service and cannot assess your symptoms. Please note when this started, how it has changed, and any other symptoms, then contact a qualified healthcare professional for personal advice. Don’t start, stop, or change medicines based on this chat. If symptoms are severe, rapidly worsening, or feel alarming, seek urgent care now.';
  }
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = prompt.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    prompt.value = '';
    prompt.style.height = 'auto';
    updateCount();
    window.setTimeout(() => addMessage(getSafetyReply(text), 'assistant'), 350);
  });

  const profileFields = ['height', 'weight', 'bp', 'cholesterol', 'sugar'].map((id) => document.getElementById(id));
  const bmiValue = document.getElementById('bmi-value');
  const bmiStatus = document.getElementById('bmi-status');
  const saveStatus = document.getElementById('save-status');
  function updateBmi() {
    const height = Number(document.getElementById('height').value);
    const weight = Number(document.getElementById('weight').value);
    if (!height || !weight || height < 50 || height > 250 || weight < 10 || weight > 400) {
      bmiValue.textContent = '—';
      bmiStatus.textContent = 'Enter height & weight';
      return;
    }
    bmiValue.textContent = (weight / ((height / 100) ** 2)).toFixed(1);
    bmiStatus.textContent = 'A screening measure';
  }
  profileFields.forEach((field) => field.addEventListener('input', updateBmi));
  document.getElementById('clear-profile').addEventListener('click', () => {
    profileFields.forEach((field) => { field.value = ''; });
    updateBmi();
    saveStatus.textContent = 'Details cleared from this tab';
  });
})();
