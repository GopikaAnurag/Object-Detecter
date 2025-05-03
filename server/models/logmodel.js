const mongoose = require ('mongoose')

const logSchema = new mongoose.Schema({
    object : String,
    status : String,
    time : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('Log',logSchema)