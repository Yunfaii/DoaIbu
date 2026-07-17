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

exports.getProfile = (req, res) => {
  const userId = parseInt(req.query.userId);
  console.log('GET Profile - userId:', userId);
  
  const users = readUsers();
  console.log('Total users:', users.length);
  
  let user;
  if (userId) {
    user = users.find(u => u.id === userId);
    console.log('Mencari user dengan ID:', userId);
  } else {
    user = users[0];
    console.log('Tidak ada userId, pakai user pertama');
  }
  
  if (!user) {
    console.log('User tidak ditemukan');
    return res.status(404).json({ error: 'User not found' });
  }

  console.log('User ditemukan:', user.name);
  const { password, ...profile } = user;
  res.json(profile);
};

exports.updateProfile = (req, res) => {
  console.log('UPDATE Profile - Request body:', req.body);
  
  const { userId, name, email, skills, experience, location, portfolio, education, profession, specialization, certification, license_number } = req.body;
  
  let users = readUsers();
  console.log('Total users:', users.length);
  
  let userIndex;
  if (userId) {
    userIndex = users.findIndex(u => u.id === parseInt(userId));
    console.log('Mencari user index dengan ID:', userId);
  } else {
    userIndex = 0;
    console.log('Tidak ada userId, pakai index 0');
  }
  
  console.log('User index:', userIndex);
  
  if (userIndex === -1) {
    console.log('User tidak ditemukan');
    return res.status(404).json({ error: 'User not found' });
  }

  console.log('User ditemukan:', users[userIndex].name);

  const updatedUser = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    profession: profession || users[userIndex].profession || '',
    specialization: specialization || users[userIndex].specialization || '',
    skills: skills || users[userIndex].skills || [],
    certification: certification || users[userIndex].certification || [],
    experience: experience || users[userIndex].experience || '',
    location: location || users[userIndex].location || '',
    education: education || users[userIndex].education || '',
    license_number: license_number || users[userIndex].license_number || '',
    portfolio: portfolio || users[userIndex].portfolio || ''
  };

  users[userIndex] = updatedUser;
  writeUsers(users);

  console.log('Profile updated untuk:', updatedUser.name);
  
  const { password, ...updatedProfile } = updatedUser;
  res.json({ 
    message: 'Profile updated successfully', 
    profile: updatedProfile 
  });
};