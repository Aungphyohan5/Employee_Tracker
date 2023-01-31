INSERT INTO department (id, name)
VALUES 
(001,'Sales'),
(002,'Engineering'),
(003,'Finance'),
(004,'Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
('Sales Lead',100000, 1 ),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Account Manager', 160000, 3),
('Accountant', 120000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4)


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Doe', 1, null),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, null),
('Kunal', 'Singh', 4, null),
('Malia', 'Brown', 5, 4),
('Sarah', 'Lourd', 6, null),
('Tom', 'Allen', 7, 6)

