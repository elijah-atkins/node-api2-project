const express = require('express');

const Posts = require('../data/db');

const router = express.Router();

router.post('/', (req, res) => {
    Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error adding post',
            })
        })
})

router.get('/', (req, res) => {
   // console.log(req.query);
    Posts.find(req.query)
        .then(post => {
            // note the "200" response... 2xx responses are "success" responses.
            res.status(200).json(post);
        })
        .catch(error => {

            res.status(500).json({
                message: 'Error retrieving the posts',
            });
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id
    //console.log(`ID: ${id}`)
    Posts.findById(id)
        .then(post => {
            // note the "200" response... 2xx responses are "success" responses.
            res.status(200).json(post);
        })
        .catch(error => {

            res.status(500).json({
                message: `Error retrieving the posts ${id}`,
            });
        });
});

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'This post has ben deleted' });
            } else {
                res.status(404).json({ message: 'The post could not be found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error removing the post',
            });
        });
});

router.put('/:id', (req, res) => {
    const id = res.params.id
    const changes = req.body;
    Posts.update(id, changes)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'The post could not be found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: `Error updating the post ${id}`,
            });
        });
});

//comments routers

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