import express from 'express';
import dotenv from 'dotenv';
import authRouter from './auth.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.send('Server is running');
});

app.get('/', (req, res) => {
    res.send(`<a href="/auth/google">Authenticate with Google</a>`);
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});