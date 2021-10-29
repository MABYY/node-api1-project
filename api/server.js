// BUILD YOUR SERVER HERE
const express = require('express'); //import express
const server = express();  // create server
const User = require('./users/model') // import the functions

// Global Middleware
server.use(express.json())  // Express can't read request bodies. 
                            // Since the user provides json as part of the request, but express can't interpret/parse JSON
                            // We need to tell express how to do it. Therefore we use express.json() to teach the server
                            // how to read request bodies as JSON

                            // const User = require('./users/model');

server.get('/', (req, res) => {
    res.send('Hello World!');
});

// server.get('/api/users', (req, res) => {
//     User.find()
//         .then( users => {
//             res.json(users)
//         })
//         .catch(err => {
//             res.status(500).json({
//                 message: "ERROR MESSAGE",
//                 error: err.message
//             })
//         })
// });

// GET ALL USERS
server.get('/api/users', async (req, res) => {
        try{
            const users = await User.find()
            res.status(200).json(users)

        } catch (err) {
            res.status(500).json({
                message: "ERROR MESSAGE",
                error: err.message
        })  
    }
});

// GET USER BY ID

server.get('/api/users/:id', async (req,res) =>{
    try {
        const users = await User.findById(req.params.id) 
        if (!users) {
            res.json(404).json({message:`The user with the specified ID does not exist`})
        } else {
            res.status(200).json(users) // retrive the id and return the filter  
        }
        
    } catch (err){
        res.status(500).json({
            message: "The users information could not be retrieved",
            error: err.message
        })
    }
})

// CREATE NEW USER

server.post('/api/users', async (req,res) =>{
        try {
            // add data validation to the process
            if (!req.body.name || !req.body.bio) {
                res.status(400).json({
                    message: "Please provide name and bio for the user"
                })
            } else {
    
            // pull user info from req.body         
            // use User.insert with req.body
            const newUser = await User.insert(req.body)
            // send back to client new user
            res.status(201).json(newUser)
    
            }
    
        } catch (err){
            res.status(500).json({
                message: "There was an error while saving the user to the database",
                error: err.message
            })
        }
})

// UPDATIND A USER
server.put('/api/users/:id', async (req,res) =>{
    const { id } = req.params
    const { body} = req

    try{
        const updatedUser = await User.update(id,body)
        if(!updatedUser){
            res.status(404).json({
                message: "Please provide name and bio for the user"
            })
        }  else {
            res.status(200).json(updatedUser)
        }
    } catch(err) {
        res.status(500).json({
            message: "The user information could not be modified"
        })
    }
})

// DELETE USERS
server.delete('/api/users/:id', async (req,res) =>{
    const { id } = req.params
    
    try{
        const deletedUser = await User.remove(id)
        if(!deletedUser) {
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        } else {
            res.status(200).json(deletedUser)
        }

    } catch(err) {
        res.status(500).json({
            message: "The user could not be removed"
        })
    }
})

module.exports = server // EXPORT YOUR SERVER instead of {}

