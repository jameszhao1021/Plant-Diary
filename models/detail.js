const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const detailSchema = new Schema({
    light: {
        type: [String], 
        enum:['low-moderate', 'bright', 'indirect','direct']
    },
    water: {
        type: [String], 
        enum:['low','low-moderate','moderate', 'moderate-high','high', 'misting' ]
    },
    soil: {
        type: [String], 
        enum:['well-draining', 'moisture-retaining', 'sandy', 'none']
    },
    plant: {
        type: Schema.Types.ObjectId,
        ref:'Plant'
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Detail', detailSchema)