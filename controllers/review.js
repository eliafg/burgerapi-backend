const reviewSchema = require('../schemas/reviewschema');
const dbo = require("../server/db/conn");

class reviewController {
    createReviews(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            if(reviewSchema.isValid(req.body).then( async function(valid){
                if(valid){
                    let db_connect = dbo.getDb("burgerapi");
                    const burger = await db_connect
                        .collection("burgers")
                        .findOne({burgerId: req.body.burgerId});
                    if(burger!=null){
                        db_connect
                            .collection("reviews")
                            .insertOne({burgerId: req.body.burgerId, score: req.body.score, comment: req.body.comment, dateReviewed: req.body.dateReviewed});
                            res.json("Reseña dada de alta");
                    }
                    else{
                        res.json("Error. El burgerId brindado no corresponde. ¿Quizá te equivocaste a la hora de llamar la hamburguesa?");
                    }
                    
                }
                else{
                    console.log(JSON.stringify(req.body, null, 2));
                    res.json("Error en la creación. ¿Quizá definiste mal el request Body?"); 
                }
            }));
            }
        else {
            res.json("Error de seguridad, esta llave es inválida.")
        }
        
    }

    getReview(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
                    let db_connect = dbo.getDb("burgerapi");
                    db_connect
                        .collection("reviews")
                        //find all users
                        .find({})
                        //Turns result into array
                        .toArray(function (err, result) {
                        if (err) throw err;
                        res.json(result);
                        });
            }
        else {
            res.json("Error de seguridad, esta llave es inválida.")
        }
        
    }

    getSingleReview(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
                    let db_connect = dbo.getDb("burgerapi");
                    let reviewId = {reviewId: parseInt(req.params.reviewId)};
                    db_connect
                    .collection("reviews")
                    .findOne(reviewId, function (err, result) {
                        if (err) throw err;
                        res.json(result);
                    }); 
            }
        else {
            res.json("Error de seguridad, esta llave es inválida.")
        }
    }

    editReview(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            //VALIDACIÓN DE JSON
            if(reviewSchema.isValid(req.body).then( function(valid){
                if(valid){
                    //CONEXIÓN A LA BASE DE DATOS
                    let db_connect = dbo.getDb("burgerapi");
                    let reviewId = { reviewId: parseInt(req.params.reviewId)};
                    db_connect
                    .collection("reviews")
                    updateOne({reviewId: parseInt(req.params.reviewId)},{ $set: {'comment': req.body.comment, 'score': req.body.score, 'dateReviewed': req.body.dateReviewed}});
                    }
                    
                else{
                        console.log(JSON.stringify(req.body, null, 2));
                        res.json("Error en la creación. ¿Quizá definiste mal el request Body?"); 
                }
                }));
            }
        else {
            res.json("Error de seguridad, esta llave es inválida.")
        }
    }

    async getLatestReviews(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            //VALIDACIÓN DE JSON
                    let db_connect = dbo.getDb("burgerapi");
                    let latestReviews = await db_connect
                    .collection("reviews")
                    .find({}).sort({_id:-1}).limit(10).toArray(function (err, result) {
                        if (err) throw err;
                        res.json(result);
                        });;
            }
        else {
            res.json("Error de seguridad, esta llave es inválida.")
        }
    }

    async getRestaurantReviews(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            let db_connect = dbo.getDb("burgerapi");
            let reviews = [];
            const burgers = await db_connect
                        .collection("burgers")
                        .find({restaurantId: parseInt(req.params.restaurantId)}).toArray();
                if(burgers.length != 0){
                    for(var i = 0; i < burgers.length; i++){
                        console.log(burgers[i]);
                        reviews.push(await db_connect
                            .collection("reviews")
                            .findOne({burgerId: burgers[i].burgerId}));
                    }
                    res.json(reviews);
                }else{
                    res.json("No se han encontrado hamburguesas en este restaurante");
                }
                    
                    }                
        else {
            res.json("Error de seguridad, esta llave es inválida.")
        }
    }
}

module.exports = new reviewController;