
const Plant = require('../models/plant');


function index(req,res){
    res.redirect(`/${req.user.name.split(" ")[0]}`)
}

async function show(req,res){
    // const plants = await Plant.find({})


    // // test ajax
    // res.render('plants/list',{plants})

    res.render('plants/sample_data')

}

async function create(req,res){
 
    req.body.user = req.user._id;
    
    req.body.price = parseFloat(req.body.price);
    await Plant.create(req.body)
    res.redirect(`/${req.user.name.split(" ")[0]}`)
}


async function deletehis(req, res) {
    try {
        const { userId, plantId } = req.params;

        // Assuming you have a Plant model imported and defined
        const plant = await Plant.findById(plantId);

        // Check if the plant exists
        if (!plant) {
            // If the plant was not found, send a 404 response
            return res.status(404).send('Plant not found');
        }

// Check if the user is the creator of the plant
        if (plant.user.toString() !== req.user._id.toString()) {
            
            // If the user is not the creator, send a 403 forbidden response
            return res.status(403).send('You are not authorized to delete this plant');
        }

        // If the user is authorized, delete the plant
        const deletedPlant = await Plant.findByIdAndDelete(plantId);

        // Redirect the user after successful deletion
        res.redirect(`/${userId}`); // Redirect to user page or another appropriate page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function fetch(req, res) {
    try {
        const action = req.body.action;
        if (action === 'fetch') {
            // Fetch all plants from the database
            const plants = await Plant.find().sort({ _id: -1 });

            // Send the fetched plants as JSON response
            res.json({ data: plants });
        } else {
            // Handle invalid action
            res.status(400).json({ error: 'Invalid action' });
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
    delete: deletehis,
    fetch,
}