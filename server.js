const express = require('express');
const mysql = require('mysql2');


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySql username:
        user: 'root',
        // MYSQL password:
        password: 'rootroot!*',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database`)
);



// Query database
db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
});

// Default response for any bad request
app.use((req, res) => { res.status(404).end() });

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});