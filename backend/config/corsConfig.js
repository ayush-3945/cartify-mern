// Modular CORS configuration
const allowedOrigins = [
  process.env.ORIGIN,
  'http://localhost:3000',
  'https://cartify-mern-ruddy.vercel.app'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  exposedHeaders: ['X-Total-Count'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
};

module.exports = { corsOptions };
