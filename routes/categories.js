const router = require('express').Router()
const Category = require('../models/Category')

// * create category
router.post('/', async (req, res) => {
	const newCategory = new Category(req.body)

	try {
		const savedCategory = await newCategory.save()

		res.status(201).json(savedCategory)
	} catch (error) {
		res.send(400).json(error)
	}
})

// * get all categories
router.get('/', async (req, res) => {
	try {
		const categories = await Category.find()
		res.status(200).json(categories)
	} catch (error) {
		res.send(400).json(error)
	}
})

module.exports = router
