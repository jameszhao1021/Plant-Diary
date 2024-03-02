const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const logSchema = new Schema({
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
    feritise: {
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
    note: {
        type: String, 
        required: false,
    },
    plant: {
        type: Schema.Types.ObjectId,
        ref:'Plant'
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Log', logSchema)