const router = require('express').Router()
const Post = require('../models/Post')

// * create post
router.post('/', async (req, res) => {
	const newPost = new Post(req.body)

	try {
		const savedPost = await newPost.save()

		res.status(201).json(savedPost)
	} catch (error) {
		res.status(500).json(error)
	}
})

// * update post
router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		try {
			if (post.username === req.body.username) {
				try {
					const updatedPost = await Post.findByIdAndUpdate(
						req.params.id,
						{
							$set: req.body,
						},
						{ new: true }
					)

					res.status(200).json(updatedPost)
				} catch (error) {
					res.status(401).json('You can update only on your post')
				}
			}
		} catch (error) {}
	} catch (error) {
		res.status(500).json(error)
	}
})

// * delete post
router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		try {
			if (post.username === req.body.username) {
				try {
					await post.delete()
					res.status(200).json('Your post has been deleted!')
				} catch (error) {
					res.status(401).json('You can delete only on your post')
				}
			}
		} catch (error) {}
	} catch (error) {
		res.status(500).json(error)
	}
})

// * get single posts
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		res.status(200).json(post)
	} catch (error) {
		res.status().json(error)
	}
})

// * get all posts
router.get('/', async (req, res) => {
	const username = req.query.user
	const categoryName = req.query.category

	try {
		let posts

		if (username) {
			posts = await Post.find({ username })
		} else if (categoryName) {
			posts = await Post.find({
				categories: {
					$in: [categoryName],
				},
			})
		} else {
			posts = await Post.find()
		}

		res.status(200).json(posts)
    
	} catch (error) {
		res.status().json(error)
	}
})

module.exports = router
