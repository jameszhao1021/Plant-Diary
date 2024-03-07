const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const detailSchema = new Schema({
    light: {
        type: String, 
        enum:['dark', 'dark-moderate', 'moderate', 'moderate-bright','bright']
    },
    water: {
        type: String, 
        enum:['low','low-moderate','moderate', 'moderate-high','high', 'misting' ]
    },
    soil: {
        type: String, 
        enum:['well-draining', 'moisture-retaining', 'sandy', 'none']
    },
    plant: {
        type: Schema.Types.ObjectId,
        ref:'Plant',
        required: true
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Detail', detailSchema)