'use strict';
require('dotenv').config();
const express = require('express');
const path = require('path');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const auth = require('./auth');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ url: URI });

app.set('views', path.join(__dirname, './views/pug'));
app.set('view engine', 'pug');

fccTesting(app); //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false, },
	key: 'express.sid',
	store,
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Expose-Headers', '*')
//   next();
// })

io.use(
	passportSocketIo.authorize({
		cookieParser,
		key: 'express.sid',
		secret: process.env.SESSION_SECRET,
		store,
		success: onAuthorizeSuccess,
		fail: onAuthorizeFail
	})
);

myDB(async client => {
	const myDatabase = await client.db('fcc').collection('qa-ane');

	auth(app, myDatabase);

	routes(app, myDatabase);

	let currentUsers = 0;
	io.on('connection', socket => {
		++currentUsers;
		io.emit(
			'user', 
			{
				name: socket.request.user.name,
				currentUsers,
				connected: true,
			}
		); // console.log(socket.request);
		currentUsers > 0 && console.log(`user ${socket.request.user.name} connected`);

		socket.on('chat message', message => {
			io.emit(
				'chat message', 
				{ 
					name: socket.request.user.name, 
					message, 
				}
			);
		})

		socket.on('disconnect', () => {
			console.log('user disconnected');
			--currentUsers;
			io.emit(
				'user', 
				{
					name: socket.request.user.name,
					currentUsers,
					connected: true,
				}
			);
		})
	});

	const PORT = process.env.PORT || 3000;
	http.listen(PORT, () => {
		console.log('Listening on port ' + PORT);
	});
}).catch(e => {
	app.route('/').get((req, res) => {
		res.render('index', { title: e, message: 'Unable to login' });
	})
});

function onAuthorizeSuccess(data, accept) {
	console.log('successful connection to socket.io');
	accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
	if (error) throw new Error(message);
  console.log('failed connection to socket.io:', message);
  accept(null, false);
}