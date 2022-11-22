const yup = require('yup');

module.exports = new yup.ObjectSchema().shape({
    name: yup.string().required(),
    burgers: yup.array().required().nullable(true),
    address: yup.string().required()
});