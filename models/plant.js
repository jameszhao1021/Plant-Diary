const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const plantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date, 
        required: true,
        default: function(){
        const defaultDate = new Date().getFullYear();
        return defaultDate;
    }},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      userName: String,
      userAvatar: String,
}, {
    timestamps: true
})

module.exports = mongoose.model('Plant', plantSchema)