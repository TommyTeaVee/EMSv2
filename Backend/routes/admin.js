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
        "R3ACTJWT",
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
            console.log(req.body.name)
            return res.json({Status: false,  Results: 'Query error' + err.message})
        } else{
            return res.json({Status: true,  Results: result.rows})
        }
    });
})


//Image uploader using Multer
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/images/')
    },
    filename: (req, file, cb) => {
   
        cb(null, `image-${Date.now()}` + path.extname(file.originalname))
           //path.extname get the uploaded file extension
       }
     });
     const multerFilter = (req, file, cb) => {
   
        if (!file.originalname.match(/\.(png|jpg|jpeg|gif|web)$/)) { 
             // upload only png and jpg format
           return cb(new Error('You can only upload image types of files'))
         }
       cb(null, true)
    
};

//initialise multer to perform uploading
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  });
  
//end of image upload

/* router.post('/api/add_employee', upload.single('image'), (req, res, next) => {

  const sql = `INSERT INTO employees
  (employee_name, email, password, address, job_title, salary, image, department_id)
   VALUES($1, $2, $3, $4, $5, $6, ${req.file.filename}, $8) RETURNING *`;
   //Encrypt the user password

   bcrypt.hash(req.body.password, 10, (err, hash) => {
    console.log(hash);
     if (err){
        return res.json({Status: false, Error:'Query Failed: ' + hash  + ' ' + err})}
    
     const values = [
        req.body.employee_name,
        req.body.email,
        hash,
        req.body.address,
        req.body.job_title,
        req.body.salary, 

        req.body.department_id
    ]
    conn.query(sql, [values], (err, result) => {
        console.log(req.file);
        if (err) {
            
            res.json({Status: false, Error: 'Query failed' + err.message})
        }

        else {
            res.json({Status: true, Result: result.rows})   
        }
    })
   })



}) */
router.post('/api/add_employee', upload.single('image'), async (req, res, next) => {
    try {
      // Check if an image was provided
      if (!req.file) {
        return res.status(400).json({ Status: false, Error: 'No image uploaded.' });
      }
  
      // Encrypt the user password
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({ Status: false, Error: 'Password hashing failed.' });
        }
  
        const sql = `
          INSERT INTO employees
          (employee_name, email, password, address, job_title, salary, image, department_id)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `;
  
        const values = [
          req.body.employee_name,
          req.body.email,
          hash,
          req.body.address,
          req.body.job_title,
          req.body.salary,
          req.file.buffer, // Use req.file.buffer to get the image data
          req.body.department_id,
        ];
  
        // Use async/await with the pool.query for better error handling
        const result = await conn.query(sql, values);
  
        res.json({ Status: true, Result: result.rows });
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      res.status(500).json({ Status: false, Error: 'Internal Server Error' });
    }
  });
  


//Get all Employees 
router.get('/api/employees', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM employees ';
    conn.query(sql, (err, results) => {
        if (err) {
            return res.json({Status: false, Error: "Query failed, canonot retrieve emploes"})
        }else {
            return res.json({Status: true, Results: results.rows})
        }


    })
})

//Retrieve employee by ID

router.get('/api/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employees WHERE employee_id = $1";
    conn.query(sql,[id], (err, result) => {
        if(err) {return res.json({Status: false, Error: "Query Error " + err.message})
    }
       else { 
        return res.json({Status: true, Result: result.rows[0]})
    }
    })
})

router.put('/api/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employees 
        set  email = $1, password =$2, address = $4,  salary = $3, job_title=$5, department_id = $6
        Where employee_id = $7`
    const values = [
        req.body.password,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.job_title,
        req.body.department_id
    ]
    conn.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error "+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/api/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM  employees WHERE  employee_id = $1"
    conn.query(sql,[id], (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error: "+ err.message})
    }
       else { return res.json({Status: true, Result: result.rows})
    }
    })
})

router.get('/api/admin_count', (req, res) => {
    const sql = "SELECT COUNT(id) AS admin FROM admin";
    conn.query(sql, (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error"+err})
    }
        else {
            return res.json({Status: true, Result: result.rows})}
    })
})

router.get('/api/employee_count', (req, res) => {
    const sql = "SELECT COUNT(employee_id) AS employee FROM employees";
    conn.query(sql, (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error"+err})
        }
        else {
            return res.json({Status: true, Result: result.rows})}
    })
})

router.get('/api/salary_count', (req, res) => {
    const sql = "SELECT SUM(salary) AS salaryOFEmp from employees";
    conn.query(sql, (err, result) => {
        if(err)  {
            return res.json({Status: false, Error: "Query Error"+err})
        }
         else {
            return res.json({Status: true, Result: result.rows})
        }
    })
})

router.get('/api/admin_records', (req, res) => {
    const sql = "SELECT * FROM admin"
    conn.query(sql, (err, result) => {
        if(err) {
            return res.json({Status: false, Error: "Query Error"+err})
        }

        else {
            return res.json({Status: true, Result: result.rows})
        }

    })
})

router.get('/api/logout', (req, res) => {
    res.clearCookie('token')
    return
     res.json({Status: true})
})

export { router as adminRouter };