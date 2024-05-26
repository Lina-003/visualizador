const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static('public'));

let lightData = [];
let ledColor = 'green';

app.post('/api/light', (req, res) => {
    const { level, timestamp } = req.body;
    lightData.push({ level, timestamp });

    if (lightData.length > 100) {
        lightData.shift();
    }

    if (level < 200) {
        ledColor = 'red';
    } else if (level < 400) {
        ledColor = 'yellow';
    } else {
        ledColor = 'green';
    }

    io.emit('dataUpdate', { lightData, ledColor });

    res.sendStatus(200);
});

setInterval(() => {
    io.emit('ledUpdate', { ledColor });
}, 5000);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    socket.emit('dataUpdate', { lightData, ledColor });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
