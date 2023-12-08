import express from 'express';
import cors from 'cors';

const PORT = 35050;
const app = express();




app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}))
app.get('/', (req, res) =>{
console.log(`Server online`)
})


app.listen(PORT,()=>{
    console.log(`Server running in Port : ${PORT}`);
})
