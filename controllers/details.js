const Plant = require('../models/plant');
const Detail = require('../models/detail')

let selectedPlant
async function show(req, res){

     selectedPlant = await Plant.findById(req.params.plantId)
    console.log("check it first: "+selectedPlant)
    console.log('see andwer:  '+ selectedPlant)
    res.render('plants/log', {selectedPlant})
}


async function crudOperations(req, res) {
    const { action, plantId } = req.body;
    const selectedPlantId = selectedPlant._id
 console.log("see the plantId from the server:  ", selectedPlantId)
    try {
        const action = req.body.action;
        if (action === 'fetch') {
         
            // Fetch all detail from the database
            // const detail = await Detail.findById(req.body.selectedPlantId);
            const detail = await Detail.find({ plant: selectedPlantId })
        
console.log("what is the detail at this page: "+ detail)

            // Send the fetched plants as JSON response
            res.json({ data: detail });
        } 
        if (action === 'Add'){
            console.log('ok, when add, see the body', req.body)
             var light = req.body.light;
             var water = req.body.water;
             var soil = req.body.soil;
             var plant = req.body.plantId;
             const newDetail = new Detail({
                light, water, soil, plant
             })
             console.log(newDetail)
             await newDetail.save();
             res.status(201).json({ message: 'Detail added successfully' });
        }

        if (action === 'delete') {
            console.log(req.body.id);
            const id = req.body.id;
        
            
                // Find the plant by its ID and delete it
                const deletedPlant = await Plant.findByIdAndDelete(id);
        
                // Check if the plant was found and deleted
                if (!deletedPlant) {
                    return res.status(404).json({ error: 'Plant not found' });
                }
        
                // Check if the user is authorized to delete the plant
                if (deletedPlant.user.toString() !== req.user._id.toString()) {
                    return res.status(403).json({ error: 'You are not authorized to delete this plant' });
                }
        
                // Send a success response
                res.json({ message: 'Plant deleted successfully' });
           
        }
        if (action === 'Edit') {
         
                // Extract data from the request body
                const id = req.body.id;
                console.log(id)
                console.log(req.body);
                const existingPlant = await Plant.findById(id);
                console.log(existingPlant);
              console.log(typeof(req.body.price))
                const updatedData = {
                    // Check if each field has been edited, if not, keep the existing value
                    name: req.body.name.length !== 0?req.body.name : existingPlant.name,
                    location: req.body.location.length !== 0? req.body.location : existingPlant.location,
                    price: req.body.price.length !== 0? req.body.price : existingPlant.price,
                    date: req.body.date.length !== 0? req.body.date : existingPlant.date,
                    // Add other fields as needed
                };        
               console.log(updatedData)
                // Find the plant by its ID and update it with the new data
                const updatedPlant = await Plant.findByIdAndUpdate(id, updatedData, { new: true });
        
                // // Check if the plant was found and updated
                if (!updatedPlant) {
                    return res.status(404).json({ error: 'Plant not found' });
                }
                
                // // Send a success response with the updated plant
                res.status(200).json({ message: 'Plant updated successfully', updatedPlant: updatedPlant });

           
        }
    } catch (error) {
        // Handle any errors that occur during database query or processing
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// async function crudOperations(req, res, userId, plantId) {
//     const { action } = req.body;

//     try {
//         if (action === 'fetch') {
//             // Fetch details for the specified plantId
//             const detail = await Detail.find({ plant: plantId });
//             // Send the fetched details as JSON response
//             return res.json({ data: detail });
//         }  
//         if (action === 'Add') {
//             // Extract detail information from the request body
//             const { light, water, soil } = req.body;
//             // Create a new detail entry associated with the provided plantId
//             const newDetail = new Detail({ light, water, soil, plant: plantId });
//             // Save the new detail entry to the database
//             await newDetail.save();
//             // Send a success response
//             return res.status(201).json({ message: 'Detail added successfully' });
//         }
//         if (action === 'delete') {
//             const id = req.body.id;
        
//             // Find the plant by its ID and delete it
//             const deletedPlant = await Plant.findByIdAndDelete(id);
        
//             // Check if the plant was found and deleted
//             if (!deletedPlant) {
//                 return res.status(404).json({ error: 'Plant not found' });
//             }
        
//             // Check if the user is authorized to delete the plant
//             if (deletedPlant.user.toString() !== req.user._id.toString()) {
//                 return res.status(403).json({ error: 'You are not authorized to delete this plant' });
//             }
        
//             // Send a success response
//             res.json({ message: 'Plant deleted successfully' });
//         }
//         if (action === 'Edit') {
//             const id = req.body.id;
            
//             // Extract updated data from the request body
//             const { name, location, price, date } = req.body;
//             const updatedData = {
//                 name: name.length !== 0 ? name : existingPlant.name,
//                 location: location.length !== 0 ? location : existingPlant.location,
//                 price: price.length !== 0 ? price : existingPlant.price,
//                 date: date.length !== 0 ? date : existingPlant.date,
//             };        

//             // Find the plant by its ID and update it with the new data
//             const updatedPlant = await Plant.findByIdAndUpdate(id, updatedData, { new: true });

//             // Check if the plant was found and updated
//             if (!updatedPlant) {
//                 return res.status(404).json({ error: 'Plant not found' });
//             }
            
//             // Send a success response with the updated plant
//             res.status(200).json({ message: 'Plant updated successfully', updatedPlant: updatedPlant });
//         }
//     } catch (error) {
//         // Handle any errors that occur during database query or processing
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }
module.exports = {
    show,
    crudOperations
}