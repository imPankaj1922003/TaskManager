export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validateTaskTitle = (title) => {
  return title.trim().length > 0;
};

export const validateTaskDescription = (description) => {
  return description.trim().length > 0;
};