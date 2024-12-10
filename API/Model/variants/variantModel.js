const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../../config/db');
const Modelname = require('../ModelNames/modelName');

class VariantModel extends Model { }

VariantModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  modelId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      tableName: 'modelnames',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  variant: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  price: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
},
{
  sequelize,
  modelName: "VariantModel",
  tableName: "variantnames",
  timestamps: true,
});




module.exports = VariantModel;
