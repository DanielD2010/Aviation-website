const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(session({
  secret: 'aviationSecret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
function sanitize(str) {
  return String(str).replace(/[^a-zA-Z0-9_@!.-]/g, '').trim();
}

app.post('/register', async (req, res) => {
  let { username, password } = req.body;
  username = sanitize(username);
  if (!username || !password || username.length < 3 || password.length < 6) {
    return res.status(400).json({ error: 'Invalid username or password.' });
  }
  let users = loadUsers();
  console.log('Loaded users (register):', users);
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash });
  saveUsers(users);
  console.log('Saved users (register):', users);
  req.session.user = { username };
  res.json({ success: true, username });
});

app.post('/login', async (req, res) => {
  let { username, password } = req.body;
  username = sanitize(username);
  let users = loadUsers();
  console.log('Loaded users (login):', users);
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.user = { username };
  res.json({ success: true, username });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.session.user);
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
}); 