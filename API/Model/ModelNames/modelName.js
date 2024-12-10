const { DataTypes, Model } = require('sequelize')
const sequelize = require("../../../config/db");
const VariantModel = require('../variants/variantModel');
const Colorname = require('../colors/ColorModel');
const AccessoriesModel = require('../Accessories/AccessoriesModel');
const InsuranceModel = require('../Insurance/InsuranceModel');
const VASModel = require('../VAS/VASModel');

class Modelname extends Model { }

Modelname.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  modelname: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  by: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
},
{
  sequelize,
  modelName: "Modelname",
  tableName: "modelnames",
  timestamps: true,
});

VariantModel.belongsTo(Modelname, { 
  foreignKey: 'modelId',
  as: 'modelnames'  
});


Modelname.hasMany(VariantModel, { 
  foreignKey: 'modelId',
  as: 'variants'
});


Colorname.belongsTo(Modelname, {
  foreignKey: 'modelId',
  as: 'modelnames'
})
Modelname.hasMany(Colorname, {
  foreignKey: 'modelId',
  as: 'colors'
});

AccessoriesModel.belongsTo(Modelname, {
  foreignKey: 'modelId',
  as: 'modelnames'
})
Modelname.hasMany(AccessoriesModel, {
  foreignKey: 'modelId',
  as: 'accessories'
});


InsuranceModel.belongsTo(Modelname, {
  foreignKey: 'modelId',
  as: 'modelnames'
})
Modelname.hasMany(InsuranceModel, {
  foreignKey: 'modelId',
  as: 'insurances'
});

VASModel.belongsTo(Modelname, {
  foreignKey: 'modelId',
  as: 'modelnames'
})
Modelname.hasMany(VASModel, {
  foreignKey: 'modelId',
  as: 'vas'
});

module.exports = Modelname;