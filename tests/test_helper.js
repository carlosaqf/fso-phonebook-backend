const Person = require('../models/person')
const User = require('../models/user')

const initialPersons = [
    {
        name: 'Carlos Fegurgur',
        number: '6714832699'
    },
    {
        name: 'Theodore Roosevelt',
        number: '8052152118'
    },
    {
        name: 'Person McTest',
        number: '1111111111'
    }
]

const nonExistingId = async () => {
    const person = new Person({ name: 'Will Remove' })
    await person.save()
    await person.remove()

    return person._id.toString()
}

const personsInDb = async () => {
    const persons = await Person.find({})
    return persons.map(person => person.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON() )
}

module.exports = {
    initialPersons, nonExistingId, personsInDb, usersInDb
}

