// Imports
const {
  query
} = require('express');
const express = require('express')
var mysql = require('mysql');

const app = express()
// this variable defines which port will be live in our example it's localhost:3000
const port = 3000
var players = [];

// This variable makes sure that we have a connection with our database. We don't have a password set since it was unnecessary.
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tigersss',
  multipleStatements: true
});

// If any error occured during connection to database, it prints error.
connection.connect(function(error) {
  if (!!error) {
    console.log('Error');
  } else {
    console.log('Connected');
  }
});

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')

// This block of codes selects every player from player table, abnd shows it in our ejs file.
connection.query("SELECT * FROM player", (error, rows, field) => {
  if (!!error) {
    console.log('Error in the query');
  } else {
    console.log('Successful query');
    app.get('/players', (req, res) => {
      players = rows;

      res.render('about', {
        player: players
      })
    })
  }
});
// This function sets our view in welcome.
app.get('/', (req, res) => {
  res.render(__dirname + '/views/welcome.ejs');
})
// This function selects everything from matches where our wanted result code from macthes match result tables result code.
// and move's match id equals matches match id.
app.get('/matches', (req, res) => {
  query1 = "SELECT * FROM matches" +
    " INNER JOIN result ON matches.result_code=result.result_code" +
    " INNER JOIN move ON move.match_id=matches.match_id"

    query2 = "SELECT * FROM player";
    expectedQuery = query1 + ";" + query2;
    connection.query(expectedQuery, [2, 1], function(error, results, fields) {
      if (!!error) {
        console.log('Error in the query');
      } else {
        console.log('Successful query');
        match = results[0];
        player = results[1];
        console.log(match);
        console.log(player);
        res.render(__dirname + '/views/matches.ejs', {
          matches: match,
          players: player
        });
      }
    });
});
// This block of code gets specific player with selected player id.
app.post('/:playerId', (req, res) => {

  console.log(req.params);
  id = req.params['playerId'];
  querya = "SELECT * FROM player WHERE player_id=" + id;
  console.log(querya);

  connection.query(querya, (error, rows, field) => {
    if (!!error) {
      console.log('Error in the query');
    } else {
      console.log('Successful query');
      player = rows;
      res.render(__dirname + '/views/player.ejs', {
        player: player
      });
    }
  });
})
// This block of code selects everything from matches where result code equals result tables result code
// player id, equals player's id, match id's matches tables match id, finnally player id1 and playerid2 equals our players id.
app.post('/:playerId/:match_id', (req, res) => {
  console.log(req.params);
  match_id = req.params['match_id'];
  player_id = req.params['playerId']
  matches = match_id.split(" ");
  console.log(matches);

  query1 = "SELECT * FROM matches" +
    " INNER JOIN result ON matches.result_code=result.result_code" +
    " INNER JOIN player ON " + player_id + "=player.player_id" +
    " INNER JOIN move ON move.match_id=matches.match_id" +
    " WHERE player_id_1=" + player_id + " OR player_id_2=" + player_id;

  if (matches.length == 1) {
    query2 = "SELECT * FROM player" +
      " WHERE player_id=" + matches[0]
  } else if (matches.length == 2) {
    query2 = "SELECT * FROM player" +
      " WHERE player_id=" + matches[0] + " OR player_id=" + matches[1]
  } else {
    query2 = "SELECT * FROM player" +
      " WHERE player_id=" + matches[0] + " OR player_id=" + matches[1] + " OR player_id=" + matches[2]
  }
  expectedQuery = query1 + ";" + query2;
  connection.query(expectedQuery, [2, 1], function(error, results, fields) {
    if (!!error) {
      console.log('Error in the query');
    } else {
      console.log('Successful query');
      match = results[0];
      opponent = results[1];
      console.log(match);
      console.log(opponent);
      res.render(__dirname + '/views/match.ejs', {
        match: match,
        opponent: opponent
      });
    }
  });
})
//  Listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))
