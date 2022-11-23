const restaurantSchema = require('../schemas/restaurantschema');
const dbo = require("../server/db/conn");

class restaurantController {
    createRestaurant(req, res) {
        let db_connect = dbo.getDb("burgerapi");
        //HARDCODE VALIDACIÓN DE LLAVES
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            //VALIDACIÓN DE JSON
            if(restaurantSchema.isValid(req.body).then( function(valid){
                if(valid){
                    //CONEXIÓN A LA BASE DE DATOS
                    db_connect
                        .collection("restaurants")
                        .insertOne(req.body);
                        res.json("Restaurante dado de alta.");
                        console.log("Restaurante dado de alta.");
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
    
    getRestaurants(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            //VALIDACIÓN DE JSON
            if(restaurantSchema.isValid(req.body).then( function(valid){
                if(valid){
                    //CONEXIÓN A LA BASE DE DATOS
                    let db_connect = dbo.getDb("burgerapi");
                    db_connect
                        .collection("restaurants")
                        //find all users
                        .find({})
                        //Turns result into array
                        .toArray(function (err, result) {
                        if (err) throw err;
                        res.json(result);
                        });
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

    getSingleRestaurant(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            //VALIDACIÓN DE JSON
            if(restaurantSchema.isValid(req.body).then( function(valid){
                if(valid){
                    //CONEXIÓN A LA BASE DE DATOS
                    let db_connect = dbo.getDb("burgerapi");
                    let restaurantId = { restaurantId: parseInt(req.params.restaurantId)};
                    db_connect
                    .collection("restaurants")
                    .findOne(restaurantId, function (err, result) {
                        if (err) throw err;
                        res.json(result);
                    });
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

    editRestaurant(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            //VALIDACIÓN DE JSON
            if(restaurantSchema.isValid(req.body).then( async function(valid){
                if(valid){
                    //CONEXIÓN A LA BASE DE DATOS
                    let db_connect = dbo.getDb("burgerapi");
                    const restaurant = await db_connect
                            .collection("restaurants").
                            updateOne({restaurantId: parseInt(req.params.restaurantId)},{ $set: {'name': req.body.name, 'address': req.body.address}});
                        res.json("Restaurante actualizado");
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
}

module.exports = new restaurantController;