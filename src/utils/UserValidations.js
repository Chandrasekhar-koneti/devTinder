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

const validateEditProfileData = (req) => {
  const AllowedFields = [
    "firstName",
    "lastName",
    "about",
    "age",
    "gender",
    "photoUrl",
    "skills",
  ];
  const { firstName, lastName, about, age, gender, photoUrl, skills } =
    req.body;

  if (
    (firstName && (firstName.length < 4 || firstName.length > 50)) ||
    (lastName && (lastName.length < 4 || lastName.length > 50))
  ) {
    throw new Error("Name must contain minimum 4 and maximum 50 characters");
  }

  if (skills && (skills.length > 8 || skills.length <= 0)) {
    throw new Error("Skills must be minimum 1 and maximum 8");
  }

  if (age && (age < 15 || age > 80)) {
    throw new Error("Age must be between 15 to 80");
  }

  if (gender && !["male", "female", "others"].includes(gender)) {
    throw new Error("Invalid gender. Gender must be male or female or others");
  }

  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Invalid photo url" + photoUrl);
  }

  if (about && (about.length < 10 || about.length > 200)) {
    throw new Error("About must be between 10 and 200 characters");
  }

  const isUpdateProfileData = Object.keys(req.body).every((field) =>
    AllowedFields.includes(field)
  );
  return isUpdateProfileData;
};

module.exports = { validateSignUpBody, validateEditProfileData };
