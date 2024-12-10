const VASModel=require('./VASModel');
const ModelNames=require('../ModelNames/modelName');

exports.CreateVAS=async(req,res)=>{
    try {
        const {modelId,VAS_Name,price}=req.body;
        const modelname=await VASModel.create(req.body);
        console.log(modelname);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error creating model name:', error);
        res.status(500).json({ error: 'Failed to create model name' });
    }
}
exports.getAllVASs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        const variants = await VASModel.findAndCountAll({
            include: [{
                model: ModelNames,
                as: 'modelnames'
            }],
            // raw: true,
            nest: false,
            limit,
            offset,
        });
        
        res.status(200).json({
            totalItems: variants.count,
            totalPages: Math.ceil(variants.count / limit),
            currentPage: page,
            data: variants.rows
        });
    } catch (error) {
        console.error('Error retrieving model names:', error);
        res.status(500).json({ error: 'Failed to retrieve model names' });
    }
};


exports.getByModelId = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const variants = await VASModel.findAndCountAll({
            where: { modelId: id },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            limit,
            offset,
        });

        res.status(200).json({
            totalItems: variants.count,
            totalPages: Math.ceil(variants.count / limit),
            currentPage: page,
            data: variants.rows,
        });
    } catch (error) {
        console.error('Error retrieving variants:', error);
        res.status(500).json({ error: 'Failed to retrieve variants' });
    }
};


exports.updateVAS = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVariant = await VASModel.update(req.body, { where: { id } });
        res.status(200).json(updatedVariant);
    } catch (error) {
        console.error('Error updating variant:', error);
        res.status(500).json({ error: 'Failed to update variant' });
    }
};


exports.deleteVAS = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVariant = await VASModel.destroy({ where: { id } });
        res.status(200).json({message: 'VAS deleted successfully'});
    } catch (error) {
        console.error('Error deleting variant:', error);
        res.status(500).json({ error: 'Failed to delete variant' });
    }
};
