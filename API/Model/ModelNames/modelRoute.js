const express = require('express');
const router = express.Router();
const ModelController=require('./modelController');

router.post('/',ModelController.CreateModelName);
router.get('/',ModelController.getAllModelNames);
router.get('/for/:id',ModelController.getById);
router.get('/detail/:id',ModelController.getallDetail);
router.put('/:id',ModelController.UpdateModel);


module.exports = router;