const AppError = require('../utils/AppError');

/**
 * Joi validation middleware factory.
 * @param {Object} schema - Joi schema object with body, query, or params keys
 */
const validate = (schema) => {
  return (req, res, next) => {
    const targets = ['body', 'query', 'params'];

    for (const target of targets) {
      if (schema[target]) {
        const { error, value } = schema[target].validate(req[target], {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          const messages = error.details.map((d) => d.message).join(', ');
          return next(new AppError(`Validation error: ${messages}`, 400));
        }

        req[target] = value;
      }
    }

    next();
  };
};

module.exports = validate;
