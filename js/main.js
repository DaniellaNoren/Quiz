const url = "https://opentdb.com/api.php?";   // base-url
var res = '';                                 // store the response here
var answers = '';                             // store all the answers to the question here
var question = '';                            // store the current question here              
var correctAnswer = '';                       // store the correct answer to the question here           
var chosenAnswer = '';                        // store the answer the user has chosen here

var radioButtons = '';                        //the type:radio-input where the user chooses an answer
var result = '';                              //the counter for correct answers
var amountOfQs = '';                          //the amount of questions
var answerSelections = '';                    //the text-fields to add the answers to

var category = "";                            //chosen category
var difficulty= "";                           //chosen difficulty
var amount = "";                              //chosen amount

window.onload = function(){
    
// Get elements from document

answerSelections = document.getElementsByClassName("answers");
questionDOM = document.getElementById("question");
radioButtons = document.getElementsByClassName("radio-input");
result = document.getElementById("result");
amountOfQs = document.getElementById("amountOfQs");

// Add Event-Listeners

var btn = document.getElementById("submit-button");
btn.onclick = submitData;

var nextBtn = document.getElementById("next-button");
nextBtn.onclick = nextQuestion;

var selectorCat = document.getElementById("category");
selectorCat.addEventListener("change", getCategory);

var progressBar = document.querySelector("progress");

for(var i = 0; i < radioButtons.length; i++){
    radioButtons[i].addEventListener("change", function(){     
            chosenAnswer = this.value;
    });
}

var selectorDiff = document.getElementById("difficulty");
selectorDiff.addEventListener("change", getDifficulty);


        /* Transforms the users quiz-choices to an URL, makes a HTTPrequest */
        function submitData(){
            amount = document.getElementById("numbers").value;
            let tempUrl = url+"amount="+amount+"&category="+category+"&difficulty="+difficulty+"&type=multiple";
            makeRequest('GET', tempUrl, initializeQuiz);
        }
        /*  Makes the request, InitializeQuiz is the callback-method */
        function makeRequest(method, url, callback){
            let req = new XMLHttpRequest;
            req.open(method, url, true);
            req.send();
            req.onreadystatechange = function(){
                if(req.readyState === 4){
                    if(req.status === 200){
                        res = req.responseText;
                        callback(res);
                        }else{
                        console.log("Error, something went wrong");
                        console.log("Status code: "+req.status);
                        
                    }
                }else{
                       console.log(req.readyState);
                }
            }
        }
       
        /* Everytime the user chooses a category, the category-variable gets the numeric value of said category  */
        function getCategory(){
            category = selectorCat.options[selectorCat.selectedIndex].value;
        }

         /*Everytime the user chooses a difficulty, the difficulty-variable gets its value  */
        function getDifficulty(){
            difficulty = selectorDiff.options[selectorDiff.selectedIndex].value;
        }

         /* Initializes the quiz for the first time, gets the unparsed http-response-text as an argument
            Parses the response to JSON, assigns the "results"-array to global variable res */
        function initializeQuiz(response){
            uncheck();
            document.getElementById("finalResult").innerHTML = "";
            res = parseResponseJSON(response);
            if(res["response_code"] === 0){
            res = res["results"];
            question = res[0].question;
            answers = res[0].incorrect_answers;
            correctAnswer = res[0].correct_answer;
            answers.push(correctAnswer);
            progressBar.max = amount;
            progressBar.value = 0;
            amountOfQs.innerHTML = amount;
            result.innerHTML = "0";
            res.shift();
            showQuestionAndAnswers(question, answers);
            }else{
                questionDOM.innerHTML = "Something went wrong, try again";
            }
                
        }

        /*Uses DOM to put up the current question and answers on screen */
        function showQuestionAndAnswers(question, answers){
            questionDOM.innerHTML = question;
            mixUpArray(answers);   //Randomize the order
            for(var i = 0; i < answerSelections.length; i++){
                answerSelections[i].innerHTML = answers[i];   //Both the radio-buttons inner values and the readable text gets the same value
                radioButtons[i].value = answers[i];
            }
        }

        /* Goes to the next question, if questions have run out it shows final result and resets */
       function nextQuestion(){
           checkCorrectAnswer(uncheck); 
            if(res.length > 0){
            
             question = res[0].question; //The position is always going to be 0 since we always remove the first question after it's done
             answers = res[0].incorrect_answers;
             correctAnswer = res[0].correct_answer;
             answers.push(correctAnswer);
             
              showQuestionAndAnswers(question, answers);   
             res.shift();   //Remove the question from the question-array
            }else{
                var a = "Answer";
                showQuestionAndAnswers("Question will show up here!", [a, a, a, a]);
                document.getElementById("finalResult").innerHTML = "Final Result: ";
                
            }
       }
       
        /*Checks if the chosen answer is the correct answer, if it is correct then it adds 1 point to progressbar */
       function checkCorrectAnswer(callback){
                    if(chosenAnswer == correctAnswer){
                        progressBar.value++;
                        result.innerHTML = progressBar.value;   
                    }
            callback();
       }

       /* Unchecks all the radio-buttons */
       function uncheck(){
        for(var i = 0; i < radioButtons.length; i++){
            radioButtons[i].checked = false;
        }
       }

    }
         /* Get a random number*/
        function getRandom(max){
           return  Math.floor(Math.random() * max);
        }

         /*Parse to JSON*/
        function parseResponseJSON(response){
           return JSON.parse(response);
        }

         /*Shuffle an array  */
        function mixUpArray(array){
            var temp = '';
            var rand = '';
            for(var i = array.length-1; i >= 0; i--){
                rand = getRandom(i);
                temp = array[rand];
                array[rand] = array[i];
                array[i] = temp;
            }
            return array;
        
        }
       