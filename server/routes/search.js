const { Product } = require('../models/Products');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ msg: 'Query is required' });
        }
        const items = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { catName: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(items);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            msg: 'Server Error'
        });
    }
});

module.exports = router;