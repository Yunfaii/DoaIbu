const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

// Helper function to read users
const readUsers = () => {
  const data = fs.readFileSync(usersPath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write users
const writeUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  // Validate
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const users = readUsers();

  // Check if email already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    skills: [],
    experience: '0 years',
    location: '',
    portfolio: '',
    education: ''
  };

  users.push(newUser);
  writeUsers(users);

  // Return user without password
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

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  res.json({ 
    message: 'Login successful', 
    user: userWithoutPassword 
  });
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};
