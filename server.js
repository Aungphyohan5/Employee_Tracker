const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');



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
    // console.table(results);
});

// inquirer questions
const question = [
    {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
    }
];

// To add department
const department = [
    {
        type: 'input',
        name: 'add_department',
        message: 'What is the name of the department?'
    }
];

// To add a role
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

// to add employee
const employee = [
    {
        type: 'input',
        name: 'firstName',
        message: 'What is the employee’s first name?'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'What is the employee’s last name?'
    },
    {
        type: 'list',
        name: 'employeeRole',
        message: 'What is the employee’s role?',
        choices:
            [
                'Sales Lead',
                'Salesperson',
                'Lead Engineer',
                'Account Manager',
                'Accountant',
                'Legal Team Lead',
                'Lawyer',
                'Customer Service'
            ]
    },
    {
        type: 'list',
        name: 'employeeManager',
        message: 'Who is the employee’s manager?',
        choices:
            [
                'None',
                'John Doe',
                'Mike chan',
                'Ashley Rodriguez',
                'Kevin Tupik',
                'Kuala Singh',
                'Mail Brown'
            ]
    }
];

// To update the employee Role
const updateEmployee = [
    {
        type: 'list',
        name: 'employeeName',
        message: 'Which employee’s role do you want to update?',
        choices:
            [
                'John Doe',
                'Mike chan',
                'Ashley Rodriguez',
                'Kevin Tupik',
                'Kuala Singh',
                'Mail Brown',
                'Sarah Lourd',
                'Tom Allen',
                'Sam Kash'

            ]
    },
    {
        type: 'list',
        name: 'newRole',
        message: 'What role do you want to assign the selected employee?',
        choices:
            [
                'Sales Lead',
                'Salesperson',
                'Lead Engineer',
                'Account Manager',
                'Accountant',
                'Legal Team Lead',
                'Lawyer',
                'Customer Service'

            ]
    }

]

function init() {
    inquirer.prompt(question).then(answers => {
        if (answers.option === 'View All Employees') {
            db.query('SELECT * FROM employee', function (err, results) {
                console.table(results);
                init()
            });
        };
        if (answers.option === 'View All Roles') {
            db.query('SELECT * FROM role', function (err, results) {
                console.table(results);
                init()
            });
        };
        if (answers.option === 'View All Departments') {
            db.query('SELECT * FROM department', function (err, results) {
                console.table(results);
                init()
            });
        };
    })
}



init()
// Default response for any bad request
app.use((req, res) => { res.status(404).end() });

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});