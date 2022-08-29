const express = require('express');
const app = express();
PORT = 3001;
require('dotenv').config()
const session = require("express-session")
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true
}))
const passport = require("passport")
var DiscordStrategy = require('passport-discord').Strategy;
var scopes = ['identify', 'email', 'bot','applications.commands'];


var usersId = []
var users = []

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new DiscordStrategy({
  clientID: '1008717918609100800',
  clientSecret: 'XzSiWnIPkC9KkjAqh68erMUtO6cKPCob',
  callbackURL: 'http://localhost:3001/auth/discord/redirect', scope: scopes},
function(accessToken, refreshToken, profile, cb) {
  console.log("Discord Info ",accessToken, refreshToken, profile)
  
  if (usersId.includes(profile.id)) {
    console.log('Includes');
    return cb(null, users[usersId.indexOf(profile.id)])
  } else {
    console.log('Doesnt Includes');
    usersId.push(profile.id)
    users.push({profile, accessToken, refreshToken})
    return cb(null, {profile, accessToken, refreshToken})
  }

}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/discord', passport.authenticate('discord', { permissions: 0x0000000000000008 }));
app.get('/auth/discord/redirect', passport.authenticate('discord'), function(req, res) {
    console.log('SUCCESS')
    res.send("Yout login is successful")

    // res.redirect('/') // Successful auth
});

app.get('/', (req,res) =>{
  res.send("<div><a href='/auth/discord'>Login to Github</a></div>")
})


app.listen(PORT, () => {
    console.log('Listening at ${PORT}')
} )