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
        host: '127.0.0.1',
        // MySql username:
        user: 'root',
        // MYSQL password:
        password: 'rootroot!*',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database`)
)

// inquirer questions
const question = [
    {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add_Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
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

// init function for inquirer question & response
function init() {
    inquirer.prompt(question).then(answers => {

        // View All Employees
        if (answers.option === 'View All Employees') {
            // reference : https://www.w3schools.com/sql/func_sqlserver_concat.asp
            db.query(`SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS LAST_Name, role.title AS Title, role.salary AS Salary, department.name AS Department,
            CONCAT (manager.first_name, " ", manager.last_name) AS manager  
            FROM employee
                   LEFT JOIN role ON employee.role_id = role.id
                   LEFT JOIN department ON role.department_id = department.id
                   LEFT JOIN employee manager ON employee.manager_id = manager.id`,
                function (err, results) {
                    console.table(results);
                    init()
                })
        };

        // View All Roles
        if (answers.option === 'View All Roles') {
            db.query(`SELECT role.id AS id, role.title AS title, role.salary as salary, department.name as department
                FROM role 
                INNER JOIN department on role.department_id = department.id`, function (err, results) {
                console.table(results);
                init()
            })
        };

        // View All Departments
        if (answers.option === 'View All Departments') {
            db.query('SELECT * FROM department', function (err, results) {
                console.table(results);
                init()
            })
        };

        // Add  New Employee
        if (answers.option === 'Add_Employee') {
            db.query(`SELECT * FROM role`, function (err, result) {

                const roles = result.map(({ title }) => ({ name: title })); // All roles

                // Questions for new employee
                inquirer.prompt([
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
                        choices: roles

                    }

                ]).then(answers => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.employeeRole) {
                            var employee_Role = result[i];
                        }
                    };


                    const firstName = answers.firstName  // new employee's first name
                    const lastName = answers.lastName // // new employee's last name


                    db.query(`SELECT * FROM employee`, function (err, result) {

                        const manager = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }))

                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'employeeManager',
                                message: 'Who is the employee’s manager?',
                                choices: manager
                            }

                        ]).then(answers => {
                            const managerName = answers.employeeManager

                            var sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?"; // reference from :: https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp
                            var values = [
                                [firstName, lastName, employee_Role.id, managerName]
                            ];

                            db.query(sql, [values], function (err, result) {

                                console.log(`Added New Employeee`)
                            })
                            init()
                        })

                    });


                });

            });

        };

        // Update Employee Role
        if (answers.option === 'Update Employee Role') {
            db.query(`SELECT * FROM employee`, function (err, result) {
                // To update the employee Role
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employeeName',
                        message: 'Which employee’s role do you want to update?',
                        choices: () => {
                            const employee = result.map(({ first_name, last_name }) => ({ name: first_name + '' + last_name }));
                            return employee
                        }
                    }
                ]).then(answers => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].first_name + '' + result[i].last_name === answers.employeeName) {
                            var employeeName = result[i];
                        }
                    }
                    // console.log(employeeName.id)
                    db.query(`SELECT * FROM role`, function (err, result) {
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'newRole',
                                message: 'What role do you want to assign the selected employee?',
                                choices: () => {
                                    const roles = result.map(({ title }) => ({ name: title }));
                                    return roles

                                }
                            }
                        ]).then(answers => {

                            for (var i = 0; i < result.length; i++) {
                                if (result[i].title === answers.newRole) {
                                    var role = result[i];
                                }
                            }
                            // console.log(role.id)
                            var sql = `UPDATE employee SET role_id = ${role.id} WHERE id = ${employeeName.id}`;

                            db.query(sql, function (err, result) {

                                console.log(`Updated Employee's New Role.`)
                                init()
                            })
                        })
                    })
                })
            })
        };

        // Add New Role
        if (answers.option === 'Add Role') {

            db.query(`SELECT * FROM department`, function (err, result) {

                inquirer.prompt([
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
                        choices: () => {
                            const dept = result.map(({ name }) => ({ name: name }));
                            return dept
                        }
                    }
                ])
                    .then(answers => {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].name === answers.role_department) {
                                var departmentId = result[i];
                            }
                        }
                        console.log(answers);
                        const roleName = answers.role_name
                        const roleSalary = answers.role_salary

                        console.log(roleName, roleSalary)
                        var sql = "INSERT INTO role (title, salary, department_id) VALUES ?"; // reference from :: https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp
                        var values = [
                            [roleName, roleSalary, departmentId.id]
                        ];

                        db.query(sql, [values], function (err, result) {
                            title: roleName;
                            salary: roleSalary;
                            department_id: departmentId.id
                            init()

                            // department_id: roleDepartment
                            console.log(`Added New Role.`)
                        })
                    })
            })


        };

        // Add New Department
        if (answers.option === 'Add Department') {
            inquirer.prompt(department).then(answers => {
                console.log(answers);
                const sql = `INSERT INTO department(name)
                VALUES (?)`;
                const newDept = answers.add_department;
                db.query(sql, newDept, function (err, result) {
                    name: newDept;
                    console.log(`Added New Department`)
                    init()
                })

            })
        };
    });

};


// To run init function
init()
// Default response for any bad request
app.use((req, res) => { res.status(404).end() });


app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});