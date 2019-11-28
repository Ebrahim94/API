//Dependancies
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//App is an instance of express
let app = express()

//Use body parser
app.use(bodyParser.urlencoded({ extended: true }))

//Connect to the local mongodb server on port 27017
mongoose.connect('mongodb://localhost:27017/serverDB', { useNewUrlParser: true })

//Schema
const streamSchema = mongoose.Schema({
    title: String,
    description: String
})

//A collection with name streams using the streamSchema with each
//document having a title and description field both holding String Values
const Stream = mongoose.model('stream', streamSchema)

//Using a REST architecture to create an API that will store data in the mongoDB database
//and be able to respond to user requests

//The root route
app.route('/streams')

    //returning All the streams in the database that are housed in the root route
    .get(function (req, res) {
        Stream.find({}, function (err, foundStream) {
            if (!err) {
                res.send(foundStream)
            } else {
                console.log(err)
            }
        })
    })

    //When the user inputs a stream
    .post(function (req, res) {
        const newStream = Stream({
            title: req.body.title,
            description: req.body.description
        })

        newStream.save(function (err) {
            if (!err) {
                res.send('The stream has been saved')
            }
        })
    })

    //Deletes all the collections in the root route
    .delete(function (req, res) {
        Stream.deleteMany({}, function (err) {
            res.send('deleted')
        })
    })

//The Stream with a particular ID will be fetched
app.route('/streams/:id')

    .get(function (req, res) {
        Stream.findOne({ _id: req.params.id }, function (err, foundStream) {
            if (foundStream) {
                res.send(foundStream)
            } else {
                res.send("there is no stream matching that id")
            }
        })
    })

    //The Stream matching a particular Id will be deleted
    .delete(function (req, res) {
        Stream.deleteOne({ _id: req.params.id }, function (err) {
            if (!err) {
                res.send(`The Stream with id of ${req.params.id} has been deleted`)
            }
        })
    })

    //The put request to update the title and the description of the stream
    .put(function (req, res) {
        Stream.update({ _id: req.params.id }, { title: req.body.title, description: req.body.description }, { overwrite: true }, function (err) {
            res.send("updated")
        })
    })

    //modify the Stream to have an updated title or description
    .patch(function (req, res) {
        Stream.update({ _id: req.params.id }, {$set:req.body}, function(err) {
            if (!err){
                res.send("updated")
            }
        })
    })

//App will run on port 4000 in the root route
app.listen('4000', function (req, res) {
    console.log('connect to the server')
}
)