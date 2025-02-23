const cors = require('cors');

app.use(cors({
  origin: [
    'https://film-client.netlify.app',
    'http://localhost:1234' // for local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Accept',
    'X-Requested-With'
  ],
  exposedHeaders: ['Authorization'],
  credentials: true
})); 