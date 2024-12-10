const ModelNames=require('./modelName.js');
const AccessoriesModel=require('../Accessories/AccessoriesModel');
const InsuranceModel=require('../Insurance/InsuranceModel');
const VariantModel=require('../variants/variantModel');
const ColorModel=require('../colors/ColorModel');
const VASModel=require('../VAS/VASModel');
const e = require('express');


exports.CreateModelName=async(req,res)=>{
    try {
        const {modelName,by}=req.body;
        const modelname=await ModelNames.create(req.body);
        console.log(modelName);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error creating model name:', error);
        res.status(500).json({ error: 'Failed to create model name' });
    }
}

exports.getAllModelNames = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const modelNames = await ModelNames.findAndCountAll({
            limit,
            offset,
        });
        
        res.status(200).json({
            totalItems: modelNames.count,
            totalPages: Math.ceil(modelNames.count / limit),
            currentPage: page,
            data: modelNames.rows
        });
    } catch (error) {
        console.error('Error retrieving model names:', error);
        res.status(500).json({ error: 'Failed to retrieve model names' });
    }
}

exports.UpdateModel=async(req,res)=>{
    try {
        const {id}=req.params;
        const modelname=await ModelNames.update(req.body,{where:{id}});
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error updating model name:', error);
        res.status(500).json({ error: 'Failed to update model name' });
    }
}

exports.deleteModel=async(req,res)=>{
    try {
        const {id}=req.params;
        const modelname=await ModelNames.destroy({where:{id}});
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error deleting model name:', error);
        res.status(500).json({ error: 'Failed to delete model name' });
    }
}


exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const modelname = await ModelNames.findByPk(id);
        if (!modelname) {
            return res.status(404).json({ error: 'Model name not found' });
        }
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error retrieving model name:', error);
        res.status(500).json({ error: 'Failed to retrieve model name' });
    }
}

exports.getallDetail=async(req,res)=>{
    try {
        const {id}=req.params;
        const modelname=await ModelNames.findAll({where:{id},
            include:[
                {model:AccessoriesModel,as:'accessories',attributes:['id','AccessoryName','price']},
                {model:InsuranceModel,as:'insurances',attributes:['id','insurance_Name','price']},
                {model:VariantModel,as:'variants',attributes:['id','variant','price']},
                {model:ColorModel,as:'colors',attributes:['id','color','price']},
                {model:VASModel,as:'vas',attributes:['id','VAS_Name','price']}
            ],
            attributes:{
                exclude: ['createdAt', 'updatedAt']
            }
        });
        if (!modelname) {
            return res.status(404).json({ error: 'Model name not found' });
        }
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error retrieving model name:', error);
        res.status(500).json({ error: 'Failed to retrieve model name' });
    }
}
