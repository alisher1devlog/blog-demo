import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    // Slug - bu maqolaning 'cat' buyrug'i uchun ishlatiladigan 
    // probelsiz, unikal nomi (masalan, 'mening-birinchi-maqolam')
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true // createdAt va updatedAt maydonlarini avtomatik qo'shadi
});

const Article = mongoose.model('Article', articleSchema);

export default Article;