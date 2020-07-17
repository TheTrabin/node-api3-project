const express = require('express');
const helmet = require('helmet');
const server = express();
const userRouter = require('./users/userRouter.js')
const postsRouter = require("./posts/postRouter.js");

server.use(express.json())

server.use(logger);

server.use('/api/users', userRouter);
server.use("/api/posts", postsRouter);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
  const messageOfTheDay = process.env.MOTD || 'Hello World'
  res.status(200).json({ api: "up", motd: messageOfTheDay });
});

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method}, Location: ${req.url}, When: [${new Date().toISOString()}] `)
next();
}

module.exports = server;
