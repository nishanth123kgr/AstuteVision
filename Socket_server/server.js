const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.emit('message', 'Hello from server');
  socket.on("command", (data) => {
    console.log(data);
    socket.broadcast.emit("command", data);
  });
});

const port = 3000;
server.listen(port, "0.0.0.0",() => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/model/', (req, res) => {
  res.sendFile(__dirname + '/model.html');
});