'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, { foreignKey: "CategoryId" })
      Product.hasMany(models.TransactionHistory, { foreignKey: "ProductId" })
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title tidak boleh Null"
        },
        notEmpty: {
          msg: "Title tidak boleh kosong "
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "price harus diisi"
        },
        isInt: {
          msg: "price harus diisi dengan number"
        },
        max: {
          args: [50000000],
          msg: "price tidak boleh melebihin 50,000,000"
        },
        min: {
          args: [0],
          msg: "price tidak boleh kurang dari 0"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Stock harus diisi"
        },
        isInt: {
          msg: "stock harus di isi dengan number "
        },
        min: {
          args: [5],
          msg: "stock tidak boleh kurang dari 5"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};