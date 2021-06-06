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
app.set('views', path.join(__dirname, 'views'));
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
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Expose-Headers', '*')
  next();
})

myDB(async client => {
	const testDb = await client.db('fcc').collection('qa-ane');

	auth(app, testDb);

	routes(app, testDb);

	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log('Listening on port ' + PORT);
	});
}).catch(e => {
	app.route('/').get((req, res) => {
		res.render('pug', { title: e, message: 'Unable to login' });
	})
});