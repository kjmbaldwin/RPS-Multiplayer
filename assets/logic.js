// Initialize Firebase
var config = {
  apiKey: "AIzaSyDvp9avnkAuRCGC0sjMItz4QQMVcvVnO7E",
  authDomain: "rps-multiplayer-1127e.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-1127e.firebaseio.com",
  projectId: "rps-multiplayer-1127e",
  storageBucket: "rps-multiplayer-1127e.appspot.com",
  messagingSenderId: "660235584495"
};

firebase.initializeApp(config);

var database = firebase.database();


var p1Guess = null;
var p2Guess = null;


$('#submit-btn').on('click', function(event){ 
  event.preventDefault();

  var userName = $('#username-input').val().trim();
  console.log(userName);


  database.ref().push({
    player: userName,
    wins: 0,
    loses: 0
  })

  $('#username-input').val('');


});





database.ref().on('child_added', function(childSnapshot){ 

  var player = childSnapshot.val().player;

  //if player 1 is empty, load from firebase, else if player 1 is full, load player 2
  if ($('#player1').hasClass('empty')){
     
    $('#player1').removeClass('empty').addClass('full');

    var $rock = $('<div>').addClass('guess g1').attr('data-choice', 'rock').text('Rock');
    var $paper = $('<div>').addClass('guess g1').attr('data-choice', 'paper').text('Paper');
    var $scissors = $('<div>').addClass('guess g1').attr('data-choice', 'scissors').text('Scissors');

    $('#p1-username').text(player);
    $('#player1').append($rock, $paper, $scissors); 


  } else if ($('#player2').hasClass('empty')){

    $('#player2').removeClass('empty').addClass('full');

    var $rock = $('<div>').addClass('guess g2').attr('data-choice', 'rock').text('Rock');
    var $paper = $('<div>').addClass('guess g2').attr('data-choice', 'paper').text('Paper');
    var $scissors = $('<div>').addClass('guess g2').attr('data-choice', 'scissors').text('Scissors');

    $('#p2-username').text(player);
    $('#player2').append($rock, $paper, $scissors); 
    $('#game-board').text("Player 1's Move!");
  }



});

//on click even for p1 and p2 guesses
$(document).on("click",".guess", function() {
  
  if(!p1Guess && $(this).hasClass('g1')){
    p1Guess = $(this).attr('data-choice');
    console.log(p1Guess);
    $('#game-board').text("Player 2's Move!");
  } 

  if(p1Guess && !p2Guess && $(this).hasClass('g2')){
    p2Guess = $(this).attr('data-choice');
    console.log(p2Guess);
  }

  if(p1Guess && p2Guess){
    compare();
  }
  

  });

function compare(){

  /*
  rock beats sci
  sic beats paper
  paper beats rock
  */

  //tie 
  if(p1Guess === p2Guess){
    $('#game-board').text("Bummer, a tie :( -- Player1, your turn");
    p1Guess = null;
    p2Guess = null;

  }

  //player 1 win
  else if ( (p1Guess === "rock" && p2Guess === "scissors") || (p1Guess === "paper" && p2Guess === "rock") || (p1Guess === "scissors" && p2Guess === "paper")){
    $('#game-board').text("Player 1 wins! -- Player1, your turn");

    //player 1 wins ++
    //player 2 loses ++

    p1Guess = null;
    p2Guess = null;

  }

  //player 2 win
  else if ((p2Guess === "rock" && p1Guess === "scissors") || (p2Guess === "paper" && p1Guess === "rock") || (p2Guess === "scissors" && p1Guess === "paper") ){
    $('#game-board').text("Player 2 wins! -- Player1, your turn");

    //player 2 wins ++
    //player 1 loses ++


    p1Guess = null;
    p2Guess = null;
  }

//   if p1 = rock ps= scissors or p1 paper and p2 is rock, or p1 = sci and ps = paper


};


// var postsRef = database.child.ref("player");
// postsRef.limitToFirst(1).once("value", function(snapshot) {
//     console.log(snapshot.key);
// });

//Firebase data doc:
//https://firebase.google.com/docs/database/admin/retrieve-data

