var express = require('express');
var app = express.Router();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/blog", { useNewUrlParser: true })

var Ariticles = mongoose.model('articles', {
	title: String,
	author: String,
	content: String,
	user_id: String,
	comment: String,
	post_date: {type: Date, default: Date.now},
	modify_date: {type: Date, default: Date.now}
});

var Users = mongoose.model('users', {
	account: String,
	password: String
});

var Comments = mongoose.model('comments', {
	article_id: String,
	user_id: String,
	author: String,
	content: String,
	post_date: {type: Date, default: Date.now},
	modify_date: {type: Date, default: Date.now}
});

// APIs

// get all articles
app.get('/articles', function(req, res) {
	console.log('Request to get all articles');
	Ariticles.find(function(err, articles) {
		if(err) throw err;
		res.send(articles);
	});
});

// get all my articles
app.get('/users/:user_id', function(req, res) {
	console.log('Request to get all my articles');
	Ariticles.find({
		user_id: req.params.user_id
	}, function(err, articles) {
		if(err) throw err;
		res.send(articles);
	});
});

// get a specific article
app.get('/articles/:article_id', async(req, res) => {
	console.log('Request to get a specfic article');
	//console.log(req.params.article_id);
	var data = [];
	try {
		data.push(await Ariticles.find({_id: req.params.article_id}));
		data.push(await Comments.find({article_id: req.params.article_id}));
		//console.log(data);
		res.send(data);
	} catch(err) {
		console.log(err);
	}
});

// create an article
app.post('/articles/post/:user_id', function(req, res) {
	console.log('post');
	//console.log(req.params.user_id);
	Ariticles.create({
		title: req.body.title,
		author: req.session.account,
		content: req.body.content,
		post_date: Date.now(),
		modify_date: Date.now(),
		user_id: req.params.user_id
	}, function(err) {
		if(err) throw err;
		res.send('post success');
	});
});

// edit an article
app.put('/articles/:article_id/edit/:user_id', function(req, res) {
	console.log('edit');
	Ariticles.update({
		_id: req.params.article_id,
		user_id: req.params.user_id
	}, {
		title: req.body.title,
		content: req.body.content,
		modify_date: Date.now()
	}, function(err, article) {
		if(err) throw err;
		res.send('edit success');
	});
});

// remove an specfic article
app.delete('/articles/:article_id/remove/:user_id', function(req, res) {
	console.log('delete');
	Ariticles.remove({ 
		_id: req.params.article_id,
		user_id: req.params.user_id
	}, function(err, article) {
		if(err) throw err;
		res.send('remove success');
	});
});

//------------------------------------------------------------//

// leave a comment
app.post('/articles/:article_id/comment/:user_id', function(req, res) {
	console.log('post comment');
	Comments.create({
		article_id: req.params.article_id,
		user_id: req.params.user_id,
		author: req.session.account,
		content: req.body.content,
		post_date: Date.now(),
		modify_date: Date.now()
	}, function(err) {
		if(err) throw err;
		res.send('post comment success');
	});
});
// edit my comment
app.put('/comments/:comment_id/edit/:user_id', function(req, res) {
	console.log('edit comment');
	Comments.update({
		_id: req.params.comment_id,
		user_id: req.params.user_id
	}, {
		content: req.body.content,
		modify_date: Date.now()
	}, function(err, article) {
		if(err) throw err;
		res.send('edit comment success');
	});
});
// remove a comment
app.delete('/comments/:comment_id/remove/:user_id', function(req, res) {
	console.log('remove comment');
	Comments.remove({
		_id: req.params.comment_id,
		user_id: req.params.user_id
	}, function(err) {
		if(err) throw err;
		res.send('remove comment success');
	});
});

//------------------------------------------------------------//

// create an account
app.post('/users/signUp', async(req, res) => {
	console.log('sign up');
	try {
		var user = await Users.find({account: req.body.account});
		if(user.length==0) {
			Users.create({
				account: req.body.account,
				password: req.body.password
			}, function(err, user) {
				if(err) throw err;
				req.session.account = req.body.account;
				req.session.password = req.body.password;
				//console.log(user._id);
				req.session.user_id = user._id;
			    req.session.time = 1;
				res.send(user);
			});
		}
		else {
			res.send('account exists');
		}

	} catch(err) {
		console.log(err);
	}
});

// login
app.post('/users/signIn', function(req, res) {
	console.log('sign in');
	Users.find({
		account: req.body.account,
		password: req.body.password
	}, function(err, user) {
		if(err) throw err;
		if(user.length==0) {
			res.send('no user');
			return;
		}

		if(req.body.account==req.session.account && req.body.password==req.session.password) {
			console.log('exist');
			req.session.time++;
		}
	   	else {
	   		console.log('first login');
	       	req.session.account = req.body.account;
	        req.session.password = req.body.password;
	        //console.log(user[0]._id);
	        req.session.user_id = user[0]._id;
	        req.session.time = 1;
	    }
		res.send(user);
	});
});
// log out
app.get('/logOut', function(req, res) {
	console.log('log out');
	req.session.destroy();
    res.send('log out success');
});

module.exports = app;
