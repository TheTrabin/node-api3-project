/** @format */

const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb.js');
const router = express.Router();

//post user - Create a user. - WORKS!!!
router.post('/', validateUser, (req, res) => {
	// do your magic!
	Users.insert(req.body)
		.then((user) => {
			res.status(201).json(user);
		})
		.catch((err) => {
			res.status(500).json({ message: 'Error adding user to database', err });
		});
});

// Post - Post post by ID - Works!!!

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
	// do your magic!
	const postInfo = {...req.body, user_id: req.params.id};
  Posts.insert(postInfo)
  .then(post =>{
    res.status(210).json(post);
  })
  .catch(error =>{
    res.status(500).json({message: 'error adding the post'})
  })
});

// Get - Users - Works...
router.get('/', (req, res) => {
	// do your magic!
	Users.get(req.query)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((error) => {
			// log error to server
			console.log(error);
			res.status(500).json({
				message: 'Error retrieving the users',
			});
		});
});

// Get - Users by ID - Works...

router.get('/:id', validateUserId, (req, res) => {
	// do your magic!
	Users.getById(req.params.id)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Could not get user from ID'
    });
  });
});

//Get - User Posts - Works...

router.get('/:id/posts', validateUserId, (req, res) => {
	// do your magic!
	Users.getUserPosts(req.params.id)
		.then((post) => {
			res.status(200).json(post);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'Can not retrieve post',
			});
		});
});

// Delete User by ID - Works!!!

router.delete('/:id', validateUserId, async (req, res) => {
	// do your magic!
	Users.remove(req.params.id)
		.then((users) => {
			if (users > 0) {
				res.status(200).json({ message: 'This user has been deleted' });
			} else {
				res.status(404).json({ message: 'The user could not be found' });
			}
		})
		.catch(error)
		.json({
			message: 'Error removing the user',
			error: 'The user could not be removed',
		});
});

//put - update user information -

router.put('/:id', validateUserId, (req, res) => {
	// do your magic!
	Users.update(req.params.id, req.body)
	.then(user=>{
	  if(user){
	  res.status(200).json(user);
	}else{
	  res.status(404).json({message: "the user could not be found"});
	}
	})
	.catch(error =>{
	  console.log(error)
	  res.status(500).json({ message: 'Error updating the user'});
	})
  });

//custom middleware

function validateUserId(req, res, next) {
	const { id } = req.params;
	Users.getById(id)
		.then((userId) => {
			if (userId) {
				req.user_Id = userId;
				// req.userId = posts.user_Id;
				next();
			} else {
				next({ message: 'invalid user id' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: "CAN'T TELL YA", err });
		});
}

function validateUser(req, res, next) {
	// do your magic!
	if (req.body && Object.keys(req.body).length > 0) {
		next();
	} else {
		res.status(400).json({ message: 'missing post data' });
	}
}

function validatePost(req, res, next) {
	// do your magic!
	if(req.body.text) {
		next();
	  }else{
		res.status(400).json({message: 'missing required text field'})
	  }
	}

module.exports = router;
