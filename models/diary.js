const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const diarySchema = new Schema({
    date: {
        type: Date, 
        required: true,
        default: function(){
        const defaultDate = new Date().getFullYear();
        return defaultDate;
    }},
    water: {
        type: Boolean, 
        required: true,
        default: false,
    },
    mist: {
        type: Boolean, 
        required: true,
        default: false,
    },
    fertilise: {
        type: Boolean, 
        required: true,
        default: false,
    },
    size: {
        type: Number, 
        min:0,
        max:300,
        required: true,
    },
    content: {
        type: String, 
        required: false,
    },
    plant: {
        type: Schema.Types.ObjectId,
        ref:'Plant',
        required: true
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Diary', diarySchema)