import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('pages/index', {
        pageTitle: "Alisher's Blog - Bosh sahifa"
    });
});

app.get('/blog', (req, res) => {
    res.render('pages/blog', {
        pageTitle: 'Mening Blogim',
        articles: [] 
    });
});
app.get('/projects', (req, res) => {
    res.render('pages/projects', { 
        pageTitle: 'Loyihalarim'
    });
});

app.get('/posts/:slug', (req, res) => {
    res.render('pages/post', {
        pageTitle: "Maqola topilmadi",
        post: undefined 
    });
});

app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} portida ishga tushdi`);
    console.log('Eslatma: MongoDB hozircha ulanmagan (kod sharhda).');
});

/*
// MongoDB'ni ulash uchun bu kodni keyinroq sharhdan ochamiz:
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB ga muvaffaqiyatli ulandi!');
        app.listen(PORT, () => {
            console.log(`Server http://localhost:${PORT} portida ishga tushdi`);
        });
    })
    .catch(err => {
        console.error('MongoDB ga ulanishda xatolik:', err);
    });
*/