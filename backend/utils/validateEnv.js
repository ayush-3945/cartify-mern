// Environment variables validation utility
const requiredEnvs = ['MONGO_URI', 'SECRET_KEY', 'ORIGIN'];

function validateEnv() {
  const missing = requiredEnvs.filter(env => !process.env[env]);
  if (missing.length > 0) {
    console.warn('[CONFIG WARNING] Missing recommended environment variables:', missing.join(', '));
  } else {
    console.log('[CONFIG] Environment variables verified successfully.');
  }
}

module.exports = { validateEnv };
