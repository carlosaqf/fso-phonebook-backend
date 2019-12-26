// controllers/person.js contains all event handles of routes for persons

const personRouter = require('express').Router()
const Person = require('../models/person')

// GET ALL PERSONS
personRouter.get('/', (req,res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

// GET SINGLE PERSON
personRouter.get('/:id', (req,res,next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

// ADD SINGLE PERSON
personRouter.post('/', (req,res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})

// DELETE SINGLE PERSON
personRouter.delete('/:id', (req,res,next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// UPDATE SINGLE PERSON
personRouter.put('/:id', (req,res,next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

module.exports = personRouter