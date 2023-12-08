import express, { json } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import conn from '../config/db.js'
import bcrypt from 'bcrypt';


const router = express.Router();


router.post('/adminlogin', (req, res)=> { 
  //console.log(req.body)
  const sql =  'SELECT * FROM admin WHERE email = $1 AND password = $2';
  conn.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) 
    {return res.json({ loginStatus: false, Error: "Query error :" + err })
    console.log(res.status)}
     if (result.rowCount> 0) {
      const email = result.rows[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result.rows[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});


//Get department from database
router.get('/api/department', (req, res) => {
    const sql ="SELECT * FROM department";
    conn.query(sql, (err, results)=>{
            if (err){
                return res.json({Status: false,  Results: 'Query error'})
            } else{
                return res.json({Status: true,  Results: results.rows})
            }


    })
});


// Post or Create a department

router.post('/api/add_department', (req, res) => {
    const sql = 'INSERT INTO department (name) VALUES ($1)';
    conn.query(sql, [req.body.name], (err, result) => {
        if (err){
            return res.json({Status: false,  Results: 'Query error' + err.message})
        } else{
            return res.json({Status: true,  Results: result.rows})
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

router.post('/api/add_employee', upload.single('image'), (req, res) => {
  const sql = `INSERT INTO employees 
  (employee_name, email, password, address, job_title, salary, image, department_id')
   VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;
   //Encrypt the user password
   
   bcrypt.hash(req.body.password, 10, (err, hash) => {
     if (err) 
        return res.json({Status: false, Error:'Query Failed' + err})
    
     const values = [
        req.body.name,
        req.body.email,
        hash,
        req.body.address,
        req.body.job_title,
        req.body.salary, 
        req.file.filename,
        req.body.department_id
    ]
    conn.query(sql, [values], (err, result) => {
        if (err) {
            res.json({Status: false, Error: 'Query failed' + err.message})
        }

        else {
            res.json({Status: true, Result: result.rows})   
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
    const sql = `UPDATE employees 
        set name = ?, email = ?, salary = ?, address = ?,department_id = ? 
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
    const sql = "delete from employees where id = ?"
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