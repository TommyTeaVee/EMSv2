import express from 'express';
import cors from 'cors';
import { adminRouter } from "./routes/admin.js";
import { EmployeeRouter } from "./routes/employees.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const PORT = 35050;

const app = express() 


app.get('/', (req, res) =>{
console.log(`Server online`)
})

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}))
app.get('/', (req, res) =>{
console.log(`Server online`)
})

app.use('/auth', adminRouter)
app.use('/employee', EmployeeRouter)
app.use(express.json())
app.use(cookieParser())
app.use('/auth', adminRouter)
app.use('/employee', EmployeeRouter)
app.use(express.static('Public'))
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(token) {
        Jwt.verify(token, "jwt_secret_key", (err ,decoded) => {
            if(err) return res.json({Status: false, Error: "Wrong Token"})
            req.id = decoded.id;
            req.role = decoded.role;
            next()
        })
    } else {
        return res.json({Status: false, Error: "Not autheticated"})
    }
}
app.get('/verify',verifyUser, (req, res)=> {
    return res.json({Status: true, role: req.role, id: req.id})
} )

app.listen(PORT,()=>{
    console.log(`Server running in Port : ${PORT}`);
})
