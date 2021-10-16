const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Post = require('../models/Post')

// * to update
router.put('/:id', async (req, res) => {
	if (req.body.userId === req.params.id) {
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10)
			req.body.password = await bcrypt.hash(req.body.password, salt)
		}

		try {
			// * update user information
			const updateUser = await User.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true } /* This code will get instant update */
			)

			res.status(200).json(updateUser)
		} catch (error) {
			res.status(500).json(err)
		}
	} else {
		res.status(401).json('You can only update with yours registered account!')
	}
})

// * to delete
router.delete('/:id', async (req, res) => {
	if (req.body.userId === req.params.id) {
		try {
			const user = await User.findById(req.params.id)

			try {
				await Post.deleteMany({ username: user.username })
				await User.findByIdAndDelete(req.params.id)
				res.status(200).json('User has been deleted...')
			} catch (error) {
				res.status(500).json(error)
			}
		} catch (error) {
			res.status(404).json('User not found!')
		}
	} else {
		res.status(401).json('You can delete only your account!')
	}
})

// * get user
router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
		const { password, ...others } = user._doc

		res.status(200).json(others)

	} catch (error) {
		res.status().json(error)
	}
})

module.exports = router
