const { User } = require("../models")
const {formatCurrency} = require("../utils/currency")
const { comparePassword } = require("../utils/bcrypt")
const { generateToken } = require("../utils/jwt")


class UserController {

    static async getUsers(req, res) {
        try {
            
            const users = await User.findAll()

            const usersWithFormattedBalance = users.map(user => ({
                ...user.dataValues,
                balance: formatCurrency(user.balance),
            }));

            res.status(200).json(usersWithFormattedBalance)

        } catch (error) {
            
            res.status(500).json({message: error.message})

        }
    }

    // ENDPOINT REGISTRASI
    static async registerUSer(req, res) {
        try {
            
            const {
                full_name, password, gender, email
            } = req.body

            const newUser = await User.create({
                full_name, password, gender, email, role:"costumer"
            })

            newUser.balance = formatCurrency(newUser.balance)

            res.status(201).json({
                user: {
                    full_name: newUser.full_name,
                    email: newUser.email,
                    gender: newUser.gender,
                    balance: newUser.balance,
                    createdAt: newUser.createdAt
                }
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    // ENDPOINT LOGIN
    static async loginUser(req, res) {
        try {
            
            const {
                email, password
            } = req.body

            const user = await User.findOne({
                where : {
                    email: email
                }
            })

            if (!user) {
                throw {
                    code: 404,
                    message: "User tidak terdaftar"
                }
            }

            const isValid = comparePassword(password, user.password)

            if (!isValid) {
                throw {
                    code: 401,
                    message: "Password Salah"
                }
            }

            const token = generateToken({
                id: user.id,
                email: user.email
            })

            res.status(200).json({ code: 200, token });

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }

    
    // ENDPOINT UPDATED USER
    static async updatedUser(req, res) {
        try {
            
            const {
                full_name, email
            } = req.body

            const userData = req.userData

            const updatedUser = await User.update({
                full_name, email
            }, {
                where: {
                    id: userData.id
                    
                },
                returning: true
            })

            if (!updatedUser[0]) {
                throw {
                    code: 404,
                    message: "Data tidak ada"
                }
            }

            res.status(200).json({
                code: 200,
                user: {
                    id: userData.id,
                    full_name: userData.full_name,
                    email: userData.email,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt
                }
            })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }


    // ENDPOINT UNTUK TOPUP USER
    static async topUpUser(req, res) {
        try {
            
            const userData = req.userData
            const {balance} = req.body

            const [updatedRows, updatedUsers] = await User.update(
                { balance: User.sequelize.literal(`balance + ${balance}`) },
                {
                    where: { id: userData.id },
                    returning: true,
                }
            );

            // const user = await User.findByPk(userData.id)

            if (!Number.isInteger(balance) || balance < 0 || balance > 100000000) {
                return res.status(400).json({
                    status: 400,
                    error: 'Invalid balance value',
                });
            }

            // await user.update({ balance: User.sequelize.literal(`balance + ${balance}`) })

            const formattedBalance = formatCurrency(updatedUsers[0].balance)
            // const formattedBalance = formatCurrency(user.balance)

            const successMessage = `Your balance has been successfully updated to Rp ${formattedBalance}`

            res.status(200).json({message: successMessage})

        } catch (error) {
            res.status(500).json(error)
        }
    }


    // ENDPOINT UNTUK DELETE USER
    static async deletedUser(req, res) {
        try {
            
            const userData = req.userData

            const deleteUser = await User.destroy({
                where: {
                    id: userData.id
                }
            })

            res.status(200).json({ message: "Your account has been succesfully deleted" })

        } catch (error) {
            res.status( error.code || 500).json(error.message)
        }
    }

}

module.exports = UserController