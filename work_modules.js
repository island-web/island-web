const fs = require('fs');
const md5 = require('md5');
const db = require("croxydb");
const date = require('date-and-time');
const mysql = require('mysql2');
const host = 'https://infiniti-pro.com/';
const https = require('node:https');

let now_full_date = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
let now_time = date.format(new Date(), 'HH:mm:ss');
//****************************************************************************************************** */
//****************************************************************************************************** */

//START 12.6.4
let data_station = db.get("data_station")[0];
if (now_time > data_station.start_work && now_time < data_station.stop_work && db.get("initialization") > 2) {
    console.log(`START WORK STATION - ${data_station.name_station}`);
    if (process.send) { process.send(`START_PLAY`) }
} else {
    console.log(`SLEEP STATION - ${data_station.name_station}`);
}
//****************************************************************************************************** */
//****************************************************************************************************** */

//CHECK TIME START AND STOP WORK************************************************************************ */
setInterval(function () {

    if (date.format(new Date(), 'HH:mm:ss') == data_station.start_work || date.format(new Date(), 'HH:mm:ss') == data_station.stop_work) {
        (data_station.status_work_day == false) ? db.set("status_work_day", "true") :
            db.set("status_work_day", "true");
        fs.writeFileSync(`server/logs.js`, `//RESTART STATION\n`, { flag: 'a+' });
    }
}, 1000)
//****************************************************************************************************** */
//****************************************************************************************************** */

/* let connection_updata = mysql.createConnection({
    host: 'infiniti-pro.com',
    user: 'u_stations_lj',
    database: 'stations_list_infiniti',
    password: 'fpCB4MZ5'
});

connection_updata.query(`UPDATE station
                         set version='RASPBERRY-ELECTRON V 12.0.4'
                         WHERE id_station = ${db.get("id")}`,
    function (err) {
        if (err) console.log(err);
    })
connection_updata.end();
 */
//*********************************************************** */
//********************************************************** */
//DOWNLOAD SONGS AFTER START STATION
//*********************************************************** */
//********************************************************** */

//CHECK UPDATE SETTINGS NSTATION
//*********************************************************** */
//********************************************************** */
//EVENT ADD NEW MODULES  НЕМНОГО ПОЗЖЕ СУКА
const buttonPressesLogFile = 'server/modules.js';
let md5Previous = null;
let fsWait = false;

fs.watch(buttonPressesLogFile, (event, filename) => {
    if (filename) {
        if (fsWait) return;
        fsWait = setTimeout(() => { fsWait = false; }, 100);
        const md5Current = md5(fs.readFileSync(buttonPressesLogFile));
        if (md5Current === md5Previous) { return; }
        md5Previous = md5Current;
        if (process.send) { process.send(`NEW_MODULES`) }
    }
});

