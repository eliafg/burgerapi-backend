const yup = require('yup');

module.exports = new yup.ObjectSchema().shape({
    name: yup.string().required(),
    meat: yup.string().required(),
    price: yup.number().required().positive(),
    style: yup.string().required(),
    restaurantId: yup.number().positive().required()
});