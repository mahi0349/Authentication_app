import './style.css'

// --- State & Constants ---
const API_BASE = 'https://api.freeapi.app/api/v1/users';
let state = {
  view: 'login', // login, register, profile
  user: null,
  loading: false,
};

// --- DOM Elements ---
document.querySelector('#app').innerHTML = `
  <div class="bg-blobs">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
  </div>
  
  <div class="toast-container" id="toastContainer"></div>

  <div class="container" id="mainContainer">
    <!-- Auth View (Login / Register) -->
    <div id="authView">
      <div id="loginFormContainer">
        <h1>Welcome Back</h1>
        <p class="subtitle">Enter your credentials to access your account</p>
        <form id="loginForm">
          <div class="form-group">
            <label for="loginUsername">Username</label>
            <input type="text" id="loginUsername" placeholder="e.g. doejohn" required />
          </div>
          <div class="form-group">
            <label for="loginPassword">Password</label>
            <input type="password" id="loginPassword" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn" id="loginBtn">
            <span class="spinner"></span>
            <span class="btn-text">Sign In</span>
          </button>
        </form>
        <div class="toggle-text">
          Don't have an account? <span class="toggle-link" id="showRegister">Sign up</span>
        </div>
      </div>

      <div id="registerFormContainer" class="hidden">
        <h1>Create Account</h1>
        <p class="subtitle">Join us to experience the best platform</p>
        <form id="registerForm">
          <div class="form-group">
            <label for="regEmail">Email</label>
            <input type="email" id="regEmail" placeholder="e.g. user@domain.com" required />
          </div>
          <div class="form-group">
            <label for="regUsername">Username</label>
            <input type="text" id="regUsername" placeholder="e.g. doejohn" required />
          </div>
          <div class="form-group">
            <label for="regPassword">Password</label>
            <input type="password" id="regPassword" placeholder="••••••••" required />
          </div>
          <button type="submit" class="btn" id="regBtn">
            <span class="spinner"></span>
            <span class="btn-text">Create Account</span>
          </button>
        </form>
        <div class="toggle-text">
          Already have an account? <span class="toggle-link" id="showLogin">Sign in</span>
        </div>
      </div>
    </div>

    <!-- Profile View -->
    <div id="profileView" class="hidden">
      <div class="profile-card">
        <div class="avatar" id="profileAvatar">U</div>
        <h1>Hello, <span id="profileName">User</span></h1>
        <p class="subtitle" id="profileRole">Role: USER</p>
        
        <div class="profile-info">
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value" id="profileEmail">user@domain.com</span>
          </div>
          <div class="info-row">
            <span class="info-label">Username</span>
            <span class="info-value" id="profileUsername">doejohn</span>
          </div>
          <div class="info-row">
            <span class="info-label">Account Created</span>
            <span class="info-value" id="profileCreated">Just now</span>
          </div>
        </div>

        <button class="btn btn-secondary" id="logoutBtn">
          <span class="spinner"></span>
          <span class="btn-text">Log Out</span>
        </button>
      </div>
    </div>
  </div>
`;

// --- UI Helpers ---
const el = id => document.getElementById(id);

const showToast = (message, type = 'success') => {
  const container = el('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after 3s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

const updateUI = () => {
  el('loginFormContainer').classList.add('hidden');
  el('registerFormContainer').classList.add('hidden');
  el('profileView').classList.add('hidden');
  el('authView').classList.add('hidden');

  if (state.view === 'login') {
    el('authView').classList.remove('hidden');
    el('loginFormContainer').classList.remove('hidden');
  } else if (state.view === 'register') {
    el('authView').classList.remove('hidden');
    el('registerFormContainer').classList.remove('hidden');
  } else if (state.view === 'profile') {
    el('profileView').classList.remove('hidden');
    
    // Populate User Data
    if (state.user) {
      el('profileAvatar').innerText = (state.user.username || 'U').charAt(0).toUpperCase();
      el('profileName').innerText = state.user.username || 'User';
      el('profileRole').innerText = `Role: ${state.user.role || 'USER'}`;
      el('profileEmail').innerText = state.user.email || 'N/A';
      el('profileUsername').innerText = state.user.username || 'N/A';
      el('profileCreated').innerText = state.user.createdAt ? new Date(state.user.createdAt).toLocaleDateString() : 'N/A';
    }
  }
};

const setLoading = (buttonId, isLoading) => {
  const btn = el(buttonId);
  if (!btn) return;
  if (isLoading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
};

// --- API Helpers ---
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// --- API Actions ---
const checkCurrentUser = async () => {
  try {
    const res = await fetch(`${API_BASE}/current-user`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.success) {
      state.user = data.data;
      state.view = 'profile';
      updateUI();
    }
  } catch (error) {
    console.error('Session check failed:', error);
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  const username = el('loginUsername').value.trim();
  const password = el('loginPassword').value.trim();

  if (!username || !password) return showToast('Please fill all fields', 'error');

  setLoading('loginBtn', true);
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (data.success) {
      if (data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
      }
      state.user = data.data.user;
      state.view = 'profile';
      showToast(data.message || 'Logged in successfully', 'success');
      el('loginForm').reset();
      updateUI();
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (error) {
    showToast('Network error occurred', 'error');
  } finally {
    setLoading('loginBtn', false);
  }
};

const handleRegister = async (e) => {
  e.preventDefault();
  const email = el('regEmail').value.trim();
  const username = el('regUsername').value.trim();
  const password = el('regPassword').value.trim();

  if (!email || !username || !password) return showToast('Please fill all fields', 'error');

  setLoading('regBtn', true);
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, role: 'USER' })
    });
    const data = await res.json();

    if (data.success) {
      showToast(data.message || 'Registration successful! Please login.', 'success');
      state.view = 'login';
      el('registerForm').reset();
      updateUI();
    } else {
      // Sometimes errors come as array or nested
      const errorMsg = data.message || (data.errors ? data.errors.join(', ') : 'Registration failed');
      showToast(errorMsg, 'error');
    }
  } catch (error) {
    showToast('Network error occurred', 'error');
  } finally {
    setLoading('regBtn', false);
  }
};

const handleLogout = async () => {
  setLoading('logoutBtn', true);
  try {
    const res = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    
    if (data.success) {
      localStorage.removeItem('accessToken');
      state.user = null;
      state.view = 'login';
      showToast(data.message || 'Logged out successfully', 'success');
      updateUI();
    } else {
      showToast(data.message || 'Logout failed', 'error');
    }
  } catch (error) {
    showToast('Network error occurred', 'error');
  } finally {
    setLoading('logoutBtn', false);
  }
};

// --- Event Listeners ---
el('showRegister').addEventListener('click', () => { state.view = 'register'; updateUI(); });
el('showLogin').addEventListener('click', () => { state.view = 'login'; updateUI(); });

el('loginForm').addEventListener('submit', handleLogin);
el('registerForm').addEventListener('submit', handleRegister);
el('logoutBtn').addEventListener('click', handleLogout);

// --- Init ---
updateUI();
if (localStorage.getItem('accessToken')) {
  checkCurrentUser();
}
