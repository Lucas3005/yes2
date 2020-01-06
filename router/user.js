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
const user = express.Router();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../database/db');
/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start route module ****************************************************
 *****************************************************************************************************************/

process.env.SECRET_KEY = "secret";

user.get("/findAll", (req, res)=>{
    db.user.findAll().then(user=>{
        if (user) {res.json({user: user})}
        else {res.json({error: "you don't have user"})}
    }).catch(err=>{
        res.json("error" + err);
    })
})


// register
user.post("/register", (req, res) => {
    const userdata = {
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: req.body.password,
    };
    // find if user existe  or not
    // select * from tbl_user where email = 'toto@toto.fr'
    db.user.findOne({
        where: {email: req.body.email}
    })
        .then(user => {
            if (!user) {
                // make hash of password in bcrypt, salt 10
                const hash = bcrypt.hashSync(userdata.password, 10);
                userdata.password = hash;
                db.user.create(userdata)
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        res.status(200).json({token: token})
                        
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.status(400).json({error: "mail already used" })
            }
        }).then(update =>{
            res.send(update)
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});

// login
user.post("/login", (req, res) => {
    db.user.findOne({
        where: {email: req.body.email}
    })
        .then(user => {
            if(user){

            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                });
                res.status(200).json({token: token})
            } else {
                res.status(400).json( {error: 'error mail or error password'})
            }
        }
        else{
                res.status(404).json({error: "user not found"})
            }
    }
    ) 
        .catch(err => {
            res.send('error' + err)
        })
   
});



// update
user.post("/update/:id", (req, res) => {
    db.user.findOne({
        where: {id: req.params.id}
    })
        .then(user => {
            if(user){
                // make hash of password in bcrypt, salt 10
                const hash = bcrypt.hashSync(req.body.password, 10);
                user.update({
                    pseudo: req.body.pseudo,
                    email: req.body.email,
                    password: req.body.password,
                    password: hash,
                    isAdmin: req.body.isAdmin,
                })
            }
            else {
                res.json({
                    error: "can't update this employe his is not your epmloye"
                })
            }
        }).then(update =>{
            res.send(update)
        })
        .catch(err => {
            res.send('error' + err)
        })
});



// delete emp
user.delete("/delete/:id", (req,res) =>{
    // find the employe you want you delete
    db.user.findOne({
        where:{id: req.params.id}
    }).then(user =>{
        // if pieces exist so
        if(user) {
            // delete this pieces
            user.destroy().then(() => {
                // send back the  confirmation of  employe is deleted
                res.json("user deleted")
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


// delete emp
user.delete("/deleteBy/:email", (req,res) =>{
    // find the employe you want you delete
    db.user.findOne({
        where:{id: req.params.email}
    }).then(user =>{
        // if pieces exist so
        if(user) {
            // delete this pieces
            user.destroy().then(() => {
                // send back the  confirmation of  employe is deleted
                res.json("user deleted")
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

// find by email emp
user.get("/Find/:email", (req,res) =>{
    // find the employe by email
    db.user.findOne({
        where:{id: req.params.email}
    }).then(user =>{
        // if pieces exist so
        if(user) {
            res.json({
                user : user
            })
        }
        else {
            // send back this emp it not exist in your database
            res.json({error : "This employe  exist in you list of employes"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});


user.get("/All", (req,res) =>{
    // find the employe by email
    db.user.findAll({
        attributes:{
            exclude:["password","createdAt", "updatedAt","garageId","atelierId"]
        }
    }).
    then(URLSearchParams =>{
        res.json(user)
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
})

module.exports = user;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/
