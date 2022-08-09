//npm i express then require
const express = require('express');
//npm i body-parser then require
const bodyParser = require('body-parser');
//npm i ejs then require
const ejs = require('ejs');
//npm i mongoose then require
const mongoose = require('mongoose');

//initialise app w/ express method
const app = express();
//specify port to use for app.listen method
const port = 3000;

//specify view engine for ejs documents
app.set('view engine', 'ejs');

//specify properties for body parser
app.use(bodyParser.urlencoded({
    extended: true
}));

//this supports the use of static files such as stylesheets on local machine.
//need to read more aobut this topic to understand further.
app.use(express.static("public"));

//set up mongoDB connection via mongoose
mongoose.connect('mongodb://localhost:27017/wikiDB');

//create schema for data structure
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

//create data model for articles
const Article = mongoose.model("Article", articleSchema);

//create GET route to fetch all articles
app.get('/articles', (req, res) => {         //When you go to articles route (GET)
  Article.find((err, foundArticles) => {     //Query Articles model with find method
    if (!err) {                              //If there are no errors
        res.send(foundArticles);             //Send results back to client
    } else {                                 //Otherwise
        res.send(err);                       //Send error message to client
    }    
  });
});

//specify port for app to listen on.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});