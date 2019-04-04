const express = require('express');
const app = express();
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const compression = require('compression');
const db = require('./db');
const cookieSession = require('cookie-session');
const bcrypt = require('./bcrypt');
const csurf = require('csurf');
const config = require('./config');
const server = require('http').Server(app);
// change origins to put the site online
const io = require('socket.io')(server, { origins: 'localhost:8080' });

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always hungry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(require('body-parser').json());
app.use(compression());
app.use(express.static(__dirname + "/public"));
app.use(csurf());
app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});



app.get('/welcome', function(req, res) {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password).then(hashed => {
        return db.addUser(req.body.first, req.body.last, req.body.email, hashed);
    }).then(
        ({rows}) => {
            req.session.userId = rows[0].id;
            res.json({success: true});
        }).catch(function(err) {
        console.log("err in reg/post: ", err);
        res.json({success: false});
    });
});

app.post('/login', (req, res) => {
    var userId;
    db.getUserData(req.body.email).then(dbResult => {
        req.session.email = dbResult.rows[0].email;
        if (dbResult.rows[0]) {
            userId = dbResult.rows[0].id;
            return bcrypt.compare(req.body.password, dbResult.rows[0].password);
        }
        else {
            req.session.userId = dbResult.rows[0].id;
            res.json({notRegistered: true});
        }
    }).then(
        () => {
            req.session.userId = userId;
            res.json({success: true});
            // console.log("userId: ", userId);
        }).catch(function(err) {
        console.log("err in login/post: ", err);
        res.json({success: false});
    });
});


app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    var userId = req.session.userId;
    // console.log('post upload');
    // console.log('req.body + file: ', req.body, req.file);
    // console.log("config.s3Url + req.file.filename: ", config.s3Url + req.file.filename);
    db.addImage(
        config.s3Url + req.file.filename,
        userId
    ).then(
        ({rows}) => {
            res.json(rows[0]);
        }
    );
});

app.post('/bio', (req, res) => {
    var userId = req.session.userId;
    // console.log('req.body', req.body);
    db.addBio(req.body.bioText, userId).then(
        ({rows}) => {
            res.json(rows[0]);
        }
    );
});


app.get('/user', (req, res) => {
    var userId = req.session.userId;
    db.getUserProfile(userId).then(dbResult => {
        // console.log("dbResult.rows[0]: ", dbResult.rows[0]);
        res.json(dbResult.rows[0]);
    }).catch(err => {
        console.log("error in get/user: ", err);
    });
});
// ajax req a user has to make to get other user info:
app.get('/user/:id/json', (req, res) => {

    if (req.session.userId == req.params.id) {
        return res.json({
            redirectTo: '/'
        });
    }
    db.getUserProfile(req.params.id).then(dbResult => {
        // console.log("dbResult.rows[0]: ", dbResult.rows[0]);
        res.json(dbResult.rows[0]);
    }).catch(err => {
        console.log("error in get/otheruser: ", err);
    });
});

app.get("/get-initial-status/:id", (req, res) => {
    // console.log("get initial runnning!");
    //
    // console.log("req.session.userId, req.params.id: ", req.session.userId, req.params.id);
    db.getInitialFriendship(req.session.userId, req.params.id)
        .then(dbResult =>{
            // console.log("getInitialFriendship", dbResult.rows[0]);

            res.json(dbResult.rows[0]);
        }).catch(err => {
            console.log("error in get/innitial: ", err);
        });
    // send results back to button comp
});

app.post('/updatefriend/:id', (req, res) => {
    // console.log("req.body: ", req.body);
    if (req.body.action == 'Accept new friend') {
        db.accept(req.session.userId, req.params.id).then(() => {
            res.json({success: true});
        }).catch(err => {
            console.log('error @ accept: ', err);
        });
    }  else if (req.body.action == "Cancel friend request" || req.body.action == "Unfriend" ) {
        // console.log("CXL req running!");
        db.unfriend(req.session.userId, req.params.id).then(() => {
            res.json({success: true});
        }).catch(err => {
            console.log('error @ removing friend: ', err);
        });
    } else if (req.body.action == 'Send Friend Request') {
        db.befriend(req.session.userId, req.params.id).then(() => {
            res.json({success: true});
        }).catch(err => {
            console.log('error @ befirend: ', err);
        });
    }
});

app.get("/friends-and-wannabes", (req, res) => {
    // console.log("friends-and-wannabes running!");

    db.allFriendships(req.session.userId)
        .then(dbResult =>{
            // console.log("friends-and-wannabes", dbResult.rows);

            res.json(dbResult.rows);
        }).catch(err => {
            console.log("error in get/friends-and-wannabes: ", err);
        });
    // send results back to button comp
});

app.get('*', function(req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});



server.listen(8080, function() {
    console.log("I'm listening.");
});

// NB: all backend code goes to io.on('connection')
let onlineUsers = {};

io.on('connection', function(socket) {

    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;
    socket.emit('userId', userId);
    onlineUsers[socket.id] = userId;

    let userIds = Object.values(onlineUsers);

    db.getUsersByIds(userIds).then(dbResults => {

        socket.emit('onlineUsers', dbResults.rows.filter(
            i => {
                if (i.id == userId) {
                    return false;
                } else {
                    return true;
                }
            }
        ));
    });

    var filtered = userIds.filter(id => id == userId);
    if (filtered.length == 1) {
        db.getUserProfile(userId).then(dbResults => {
            socket.broadcast.emit('userJoined', dbResults.rows);
        });
    }

    socket.on('disconnect', function() {
        delete onlineUsers[socket.id];
        if (Object.values(onlineUsers).indexOf(userId) == -1) {
            io.sockets.emit('userLeft', userId);
        }
    });

    db.getMessages().then(dbResults => {
        // console.log("getMessages dbResults.rows: ", dbResults.rows);
        socket.emit('chatMessages', dbResults.rows);
    }).catch(err => {
        console.log("error @ loading chatMessages: ", err);
    });

    socket.on("chatMessageFromTextArea", async function(text) {
        const userInfo = await db.getUserProfile(userId);
        let newMessage = {
            message: text,
            sender_first: userInfo.rows[0].first,
            sender_last: userInfo.rows[0].last,
            sender_id: userInfo.rows[0].id,
            sender_url: userInfo.rows[0].url
        };
        db.addMessage(newMessage.message, newMessage.sender_id).then(dbResults => {
            newMessage.message_id = dbResults.rows[0].id;
            newMessage.message_created_at = dbResults.rows[0].created_at;
            // console.log("addMessage dbResults.rows: ", dbResults.rows);
            io.sockets.emit('chatMessage', newMessage);
        }).catch(err => {
            console.log("error @ adding new chatmessage: ", err);
        });

    });
});
