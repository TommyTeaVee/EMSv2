
import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { adminRouter } from './routes/admin.js';
import { EmployeeRouter } from './routes/employees.js';
import bodyParser from 'body-parser';
import seeder from './migrations/seedings.js';



const PORT = 35050;

const app = express() 


app.get('/', (req, res) =>{
console.log(`Server online`)
res.json({Status: true, Result:"Server online "})
})

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/auth', adminRouter)
app.use(express.static('Public'))
app.use('/auth', adminRouter)
app.use('/user', EmployeeRouter)
app.use(bodyParser.urlencoded({ extended: true }));



const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(token) {
        Jwt.verify(token, process.env.JWT_SECRET_KEY || "R3ACTJWT", (err ,decoded) => {
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

seeder();
app.listen(PORT,()=>{
    console.log(`Server running in Port : ${PORT}`);
})
