const { verifyToken } = require("../utils/jwt")
const { User } = require("../models")

const authenticationToken = async(req, res, next) => {
    try {
        
        const token = req.headers["authorization"]

        if (!token) {
            throw {
                code: 401,
                message: "Token tidak tersedia"
            }
        }

        const decoded = verifyToken(token)

        const userData = await User.findOne({
            where: {
                id: decoded.id,
                email: decoded.email
            }
        })

        if(!userData) {
            throw {
                code: 404,
                message: "User tidak ada"
            }
        }

        req.userData = {
            id: userData.id,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
        }



        next()

    } catch (error) {
        res.status(error.code || 401).json(error.message)
    }
}

module.exports = {
    authenticationToken
}