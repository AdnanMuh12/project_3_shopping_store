const { Product, Category } = require("../models")
const { formatCurrency } = require("../utils/currency")

class ProductController {

    // ENDPOINT POST PRODUCTS
    static async postProducts(req, res) {
        try {

            const {
                title, price, stock, CategoryId
            } = req.body

            const category = await Category.findByPk(CategoryId)

            if (!category) {
                throw {
                    code: 404,
                    message: "Category tidak ada"
                }
            }

            const newProduct = await Product.create({
                title, price, stock, CategoryId
            })

            newProduct.price = formatCurrency(newProduct.price)

            res.status(201).json({
                status: 201,
                product: newProduct,
            })
            
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    // ENPOINT UNTUK GET PRODUCTS
    static async getProducts(req, res) {
        try {
            
            const products = await Product.findAll({
                include: Category
            })

            const formattedProducts = products.map((product) => {
                return {
                    id: product.id,
                    title: product.title,
                    price: formatCurrency(product.price),
                    stock: product.stock,
                    CategoryId: product.CategoryId,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                };
            })

            res.status(200).json({
                status: 200,
                products: formattedProducts,
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    // ENDPOINT UNTUK PUT PRODUCTS
    static async putProducts(req, res) {
        try {
            
            const productId = req.params.id

            const {
                price, stock, title
            } = req.body

            const product = await Product.findByPk(productId)

            if(!product) {
                throw {
                    code: 404,
                    message: "Data Tidak Ada"
                }
            }

            product.title = title || product.title
            product.price = price || product.price
            product.stock = stock || product.stock

            await product.save()

            product.price = formatCurrency(product.price)

            res.status(200).json({
                status: 200,
                product
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    // ENDPOINT UNTUK PATCH PRODUCTS
    static async patchProducts(req, res) {
        try {
            
            const productId = req.params.id

            const { CategoryId } = req.body

            const product = await Product.findByPk(productId)

            if(!product) {
                throw {
                    code: 404,
                    message: "Product Tidak Ada"
                }
            }

            const category = await Category.findByPk(CategoryId)

            if(!category) {
                throw {
                    code: 404,
                    message: "Category Tidak Ada"
                }
            }

            product.CategoryId = CategoryId

            await product.save()

            res.status(200).json({
                status: 200,
                product
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    // ENPOINT UNTUK DELETE PROODUCTS
    static async deleteProducts(req, res) {
        try {
            
            const productId = req.params.id

            const product = await Product.findByPk(productId)

            if(!product) {
                throw {
                    code: 404,
                    message: "Product Tidak Ada"
                }
            }

            await product.destroy()

            res.status(200).json({
                status: 200,
                message: "Product has been successfully deleted",
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

}

module.exports = ProductController