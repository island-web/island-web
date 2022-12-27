const fs = require('fs');
const mysql = require('mysql2');
const https = require('https');
const db = require("croxydb");
const colors = require('colors');
const date = require('date-and-time');
let station = db.get('data_station');
const killProcess = require('kill-process-by-name');
const send_info_to_server = require('./logs.js');


module.exports.delete_old_adv = function(){
    if(db.get('adv')){
        fs.readdir(`adv/`, (err, files) => {
            files.forEach(file => {
                let flag = 0;
                db.get('adv').forEach(el => {
                    if (el.name_adv == file) {
                        flag = 1;
                    }
                })
                if (flag !== 1 && file !== '.DS_Store') {
                    fs.unlinkSync(`adv/${file}`);
                    send_info_to_server.send_log(`DELETE_OLD_ADV - ${file}`, 0, `song`);
                }
            });
            if (err) {
                let time_out = setTimeout(function () {
                    shell.exec(`${path_config}restart.sh`);
                    process.exit();
                }, 3000);
            }
        });    
    }
}

module.exports.get_new_data = function(){
    const connection_station_data = mysql.createConnection({
        host: 'infiniti-pro.com',
        user: 'u_stations_lj',
        database: 'stations_list_infiniti',
        password: 'fpCB4MZ5'
    })

    const COLLUMS = [
        'update_playlist',                                                                                                               
        'update_adv',                                                                                                                    
        'updata_settings',                                                                                                               
        'updata_additional',                                                                                                             
        'updata_soft'
    ]

    connection_station_data.query(`SELECT * FROM station WHERE id_station=${db.get("id")}`,
        function (err, results) {
            if(err){
                send_info_to_server.send_log(`CONNECT_DATADASE_ERROR: =====> ${e}`, 0, 'error', date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'), 'error');
            }
            COLLUMS.forEach(element => {
                 if(results[0][element] == 1){
                     send_info_to_server.send_log(`NEW_DATA_FROM_SERVER [ ${element} ]`, 0, 'work', date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'), 'adv');
                 }
             });
                
        });
    connection_station_data.end();    
}
