const mongoose = require('mongoose')

const roleStatus = ['admin', 'employee','boss']
const title = ['นาย.', 'นาง.', 'น.ส.', 'Mr.', 'Ms.']

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: title,
        require: true,
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: roleStatus,
        required: true
    },
    phone: {
        type: String,
        require: true,
        unique: true
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)