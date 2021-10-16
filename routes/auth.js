const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// * to register
router.post('/register', async (req, res) => {
	try {
		// * hashing the password to be more secured
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(req.body.password, salt)

		// * this will work with frontend form data
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		})

		// * this will save into the database
		const user = await newUser.save()

		res.status(201).json(user)
	} catch (error) {
		res.status(500).json(error)
	}
})

// * to logging in
router.post('/login', async (req, res) => {
	try {
		// * looking the data in the database
		const user = await User.findOne({ username: req.body.username })

		// * response message if there is not user in the DB
		!user && res.status(400).json('Wrong credentials!')

		// * validating the hashed password
		const validated = await bcrypt.compare(req.body.password, user.password)

		// * response message if there is no the same password in the DB
		!validated && res.status(400).json('Wrong credentials!')

		// ! i don't wanna send my password credential to the client (do with this!)
		const { password, ...others } = user._doc

		// * return user data from the DB
		res.status(200).json(others)
	} catch (error) {
		res.status(500).json(err)
	}
})

module.exports = router
