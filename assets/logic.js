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