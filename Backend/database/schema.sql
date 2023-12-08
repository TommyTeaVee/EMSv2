DROP TABLE IF EXISTS admin;

CREATE TABLE admin(
  ID INT PRIMARY KEY NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(50) NOT NULL
);

INSERT INTO admin (ID, email, password)
VALUES (1, 'superadmin@shaper.co.za', '@dmin@dmin1023');
INSERT INTO admin (ID, email, password)
VALUES (2, 'admin@shaper.co.za', '@dmin@dmin1023');

INSERT INTO admin (ID, email, password)
VALUES (3, 'sysop@shaper.co.za', '@dmin@dmin1023');


DROP TABLE IF EXISTS department;

CREATE TABLE department(
    ID SERIAL PRIMARY KEY,
    name VARCHAR(255));


INSERT INTO department (name)
VALUES ('administration');
INSERT  INTO department (name)
VALUES ('HQ');

INSERT  INTO department (name)
VALUES ('campus');


DROP TABLE IF EXISTS employees;

CREATE TABLE employees(
   employee_id SERIAL PRIMARY KEY,
    employee_name VARCHAR(255),
    employee_surname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    address TEXT,
    job_title VARCHAR(255),
    salary NUMERIC(10, 2),
    image VARCHAR(255),
    department_id INT

);
INSERT INTO employees (employee_name, employee_surname, email, password, address, job_title, salary, image, department_id)
VALUES( 'John', 'Doe', 'johndoe@shaper.co.za','johnPassword!','home sweet str avenue','System Operator', 15000, 'avatar.jpeg', 1);


INSERT INTO employees (employee_name, employee_surname, email, password, address, job_title, salary, image, department_id)
VALUES( 'Jane', 'Doe', 'janedoe@shaper.co.za','janePassword!', 'Work drive cres', 'System Admin', 10000, 'avatar.jpeg', 2)