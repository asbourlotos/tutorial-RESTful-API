//npm i express then require
const express = require('express');
//npm i body-parser then require
const bodyParser = require('body-parser');
//npm i ejs then require
const ejs = require('ejs');
//npm i mongoose then require
const mongoose = require('mongoose');
// npm i lodash then require
const _ = require('lodash');

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

//////////////// REQUESTS TARGETTING ALL ARTICLES //////////////////

app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticles) => {  //Query Articles model with find method
            if (!err) {                         //If there are no errors
                res.send(foundArticles);        //Send results back to client
            } else {                            //Otherwise
                res.send(err);                  //Send error message to client
            }    
          });
    })
    .post((req, res) => {
        //create new article const to store data passed in
        const newArticle = new Article ({
            title: req.body.title,              //pass in the title as defined in Postman
            content: req.body.content           //pass in the content as defined in Postman
        });
                                                //save the created Article to the database
        newArticle.save((err) => {              //callback within save to send response back to Postman.
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {           //deleteMany with no parameter will delete ALL
            if (!err) {                         //if no error, send success message
                res.send("Successfully deleted all articles");
            } else {                            //otehrwise
                res.send(err);                  //send error message to client
            }
        });
    });

//////////////// REQUESTS TARGETTING SPECIFIC ARTICLES //////////////////

app.route('/articles/:articleTitle')
    //create GET request
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if (foundArticle) {
                res.send({
                    title: foundArticle.title,
                    content: foundArticle.content
                });
            } else {
                res.send(err);
            }
        });
    })
    //create PUT request
    .put((req, res) => {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err) => {
                if (!err) {
                    res.send("Successfully updated articles");
                } else {
                    res.send(err);
                }
            }
        );
    })
    //create PATCH request
    .patch((req, res) => {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if (!err) {
                    res.send("Successfully patched articles");
                } else {
                    res.send(err);
                }
            }
        );
    })
    //create DELETE request
    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle}, 
            (err) => {
                if (!err) {
                    res.send("Successfully deleted the article");
                } else {
                    res.send(err);
                }
            }
        );
    });

// ---------- START DEAD CODE ----------
//DEAD CODE FEATURES ROUTES WITHOUT CHAINING FOR REFERENCE
//create GET route to fetch all articles
// app.get('/articles', (req, res) => {        //When you go to articles route (GET)
//   Article.find((err, foundArticles) => {    //Query Articles model with find method
//     if (!err) {                             //If there are no errors
//         res.send(foundArticles);            //Send results back to client
//     } else {                                //Otherwise
//         res.send(err);                      //Send error message to client
//     }    
//   });
// });

//create POST route to create one new article
// app.post('/articles', (req, res) => {
//     //create new article const to store data passed in
//     const newArticle = new Article ({
//         title: req.body.title,              //pass in the title as defined in Postman
//         content: req.body.content           //pass in the content as defined in Postman
//     });
//                                             //save the created Article to the database
//     newArticle.save((err) => {              //callback within save to send response back to Postman.
//         if (!err) {
//             res.send("Successfully added a new article.");
//         } else {
//             res.send(err);
//         }
//     });
// });

//create DELETE route to delete all articles
// app.delete('/articles', (req, res) => {
//     Article.deleteMany((err) => {           //deleteMany with no parameter will delete ALL
//         if (!err) {                         //if no error, send success message
//             res.send("Successfully deleted all articles");
//         } else {                            //otehrwise
//             res.send(err);                  //send error message to client
//         }
//     });
// });
// ---------- END DEAD CODE ----------

//specify port for app to listen on.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});