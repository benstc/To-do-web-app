import express from "express"
import session from "express-session"
import mysql from "mysql2"
import bcrypt from 'bcrypt';
import path from "path";
import { fileURLToPath } from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SALT_ROUNDS_COUNT = 10;

var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('views', 'static/views');
app.set('view engine', 'pug');

app.use(session({
  secret: 'csci4131secret',
  resave: false,
  saveUninitialized: true,
}));

const port = 3000;

var connection = mysql.createConnection({
    host: "cse-mysql-classes-01.cse.umn.edu",
    user: "C4131F24S002U52",
    password: "755219bs",
    database: "C4131F24S002U52",
    port: 3306
});

connection.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected to MYSQL database!");
})

app.listen(port, () => console.log("Listening on port:" + port + "!"));


// compare attempted login to info stored in database
app.post('/login', (req, res) => {
  if (req.session.value) {
    res.redirect('/to-do-items.html');
  }
  const {username, password} = req.body;
  
  const sql = 'SELECT * FROM finalUsers WHERE username = ?';
  connection.query(sql, [username], function(error, result) {
    if (error) throw error;
    if (result.length == 0) {
      console.log("no username match");
      res.status(401).json({message: 'Incorrect username/password'});
    } else if (!bcrypt.compareSync(password, result[0].password)) {
      console.log("password doesn't match");
      res.status(401).json({message: 'Incorrect username/password'});
    } else {
      console.log("successful username and password");
      // want to change the below line to set the session.value to the userID
      const userId = result[0].id;
      req.session.value = userId;
      res.status(200).json({message: 'Logged in!'});
    } 
  });
});

// Handle creating account
app.post('/create-account', (req, res) => {
  const {username, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS_COUNT);

  // if username is not taken, make query to insert new username and hashed password in database
  connection.query('INSERT INTO finalUsers (username, password) VALUES (?, ?)', [username, hashedPassword], (error, result) => {
    if (error) {
      console.log("Username taken");
      return res.status(401).json({message: 'Username taken'});
    } else {
      console.log("new user created");
      req.session.value = result.insertId;
      res.status(200).json({message: 'New account created'});
    }
  });
});


// add to-do item to database
app.post('/add-item', (req, res) => {
  if (!req.session.value) {
    res.redirect('/login.html');
  } else {
    const postData = req.body;

    const query = {
      title: postData.title,
      deadline: postData.deadline,
      status: "Undone",
      userID: req.session.value
    }
    connection.query('INSERT tasks SET ?', query, function(err, result) {
      if (err) throw err;
      console.log("Values inserted");
    });

    res.redirect('/to-do-items.html');
  }
});

// get all items from database
app.get('/get-items', (req, res) => {
  if (!req.session.value) {
    res.redirect('/login.html');
  } else {
    const userId = req.session.value;
    connection.query('SELECT * FROM tasks WHERE userId = ?', [userId], function(err,rows,fields) {
      if (err) throw err;
      res.json(rows);
    })
  }
})

// get all overdue items
app.get('/get-overdue', (req, res) => {
  if (!req.session.value) {
    res.redirect('/login.html');
  } else {
    const userId = req.session.value;
    connection.query('SELECT * FROM tasks WHERE status = "Undone" AND userId = ? AND deadline < CURDATE() ORDER BY deadline ASC', [userId], function(err,rows,fields) {
      if (err) throw err;
      res.json(rows);
    })
  }
})

// get all items in order of deadline
app.get('/get-deadline', (req, res) => {
  if (!req.session.value) {
    res.redirect('/login.html');
  } else {
    const userId = req.session.value;
    connection.query('SELECT * FROM tasks WHERE userId = ? ORDER BY deadline ASC', [userId], function(err,rows,fields) {
      if (err) throw err;
      res.json(rows);
    })
  }
})

// get all done items
app.get('/get-done', (req, res) => {
  if (!req.session.value) {
    res.redirect('/login.html');
  } else {
    const userId = req.session.value;
    connection.query('SELECT * FROM tasks WHERE status = "Done" AND userId = ?', [userId], function(err,rows,fields) {
      if (err) throw err;
      res.json(rows);
    })
  }
})

// get all done items
app.get('/get-undone', (req, res) => {
  if (!req.session.value) {
    res.redirect('/login.html');
  } else {
    const userId = req.session.value;
    connection.query('SELECT * FROM tasks WHERE status = "Undone" AND userId = ?', [userId], function(err,rows,fields) {
      if (err) throw err;
      res.json(rows);
    })
  }
})


app.post('/edit-status/:input', (req, res) => {
  if (!req.session.value) {
    res.redirect('/login.html');
  } else {
    const input = req.params.input;
    const inputParts = input.split('-');
    const taskID = inputParts[0];
    const status = inputParts[1];
    const sql = 'UPDATE tasks SET status = ? WHERE taskID = ?';
    connection.query(sql, [status, taskID], function(err, result) {
      if (err) throw err;
    });
    res.status(200).send("edited task status");
  }
})

// delete task from database with given taskID
app.delete('/delete-task/:id', (req, res) => {
  if (!req.session.value) {
    res.redirect('/login.html');
  } else {
    const taskId = req.params.id;
    const sql = 'DELETE FROM tasks WHERE taskID = ?';
  
    connection.query(sql, [taskId], function (err, result) {
      if (err) throw err;
      res.status(200).json({message: 'Contact deleted'});
    });
  }
});

// Getting files that need log in authentification
app.get('/to-do-items.html', (req, res) => {
  if (req.session.value) {
    res.sendFile(__dirname + '/static/html/to-do-items.html');
  } else {
    res.redirect('/login.html');
  }
});
app.get('/add-item.html', (req, res) => {
  if (req.session.value) {
    res.sendFile(__dirname + '/static/html/add-item.html');
  } else {
    res.redirect('/login.html');
  }
});

// Getting files that must be logged out for
app.get('/login.html', (req, res) => {
  if (req.session.value) {
    res.redirect('/to-do-items.html');
  } else {
    res.sendFile(__dirname + '/static/html/login.html');
  }
});
app.get('/create-account.html', (req, res) => {
  if (req.session.value) {
    res.redirect('/to-do-items.html');
  } else {
    res.sendFile(__dirname + '/static/html/create-account.html');
  }
});

// handle log out button being clicked
app.get('/logout', (req, res) => {
  req.session.destroy();
  console.log("session destroyed");
  res.redirect('/login.html');
});



// at bottom
app.use(express.static('static'));
app.use(express.static('static/html'));

app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>');
});
