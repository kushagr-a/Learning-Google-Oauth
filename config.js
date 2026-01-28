import dotenv from 'dotenv';

dotenv.config();

export const config = {
    google: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        REDIRECT_URI: 'http://localhost:3000/auth/google/callback',
    },
};