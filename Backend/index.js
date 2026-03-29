import express from "express";
import dotenv from 'dotenv'
dotenv.config()
import dbconnect from "./config/dbconnect.js";
import userrouter from "./route/userroute.js";
import adminRouter from "./route/adminRoute.js";
import signRouter from "./route/signRoute.js";
import cors from "cors";
import youtubeRouter from './route/youtube.js'
import frouter from "./route/friendRoute.js";
import path from 'path';
import { existsSync, readdirSync } from 'fs';
import quizRouter from "./route/quiz.js";
import Lessonrouter from "./route/lesson.routes.js";
import practicesignrouter from "./route/practicesign.js";

const app = express();

// 🔥 MIDDLEWARE FIRST
app.use(express.json({ limit: '10mb' }));
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
const PORT = process.env.PORT || 8080;

// 🔍 FIND YOUR EXACT FOLDERS
console.log('🔍 Backend folder:', process.cwd());
console.log('🔍 Expected frontend:', path.join(process.cwd(), '../frontend/public/lessons'));

const frontendLessons = path.join(process.cwd(), '../frontend/public/lessons');
const backendLessons = path.join(process.cwd(), 'Backend/public/lessons');

// ✅ DEBUG: Check what actually exists
console.log('📁 Frontend lessons exists?', existsSync(frontendLessons));
console.log('📁 Backend lessons exists?', existsSync(backendLessons));

if (existsSync(frontendLessons)) {
    console.log('✅ USING FRONTEND PATH');
    readdirSync(frontendLessons).slice(0, 10).forEach(folder => 
        console.log('   📂', folder)
    );
}

// 🔥 SIMPLE FIX: Backend lessons FIRST (most likely working)
if (existsSync(backendLessons)) {
    console.log('🚀 ✅ SERVING Backend/public/lessons');
    app.use('/lessons', express.static(backendLessons, {
        maxAge: '7d',
        etag: false,
        setHeaders: (res, path) => {
            if (path.match(/\.(png|gif|jpg)$/i)) {
                res.set('Cache-Control', 'public, max-age=604800, immutable');
            }
        }
    }));
} 
// 🔥 FALLBACK: Frontend lessons
else if (existsSync(frontendLessons)) {
    console.log('🚀 ✅ SERVING frontend/public/lessons');
    app.use('/lessons', express.static(frontendLessons, {
        maxAge: '7d',
        etag: false,
        setHeaders: (res, path) => {
            if (path.match(/\.(png|gif|jpg)$/i)) {
                res.set('Cache-Control', 'public, max-age=604800, immutable');
            }
        }
    }));
} else {
    console.error('❌ NO LESSONS FOLDER FOUND ANYWHERE!');
}

app.use('/uploads', express.static(path.join(process.cwd(), 'Backend', 'uploads'), { maxAge: '1d' }));

console.log('🚀 ✅ STATIC FILES LIVE!');
console.log('   📁 Lessons path:', existsSync(backendLessons) ? backendLessons : frontendLessons);
console.log('   🧪 Test: http://localhost:8080/lessons/alphabets/a.png');
console.log('   🧪 Test: http://localhost:8080/lessons/numbers/one.png');

// ✅ ALL ROUTES
app.use('/api', youtubeRouter);
app.use('/api/users', userrouter);
app.use('/api/friends', frouter);
app.use('/api/admin', adminRouter);
app.use('/api/signs', signRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/lesson', Lessonrouter);
app.use('/api', practicesignrouter);

// ✅ PROXY ROUTES (unchanged)
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

// 🏠 ROOT ENDPOINT
app.get("/", (req, res) => {
    res.json({
        message: `🚀 MERN Backend LIVE on port ${PORT}`,
        lessonsPath: existsSync(backendLessons) ? backendLessons : frontendLessons,
        testImages: [
            "🔤 http://localhost:8080/lessons/alphabets/a.png",
            "🔤 http://localhost:8080/lessons/alphabets/z.png",
            "🔢 http://localhost:8080/lessons/numbers/one.png",
            "🍎 http://localhost:8080/lessons/Fruits/apple.gif"
        ]
    });
});

// 🚀 Start Server
dbconnect().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🎉 ✅ SERVER LIVE on port ${PORT}`);
        console.log(`🔤 ALPHABETS: http://localhost:${PORT}/lessons/alphabets/a.png`);
        console.log(`🔢 NUMBERS: http://localhost:${PORT}/lessons/numbers/one.png`);
        console.log(`📱 Frontend: ${process.env.FRONTEND_URL}`);
    });
}).catch((err) => {
    console.error("❌ Failed to start server:", err);
});
