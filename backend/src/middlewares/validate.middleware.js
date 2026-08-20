export const validateSchema = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next(); // si fue exitosa la validacion, continua con el siguiente middleware o controlador
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