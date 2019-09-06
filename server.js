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

server.get("/", (req, res) => {
  res.send(`<h2>Sierra's blog!</h2>`);
});

module.exports = server;
