const Gpio = require('pigpio').Gpio;
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

// Define public dir
app.use(express.static('public'));

app.use(express.static('node_modules'));

const led = new Gpio(4, {mode: Gpio.OUTPUT});

// Default to /
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Check connections
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });

      socket.on('led_on', (msg) => {
        led.pwmWrite(255);

      });

      socket.on('led_off', (msg) => {
        led.pwmWrite(0);

      });
  });

  
// Set listener
http.listen(3000, () => {
  console.log('listening on *:3000');
});