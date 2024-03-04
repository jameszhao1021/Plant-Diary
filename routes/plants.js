const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/plants');
const detailsController = require('../controllers/details');

const ensureLoggedIn = require('../config/ensureLoggedIn');


router.get('/user', ensureLoggedIn, plantsController.index);
router.get('/:id', ensureLoggedIn, plantsController.show);
router.get(`/:userId/:plantId`, ensureLoggedIn, detailsController.show);
router.post('/:id', ensureLoggedIn, plantsController.crudOperations)

module.exports = router;