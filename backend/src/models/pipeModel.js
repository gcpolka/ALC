const mongoose = require("mongoose");

const pipeSchema = new mongoose.Schema({
    pipe: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Pipe', pipeSchema)