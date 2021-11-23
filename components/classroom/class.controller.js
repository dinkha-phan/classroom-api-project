const express = require('express');
const router = express.Router();
const classService = require('./class.service');


/* Get list of classes */
router.get('/', async function (req, res, next) {
    const result = await classService.getAllClasses();
    res.json(result);
});

/* Get class by ID */
router.get('/:id', async function (req, res, next) {
    const id = req.params.id;
    //console.log(id);
    const result = await classService.getClassByID(id);
    res.json(result);
});

/* Add class*/
router.post('/', async (req, res, next) => {
    // console.log(req.body);
    res.json(await classService.createClass(req.body));
});

/* Update class by ID */
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    //console.log(id, req.body);
    const result = await classService.updateClassByID(id, req.body);
    res.send(result);
});

/* Delete class by ID */
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    // console.log(id);
    const result = await classService.deleteClassByID(id);
    res.send(result);
});




module.exports = router;
