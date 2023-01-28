const express = require('express');
const inquirer = require('inquirer');
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
db.query('SELECT * FROM department', function (err, results) {
    // console.table(results);
});

db.query('SELECT * FROM role', function (err, results) {
    // console.log(results);
});

db.query('SELECT * FROM employee', function (err, results) {
    // console.log(results);
});

// inquirer questions
const question = [
    {
        type: 'list',
        name: 'questions',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
    }
];

const department = [
    {
        type: 'input',
        name: 'add_department',
        message: 'What is the name of the department?'
    }
];


const role = [
    {
        type: 'input',
        name: 'role_name',
        message: 'What is the name of the role?'
    },
    {
        type: 'input',
        name: 'role_salary',
        message: 'What is the salary of the role?'
    },
    {
        type: 'list',
        name: 'role_department',
        message: 'Which department does the role belong to?',
        choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Service']
    }
];

inquirer.prompt(question).then((answer) => {
    console.log(answer);
})

// Default response for any bad request
app.use((req, res) => { res.status(404).end() });

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});