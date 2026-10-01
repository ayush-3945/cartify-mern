// Centralized validation regex and message rules
export const VALIDATION_RULES = {
  EMAIL: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid email address'
  },
  PASSWORD: {
    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number'
  },
  OTP: {
    minLength: 4,
    maxLength: 6,
    message: 'Please enter a valid OTP code'
  }
};
