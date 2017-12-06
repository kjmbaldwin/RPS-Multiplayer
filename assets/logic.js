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

var p1Guess = '';
var p2Guess = '';

var newPlayer = null;

var player1 = null;
var player2 = null;

//watch the players section for changes
database.ref('players/').on('value', function(snapshot){

  var watchP1 = snapshot.child('p1').exists()
  var watchP2 = snapshot.child('p2').exists()

  //if a player1 exists
  if(watchP1){
    
    //give var player1 a value
    player1 = snapshot.val().p1;

    //print name and stats
    $('#p1-username').text(player1.player);
    $('#p1-stats').text('Wins: ' + player1.wins + ' Loses: ' + player1.loses);
  
  // if player1 does not exist remove everything.
  } else {

    $('#p1-username').text('Waiting for Player 1');
    $('#p1-stats').empty();

  }

  if(watchP2){
    exist2 = true;
    player2 = snapshot.val().p2;

    //print name and stats
    $('#p2-username').text(player2.player);
    $('#p2-stats').text('Wins: ' + player2.wins + ' Loses: ' + player2.loses);
  
  } else {

    $('#p2-username').text('Waiting for Player 2');
    $('#p2-stats').empty();

  }

  //if we have a player 1 and player 2, set turns to 1 in firebase
  if(watchP1 && watchP2){
    database.ref().child('turn').set(1);
  }

  //if we lose player 1 or 2, remove turns
  if (!watchP1 || !watchP2){
    database.ref().child('turn').remove();
  } 

});

//watch who's turn it is
database.ref('turn/').on('value', function(turn){ 

  if(turn.val() === 1){
    renderButtons('#p1-buttons');
    
  } else{
    $('#p1-buttons').empty();
  }

  if(turn.val() === 2){
    renderButtons('#p2-buttons');

  } else{
    $('#p2-buttons').empty();
  }

});





$('#submit-btn').on('click', function(event){ 
  event.preventDefault();

  //if var player1 doesn't have a value
  if(!player1){

    //write new player 1 and push to firebase
    writePlayer();
    database.ref().child('players/p1').set(newPlayer);
  
    //if the user closes the tab, remove player 1 and turns
    database.ref().child('players/p1').onDisconnect().remove();


  }  else if(!player2){
    
    writePlayer();
    database.ref().child('players/p2').set(newPlayer);

    database.ref().child('players/p2').onDisconnect().remove();

  }

  $('#username-input').val('');
});

/*
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
*/

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

function writePlayer(){

  newPlayer = {
      player: $('#username-input').val().trim(),
      wins: 0,
      loses: 0,
      guess: '',
    }

};

function renderButtons(location){

  var $text = $('<div>').addClass('text-center').text('It\'s Your Turn!');
  var $rock = $('<div>').addClass('guess').attr('data-choice', 'rock').text('Rock');
  var $paper = $('<div>').addClass('guess').attr('data-choice', 'paper').text('Paper');
  var $scissors = $('<div>').addClass('guess').attr('data-choice', 'scissors').text('Scissors');

  $(location).append($text, $rock, $paper, $scissors);

  
};

