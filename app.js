const express = require("express");
const https = require("https");
const request = require("request");
var decode = require("html-entities-decoder");
const app = express();

app.use(express.static(__dirname + "/public"));
app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: true}));



app.get("/", function(req, res){
    

    

    var url = "https://opentdb.com/api.php?amount=1";
    request(url, function(error, response, body){
        let data = JSON.parse(body);
        let question = decode(data.results[0].question);
        let category = decode(data.results[0].category);
        let difficulty = decode(data.results[0].difficulty);
        
        let correctAnswer = decode(data.results[0].correct_answer);

        var wrongAnswers = data.results[0].incorrect_answers;
        for (let i = 0; i < wrongAnswers.length; i++){
            wrongAnswers[i] = decode(wrongAnswers[i]);
        }

        let allAnswers = [];
        for (let i = 0; i < wrongAnswers.length; i++){
            allAnswers[i] = wrongAnswers[i];
        }

        var numAnswers = wrongAnswers.length == 1 ? 2 : 4;

        const randomNum = Math.floor(Math.random() * numAnswers);

        allAnswers.splice(randomNum, 0, correctAnswer);
        
        let choices = ["A.", "B.", "C.", "D."];


        res.render("index.ejs", {
            question: question,
            category: category,
            difficulty: difficulty,
            correctAnswer: correctAnswer,
            allAnswers: allAnswers,
            wrongAnswers: wrongAnswers,
            choices: choices,
            correctAnswerIndex: randomNum

        });
        



    });
 

});


app.post("/redirect", function(req, res){
    res.redirect("/");
});

app.listen(3000, function(req, res){
    console.log("Port 3000 started");
});


