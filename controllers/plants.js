
const Plant = require('../models/plant');

function index(req,res){
    res.redirect(`/${req.user.name.split(" ")[0]}`)
}

async function show(req,res){
    res.render('plants/list')
}

async function create(req,res){
    req.body.user = req.user._id;
    console.log(req.body.user)
    req.body.price = parseFloat(req.body.price);
    await Plant.create(req.body)
    res.redirect(`/${req.user.name.split(" ")[0]}`)
}

async function crudOperations(req, res) {
    try {
        const action = req.body.action;
        if (action === 'fetch') {
            console.log('see the fetch body: ',req.body)
            const userId = req.body.userId
            // Fetch all plants from the database
            const plants = await Plant.find({user:userId}).sort({date: -1 });
            // Send the fetched plants as JSON response
            res.json({ data: plants });
        } 
        if (action === 'Add'){
            console.log(req.body)
             const name = req.body.name;
             const location = req.body.location;
             const price = req.body.price;
             const date = req.body.date;
             req.body.user = req.user._id;
             const user = req.body.user;
             const userName = req.body.userName;
             const userAvatar = req.body.userAvatar;
             const newPlant = new Plant({
                name, location,price, date, user ,userName, userAvatar
             })
             
             await newPlant.save();
             res.status(201).json({ message: 'Plant added successfully' });
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
                const existingPlant = await Plant.findById(id);
                const updatedData = {
                    // Check if each field has been edited, if not, keep the existing value
                    name: req.body.name.length !== 0?req.body.name : existingPlant.name,
                    location: req.body.location.length !== 0? req.body.location : existingPlant.location,
                    price: req.body.price.length !== 0? req.body.price : existingPlant.price,
                    date: req.body.date.length !== 0? req.body.date : existingPlant.date,
                    // Add other fields as needed
                };        
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

module.exports = {
    index,
    show,
    create,
    crudOperations,
}