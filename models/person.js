// const mongoose = require('mongoose')
// const url = process.env.MONGODB_URI

// mongoose.set('useFindAndModify', false)
// mongoose.set('useUnifiedTopology', true)

// console.log('Connecting to ', url)

// mongoose.connect(url, { useNewUrlParser: true })
//     .then(result => {
//         console.log('connected to MongoDB')
//     })
//     .catch(error => {
//         console.log('error connecting to MongoDB:', error.message)
//     })

// const personSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     number: String
// })

// personSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })

// module.exports = mongoose.model('Person', personSchema)

const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__V
    }
})

module.exports = mongoose.model('Person', personSchema)

// models/person.js is used to define mongoose schema for persons