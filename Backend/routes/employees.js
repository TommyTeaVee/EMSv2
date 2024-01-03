import express from "express";
import conn from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();


// Middleware to generate a token upon successful login
const generateToken = (user) => {
  return jwt.sign(
    { user },
    process.env.JWT_SECRET_KEY || "R3ACTJWTKEY",
    { expiresIn: "1d" }
  );
}

/* router.post("/api/employee_login", async (req, res) => {  
  const { email, password } = req.body;

  const sql = "SELECT * from employees WHERE email = $1";
  conn.query(sql, [email], (err, result) => {
    if (err) {
      return res.json({ loginStatus: false, Error: "Query error" });
    }

    if (result.rows.length > 0) {
      console.log(result.rows[0]);

      if (result.rows[0].password === password) {
        let userData = result.rows[0]

        const user = {
          employee_id: userData.employee_id,
          email: userData.email,
          employee_name: userData.employee_name,
          employee_surname: userData.employee_surname,
          address: userData.address,
          job_title: userData.job_title,
          salary: userData.salary,
          department_id: userData.department_id,
          image: userData.image,
        };

        const token = jwt.sign(
          { user },
          process.env.JWT_SECRET_KEY || "R3ACTJWTKEY",
          { expiresIn: "1d" }
        );

        return res.json({ loginStatus: true, user, token });
      } else {
        return res.json({
          loginStatus: false,
          error: "Email or Password incorrect",
        });
      }
    } else {
     
      console.log(result);
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});
 */
/* router.get("/detail/:id", (req, res) => {
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
 */

router.post('/api/employee_login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await conn.query('SELECT * from employees WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Generate a JWT token
        const token = jwt.sign({ email: user.email },  process.env.JWT_SECRET_KEY || "R3ACTJWTKEY", { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in', error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  console.log(req.headers);  // Log headers
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token not provided');
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY || "R3ACTJWTKEY", (err, user) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.user = user;
    next();
  });
}

router.get('/api/employees/me', verifyToken, (req, res) => {
  console.log(req.headers);  // Log headers
  res.json({ message: 'This is a protected route', user: req.user });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as EmployeeRouter };
