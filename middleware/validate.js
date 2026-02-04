const Joi = require('joi');
const ErrorResponse = require('../utils/errorResponse');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const message = error.details.map((detail) => detail.message).join(', ');
        return next(new ErrorResponse(message, 400));
    }
    next();
};

module.exports = validate;
