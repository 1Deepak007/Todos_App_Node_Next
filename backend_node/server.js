require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();


const app = express();
const port = process.env.PORT || 5100;

connectDB();

app.use(cors
({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('Server is running'));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));

