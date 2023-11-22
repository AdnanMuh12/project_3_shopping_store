
const isAdminRoleMiddleware = (req, res, next) => {
    const user = req.userData;

    if (!user || user.role !== "admin") {
        return res.status(403).json({
            status: 403,
            error: "Forbidden - Admin access required",
        });
    }

    next();
};

    module.exports = {
        isAdminRoleMiddleware,
    };
