const InsuranceModel=require('./InsuranceModel');
const ModelNames=require('../ModelNames/modelName');

exports.CreateInsurance=async(req,res)=>{
    try {
        const {modelId,insurance_Name,price}=req.body;
        const modelname=await InsuranceModel.create(req.body);
        console.log(modelname);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error creating model name:', error);
        res.status(500).json({ error: 'Failed to create model name' });
    }
}
exports.getAllInsurances = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        const variants = await InsuranceModel.findAndCountAll({
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
        const variants = await InsuranceModel.findAndCountAll({
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

