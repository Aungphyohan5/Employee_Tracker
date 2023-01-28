DROP DATABASE IF EXISTS employee_db;
-- create employee database -- 
CREATE DATABASE employee_db;

-- use employee database --
USE employee_db;

-- create department table --
CREATE TABLE department (
    id INT,
    name VARCHAR(30),
  PRIMARY KEY(id)
);

-- create role table --
CREATE TABLE role (
    id INT,
    title VARCHAR(30),
    salary DECIMAL(19,4),
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    PRIMARY KEY(id)
);

-- create employee table -- 
CREATE TABLE employee (
    id INT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    PRIMARY KEY(id)
    ON DELETE SET NULL
);
