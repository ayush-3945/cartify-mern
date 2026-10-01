// Application logger utility with timestamps
const log = {
  info: (msg, ...args) => console.log(`[INFO ${new Date().toLocaleTimeString()}]: ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[WARN ${new Date().toLocaleTimeString()}]: ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[ERROR ${new Date().toLocaleTimeString()}]: ${msg}`, ...args),
  success: (msg, ...args) => console.log(`[SUCCESS ${new Date().toLocaleTimeString()}]: ${msg}`, ...args)
};

module.exports = { log };
