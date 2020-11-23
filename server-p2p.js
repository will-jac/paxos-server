
const app = require('express')();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"]
      },
});


const nodes = new Set();
var num_connected = 0;

io.on('connection', (socket) => {
    socket.emit('ready');
    nodes.add(socket);

    ++num_connected;

    console.log('connected', num_connected);
    io.emit('num-nodes', num_connected)

    socket.once('disconnect', () => {
        --num_connected;
        console.log('disconnect', num_connected);
        nodes.delete(socket)
        io.emit('num-nodes', num_connected)
    });

    socket.on('peer-msg', (data) => {
        console.log('recv:', data)
    });

    socket.on('join-doc', (docname) => {
        socket.join(docname)
    })

});

server.listen(443);