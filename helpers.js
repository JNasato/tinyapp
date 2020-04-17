const generateRandomString = (length) => {
  return Math.random().toString(36).substr(2, length);
};

const emailLookUp = (users, emailCheck) => {
  for (let user in users) {
    if (users[user].email === emailCheck) {
      return true;
    }
  }
  return false;
};

const getUserByEmail = (users, emailCheck) => {
  for (let user in users) {
    if (users[user].email === emailCheck) {
      return users[user];
    }
  }
};

module.exports = {
  generateRandomString,
  emailLookUp,
  getUserByEmail
};