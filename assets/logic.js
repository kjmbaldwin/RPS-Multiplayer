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


$('#submit-btn').on('click', function(event){ 
  event.preventDefault();

  var userName = $('#user-name').val().trim();
  console.log(userName);


  database.ref().push({
    player: userName,
  })

  $('#user-name').val('');


});


database.ref().on('child_added', function(childSnapshot){ 

  var player = childSnapshot.val().player;

  //if player 1 class = empty, then append palyer 1 and change class to full
  if ($('#player1').hasClass('empty')){
     
    $('#player1').removeClass('empty').addClass('full');

    var $rock = $('<div>').addClass('guess').attr('id', 'p1-rock').text('Rock');
    var $paper = $('<div>').addClass('guess').attr('id', 'p1-paper').text('Paper');
    var $scissors = $('<div>').addClass('guess').attr('id', 'p1-scissors').text('Scissors');

    $('#player1').append(player, $rock, $paper, $scissors); 


  } else if ($('#player2').hasClass('empty')){

    $('#player2').removeClass('empty').addClass('full');

    var $rock = $('<div>').addClass('guess').attr('id', 'p2-rock').text('Rock');
    var $paper = $('<div>').addClass('guess').attr('id', 'p2-paper').text('Paper');
    var $scissors = $('<div>').addClass('guess').attr('id', 'p2-scissors').text('Scissors');

    $('#player2').append(player, $rock, $paper, $scissors); 
  }


  
  //else if same for player 2


});


//onclick send user name to firebase
//initialize wins and loses 
//create buttons for r p and s
