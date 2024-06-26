const Plant = require('../models/plant');
const Detail = require('../models/detail');
const Diary = require('../models/diary');

let selectedPlant
async function show(req, res) {
    selectedPlant = await Plant.findById(req.params.plantId);
    res.render('plants/log', { selectedPlant });
}

async function crudOperations(req, res) {
    const { action, plantId } = req.body;
    const part = req.body.part;
    const selectedPlantId = selectedPlant._id;

    if(part === 'detail'){
    try {
        const action = req.body.action;
        if (action === 'fetch') {
            // Fetch corresponding detail from the database
            const detail = await Detail.find({ plant: selectedPlantId })
            // Send the fetched plants as JSON response
            res.json({ data: detail });
        }
        if (action === 'Add') {
            const light = req.body.light;
            const water = req.body.water;
            const soil = req.body.soil;
            const plant = req.body.plantId;
            const newDetail = new Detail({
                light, water, soil, plant
            })
            console.log(newDetail)
            await newDetail.save();
            res.status(201).json({ message: 'Detail added successfully' });
        }
        if (action === 'delete') {
            const plantId = req.body.selectedPlantId;
            // Find the plant by its ID that its detail will be deleted
            const deletedDetailPlant = await Plant.findById(plantId);
            
            await Detail.findOneAndDelete({plant:plantId})
            // Check if the plant was found and deleted
            if (!plantId) {
                return res.status(404).json({ error: 'Plant not found' });
            }
            // Check if the user is authorized to delete the plant
            if (deletedDetailPlant.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'You are not authorized to delete this plant' });
            }
            // Send a success response
            res.json({ message: 'Plant deleted successfully' });
        }
        if (action === 'Edit') {
            // Extract data from the request body
            const plantId = req.body.selectedPlantId;
            const existingDetail = await Detail.findOne({plant:plantId});
            const updatedData = {
                // Check if each field has been edited, if not, keep the existing value
                light: req.body.light.length !== 0 ? req.body.light : existingDetail.light,
                water: req.body.water.length !== 0 ? req.body.water : existingDetail.water,
                soil: req.body.soil.length !== 0 ? req.body.soil : existingDetail.soil,
                // Add other fields as needed
            };
            // Find the plant by its ID and update it with the new data
            const updatedDetail= await Detail.findOneAndUpdate({plant:plantId}, updatedData, { new: true });
            // // Check if the plant was found and updated
            if (!existingDetail) {
                return res.status(404).json({ error: 'Detail not found' });
            }
            // // Send a success response with the updated plant
            res.status(200).json({ message: 'Plant updated successfully', updatedDetail: updatedDetail });
        }
    } catch (error) {
        // Handle any errors that occur during database query or processing
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (part === 'diary'){
    try {
        const action = req.body.action;
        if (action === 'fetch') {
            // Fetch corresponding detail from the database
            const diaries = await Diary.find({ plant: selectedPlantId }).sort({date: -1 })
            // Send the fetched plants as JSON response
            res.json({ data: diaries });
        }
        if (action === 'Add') {
            const date = req.body.date;
            const size = req.body.size;
            const water = req.body.water;
            const mist = req.body.mist;
            const fertilise = req.body.fertilise;
            const content = req.body.content;
            const plant = req.body.plantId;
            const waterValue = water === 'on' ? true : false;
            const mistValue = mist === 'on' ? true : false;
            const fertiliseValue = fertilise === 'on' ? true : false;
            const newDiary = new Diary({
                date, size, water: waterValue, mist:mistValue, fertilise:fertiliseValue, content, plant
            })
            await newDiary.save();
            res.status(201).json({ message: 'Diary added successfully' });
        }
        if (action === 'delete') {         
            const id = req.body.id;       
                // Find the plant by its ID and delete it
                const deleteDiary = await Diary.findByIdAndDelete(id); 
                // Check if the plant was found and deleted
                if (!deleteDiary) {
                    return res.status(404).json({ error: 'Diary not found' });
                }      
                // Send a success response
                res.json({ message: 'Diary deleted successfully' });
        }
        if (action === 'Edit') {
            const id = req.body.id;
            // Extract data from the request body
            const plantId = req.body.selectedPlantId;  
            const existingDiary = await Diary.findById(id);
            const water = req.body.water.length !== 0 ? req.body.water : existingDiary.water;
            const mist = req.body.mist.length !== 0 ? req.body.mist : existingDiary.mist;
            const fertilise = req.body.fertilise.length !== 0 ? req.body.fertilise : existingDiary.fertilise;
            const waterValue = water == 'true' ? true : false;
            const mistValue = mist == 'true' ? true : false;
            const fertiliseValue = fertilise == 'true' ? true : false;
            const updatedData = {
                // Check if each field has been edited, if not, keep the existing value        
                date: req.body.date.length !== 0 ? req.body.date : existingDiary.date,
                size: req.body.size.length !== 0 ? req.body.size : existingDiary.size,
                water: waterValue,
                mist: mistValue,
                fertilise: fertiliseValue,
                content: req.body.content.length !== 0 ? req.body.content : existingDiary.content,
                // Add other fields as needed
            };
            // Find the plant by its ID and update it with the new data
            const updatedDiary= await Diary.findOneAndUpdate({ _id: id }, updatedData, { new: true });
            // // Check if the plant was found and updated
            if (!existingDiary) {
                return res.status(404).json({ error: 'Detail not found' });
            }
            // // Send a success response with the updated plant
            res.status(200).json({ message: 'Plant updated successfully', updatedDiary: updatedDiary });
        }
    } catch (error) {
        // Handle any errors that occur during database query or processing
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = {
    show,
    crudOperations
}