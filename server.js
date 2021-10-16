const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const multer = require('multer')

// * import routes file
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
const categoryRoute = require('./routes/categories')

// * configure env
dotenv.config()

// * initialize app
const app = express()

// * apply middleware
app.use(express.json())
app.use(morgan('dev'))

// * connect database
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log('Connected to MongoDB :")'))
	.catch((err) => console.log(err.message))

// * upload images to the DB (Configuration)
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
	},
	filename(req, file, cb) {
		cb(null, 'peaceFestival.jpg') // this one will handle from the client site
	},
})

// * upload logic
const upload = multer({ storage: storage })
app.post('/api/upload', upload.single('file'), (req, res) => {
	res.status(200).json('Your file has been uploaded into your database!')
})

// * routes
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/categories', categoryRoute)

// * port range
const PORT = process.env.PORT | 5000

// * run server
app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
)
