const express = require('express')
const router = express.Router()
const {getTareas,updateTareas,deleteTareas, createTareas} = require('../controllers/tareasControllers')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getTareas)
router.post('/', protect, createTareas)

router.put('/:id', protect, updateTareas)
router.put('/:id', protect, deleteTareas)

module.exports = router

