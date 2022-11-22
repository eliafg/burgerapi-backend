const yup = require('yup');

module.exports = new yup.ObjectSchema().shape({
    burgerId: yup.number().positive(),
    score: yup.number().min(0).max(5),
    comment: yup.string().required(),
    dateReviewed: yup.date().default(function () {
        return new Date();
    })
});