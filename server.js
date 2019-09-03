const express = require('express');

const server = express();
const db = require('./data/db.js');
server.use(express.json());

//posts
server.get('/api/posts', (req, res) => {
    db.find().then(result => res.json(result)).catch(err => res.send(err))
})

server.post('/api/posts', (req, res) => {
    const post = req.body;
    if(post.title && post.contents) {
    db.insert(post).then(result => res.json(result)).catch(err => res.json(err))
    } else {
        res.json('Please include title and contents in post')
    }
})

server.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id).then(result => res.json(result)).catch(err => res.send(err))
})

//comments
server.get('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id
    db.findById(id).then(result => res.json(result)).catch(err => res.send(err))
})


module.exports = server;