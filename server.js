const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimiter = require('./middleware/rateLimiter');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors()); 

app.use(express.json());
app.use(rateLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/email', require('./routes/email'));
app.use('/api/oauth', require('./routes/google'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));