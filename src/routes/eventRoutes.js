const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas Públicas
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Rotas Protegidas (precisam de token)
router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);
router.post('/:id/register', authMiddleware, eventController.registerForEvent);

module.exports = router;