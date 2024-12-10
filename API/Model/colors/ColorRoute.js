const ColorController=require('./ColorController');
const express = require('express');
const router = express.Router();

router.post('/',ColorController.CreateColor);
router.get('/',ColorController.getAllColors);
router.get('/:id',ColorController.getByModelId);


module.exports=router;
