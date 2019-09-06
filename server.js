const express = require('express');
const cors = require('cors')

const server = express();
server.use(express.json())
server.use(cors({}))

const userRouter = require("./users/userRouter")
const postRouter = require("./posts/postRouter")

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
    )}`
  );

  next();
};

server.use(logger);
server.use("/users", userRouter)
server.use("/posts", postRouter)

const errorHelper = (status, message, res) => {
  res.status(status).json({error:message})
}

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

// const nameChecker = (req, res, next) => {
//   const {name} = req.body;
//   if (!name) {
//     errorHelper(404, 'Name must be included', res);
//     next()
//   } else {
//     next()
//   }
// }

// server.get('/api/users', (req, res) =>{
//   users
//     .get()
//     .then(usersArray => {
//       res.json(usersArray)
//     })
//     .catch(err => {
//       return errorHelper(500, 'Error getting data', res)
//     })
// })

// server.post('/api/users', nameChecker, (req, res) => {
//   const {name} = req.body
//   users
//     .insert({name})
//     .then( response => {
//       res.json(response)
//     })
//     .catch( err => {
//       return errorHelper(500, 'Error adding name', res)
//     })
// });

//custom middleware

module.exports = server;
