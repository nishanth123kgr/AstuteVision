const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');

const app = express();
const server = createServer(app);


app.use(express.static('public'));

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('A user connected');

  ws.on('close', () => {
    console.log('A user disconnected');
  });

  ws.send(JSON.stringify({"data":"Hello from server"}));
  ws.on('message', (message) => {
    let msg = JSON.parse(message);
    if (msg.type === 'command') {
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
    } else if (msg.type === 'prediction') {
      console.log(msg.data);
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/model/', (req, res) => {
  res.sendFile(__dirname + '/model.html');
});