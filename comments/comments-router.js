const express = require('express');

const Posts = require('../data/db');

const router = express.Router();

router.post('/:id/comments', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    Posts.insertComment(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error adding comment'
            })
        })
})

router.get('/:id/comments', async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        const message = await Posts.findPostComments(id);
        console.log(message);
        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json({ success: false, message: 'invalid message id' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

module.exports = router;