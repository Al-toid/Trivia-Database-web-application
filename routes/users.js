var express = require('express');
var axios = require("axios");
var router = express.Router();
var {writeUserDB} = require("../db");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');

});

router.post('/submit', async function(req, res){

  const {'num-questions': numQuestions, Category, Difficulty, Type } = req.body;

  try{
    const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=${Category}&difficulty=${Difficulty}&type=${Type}`;
    const response = await axios.get(apiUrl);

    //test
    console.log(response.data);
    const data = response.data;

    res.render('quizPage', { quizData: data.results, currentQuestionIndex: 0, userAnswers: [] });

  }
  catch(err){
    console.log(err);
  }

});

router.post('/next', async function(req, res, next) {
  
    const { answer, quizData, currentQuestionIndex, userAnswers } = req.body;
    const quizDataParsed = JSON.parse(quizData);
    const userAnswersParsed = JSON.parse(userAnswers);

    // Store the users answer
    userAnswersParsed[currentQuestionIndex] = answer;

    // Move to the next question
    const nextQuestionIndex = parseInt(currentQuestionIndex, 10) + 1;

    if (nextQuestionIndex < quizDataParsed.length) {
      return res.render('quizPage', { quizData: quizDataParsed, currentQuestionIndex: nextQuestionIndex, userAnswers: userAnswersParsed });

    } else {
         // Calculate the score by counting correct answers
        const score = userAnswersParsed.filter((userAnswer, index) => userAnswer === quizDataParsed[index].correct_answer).length;

          //write DB function that totally doesnt work
          await writeUserDB({ score: score, totalQuestions: quizDataParsed.length });
           // Render the results page with the final score
          return res.render('results', { score: score, totalQuestions: quizDataParsed.length });
    } 
  }
);

module.exports = router;
