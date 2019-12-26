require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.static('build'))
const bodyParser = require('body-parser')
app.use(bodyParser.json())



const morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')
app.use(cors())


const mongoose = require('mongoose')

// const url = `mongodb+srv://fullstack:horsebutt123@cluster0-hm0pj.mongodb.net/phonebook-app?retryWrites=true&w=majority`

// mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

// const Person = mongoose.model('Person', personSchema)
const Person = require('./models/person')

let persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 4
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3
	},
	{
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
		id: 2
	}
]

// Return ALL Phonebook Entries
app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

// GET general phonebook info
// Return number of entries and
// time of request
app.get('/info', (req, res) => {
	const length = persons.length
	const requestTime = new Date()
	res.send(`
        <p>Phonebook has info for ${length} people</p>
        <p>${requestTime}</p>
    `)
})

// GET phonebook information for ONE person
app.get('/api/persons/:id', (req,res, next) => {
	// const id = Number(req.params.id)
	// const person = persons.find(person => person.id === id)
	// console.log('This is the found person', person)
	// console.log('This is the found persons name', person.name)
	// if (person) {
	//     res.json(person)
	// }else{
	//     res.status(404).json({
	//         error: "Person not found"
	//     })
	// }
	// Removing due to Mongo DB Implementation -----------------

	Person.findById(req.params.id)
		.then(person => {
			if (person){
				res.json(person.toJSON())
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))

})

// DELETE single entry
app.delete('/api/persons/:id', (req, res) => {
	// const id = Number(req.params.id)
	// persons = persons.filter(person => person.id !== id)
	// console.log('Person successfully deleted, here is the new array', persons)
	// res.status(204).end()
	// -- Removing due to Mongo DB Implementation --

	Person.findByIdAndRemove(req.params.id)
		// eslint-disable-next-line no-unused-vars
		.then(result => {
			res.status(204).end()
		})
		// eslint-disable-next-line no-undef
		.catch(error => next(error))
})

// -- Removing due to Mongo DB Implementation --
// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(p => p.id))
//         : 0
//     return maxId + 1
// } -------------------------------------------

// ADD single entry
app.post('/api/persons', (req, res) => {

	const body = req.body

	if (!body.name || !body.number){
		return res.status(404).json({
			error: 'Name or number is missing'
		})
	}

	const newName = body.name
	const newNumber = body.number
	const duplicateName = persons.find(person => person.name === newName)
	const duplicateNumber = persons.find(person => person.number === newNumber)

	if (duplicateName){
		return res.status(404).json({
			error: 'Name already exists'
		})
	}

	if (duplicateNumber){
		return res.status(404).json({
			error: 'Number already exists'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
		// id: generateId() - removed due to Mongo DB implementation
	})

	// -- Removing due to Mongo DB implementation --
	// console.log('This is the person', person)

	// persons = persons.concat(person)
	// res.json(persons)
	// ---------------------------------------------

	person.save()
		.then(savedPerson => {
			res.json(savedPerson.toJSON())
		})
		// eslint-disable-next-line no-undef
		.catch(error => next(error))

})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.log(error.message)

	// eslint-disable-next-line eqeqeq
	if (error.name === 'CastError' && error.kind == 'ObjectId'){
		return res.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError'){
		return res.status(400).json({ error: error.messaage })
	}

	next(error)
}
app.use(errorHandler)



const PORT = process.env.PORT

app.listen(PORT, () => {
	console.log(`Server is running on Port ${PORT}`)
})