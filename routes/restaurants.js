const express = require('express');

const resData = require('../util/restaurant-data');

const router = express.Router();

const uuid = require('uuid');

router.get('/restaurants', function(req, res) {
    const order = req.query.order;
    let nextOrder = 'desc';

    if (order !== 'asc' && order !== 'desc') {
        order = 'asc';
    }

    if (order === 'desc') {
        nextOrder = 'asc';
    }

    const storedRestaurants = resData.getStoredRestaurant();

    storedRestaurants.sort(function(resA, resB) {
        if ((order === 'asc' && resA.name > resB.name) || (order === 'desc' && resB.name > resA.name)) {
            return 1;
        } return -1
         
    });
    
    res.render('restaurants', { numberOfRestaurants: storedRestaurants.length, restaurants: storedRestaurants, nextOrder: nextOrder });
});

router.get('/restaurants/:id', function (req, res) {
    const restaurantId = req.params.id;
    const storedRestaurants = resData.getStoredRestaurant();

    for(const restaurant of storedRestaurants) {
        if (restaurant.id === restaurantId) {
            return res.render('restaurants-detail', {restaurant: restaurant});
        } 
    }

    res.status(404).render('404');
});

router.get('/recommend', function(req, res) {
    res.render('recommend');
});

router.get('/confirm', function(req, res) {
    res.render('confirm');
});



router.post('/recommend', function(req, res) {
    const restaurant = req.body;
    restaurant.id = uuid.v4();
   const storedRestaurants = resData.getStoredRestaurant();

    storedRestaurants.push(restaurant);

    resData.storedRestaurants(storedRestaurants);

    res.redirect('/confirm');
});

module.exports = router;