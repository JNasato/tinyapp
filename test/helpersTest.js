const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });

  it('should return undefined when an email is non-existent', () => {
    const user = getUserByEmail(testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});





