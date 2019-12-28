const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Person = require('../models/person')


beforeEach(async () => {
    await Person.deleteMany({})
    console.log('cleared')

    const personObjects = helper.initialPersons
        .map(person => new Person(person))
    const promiseArray = personObjects.map(person => person.save())
    await Promise.all(promiseArray)

    // -- beforeEach Refactor v2 --
    // helper.initialPersons.forEach(async (person) => {
    //     let personObject = new Person(person)
    //     await personObject.save()
    //     console.log('saved')
    // })
    console.log('done')

    // -- beforeEach Refactor --
    // let personObject = new Person(helper.initialPersons[0])
    // await personObject.save()

    // personObject = new Person(helper.initialPersons[1])
    // await personObject.save()

    // personObject = new Person(helper.initialPersons[2])
    // await personObject.save()
})

test('persons are returned as json', async () => {
    await api
        .get('/api/persons')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all persons are returned', async () => {
    const response = await api.get('/api/persons')

    expect(response.body.length).toBe(helper.initialPersons.length)
})

test('a specific person is within the returned notes', async () => {
    const res = await api.get('/api/persons')

    const contents = res.body.map(r => r.name)
    expect(contents).toContain('Carlos Fegurgur')
})

test('a valid person can be added ', async () => {
    const newPerson = {
        name: 'New Person',
        number: '1234567890'
    }

    await api
        .post('/api/persons')
        .send(newPerson)
        .expect(200)
        .expect('Content-Type', /application\/json/)


    const personsAtEnd = await helper.personsInDb()
    expect(personsAtEnd.length).toBe(helper.initialPersons.length + 1)

    const contents = personsAtEnd.map(r => r.name)

    expect(contents).toContain(
        'New Person'
    )
})

test('person with no name is not added', async () => {
    const newPerson = {
        number: '1029384756'
    }

    await api
        .post('/api/persons')
        .send(newPerson)
        .expect(400)

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd.length).toBe(helper.initialPersons.length)
})

// TESTS FOR FETCHING AND REMOVING SINGLE PERSON
test('a specific person can be viewed', async () => {
    const personsAtStart = await helper.personsInDb()

    const personToView = personsAtStart[0]

    const resultPerson = await api
        .get(`/api/persons/${personToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(resultPerson.body).toEqual(personToView)
})

test('a note can be deleted', async () => {
    const personsAtStart = await helper.personsInDb()
    const personToDelete = personsAtStart[0]

    await api
        .delete(`/api/persons/${personToDelete.id}`)
        .expect(204)

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd.length).toBe(helper.initialPersons.length - 1)

    const contents = personsAtEnd.map(r => r.name)

    expect(contents).not.toContain(personToDelete.name)


})

afterAll(() => {
    mongoose.connection.close()
})