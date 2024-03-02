const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/plants');
const detailsController = require('../controllers/details');

const ensureLoggedIn = require('../config/ensureLoggedIn');


router.get('/user', ensureLoggedIn, plantsController.index);
router.get('/:id', ensureLoggedIn, plantsController.show);
router.post('/:id/new', ensureLoggedIn, plantsController.create);
router.get(`/:userId/:plantId`, ensureLoggedIn, detailsController.show);




// testAjax
router.post('/:id', ensureLoggedIn, plantsController.fetch)

module.exports = router;