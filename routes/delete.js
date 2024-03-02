const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/plants');
const ensureLoggedIn = require('../config/ensureLoggedIn');



router.post(`/:userId/:plantId/delete`, ensureLoggedIn, plantsController.delete);



module.exports = router;