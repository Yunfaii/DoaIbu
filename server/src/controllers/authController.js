const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

const readUsers = () => {
  const data = fs.readFileSync(usersPath, 'utf8');
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const users = readUsers();

  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    profession: '',
    specialization: '',
    skills: [],
    certification: [],
    experience: '',
    location: '',
    portfolio: '',
    education: '',
    license_number: ''
  };

  users.push(newUser);
  writeUsers(users);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ 
    message: 'Registration successful', 
    user: userWithoutPassword 
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ 
    message: 'Login successful', 
    user: userWithoutPassword 
  });
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};