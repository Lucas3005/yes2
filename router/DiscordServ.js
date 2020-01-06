/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
/**
 *Express.js
 * is a framework for building web applications based on Node.js.
 * This is the standard framework for server development in Node.js.
 **/
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
const discord = express.Router();



const db = require('../database/db');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start route module ****************************************************
 *****************************************************************************************************************/


/***
 *  this route i can add new atelier
 *  the data i need is name of atelier and id of garageID in this case id will 1;
 *
 */


discord.get("/findAll", (req, res) => {
    // Find all clients with out there voiture
    db.discord.findAll({
        // if you neec you use
        attributes: {
            include: [],
            exclude: ["updatedAt","createdAt"]
        },
    })
    // get list of clients All clients in your database
        .then(discords => {
            // send back respose in json liste of clients
            res.json(discords)
        })
        // catch error if something happend
        .catch(err => {
            // send back error
            res.send("error" + err)
        })
});

discord.get("/findlike/:disName",(req, res)=>{
    db.discord.findAll({
        where: {
            disName:{
                [Op.like]: '%'+req.params.disName+'%'
            }
          
        }
    })
    .then(discord=>{
        res.json(discord)
    })
    .catch(err=>{
        console.log(err);
        res.json(err);
    })
})



discord.post("/add", (req, res) => {
    // create data atelier
    var discords = {
        disName: req.body.disName,
        disLink: req.body.disLink,
        description: req.body.description,
        userId: req.body.userId,
        catName: req.body.catName,
    };
    // find if atelier existe  or not
    db.discord.findOne({
        where: {disLink: req.body.disLink}
    })
        .then(discord => {
            // if not existe so we create a new
            if (!discord) {

                // insert into "tbl_atelier
                // make create
                db.discord.create(discords)
                    .then(discord => {
                        // send back message to show that add in table
                        res.json({message: 'ook', discord})
                        res.status(200).json("server posted")
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.status(400).json({error: "server already exist" })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});

/**
 *
 *  with this i can update the  atelier
 *  the data i need is name of atelier { nom } and id of garageID in this case id will 1;
 *  i need the id of atelier to update
 *
 */
discord.post("/update/:id", (req, res) => {
    // try to find if atelier with this id
    db.discord.findOne({
        where: {id: req.params.id}
    })
        .then(discord => {
            // if this atelier then
            if(discord){
                // make update on nom
                discord.update({
                    disName: req.body.disName,
                    description: req.body.description,
                    catName: req.body.catName,
                })
                    .then(update =>{
                        res.send(update)
                    })
            }
            else {
                res.json({
                    error: "can't update this discord"
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});


/**
 *
 *  with this i can delete  the  atelier
 *  i need the id of atelier to delete
 *
 */
// delete atelier
discord.delete("/delete/:id", (req,res) =>{
    // find the atelierloye you want you delete
    db.discord.findOne({
        where:{id: req.params.id}
    }).then(discord =>{
        // if pieces exist so
        if(discord) {
            // delete this pieces
            discord.destroy().then(() => {
                // send back the  confirmation of  atelierloye is deleted
                res.json("discord deleted")
            })
            // catch if error
                .catch(err => {
                    // send back the error to info that in json
                    res.json("error" + err)
                })
        }
        else {
            // send back the error message to info that you can't deleted this atelier it not exist in your database
            res.json({error : "you can't delete this discord it not exist in you list of discord"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});

// find by email atelier
discord.get("/FindById/:discordservId", (req,res) =>{
    // find the atelier by garageId
    db.discord.findAll({
        where:{discordservId: req.params.discordservId}
    }).then(discord =>{
        // if pieces exist so
        if(discord) {
            res.json({
                discord: discord
            })
        }
        else {
            // send back this atelier it not exist in your database
            res.json({error : "This discord  exist in you list of discord"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});

discord.get("/FindByCat/:catName", (req,res) =>{
    // find the atelier by garageId
    db.discord.findAll({
        where:{catName: req.params.catName}
    }).then(discord =>{
        // if pieces exist so
        if(discord) {
            res.json({
                discord: discord
            })
        }
        else {
            // send back this atelier it not exist in your database
            res.json({error : "This discord dont exist in you list of discord"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});

discord.get("/FindByUser/:userId", (req,res) =>{
    // find the atelier by garageId
    db.discord.findAll({
        where:{userId: req.params.userId}
    }).then(discord =>{
        // if pieces exist so
        if(discord) {
            res.json({
                discord: discord
            })
        }
        else {
            // send back this atelier it not exist in your database
            res.json({error : "This discord dont exist in you list of discord"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("error" + err);
        })
});

module.exports = discord;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/
