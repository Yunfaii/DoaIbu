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

// GET user profile by ID (from query param)
exports.getProfile = (req, res) => {
  const userId = parseInt(req.query.userId);
  const users = readUsers();
  
  // If userId provided, get that user, otherwise get first user
  let user;
  if (userId) {
    user = users.find(u => u.id === userId);
  } else {
    user = users[0];
  }
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...profile } = user;
  res.json(profile);
};

// UPDATE user profile
exports.updateProfile = (req, res) => {
  const { userId, name, email, skills, experience, location, portfolio, education } = req.body;
  
  let users = readUsers();
  
  // Find user by ID or use first user
  let userIndex;
  if (userId) {
    userIndex = users.findIndex(u => u.id === userId);
  } else {
    userIndex = 0; // default to first user
  }
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update user fields
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    skills: skills || users[userIndex].skills,
    experience: experience || users[userIndex].experience,
    location: location || users[userIndex].location,
    portfolio: portfolio || users[userIndex].portfolio,
    education: education || users[userIndex].education
  };

  writeUsers(users);

  const { password, ...updatedProfile } = users[userIndex];
  res.json({ 
    message: 'Profile updated successfully!', 
    profile: updatedProfile 
  });
};
