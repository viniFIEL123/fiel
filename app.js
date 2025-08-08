// app.js

// Credenciais do OWNER hard-coded (apenas demo, não usar em produção)
const OWNER_USER = 'beyby';
const OWNER_PASS = '0001';

// DOM elements
const modalContainer = document.getElementById('modal-container');
const loginBtn = document.getElementById('login-btn');
const userInfo = document.getElementById('user-info');
const postsContainer = document.getElementById('posts-container');

let currentUser = null; // usuário logado {username,email,isOwner}
let posts = []; // array de posts
let currentCategory = null; // skin | arma | veículo

// Detecta categoria pela página atual
function detectCategoryFromURL() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('skins.html')) return 'Skin';
  if (path.includes('armas.html')) return 'Arma';
  if (path.includes('veiculos.html')) return 'Veículo';
  return null; // home ou outras páginas sem categoria
}

// Salva posts no localStorage
function savePosts() {
  localStorage.setItem('beyby_posts', JSON.stringify(posts));
}

// Carrega posts do localStorage
function loadPosts() {
  const data = localStorage.getItem('beyby_posts');
  posts = data ? JSON.parse(data) : [];
}

// Salva sessão atual
function saveSession() {
  if (currentUser) {
    localStorage.setItem('beyby_session', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('beyby_session');
  }
}

// Carrega sessão
function loadSession() {
  const session = localStorage.getItem('beyby_session');
  if (session) {
    currentUser = JSON.parse(session);
  }
}

// Exibe posts da categoria atual na tela
function renderPosts() {
  if (!postsContainer) return;

  // Limpa conteúdo
  postsContainer.innerHTML = '';

  // Filtra posts da categoria atual
  const filtered = posts.filter(p => p.categoria === currentCategory);

  if (filtered.length === 0) {
    postsContainer.innerHTML = `<p style="color:#ccc; text-align:center;">Nenhum drop encontrado nesta categoria.</p>`;
    return;
  }

  filtered.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');

    postEl.innerHTML = `
      <img src="${post.imageDataURL}" alt="${post.titulo}" />
      <h4>${post.titulo}</h4>
      <p>${post.descricao}</p>
    `;

    // Botão download só se link válido e usuário logado
    if (post.downloadUrl && currentUser) {
      const btnDownload = document.createElement('button');
      btnDownload.textContent = 'Download';
      btnDownload.classList.add('download-btn');
      btnDownload.onclick = () => window.open(post.downloadUrl, '_blank');
      postEl.appendChild(btnDownload);
    }

    // Botão excluir só para owner
    if (currentUser && currentUser.isOwner) {
      const btnDelete = document.createElement('button');
      btnDelete.textContent = 'Excluir';
      btnDelete.classList.add('delete-btn');
      btnDelete.onclick = () => {
        if (confirm(`Excluir o post "${post.titulo}"?`)) {
          posts = posts.filter(p => p.id !== post.id);
          savePosts();
          renderPosts();
          showToast('Post excluído com sucesso!');
        }
      };
      postEl.appendChild(btnDelete);
    }

    postsContainer.appendChild(postEl);
  });
}

// Renderiza informações do usuário no cabeçalho
function renderUserInfo() {
  if (!userInfo) return;

  userInfo.innerHTML = '';

  if (currentUser) {
    // Mostra avatar + nome + logout
    const avatar = document.createElement('div');
    avatar.textContent = '👑';
    avatar.style.fontSize = '20px';

    const name = document.createElement('span');
    name.textContent = currentUser.isOwner
      ? `Owner: ${currentUser.username}`
      : `Usuário: ${currentUser.username}`;

    const btnLogout = document.createElement('button');
    btnLogout.textContent = 'Logout';
    btnLogout.onclick = () => {
      logout();
    };

    userInfo.appendChild(avatar);
    userInfo.appendChild(name);
    userInfo.appendChild(btnLogout);

    // Esconde botão Entrar
    if (loginBtn) loginBtn.style.display = 'none';

    // Se página categoria, mostra botão Postar para owner
    if (currentCategory && currentUser.isOwner) {
      if (!document.getElementById('postar-btn')) {
        const postBtn = document.createElement('button');
        postBtn.id = 'postar-btn';
        postBtn.textContent = 'Postar';
        postBtn.style.marginLeft = '20px';
        postBtn.onclick = openPostModal;
        userInfo.appendChild(postBtn);
      }
    }
  } else {
    // Usuário não logado
    if (loginBtn) loginBtn.style.display = 'inline-block';
  }
}

// Logout
function logout() {
  currentUser = null;
  saveSession();
  renderUserInfo();
  renderPosts();
  closeModal();
  alert('Logout realizado com sucesso!');
}

// Abre modal login/register
function openLoginModal() {
  modalContainer.style.display = 'flex';
  modalContainer.innerHTML = `
    <div class="modal-content">
      <h3>Entrar / Registrar</h3>
      <input type="text" id="username-input" placeholder="Usuário" />
      <input type="email" id="email-input" placeholder="Email (para registro)" />
      <input type="password" id="password-input" placeholder="Senha" />
      <button id="login-submit-btn">Entrar</button>
      <button id="register-submit-btn">Registrar</button>
      <button id="modal-close-btn" style="margin-top:10px; background:#d90429;">Cancelar</button>
    </div>
  `;

  document.getElementById('modal-close-btn').onclick = closeModal;
  document.getElementById('login-submit-btn').onclick = loginUser;
  document.getElementById('register-submit-btn').onclick = registerUser;
}

// Fecha modal
function closeModal() {
  modalContainer.style.display = 'none';
  modalContainer.innerHTML = '';
}

// Valida email simples
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Login
function loginUser() {
  const username = document.getElementById('username-input').value.trim();
  const password = document.getElementById('password-input').value;

  if (!username || !password) {
    alert('Preencha usuário e senha para entrar.');
    return;
  }

  // Hardcoded owner login
  if (username === OWNER_USER && password === OWNER_PASS) {
    currentUser = { username, email: '', isOwner: true };
    saveSession();
    renderUserInfo();
    renderPosts();
    closeModal();
    alert('Logado como Owner com sucesso!');
    return;
  }

  // Verifica credenciais do usuário comum salvo em localStorage
  const usersData = localStorage.getItem('beyby_users');
  const users = usersData ? JSON.parse(usersData) : [];

  const userFound = users.find(u => u.username === username && u.password === password);

  if (userFound) {
    currentUser = { username: userFound.username, email: userFound.email, isOwner: false };
    saveSession();
    renderUserInfo();
    renderPosts();
    closeModal();
    alert('Login efetuado com sucesso!');
  } else {
    alert('Usuário ou senha incorretos.');
  }
}

// Registro
function registerUser() {
  const username = document.getElementById('username-input').value.trim();
  const email = document.getElementById('email-input').value.trim();
  const password = document.getElementById('password-input').value;

  if (!username || !email || !password) {
    alert('Preencha todos os campos para registrar.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Email inválido.');
    return;
  }

  // Não permitir registrar como owner
  if (username === OWNER_USER) {
    alert('Usuário reservado. Escolha outro nome.');
    return;
  }

  // Salva no localStorage
  const usersData = localStorage.getItem('beyby_users');
  const users = usersData ? JSON.parse(usersData) : [];

  if (users.find(u => u.username === username)) {
    alert('Usuário já existe.');
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem('beyby_users', JSON.stringify(users));

  alert('Registrado com sucesso! Agora faça login.');
}

// Abre modal de post novo (só owner)
function openPostModal() {
  modalContainer.style.display = 'flex';
  modalContainer.innerHTML = `
    <div class="modal-content">
      <h3>Postar novo drop</h3>
      <input type="text" id="post-title" placeholder="Título" />
      <select id="post-category" disabled>
        <option value="${currentCategory}" selected>${currentCategory}</option>
      </select>
      <textarea id="post-description" rows="4" placeholder="Descrição"></textarea>
      <input type="url" id="post-download" placeholder="URL para download (opcional)" />
      <input type="file" id="post-image" accept="image/*" />
      <img id="post-image-preview" style="max-width:100%; margin-top:10px; display:none; border-radius:8px;" />
      <button id="submit-post-btn">Postar</button>
      <button id="modal-close-btn" style="margin-top:10px; background:#d90429;">Cancelar</button>
    </div>
  `;

  const fileInput = document.getElementById('post-image');
  const imgPreview = document.getElementById('post-image-preview');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) {
      imgPreview.style.display = 'none';
      imgPreview.src = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      imgPreview.src = e.target.result;
      imgPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('submit-post-btn').onclick = submitNewPost;
  document.getElementById('modal-close-btn').onclick = closeModal;
}

// Gera ID simples
function generateID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Valida URL simples
function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Envia novo post
function submitNewPost() {
  const titulo = document.getElementById('post-title').value.trim();
  const descricao = document.getElementById('post-description').value.trim();
  const downloadUrl = document.getElementById('post-download').value.trim();
  const imgPreview = document.getElementById('post-image-preview');

  if (!titulo || !descricao) {
    alert('Título e descrição são obrigatórios.');
    return;
  }

  if (downloadUrl && !validateURL(downloadUrl)) {
    alert('URL de download inválida.');
    return;
  }

  if (!imgPreview.src) {
    alert('Por favor, envie uma imagem.');
    return;
  }

  const novoPost = {
    id: generateID(),
    categoria: currentCategory,
    titulo,
    descricao,
    downloadUrl: downloadUrl || '',
    imageDataURL: imgPreview.src,
    createdAt: Date.now()
  };

  posts.push(novoPost);
  savePosts();
  renderPosts();
  closeModal();
  showToast('Post publicado com sucesso!');
}

// Toast simples
function showToast(msg) {
  let toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#7209b7';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '30px';
  toast.style.boxShadow = '0 0 10px #b5179e';
  toast.style.zIndex = '10000';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.4s ease';
  document.body.appendChild(toast);

  setTimeout(() => (toast.style.opacity = '1'), 100);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 400);
  }, 3000);
}

// Inicialização principal
function init() {
  currentCategory = detectCategoryFromURL();
  loadSession();
  loadPosts();
  renderUserInfo();
  renderPosts();

  if (loginBtn) {
    loginBtn.onclick = e => {
      e.preventDefault();
      openLoginModal();
    };
  }
}

init();
const firebaseConfig = {
  apiKey: "AIzaSyChW7kJjCqeEOMx_3nKl8tb7RyYBRMuZxg",
  authDomain: "beyby-26fee.firebaseapp.com",
  databaseURL: "https://beyby-26fee-default-rtdb.firebaseio.com",
  projectId: "beyby-26fee",
  storageBucket: "beyby-26fee.firebasestorage.app",
  messagingSenderId: "261628292926",
  appId: "1:261628292926:web:c72a2abe7cd89a9e0c066f",
  measurementId: "G-E3X1WJ5YP6"
};

