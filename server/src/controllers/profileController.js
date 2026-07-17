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

// GET user profile (default user)
exports.getProfile = (req, res) => {
  const users = readUsers();
  // Return first user as default profile
  const user = users[0];
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...profile } = user;
  res.json(profile);
};

// UPDATE user profile
exports.updateProfile = (req, res) => {
  const { name, email, skills, experience, location, portfolio, education } = req.body;
  
  let users = readUsers();
  // Update first user
  const userIndex = users.findIndex(u => u.id === 1);
  
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
