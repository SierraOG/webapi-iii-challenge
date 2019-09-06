const express = require('express');

const db = require("./postDb")

const router = express.Router();
router.use(express.json())

const errorHelper = (status, message, res) => {
    res.status(status).json({error:message})
}

router.get('/', (req, res) => {
    db.get()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch( err => {
        return errorHelper(500, 'Error getting posts', res)
    })
});

router.get('/:id', validatePostId, (req, res) => {
    let id = req.params.id
    db.getById(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch( err => {
        return errorHelper(500, 'Error getting post', res)
    })
});

router.delete('/:id', validatePostId, (req, res) => {
    let id = req.params.id
    db.remove(id)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch( err => {
        return errorHelper(500, 'Error deleting post', res)
    })
});

router.put('/:id', validatePostId, (req, res) => {
    const id = req.params.id
    const updatedPost = req.body
    db.update(id,updatedPost)
    .then(post => {
        res.status(200).json(post)
    })
    .catch( err => {
        return errorHelper(500, 'Error updating post', res)
    })
});

// custom middleware

function validatePostId(req, res, next) {
    let id = req.params.id
    db.getById(id)
    .then(post => {
        if (post) {
            next()
        } else {
        return errorHelper(400, 'User not found', res)
        }
    })
    .catch( err => {
        return errorHelper(500, 'Error finding post', res)
    })
};

module.exports = router;