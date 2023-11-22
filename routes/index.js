const UserController = require("../controllers/userControllers")
const CategoryController = require("../controllers/categoryController")
const ProductController = require("../controllers/productControllers")
const TransactionController = require("../controllers/transactionControllers")
const { authenticationToken } = require("../middleware/auth")
const { isAdminRoleMiddleware } = require("../middleware/checkRole")

const router = require("express").Router()

router.get("/users", UserController.getUsers)
router.post("/users/register", UserController.registerUSer)
router.post("/users/login", UserController.loginUser)
router.put("/users", authenticationToken, UserController.updatedUser)
router.delete("/users", authenticationToken, UserController.deletedUser)
router.patch("/users/topup", authenticationToken, UserController.topUpUser)

router.post("/categories", authenticationToken, isAdminRoleMiddleware, CategoryController.createCategory)
router.get("/categories", authenticationToken, isAdminRoleMiddleware, CategoryController.getAllCategories)
router.patch("/categories/:id", authenticationToken, isAdminRoleMiddleware, CategoryController.patchCategory)
router.delete("/categories/:id", authenticationToken, isAdminRoleMiddleware, CategoryController.deleteCategory)

router.post("/products", authenticationToken, isAdminRoleMiddleware, ProductController.postProducts)
router.get("/products", authenticationToken, ProductController.getProducts)
router.put("/products/:id", authenticationToken, isAdminRoleMiddleware, ProductController.putProducts)
router.patch("/products/:id", authenticationToken, isAdminRoleMiddleware, ProductController.patchProducts)
router.delete("/products/:id", authenticationToken, isAdminRoleMiddleware, ProductController.deleteProducts)

router.post("/transactions", authenticationToken, TransactionController.createTransaction)
router.get("/transactions/admin", authenticationToken, isAdminRoleMiddleware, TransactionController.getTransactionAdmin)
router.get("/transactions/:id", authenticationToken, TransactionController.getTransactionByUser)



module.exports = router 