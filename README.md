
# Employee Management System

This is a PERN (PostgreSQL, React.js, and Node) full stack  employee management system.


## Features
The application contains two types of Users, Admin and Employee.

- Add other admins
- Add and edit Employees
- Add departments
- Assign  employees departments





## Running the application

This project uses Node v18^ PostgreSQL  4.5 and React.js 18 with Vite as development server.  To run the project, navigate to the Backend folder first and run

```bash
  npm install
```
To run on the dev mode use nodemon, run the project with
```bash
npm run dev
```
to run in production mode, run with:
```bash
npm run start
```





## API Reference
For testing purposes , inside the backend folder, there's an API.rest file that can test the CRUD methods directly or alternatively , you can use Postman or other testing applications like Thunderclient

Takes two numbers and returns the sum.
### test the server is it's online ##########
```http
GET http://localhost:35050
```


#### ADMIN TASKS

### authenticate ADMIN (login|)
```http
POST http://localhost:35050/auth/adminlogin
content-type: application/json

{
    "email": "admin@shaper.co.za",
    "password": "@dmin@dmin1023"
}
```
### List all  admins ################################
```http
GET http://localhost:35050/auth/api/admin_records
```
#### Get a list of all departments #################
``` http
GET http://localhost:35050/auth/api/department
```
 
### Get total number of  departments ################
```http
GET http://localhost:35050/auth/api/department_count
```


#### Add a new department ##########################
```http
POST http://localhost:35050/auth/api/add_department 
content-type: application/json

{
    "name": "Sales"
}
```


### authenticate Employee (login) ####################
```http
POST http://localhost:35050/user/api/employee_login
content-type: application/json

{
    "email": "lisa@shaper.co.za",
    "password": "password1"
}
```
##### get a list all employees ####################
```http
GET http://localhost:35050/auth/api/employees
```
###### get total number of all employees ###########
```http
GET http://localhost:35050/auth/api/employee_count
```

### GET Employee Details ##############################
```http
 GET  http://localhost:35050/user/api/employees/me

```


## Frontend Features
To run the frontend , navigate to the Frontend/ems_eu folder and run 
```bash 
yarn install
yarn dev
```

Login as either employee or admin 

![Logo](https://github.com/TommyTeaVee/EMSv2/blob/pg-version/Screenshot%202024-01-05%20at%2009.08.17.png?raw=true)


### Acknowledgements

 - Vite as the development server for frontend 

     https://vitejs.dev

 - React.js  for frontend 
   
   https://react.dev
   
   - Bootstrap

    https://getbootstrap.com

   ### Backend 
   - Node.js 18.0.0


   - PostgreSQL

   https://www.postgresql.org

   


## Authors

- [@TommyTeaVee](https://www.github.com/tommyteavee)

