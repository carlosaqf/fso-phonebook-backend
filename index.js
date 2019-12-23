const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 4
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 2
    }
]

// Return Phonebook Entries
app.get('/api/persons', (req, res) => {
    res.json(persons)
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

// GET phonebook information for
// ONE person
app.get('/api/persons/:id', (req,res) =>{
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    console.log('This is the found person', person)
    console.log('This is the found persons name', person.name)
    if (person) {
        res.json(person)
    }else{
        res.status(404).json({
            error: "Person not found"
        })
    }
})

// DELETE single entry
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    console.log('Person successfully deleted, here is the new array', persons)
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}

// ADD single entry
app.post('/api/persons', (req, res) => {

    const body = req.body

    if (!body.name || !body.number){
        return res.status(404).json({
            error: "Name or number is missing"
        })
    }

    const newName = body.name
    const newNumber = body.number
    const duplicateName = persons.find(person => person.name === newName)
    const duplicateNumber = persons.find(person => person.number === newNumber)

    if (duplicateName){
        return res.status(404).json({
            error: "Name already exists"
        })
    }

    if (duplicateNumber){
        return res.status(404).json({
            error: "Number already exists"
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    console.log('This is the person', person)

    persons = persons.concat(person)
    res.json(persons)

})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})