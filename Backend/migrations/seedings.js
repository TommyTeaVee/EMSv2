//Seeding using sequalizer
import fs from 'fs';
import conn from '../config/db.js';

export default function seeder(){
const seedQuery  = fs.readFileSync('database/schema.sql', { encoding: 'Utf8' })
conn.query(seedQuery, (err, res)=>{
   
   if(err) {
    console.error(err, res);
}else {
    console.log('Seeding completed successfully');

}

})

}
