'use strict';
const {
  Model
} = require('sequelize');

const {
  hashPassword
} = require("../utils/bcrypt")

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.TransactionHistory, { foreignKey: "UserId" })
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "full name tidak boleh kosong"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "email sudah digunakan"
      },
      validate: {
        isEmail: {
          args: true,
          msg: "format email tidak valid"
        },
        notEmpty: {
          args: true,
          msg: "field email tidak boleh kosong"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "password tidak boleh kosong"
        },
        len: {
          args: [6, 10],
          msg: "password harus diisi 6 sampai 10 character"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "gender harus di isi"
        },
        isIn: {
          args: [["male", "female"]],
          msg: "gender hanya boleh diisi dengan male dan female"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["admin", "costumer"]],
          msg: "role hanya bisa di isi dengan admin atau costumer"
        }
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        min: {
          args: [0],
          msg: "balance tidak boleh kurang dari 0"
        },
        max: {
          args: [100000000],
          msg: "balance tidak boleh dari 100000000"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user) => {
        const hashedPassword = hashPassword(user.password)

        user.password = hashedPassword
        user.balance = 0
      },
      beforeUpdate: (user) => {
        if (user.balance !== undefined && (user.balance < 0 || user.balance > 100000000)) {
          throw new Error('Balance must be between 0 and 100000000');
        }
      },
    }
  });
  return User;
};