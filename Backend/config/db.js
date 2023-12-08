//Replaced MYSQL Configuration with Postgres
import pg from 'pg';
const { Pool } = pg;

 const conn = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'employeems',
  password: 'password',
  port: 5432,
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
export default conn;
