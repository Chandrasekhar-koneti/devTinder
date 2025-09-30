const validator = require("validator");

const validateSignUpBody = (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is required");
  } else if (firstName.length < 4 || lastName.length > 50) {
    throw new Error(
      "Name must contain minimum 4 charaters and maximum 50 characters "
    );
  }
  if (!emailId) {
    throw new Error("Emaild id is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email id");
  }

  if (!password) {
    throw new Error("password is empty");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }

  if (!age) {
    throw new Error("Age is required");
  } else if (age < 15 || age > 80) {
    throw new Error("Age must be between 15 to 80");
  }

  if (!gender) {
    throw new Error("Gender is required");
  } else if (!["male", "female", "others"].includes(gender)) {
    throw new Error("Invalid gender.");
  }
};

module.exports = { validateSignUpBody };
