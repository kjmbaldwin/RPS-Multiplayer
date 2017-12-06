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

//object to write the player to firebase
var newPlayer = null;

//to track players locally
var player1 = null;
var player2 = null;

//holds guess values to compare
var p1Guess;
var p2Guess;

//used to hold the current score
var p1Win;
var p1Loss;
var p2Win;
var p2Loss;



//watch firebase for changes to main children
database.ref().on('value', function(snapshot){

  //see if these children exist after data chagnes
  var watchP1 = snapshot.child('players/p1').exists()
  var watchP2 = snapshot.child('players/p2').exists()
  var watchTurn = snapshot.child('turn').exists()

  //if a player1 exists
  if(watchP1){
    
    //give var player1 a value
    player1 = snapshot.val().players.p1;

    //print name and stats
    $('#p1-username').text(player1.player);
    $('#p1-stats').text('Wins: ' + player1.wins + ' Loses: ' + player1.loses);

    //hold the current score locally
    p1Win = snapshot.val().players.p1.wins;
    p1Loss = snapshot.val().players.p1.loss;
  
  // if player1 does not exist remove everything.
  } else {

    $('#p1-username').text('Waiting for Player 1');
    $('#p1-stats').empty();

  }

  if(watchP2){
    exist2 = true;
    player2 = snapshot.val().players.p2;

    //print name and stats
    $('#p2-username').text(player2.player);
    $('#p2-stats').text('Wins: ' + player2.wins + ' Loses: ' + player2.loses);

    p2Win = snapshot.val().players.p1.wins;
    p2Loss = snapshot.val().players.p2.loss;
  
  } else {

    $('#p2-username').text('Waiting for Player 2');
    $('#p2-stats').empty();

  }

  //if we have a player 1 & 2, and the turns count does not exist, create it.
  if(watchP1 && watchP2 && !watchTurn){
    database.ref().child('turn').set(1);
  }

  //if we lose player 1 or 2, remove turns
  if (!watchP1 || !watchP2){
    database.ref().child('turn').remove();
  } 


  


});

//add players to firebase via button
$('#submit-btn').on('click', function(event){ 
  event.preventDefault();

  //if var player1 doesn't have a value
  if(!player1){

    //write new player 1 and push to firebase
    writePlayer();
    database.ref().child('players/p1').set(newPlayer);
  
    //if the user closes the tab, remove player 1
    database.ref().child('players/p1').onDisconnect().remove();

    //if playter 1 has a value, write player 2
  }  else if(!player2){
    
    writePlayer();
    database.ref().child('players/p2').set(newPlayer);

    database.ref().child('players/p2').onDisconnect().remove();

  }

  $('#username-input').val('');
});


//watch who's turn it is
database.ref('turn').on('value', function(turn){ 

  //clear any buttons that were rendered
  $('#p1-buttons').empty();
  $('#p2-buttons').empty();

  //render buttons to the correct side of the game
  if(turn.val() === 1 ){
    renderButtons('#p1-buttons', 'p1');

  } 

  if(turn.val() === 2 ){
    renderButtons('#p2-buttons', 'p2');
  } 

  

});


//on click events for player1 guesses:
$(document).on('click', '.p1', function(){ 

  //pulls the data from the button
  var guess = $(this).attr('data-choice');

  //sends the data to firebase and sets the turn to 2
  database.ref().child('players/p1/guess').set(guess);
  database.ref().child('turn').set(2);

});

$(document).on('click', '.p2', function(){ 

  var guess = $(this).attr('data-choice');
  database.ref().child('players/p2/guess').set(guess);
  database.ref().child('turn').set(1);
  compare();
 
});


//watch the guess values, if both are answered, compare them:
database.ref('players/').on('value', function(snapshot){

  if (snapshot.child('p1/guess').exists()){
    p1Guess = snapshot.val().p1.guess;
    console.log("p1Guess: " + p1Guess);
  }

  if(snapshot.child('p2/guess').exists()){
    p2Guess = snapshot.val().p2.guess;
    console.log("p2Guess: " + p2Guess);
  }

  // if (p1Guess && p2Guess){
  //   compare();
  //   p1Guess = null;
  //   p2Guess = null;
    // console.log('after compare' + p1Guess);
    // database.ref().child('players/p1/guess').set('');
    // database.ref().child('players/p2/guess').set('');
  // }

});

  
function compare(){


      //tie 
      if(p1Guess === p2Guess){
        $('#game-board').html('<h2>Bummer, a tie :(</h2>');
      } 

      //player 1 win
      if ( (p1Guess === "rock" && p2Guess === "scissors") || (p1Guess === "paper" && p2Guess === "rock") || (p1Guess === "scissors" && p2Guess === "paper")){
          
        $('#game-board').html("<h2>Player 1 wins!</h2>");

        //player 1 wins ++
        // p1Win = p1Win + 1;
        // console.log("after compare p1 win:" + p1Win);
        // database.ref().child('players/p1/wins').set(p1Win);
        // database.ref().child('players/p1/guess').remove();
        
        //player 2 loses ++
        // p2Loss = p2Loss + 1;
        // console.log("after compare p2 loss:" + p2Loss);
        // database.ref().child('players/p1/wins').set(p2Loss);
        // database.ref().child('players/p2/guess').remove();

        } 

        // //player 2 win
        if ((p2Guess === "rock" && p1Guess === "scissors") || (p2Guess === "paper" && p1Guess === "rock") || (p2Guess === "scissors" && p1Guess === "paper") ){
            $('#game-board').html("<h2>Player 2 wins!</h2>");

        //     //player 2 wins ++
        //     p2Win = p2Win + 1;
        //     database.ref().child('players/p1/wins').set(p2Win);
        //     //player 1 loses ++
        //     p1Loss = p1Loss + 1;
        //     database.ref().child('players/p1/wins').set(p1Loss);
          }


//   if p1 = rock ps= scissors or p1 paper and p2 is rock, or p1 = sci and ps = paper

  // 

};


function writePlayer(){

  newPlayer = {
      player: $('#username-input').val().trim(),
      wins: 0,
      loses: 0,
      
    }

  // database.ref().child('turn').set(1);


};

function renderButtons(location, player){

  var $text = $('<div>').addClass('text-center').text('It\'s Your Turn!');
  var $rock = $('<div>').addClass('guess').addClass(player).attr('data-choice', 'rock').text('Rock');
  var $paper = $('<div>').addClass('guess').addClass(player).attr('data-choice', 'paper').text('Paper');
  var $scissors = $('<div>').addClass('guess').addClass(player).attr('data-choice', 'scissors').text('Scissors');

  $(location).append($text, $rock, $paper, $scissors);

  
};

function grabScore(){
  var ref = database.ref('players/');

  ref.once('value').then(function(snapshot){
    p1Win = snapshot.val().p1.wins;
    p1Loss = snapshot.val().p1.loses;
    p2Win = snapshot.val().p2.wins;
    p2Loss = snapshot.val().p2.loses;

    console.log('inside function p1 win ' + p1Win);
    console.log('inside function p1 loss ' + p1Loss);
    console.log('inside function p2 win ' + p2Win);
    console.log('inside function p2 loss ' + p2Loss);

    compare();

    });

  console.log('before parse p1 win ' + p1Win);
  console.log('before parse p1 loss ' + p1Loss);
  console.log('before parse p2 win ' + p2Win);
  console.log('before parse p2 loss ' + p2Loss);

  p1Win = parseInt(p1Win);
  p1Loss = parseInt(p1Loss);
  p2Win = parseInt(p2Win);
  p2Loss = parseInt(p2Loss);

  console.log('after parse p1 win ' + p1Win);
  console.log('after parse p1 loss ' + p1Loss);
  console.log('after parse p2 win ' + p2Win);
  console.log('after parse p2 loss ' + p2Loss);
};