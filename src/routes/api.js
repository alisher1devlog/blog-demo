import { Router } from 'express';
import Article from '../models/Article.js'; // Biz hozir yaratgan modelni import qilamiz

const router = Router();

/**
 * GET /api/posts
 * "ls" buyrug'i uchun. Barcha maqolalarning sarlavhasi va slug'ini qaytaradi.
 */
router.get('/posts', async (req, res) => {
    try {
        // Faqat kerakli maydonlarni (title, slug) olamiz
        const articles = await Article.find().select('title slug').sort({ createdAt: 'desc' });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: "Server xatosi: Maqolalarni olib bo'lmadi" });
    }
});

/**
 * GET /api/posts/:slug
 * "cat [slug]" buyrug'i uchun. Bitta maqolani slug orqali topib qaytaradi.
 */
router.get('/posts/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        
        if (!article) {
            // Agar maqola topilmasa
            return res.status(404).json({ message: "Xato: Bunday maqola topilmadi." });
        }
        
        res.json(article); // Maqolaning to'liq ma'lumotini yuboramiz
    } catch (err) {
        res.status(500).json({ message: "Server xatosi" });
    }
});

export default router;  