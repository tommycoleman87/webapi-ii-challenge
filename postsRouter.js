const express = require('express');
const router = express.Router()
const db = require('./data/db.js');
router.use(express.json())
router.get('/posts', (req, res) => {
    db.find().then(result => res.status(200).json(result)).catch(err => res.status(500).json({ error: "The posts information could not be retrieved." }))
})

router.get('/posts/:id', (req, res) => {
    const id = req.params.id
    db.findById(id).then(result => {
        if (result.length > 0) {
            res.status(200).json(result)
        } else {
            res.status(400).json({ message: "The post with the specified ID does not exist." })
        }
    }).catch(err => res.status(500).json({ error: "The post information could not be retrieved." }))
})

router.put('/posts/:id', (req, res) => {
    const id = req.params.id
    const post = req.body
    if (post.title && post.contents) {
        db.update(id, post).then(result => {
            if (result > 0) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        }).catch(err => res.status(500).json({ error: "The post information could not be modified." }))
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }

})

router.post('/posts', (req, res) => {
    const post = req.body;
    if (post.title && post.contents) {
        db.insert(post).then(result => res.status(201).json(post)).catch(err => res.status(500).json({ error: "There was an error while saving the post to the database" }))
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
})

router.delete('/posts/:id', (req, res) => {
    const id = req.params.id;
    let deleted;
    db.findById(id)
    .then(result => {
        deleted = result;
        db.remove(id).then(re => {
            res.status(200).json(deleted)
        })
        .catch(err => res.status(500).json({ error: "The post could not be removed" }))
    })
    .catch(err => res.status(404).json({ message: "The post with the specified ID does not exist." }))
})

//comments
router.get('/posts/:id/comments', (req, res) => {
    const id = req.params.id

    db.findById(id)
        .then(result => {
            if(result.length > 0) {
                db.findPostComments(id).then(result => {
                        res.status(200).json(result)
                    
                }).catch(err => res.status(500).json({ error: "The comments information could not be retrieved." }))
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

router.post('/posts/:id/comments', (req, res) => {
    const id = req.params.id
    const comment = req.body
    if (comment.post_id === id && comment.text) {
        db.insertComment(comment).then(result => res.status(201).json(comment)).catch(err => res.status(500).json({ error: "There was an error while saving the comment to the database" }))
    } else if (comment.post_id !== id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
})

module.exports = router;
