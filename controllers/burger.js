const burgerSchema = require('../schemas/burgerschema');
const dbo = require("../server/db/conn");
const ObjectId = require('mongodb').ObjectId;

class burgerController{
    createBurger(req, res) {
        let db_connect = dbo.getDb("burgerapi");
        //HARDCODE VALIDACIÓN DE LLAVES
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            //VALIDACIÓN DE JSON
            if(burgerSchema.isValid(req.body).then( async function(valid){
                if(valid){
                    //OBTENCIÓN DEL RESTAURANTE
                    const restaurant = await db_connect
                        .collection("restaurants")
                        .findOne({restaurantId: req.body.restaurantId});

                    console.log(restaurant);
                    //VERIFICAR SI EL RESTAURANTE FUE OBTENIDO CORRECTAMENTE
                    if( restaurant != null){
                        //SE AGREGA LA HAMBURGUESA AL RESTAURANTE
                        restaurant["burgers"].push(req.body);
                        //INSERTAMOS LOS CAMBIOS HACIA LA BASE DE DATOS
                        db_connect.collection("restaurants").updateOne({restaurantId: req.body.restaurantId},{ $set: restaurant});
                        db_connect.collection("burgers").insertOne(req.body);
                        res.json("Hamburguesa dada de alta y restaurante actualizado");
                    }
                    else{
                        res.json("Error. Restaurante inválido. ¿Quizá el restaurantId es incorrecto?");
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
    getBurger(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            //CONEXIÓN A LA BASE DE DATOS
            let db_connect = dbo.getDb("burgerapi");
            db_connect
                .collection("burgers")
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
    getSingleBurger(req, res) {
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            //CONEXIÓN A LA BASE DE DATOS
            let db_connect = dbo.getDb("burgerapi");
            let burgerId = { burgerId: parseInt(req.params.burgerId)};
            db_connect
            .collection("burgers")
            .findOne(burgerId, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
        }
        else {
            res.json("Error de seguridad, esta llave es inválida.")
        }
        
    }
    async editBurger(req, res) {
        let db_connect = dbo.getDb("burgerapi");
        //HARDCODE VALIDACIÓN DE LLAVES
        if(req.params['API_KEY'] == process.env.KEY_YANITZA || req.params['API_KEY'] == "devsdi"){
            const original_burger = await db_connect
            .collection("burgers")
            .findOne({burgerId: parseInt(req.params.burgerId)});
            //VALIDACIÓN DE JSON
            if(burgerSchema.isValid(req.body).then( async function(valid){
                if(req.body.restaurantId == original_burger.restaurantId){
                    if(valid){
                        //OBTENCIÓN DEL RESTAURANTE
                        const restaurant = await db_connect
                            .collection("restaurants")
                            .findOne({restaurantId: req.body.restaurantId});
                            
                        //VERIFICAR SI EL RESTAURANTE FUE OBTENIDO CORRECTAMENTE
                        if( restaurant != null){
                            let indice = -1;
                            //CICLO PARA ENCONTRAR LA POSICIÓN DEL OBJETO EN EL ARREGLO
                            for(var i = 0; i < restaurant.burgers.length; i++){
                                if (restaurant["burgers"][i]!=undefined){
                                    console.log(original_burger._id);
                                    console.log(restaurant["burgers"][i]._id);

                                    if(original_burger._id.equals(restaurant["burgers"][i]._id)){
                                        indice = i
                                    }
                                }
                                
                            }
                            console.log(indice);
                            if(indice >= 0){
                                //SE AGREGA LA HAMBURGUESA AL RESTAURANTE
                                db_connect.collection("burgers").updateOne({burgerId: parseInt(req.params.burgerId)}, { $set: req.body});
                                req.body._id = original_burger._id;
                                restaurant["burgers"][indice]=req.body;
                                //INSERTAMOS LOS CAMBIOS HACIA LA BASE DE DATOS
                                db_connect.collection("restaurants").updateOne({restaurantId: req.body.restaurantId},{ $set: restaurant});
                                res.json("Hamburguesa y restaurante actualizado");
                            }
                            else{
                                res.json("Error. Hamburguesa no encontrada en el restaurante determinado");
                            }
                            
                        }
                    }
                    else{
                        console.log(JSON.stringify(req.body, null, 2));
                        res.json("Error en la creación. ¿Quizá definiste mal el request Body?"); 
                    }
                }else{
                    res.json("Error. Restaurante inválido. No se pueden mover hamburguesas entre restaurantes");
                }
            }));
        }
        else {
            res.json("Error de seguridad, esta llave es inválida.")
        }
    }
}

module.exports = new burgerController;