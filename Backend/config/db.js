//MYSQL database
import mysql from 'mysql';

//Database connection string
const conn= mysql.createConnection({
    host: 'localhost',
    user:'sueperadmin',
    password: '@dmin@dmin1023',
    database: "employeems"
})

//Database connection verification
conn.connect(function (err){
    if(err) {
        console.log(`Database connection error: ${err.message}`)
    }
    else {
        console.log(`Database connected successfully`)
    }
})

