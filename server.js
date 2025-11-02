// server.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; // <-- (Buni import qiling)
import mongoose from 'mongoose'; // <-- (Buni import qiling)

// Routerlarni import qilish
import mainRoutes from './src/routes/main.js';
import apiRoutes from './src/routes/api.js'; // <-- 1. BU QATORNI QO'SHING (yoki sharhdan oching)

// .env faylini yuklash
dotenv.config();

// __dirname ni sozlash
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ... (EJS, static papkalarni sozlash) ...
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Routerlarni ishlatish
app.use('/', mainRoutes);
app.use('/api', apiRoutes); // <-- 2. BU QATORNI QO'SHING (yoki sharhdan oching)


// --- 3. MONGODB GA ULANISH ---
// (Bu qismni qo'shing yoki sharhdan oching)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB ga muvaffaqiyatli ulandi!');
        
        // Faqat DB ulangandan keyin serverni ishga tushiramiz
        app.listen(PORT, () => {
            console.log(`Server http://localhost:${PORT} portida ishga tushdi`);
        });
    })
    .catch(err => {
        console.error('MongoDB ga ulanishda xatolik:', err);
    });