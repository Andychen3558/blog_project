var express = require('express');
var app = express.Router();

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/signIn', function(req, res) {
	res.render('sign', {isSignIn: true});
});

app.get('/signUp', function(req, res) {
	res.render('sign', {isSignIn: false});
});

app.get('/articles', function(req, res) {
	if(!req.session.account) {
		res.render('index');
	}
	else {
		res.render('home', {account: req.session.account,
		user_id: req.session.user_id,
		isMyArticles: false});
	}
});

app.get('/users/:user_id', function(req, res) {
	if(!req.session.account) {
		res.render('index');
	}
	res.render('home', {account: req.session.account,
		user_id: req.session.user_id,
		isMyArticles: true});
});

app.get('/articles/:article_id', function(req, res) {
	if(!req.session.account) {
		res.render('index');
	}
	res.render('information', {account: req.session.account,
		user_id: req.session.user_id,
		article_id: req.params.article_id});
});

app.get('/articles/post/:user_id', function(req, res) {
	if(!req.session.account) {
		res.render('index');
	}
	res.render('post', {account: req.session.account,
		user_id: req.session.user_id,
		article_id: "",
		isEdit: false});
});

app.get('/articles/:article_id/edit/:user_id', function(req, res) {
	if(!req.session.account) {
		res.render('index');
	}
	res.render('post', {account: req.session.account,
		user_id: req.session.user_id,
		article_id: req.params.article_id,
		isEdit: true});
});

app.get('/articles/:article_id/comments/post', function(req, res) {
	if(!req.session.account) {
		res.render('index');
	}
	res.render('comment', {account: req.session.account,
		user_id: req.session.user_id,
		article_id: req.params.article_id,
		comment_id: "",
		isCommentEdit: false});
});

app.get('/articles/:article_id/comments/:comment_id/edit', function(req, res) {
	if(!req.session.account) {
		res.render('index');
	}
	res.render('comment', {account: req.session.account,
		user_id: req.session.user_id,
		article_id: req.params.article_id,
		comment_id: req.params.comment_id,
		isCommentEdit: true});
});

module.exports = app;


