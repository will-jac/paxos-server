const app = require('express')();
const cors = require('cors')
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('connected')
})

const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {debug: true, path: '/peer'});

app.use('/peerjs', peerServer);

const documents = new Map();
const clients = new Map();
// docname -> [numconnected, Set<Sockets>]

// do nothing on connect
peerServer.on('connection', (conn) => {
    io.emit('user_connected', conn.id)
    console.log('connected:',  conn.id)
})
peerServer.on('disconnect', (conn) => {
    // remove from the documents
    // if (clients[id]) {
        io.emit('user_disconnected',  conn.id)
        console.log('disconnected:',  conn.id)
        // documents[clients[client]] = documents[clients[client]].remove(client)
    // }
});

app.use(cors())
server.listen(3030)

// app.post('/join', (req, res) => {
//     // joining a document
//     console.log(req.body, req.params, req.json)
//     if (documents[req.body.docname]) {
//         res.send(documents[req.body.docname])
//         documents[req.body.docname].add(req.body.id)
//     } else {
//         res.send([])
//         documents[req.body.docname] = new Set(req.body.id)
//     }
//     // console.log(documents)
//     clients[req.body.id] = req.body.docname
// });



// io.on('connection', (socket) => {
//     socket.emit('ready');

//     socket.on('join-doc', (docname) => {
//         socket.join(docname);
//         if (rooms[docname])
//             ++rooms[docname]
//         else
//             rooms[docname] = 1

//         console.log('connect', docname, rooms[docname]);
//         io.in(docname).emit('num-nodes', rooms[docname])

//         socket.once('disconnect', () => {
//             --rooms[docname];
//             console.log('disconnect', docname, rooms[docname]);
//             io.in(docname).emit('num-nodes', rooms[docname])
//         });

//         socket.on('disconnecting', () => {
//             const rooms = Object.keys(socket.rooms);
//             // the rooms array contains at least the socket ID
//             console.log(rooms)
//         });

//         socket.on('prepare', (ballotID) => {
//             // broadcast by proposer to acceptors
//             console.log('prepare', socket.id, ballotID)
//             io.in(docname).emit('prepare', socket.id, ballotID);
//         });
//         socket.on('accept', (ballotID, decree) => {
//             // broadcast by proposer to acceptors
//             console.log('accept', socket.id, ballotID, decree)
//             io.in(docname).emit('accept', socket.id, ballotID, decree);
//         });
//         socket.on('prepareNack', (toUID, ballotID, promisedID) => {
//             // Acceptor -> proposer when prepare is bad
//             console.log('prepareNack', socket.id, ballotID, promisedID)
//             io.to(toUID).emit('prepareNack', socket.id, ballotID, promisedID)
//         });
//         socket.on('acceptNack', (toUID, ballotID, promisedID) => {
//             // Acceptor -> proposer when Accept is bad
//             console.log('acceptNack', socket.id, ballotID, decree)
//             io.to(toUID).emit('acceptNack', socket.id, ballotID, promisedID)
//         });
//         socket.on('promise', (proposerUID, ballotID, prevID, prevDecree) => {
//             // sent from acceptor to proposer
//             io.to(proposerUID).emit('promise', socket.id, ballotID, prevID, prevDecree)
//         });
//         socket.on('heartbeat', () => {
//             // bcast by proposer -> proposers
//             socket.to(docname).emit('heartbeat')
//         });
//         socket.on('accepted', (ballotID, decree) => {
//             // broadcast by acceptor to learner
//             console.log('accepted', socket.id, ballotID, decree);
//             io.in(docname).emit('accepted', socket.id, ballotID, decree)
//         });
//     });

//     socket.on('peer-msg', (data) => {
//         console.log('recv:', data)
//     });

// });
