let currentUser = null;
let isAdmin = false;

function openAuthModal() {
  document.getElementById('authModal').style.display = 'block';
  showAuthTab('login');
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
  document.getElementById('registerError').style.display = 'none';
  document.getElementById('registerSuccess').style.display = 'none';
}

function showAuthTab(tab) {
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
}

// All login/register/authentication logic removed

function showUploadForm(section) {
  const formId = section + 'UploadForm';
  const formDiv = document.getElementById(formId);
  formDiv.innerHTML = `
    <form onsubmit="return submitUploadForm('${section}')">
      <label>Select Image: <input type="file" accept="image/*" id="${section}ImageInput" required></label><br>
      <label>Description: <input type="text" id="${section}DescInput" required></label><br>
      <button type="submit">Upload</button>
      <button type="button" onclick="hideUploadForm('${section}')">Cancel</button>
    </form>
  `;
  formDiv.style.display = 'block';
}

function hideUploadForm(section) {
  document.getElementById(section + 'UploadForm').style.display = 'none';
}

function submitUploadForm(section) {
  const fileInput = document.getElementById(section + 'ImageInput');
  const descInput = document.getElementById(section + 'DescInput');
  const file = fileInput.files[0];
  const desc = descInput.value;
  if (file && desc) {
    const reader = new FileReader();
    reader.onload = function(e) {
      addImageToGallery(section, e.target.result, desc);
      saveUpload(section, e.target.result, desc);
    };
    reader.readAsDataURL(file);
  }
  hideUploadForm(section);
  return false;
}

function addImageToGallery(section, imgSrc, desc) {
  const gridId = section + 'GalleryGrid';
  const grid = document.getElementById(gridId);
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.innerHTML = `
    <img src="${imgSrc}" alt="${desc}" />
    <div class="gallery-overlay">
      <div class="gallery-info">
        <h3>${desc}</h3>
        <p>Uploaded by admin</p>
        <span class="aircraft-type">Custom Upload</span>
      </div>
    </div>
  `;
  grid.appendChild(div);
}

function saveUpload(section, imgSrc, desc) {
  let uploads = JSON.parse(localStorage.getItem(section + 'Uploads') || '[]');
  uploads.push({ imgSrc, desc });
  localStorage.setItem(section + 'Uploads', JSON.stringify(uploads));
}

function loadUploads() {
  ['civil', 'military'].forEach(section => {
    let uploads = JSON.parse(localStorage.getItem(section + 'Uploads') || '[]');
    uploads.forEach(u => addImageToGallery(section, u.imgSrc, u.desc));
  });
}

function showControlPanel() {
  document.getElementById('controlPanelModal').style.display = 'block';
}

function closeControlPanel() {
  document.getElementById('controlPanelModal').style.display = 'none';
}

// Hide modal on outside click
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
};

// On page load, check session
window.addEventListener('DOMContentLoaded', async function() {
  try {
    const res = await fetch('http://localhost:3000/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      currentUser = data.username;
    } else {
      currentUser = null;
    }
  } catch (e) {
    currentUser = null;
  }
  updateAuthUI();
});
