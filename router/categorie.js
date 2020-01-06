/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
const express = require('express');

/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * route.METHOD (PATH, HANDLER)
 *
 * * GET : The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
 * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
 * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI. The data POSTed might be, for example, an annotation for existing resources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
 * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing resource, it is modified; if the URI does not point to an existing resource, then the server can create the resource with that URI.[24]
 * DELETE : The DELETE method deletes the specified resource.
 * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
 * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
 * PATCH : The PATCH method applies partial modifications to a resource.
 *
 * @type { Router }
 */
const categorie = express.Router();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../database/db');
/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start route module ****************************************************
 *****************************************************************************************************************/



categorie.get("/findAll", (req, res)=>{
    db.categorie.findAll().then(categorie=>{
        if (categorie) {res.json({categorie: categorie})}
        else {res.json({error: "you don't have categorie"})}
    }).catch(err=>{
        res.json("error" + err);
    })
})



categorie.post("/add", (req, res) => {
    // create data atelier
    var categories = {
        catName: req.body.catName,
    };
    // find if categorie existe  or not
    db.categorie.findOne({
        where: {catName: req.body.catName}
    })
        .then(categorie => {
            // if not existe so we create a new
            if (!categorie) {

                // insert into "categorie
                // make create
                db.categorie.create(categories)
                    .then(categorie => {
                        // send back message to show that add in table
                        res.json({message: 'ook', categorie})
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "categorie already exists"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});


// update
categorie.post("/update/:name", (req, res) => {
    // try to find if atelier with this id
    db.categorie.update({
       

        catName: req.body.catName
    } ,{ where: {catName: req.params.name}} )

        .then(categorie => {
           
          
                res.send(categorie)
        })
         
        .catch(err => {
            res.send('error' + err)
        })
});


// delete emp
categorie.delete("/delete/:catName", (req,res) =>{
    // find the employe you want you delete
    db.categorie.findOne({
        where:{catName: req.params.catName}
    }).then(categorie =>{
        // if pieces exist so
        if(categorie) {
            // delete this pieces
            categorie.destroy().then(() => {
                // send back the  confirmation of  employe is deleted
                res.json("categorie deleted")
            })
            // catch if error
                .catch(err => {
                    // send back the error to info that in json
                    res.json("error" + err)
                })
        }
        else {
            // send back the error message to info that you can't deleted this emp it not exist in your database
            res.json({error : "you can't delete this employe it not exist in you list of employes"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});

categorie.get("/Find/:catName", (req,res) =>{
    // find the employe by email
    db.categorie.findOne({
        where:{catName: req.params.catName}
    }).then(categorie =>{
        // if pieces exist so
        if(categorie) {
            res.json({
                categorie : categorie
            })
        }
        else {
            // send back this emp it not exist in your database
            res.json({error : "This employe dont exist in you list of employes"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});





module.exports = categorie;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/
