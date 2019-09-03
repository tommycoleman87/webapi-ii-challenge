const express = require('express');

const server = express();
const db = require('./data/db.js');
server.use(express.json());

//posts
server.get('/api/posts', (req, res) => {
    db.find().then(result => res.json(result)).catch(err => res.send(err))
})

server.get('/api/posts/:id', (req, res) => {
    const id = req.params.id
    db.findById(id).then(result => res.json(result)).catch(err => res.send(err))
})

server.put('/api/posts/:id', (req,res) => {
    const id = req.params.id
    const post = req.body
    if(post.title && post.contents) {
        db.update(id, post).then(result => res.json(result)).catch(err => res.send(err))
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    
})

server.post('/api/posts', (req, res) => {
    const post = req.body;
    if(post.title && post.contents) {
    db.insert(post).then(result => res.status(201).json(post)).catch(err => res.status(500).json({ error: "There was an error while saving the post to the database" }))
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
})

server.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id).then(result => res.json(result)).catch(err => res.send(err))
})

//comments
server.get('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id
    db.findPostComments(id).then(result => res.json(result)).catch(err => res.send(err))
})

server.post('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id
    const comment = req.body
    if(comment.post_id === id && comment.text) {
        db.insertComment(comment).then(result => res.status(201).json(comment)).catch(err => res.status(500).json({ error: "There was an error while saving the comment to the database" }))
    } else if(comment.post_id !== id){
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
})


module.exports = server;