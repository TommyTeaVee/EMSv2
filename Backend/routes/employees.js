import express from "express";
import conn from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/api/employee_login", async (req, res) => {  
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

router.get("/detail/:id", (req, res) => {
  const id = req.params.employee_id;
  const sql = "SELECT * FROM employees where employee_id = $1";
  conn.query(sql, [id], (err, result) => {
    if (err){ 
      return res.json({ Status: false });}

   res.status(200).json(result.rows);
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as EmployeeRouter };
