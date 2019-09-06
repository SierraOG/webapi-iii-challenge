const express = require('express');

const router = express.Router();

const db = require('./userDb')
const postDb = require('../posts/postDb')

router.use(express.json())

const errorHelper = (status, message, res) => {
    res.status(status).json({error:message})
}

router.post('/', validateUser, (req, res) => {
    const newUser = req.body
    db.insert(newUser)
    .then(user => {
        res.status(200).json(user)
    })
    .catch( err => {
        return errorHelper(500, 'Error adding user', res)
    })
});

router.post('/:id/posts', validatePost, (req, res) => {
    const rePost = req.body;
    rePost.user_id = req.params.id;
  
    if (rePost) {
      postDb.insert(rePost)
        .then(post => {
          res.status(200).json(post);
        })
        .catch(err => {
            return errorHelper(500, 'Error adding post', res)
        });
    }
});

router.get('/', (req, res) => {
    db.get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
        return errorHelper(500, 'Error getting user', res)
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.getById(id)
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => {
        return errorHelper(500, 'Error getting user', res)
      });
});

router.get('/:id/posts', (req, res) => {
    const id = req.params.id;
    db.getUserPosts(id)
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(err => {
        return errorHelper(500, 'Error getting user posts', res)
      });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
      .then(deleted => {
        if (deleted) {
          res.status(200).json({ message: "user deleted" });
        } else {
            return errorHelper(404, 'Error deleting user', res)
        }
      })
      .catch(err => {
        return errorHelper(500, 'Error deleting user', res)
      });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    db.update(id, changes)
      .then(updated => {
        res.status(200).json(updated);
      })
      .catch(err => {
        return errorHelper(500, 'Error updating user', res)
      });
});

//custom middleware

function validateUserId(req, res, next) {
    let users = req.params.id;

    db.getById(users)
      .then(user => {
        if (user) {
          next();
        } else {
            return errorHelper(400, 'Error finding user', res)
        }
      })
      .catch(err => {
        return errorHelper(500, 'Error finding user', res)
      });
};

function validateUser(req, res, next) {
    let body = req.body
    if (!body) {
        return errorHelper(400, 'Missing user data', res)
    } else {
        if (!body.name) {
            return errorHelper(400, 'Missing required name field', res)
        } else {
            next()
        }
    }
};

function validatePost(req, res, next) {
    let body = req.body
    if (!body) {
        return errorHelper(400, 'Missing post data', res)
    } else {
        if (!body.text) {
            return errorHelper(400, 'Missing required text field', res)
        } else {
            next()
        }
    }
};

module.exports = router;
