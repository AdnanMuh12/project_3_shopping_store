const { 
        Product,
        User, 
        TransactionHistory, 
        Category  
    } = require("../models")

const { formatCurrency } = require("../utils/currency")

class TransactionController {


    // ENDPOINT UNTUK TRANSAKSI USER
    static async createTransaction(req, res) {

        const { productId: originalProductId, quantity } = req.body
        const userId = req.userData.id

        const productId = originalProductId

        try {
            
            const product = await Product.findByPk(productId)

            if (!product) {
                throw {
                    code: 404,
                    message: "Produk tidak ada"
                }
            }

            if (product.stock < quantity) {
                throw {
                    code: 400,
                    message: "Stock tidak cukup"
                }
            }

            const user = await User.findByPk(userId)

            if (user.balance < product.price * quantity) {
                throw {
                    code: 404,
                    message: "Saldo tidak cukup"
                }
            }

            const transaction = await User.sequelize.transaction()

            try {
                
                await Product.update(
                    { stock: product.stock - quantity },
                    { where: { id: productId }, transaction }
                )

                await User.update(
                    { balance: user.balance - product.price * quantity },
                    { where: { id: userId }, transaction }
                )

                const category = await Category.findByPk(product.CategoryId);
                await Category.update(
                    { sold_product_amount: category.sold_product_amount + quantity },
                    { where: { id: product.CategoryId }, transaction }
                )

                await TransactionHistory.create(
                    {
                        quantity,
                        total_price: product.price * quantity,
                        ProductId: productId,
                        UserId: userId,
                    },
                    { transaction }
                )

                await transaction.commit()

                const productName = product.title

                const response = {
                    message: "You have successfully purchased the product",
                    transactionBill: {
                      total_price: formatCurrency(product.price * quantity),
                        quantity,
                        product_name: productName,
                    },
                }

                res.status(201).json(response)

            } catch (error) {
                res.status(500).json({message: error.message})
            }

        } catch (error) {
            res.status(500).json({message: error.message})
        }

    }


    // ENDPOINT GET TRANSAKSI OLEH ADMIN
    static async getTransactionAdmin(req, res) {
        try {
            
            const transactions = await TransactionHistory.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'balance', 'gender', 'role'],
                    },
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            })

            const formattedTransactions = transactions.map((transaction) => {
                return {
                    ProductId: transaction.ProductId,
                    UserId: transaction.UserId,
                    quantity: transaction.quantity,
                    total_price: formatCurrency(transaction.total_price),
                    createdAt: transaction.createdAt,
                    updatedAt: transaction.updatedAt,
                    Product: {
                        id: transaction.Product.id,
                        title: transaction.Product.title,
                        price: formatCurrency(transaction.Product.price),
                        stock: transaction.Product.stock,
                        CategoryId: transaction.Product.CategoryId,
                    },
                    User: {
                        id: transaction.User.id,
                        email: transaction.User.email,
                        balance: formatCurrency(transaction.User.balance),
                        gender: transaction.User.gender,
                        role: transaction.User.role,
                    },
                };
            })

            res.status(200).json({
                transactionHistories: formattedTransactions,
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    
    // ENPOINT UNTUK GET TRANSAKSI OLEH USER 
    static async getTransactionByUser(req,res) {
        try {
            

            const transactionId = req.params.id

            const transaction = await TransactionHistory.findOne({
                where: { id: transactionId },
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId'],
                    },
                ],
            })

            if(!transaction) {
                throw {
                    code: 404,
                    message: "Transaksi tidak ditemukan"
                }
            }

            const formattedTransaction = {
                ProductId: transaction.ProductId,
                UserId: transaction.UserId,
                quantity: transaction.quantity,
                total_price: formatCurrency(transaction.total_price),
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
                Product: {
                    id: transaction.Product.id,
                    title: transaction.Product.title,
                    price: formatCurrency(transaction.Product.price),
                    stock: transaction.Product.stock,
                    CategoryId: transaction.Product.CategoryId,
                },
            }

            res.status(200).json({
                transaction: formattedTransaction,
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

}

module.exports = TransactionController