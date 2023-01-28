const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

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



