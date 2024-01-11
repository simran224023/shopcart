var mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mystore', // your database name
  });
  
  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err.stack);
      return;
    }
    console.log('Connected to the database');
  });

module.exports = connection;