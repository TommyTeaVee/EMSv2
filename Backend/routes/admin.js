import express, { json } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import conn from '../config/db.js'
import bcrypt from 'bcrypt';


const router = express.Router();


router.post('/adminlogin', (req, res)=> { 
  console.log(req.body)
  const sql =  'SELECT * FROM admin WHERE email = ? AND password = ?';
  conn.query(sql, [req.body.email, req.body.password], (error, result)=>{
    if (error) return res.json({ loginStatus: false, error: "Querry error"});
  })
  if (results.length>0){
    const email= results[0].email;
    const token = jwt.sign(
   { role: 'admin', email:email, id: results[0].id},
    "jwt_secret_key",
    {expiresIn: "1d"});
    res.cookie(token, token)
    return res.json({loginStatus: true})
}
        else{
          return res.json({loginStatus: false, Error: 'Error: Wrong email address or password'});  
        }


})


//Get department from database
router.get('/api/department', (req, res) => {
    const sql ="SELECT * FROM department";
    conn.query(sql, (err, results)=>{
            if (err){
                return res.json({Status: false,  Results: 'Query error'})
            } else{
                return res.json({Status: true,  Results: reuslts})
            }


    })
});


// Post or Create a department

router.post('/api/add_department', (req, res) => {
    const sql = 'INSERT INTO department (`name`) VALUES (?)';
    conn.query(sql, [req.body.department], (err, result) => {
        if (err){
            return res.json({Status: false,  Results: 'Query error'})
        } else{
            return res.json({Status: true,  Results: reuslts})
        }
    });
})


//Image uploader using Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/images/')
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '.' + Date.now() + path.extname(file.originalname))
    }

})

//initialise multer to perform uploading
const upload = multer({
    storage: storage
})
//end of image upload

router.post('api/add_employee', upload.single('image'), (req, res) => {
  const sql = `INSERT INTO employee 
  (employee_name, email, password, address, salary, department_id')
   VALUES(?)`;
   //Encrypt the user password
   bcrypt.hash(req.body.password, 10, (err, hash) => {
     if (err) {
        return res.json({Status: false, Error:'Query Failed'})
     }
     const values = [
        req.body.name,
        req.body.email,
        hash,
        req.body.address,
        req.body.salary, 
        req.file.filename,
        req.body.category_id
    ]
    conn.query(sql, [values], (err, result) => {
        if (err) {
            res.json({Status: false, Error: 'Query failed'})
        }

        else {
            res.json({Status: true })   
        }
    })
   })



})

//Get all Employees 
router.get('/api/employees', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM employees ';
    conn.query(sql, (err, results) => {
        if (err) {
            return res.json({Status: false, Error: "Query failed, canonot retrieve emploes"})
        }else {
            return res.json({Status: true, Results: results})
        }


    })
})

//Retrieve employee by ID

router.get('/api/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) {return res.json({Status: false, Error: "Query Error"})
    }
       else { 
        return res.json({Status: true, Result: result})
    }
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
        Where id = ?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error "+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from employee where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error"+err})
    }
       else { return res.json({Status: true, Result: result})
    }
    })
})

router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error"+err})
    }
        {
            return res.json({Status: true, Result: result})}
    })
})

router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error"+err})
        }
        else {
            return res.json({Status: true, Result: result})}
    })
})

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err)  {
            return res.json({Status: false, Error: "Query Error"+err})
        }
         else {
            return res.json({Status: true, Result: result})
        }
    })
})

router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error"+err})
        }

        else {
            return res.json({Status: true, Result: result})
        }

    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return
     res.json({Status: true})
})

export { router as adminRouter };