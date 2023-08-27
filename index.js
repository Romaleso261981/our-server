const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 8080;

app.use(cors()); // Використовуємо cors для дозволу запитів з будь-яких джерел

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Обробка події відправлення повідомлення
  socket.on('send-message', (data) => {
    io.emit('new-message', { user: connectedUsers[socket.id], message: data.message });
  });

  // Обробка події підключення нового користувача
  socket.on('new-user', (username) => {
    connectedUsers[socket.id] = username;
    io.emit('user-connected', username);
  });

  // Обробка події відключення користувача
  socket.on('disconnect', () => {
    const username = connectedUsers[socket.id];
    delete connectedUsers[socket.id];
    io.emit('user-disconnected', username);
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 8080 });

// const connections = [];

// wss.on('connection', (ws) => {
//   connections.push(ws);

//   ws.on('message', (message) => {
//     connections.forEach((connection) => {
//       if (connection !== ws && connection.readyState === WebSocket.OPEN) {
//         connection.send(message.toString('utf-8'));
//       }
//     });
//   });

//   ws.on('close', () => {
//     // Видалити підключення при закритті з'єднання
//     const index = connections.indexOf(ws);
//     if (index !== -1) {
//       connections.splice(index, 1);
//     }
//   });
// });