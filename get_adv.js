const db = require("croxydb")
const mysql = require('mysql2');


let connection = mysql.createConnection({
    host: 'infiniti-pro.com',
    user: 'u_adv_infini',
    database: 'adv_infinity',
    password: 'nBAw8R03mKti'
});

let connection_adv = mysql.createConnection({
    host: 'infiniti-pro.com',
    user: 'u_adv_infini',
    database: 'adv_infinity',
    password: 'nBAw8R03mKti'
});

console.log('CHECK ADV');
function getAdv() {
    connection.query(`SELECT id_program FROM stations_program WHERE id_station = ${db.get("id")}`,
        function (err, results) {
            if(err){
                if (process.send) {
                    process.send('ERROR CONNECTION TO [DATA_ADV], SERVER DOWN');
                }    
            }
            else{
                let temp_adv = [];
                results.forEach(ad => {
                    connection_adv.query(`SELECT * FROM adv_program WHERE id_program = ${ad.id_program}`,
                        function (err, results_adv) {
                            if(err){
                                if (process.send) {
                                    process.send('ERROR CONNECTION TO [DATA_ADV], SERVER DOWN');
                                }    
                            }
                            else{
                                results_adv.forEach(r_ad => {
                                    if (r_ad.date_stop > new Date(today())) { temp_ad.push(r_ad); }
                                });
                                if (process.send) {
                                    process.send('NEW_ADV', results);
                                    db.set("adv", temp_adv);
                                }    
                            }
                        });
                });
                connection_adv.end();    
            }
        });
    connection.end();
}