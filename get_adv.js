const day = require('date-and-time');
const db = require("croxydb")
const mysql = require('mysql2');
const host = 'https://infiniti-pro.com/';
const https = require('node:https');
const fork = require('child_process').fork;

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

let today = day.format(new Date(), 'YYYY/MM/DD');

function checkFile(name, path = 'music/') {
    let flag = true;
    try {
        fs.accessSync(path + name, fs.F_OK);
    } catch (e) {
        flag = false;
    }
    return flag;
}


connection.query(`SELECT id_program FROM stations_program WHERE id_station = ${db.get("id")}`,
    function (err, results) {
        if (err) {
            if (process.send) {
                process.send('ERROR CONNECTION TO [DATA_ADV], SERVER DOWN');
            }
        }
        else {
            results.forEach(ad => {
                connection_adv.query(`SELECT * FROM adv_program WHERE id_program = ${ad.id_program}`,
                    function (err, results_adv) {
                        if (err) {
                            if (process.send) {
                                process.send('ERROR CONNECTION TO [DATA_ADV], SERVER DOWN');
                            }
                        }
                        else {
                            results_adv.forEach(r_ad => {
                                if (day.format(r_ad.date_stop, 'YYYY/MM/DD') > today && !checkFile(r_ad.name_adv, 'adv/')) {
                                    db.push('adv', r_ad);
                                    const child_download_adv = fork(`download_adv`);
                                    child_download_adv.on('message', m => {
                                        console.log(m);
                                        setInterval(function () {
                                            child.kill('SIGINT');
                                            process.exit();
                                        }, 150000);
                                    })
                                }
                            });
                        }
                    });
            });
            connection_adv.end();
            if (process.send) {
                process.send('CHECK_ADV_FINISH');
            }
        }
    });
connection.end();
