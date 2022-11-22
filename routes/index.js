const express = require('express');
const burgerController = require('../controllers/burger');
const reviewController = require('../controllers/review');
const restaurantController = require('../controllers/restaurant');

const router = express.Router();

//ENRUTADO DE ENDPOINTS PARA LAS HAMBURGUESAS
router.post('/api/v1/:API_KEY/burgers', burgerController.createBurger);
router.get('/api/v1/:API_KEY/burgers', burgerController.getBurger);
router.get('/api/v1/:API_KEY/burgers/:burgerId', burgerController.getSingleBurger);
router.put('/api/v1/:API_KEY/burgers/:burgerId', burgerController.editBurger);

//ENRUTADO DE ENDPOINTS PARA LAS RESEÑAS
router.post('/api/v1/:API_KEY/reviews', reviewController.createReviews);
router.get('/api/v1/:API_KEY/reviews', reviewController.getReview);
router.get('/api/v1/:API_KEY/reviews/:reviewId', reviewController.getSingleReview);
router.put('/api/v1/:API_KEY/reviews/:reviewId', reviewController.editReview);
router.get('/api/v1/:API_KEY/latestreviews', reviewController.getLatestReviews);
router.get('/api/v1/:API_KEY/reviews/restaurant/:restaurantId', reviewController.getRestaurantReviews);

//ENRUTADO DE ENDPOINTS PARA LOS RESTAURANTES
router.post('/api/v1/:API_KEY/restaurants', restaurantController.createRestaurant);
router.get('/api/v1/:API_KEY/restaurants', restaurantController.getRestaurants);
router.get('/api/v1/:API_KEY/restaurants/:restaurantId', restaurantController.getSingleRestaurant);
router.put('/api/v1/:API_KEY/restaurants/:restaurantId', restaurantController.editRestaurant);


module.exports = router;