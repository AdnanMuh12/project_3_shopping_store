const { Category, Product } = require("../models")
const { formatCurrency } = require("../utils/currency")

class CategoryController {

    // ENDPOITN UNTUK MENAMBAHKAN CATEGORY
    static async createCategory(req, res) {
        try {
            
            const { type } = req.body

            const newCategory = await Category.create({ type })

            newCategory.sold_product_amount = formatCurrency(newCategory.sold_product_amount)

            res.status(201).json({
                status: 201,
                category: newCategory,
            });

        } catch (error) {
            // if (error.name === "SequelizeUniqueConstraintError") {
            //     return res.status(400).json({
            //         status: 400,
            //         error: "Type Category sudah ada",
            //     });
            // }

            res.status(500).json({message: error.message})
        }
    }


    // ENDPOINT UNTUK GET CATEGORY
    static async getAllCategories(req, res) {
        try {
            
            const categories = await Category.findAll({
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId', 'createdAt', 'updatedAt']
                    },
                ],
            })

            const formattedCategories = categories.map((category) => {
                return {
                    id: category.id,
                    type: category.type,
                    sold_product_amount: formatCurrency(category.sold_product_amount),
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                    products: category.Products.map((product) => {
                        return {
                            id: product.id,
                            title: product.title,
                            price: formatCurrency(product.price),
                            stock: product.stock,
                            createdAt: product.createdAt,
                            updatedAt: product.updatedAt
                        };
                    }),
                };
            });

            res.status(200).json({
                status: 200,
                categories: formattedCategories,
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    // ENDPOINT UNTUK PATCH CATEGORY
    static async patchCategory(req, res) {
        try {
            
            const categoryId = req.params.id

            const { type } = req.body

            const category = await Category.findByPk(categoryId)

            if (!category) {
                return res.status(404).json({
                    status: 404,
                    error: "category tidak ada",
                });
            }

            if (type) {
                category.type = type;
            }

            await category.save()

            category.sold_product_amount = formatCurrency(category.sold_product_amount)

            res.status(200).json({
                status: 200,
                category
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    // ENDPOITN UNTUK MENGHAPUS CATEGORY
    static async deleteCategory(req, res) {
        try {
            
            const categoryId = req.params.id

            const category = await Category.findByPk(categoryId)

            if (!category) {
                return res.status(404).json({
                    status: 404,
                    error: "Category tidak ditemukan",
                });
            }

            await category.destroy()

            res.status(200).json({
                status: 200,
                message: "Category has been succesfully deleted",
            })

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

}

module.exports = CategoryController