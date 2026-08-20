export const validateSchema = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
            return res.status(400).json({
            error: 'Error de validación',
            details: error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message
            }))
        });
    }
};