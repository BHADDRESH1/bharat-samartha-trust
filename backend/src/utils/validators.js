const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[\d\s-()]{10,}$/;

const validateEmail = (email) => {
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  return phoneRegex.test(phone);
};

const validatePassword = (password) => {
  return password && password.length >= 8;
};

const validateRequiredFields = (fields) => {
  return fields.every(field => field !== undefined && field !== null && field !== '');
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateRequiredFields
};