import { Router } from 'express';
const router = Router();

// Asosiy '/' manziliga so'rov kelganda...
router.get('/', (req, res) => {
    // Bizning yagona terminal qobig'imizni render qilamiz
    res.render('pages/index', {
        pageTitle: "Alisher's Terminal Blog"
    });
});

export default router;