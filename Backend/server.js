import express from 'express';

const PORT = 35050;
const app = express();


app.listen(PORT,()=>{
    console.log(`Server runnign in: ${PORT}`);
})
