import express from "express";
import dotenv from 'dotenv'
dotenv.config()
import dbconnect from "./config/dbconnect.js";
import userrouter from "./route/userroute.js";
import cors from "cors";
import youtubeRouter from './route/youtube.js'
import frouter from "./route/friendRoute.js";

const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL  // http://localhost:5173
}));

const PORT = process.env.PORT || 8080;

app.use('/api', youtubeRouter);
// ✅ PROXY ROUTES for Python services
app.get('/api/sign-status', async (req, res) => {
    try {
        const response = await fetch('http://localhost:5000/api/status');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(503).json({ service: "sign-to-text", status: "offline" });
    }
});

app.post('/api/text-to-sign', async (req, res) => {
    try {
        const response = await fetch('http://localhost:5001/api/text-to-sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(503).json({ error: 'Text-to-sign service offline' });
    }
});

app.get("/", (req, res) => {
    res.json({
        message: `Server running on port ${PORT}`,
        services: {
            auth: "online",
            "sign-to-text": "http://localhost:5000",
            "text-to-sign": "http://localhost:5001"
        }
    });
});

app.use('/api/users', userrouter);
app.use('/api/friends', frouter);

dbconnect().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 MERN Backend + Python Proxy on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server:", err);
});
