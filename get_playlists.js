const db = require("croxydb")
const mysql = require('mysql2');


let connection = mysql.createConnection({
    host: 'infiniti-pro.com',
    user: 'u_global_inf',
    database: 'global_infiniti',
    password: 'Pf1vUdyO'
})
connection.query(`SELECT * FROM playlist_for_program WHERE id_program=${db.get("id_program_music")}`,
    function (err, results) {
        if(err){
            if (process.send) {
                process.send('ERROR CONNECTION TO [DATA_PLAYLIST], SERVER DOWN');
            }    
        }
        else{
            if(process.send){
                process.send(results);
                db.set("playlist", results);
            }    
        }
    })

connection.query(`SELECT * FROM speciallist_for_program WHERE id_program=${db.get("id_program_music")}`,
    function (err, results) {
        db.set("speciallist", results);
    })
connection.end();