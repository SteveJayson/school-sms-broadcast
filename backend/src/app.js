const cors = require('cors');

// Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://school-sms-frontend.onrender.com',
  'https://*.onrender.com',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));