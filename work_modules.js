const fs = require('fs');
const md5 = require('md5');
const db = require("croxydb");
const date = require('date-and-time');
const mysql = require('mysql2');
const host = 'https://infiniti-pro.com/';
const https = require('https');
const send_info_to_server = require('./logs.js');
const { Console } = require('console');
let now_full_day = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');

let today = date.format(new Date(), 'YYYY/MM/DD');
let now_time = date.format(new Date(), 'HH:mm:ss');
//****************************************************************************************************** */
//****************************************************************************************************** */
let data_station = db.get("data_station")[0];
if (now_time > data_station.start_work && now_time < data_station.stop_work && db.get("initialization") > 2) {

    send_info_to_server.send_lod(`START_WORK_STATION`, 0, `work`, now_full_day);
    send_info_to_server.send_status();

    if (process.send) {
        process.send(`START_WORK_STATION`);
        checkAudioForDownload(db.get('adv'), 'adv/');
        sortAdv();
        //checkAudioForDownload(db.get('music_my_playlist'), 'music/');
        //checkAudioForDownload(db.get('music_speciallist'), 'music/');

    }
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

//EVENT ADD NEW MODULES  
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
//*********************************************************** */
//********************************************************** */

//DOWNLOAD SONGS AFTER START STATION
function checkFile(name, path = 'music/') {
    let flag = true;
    try {
        fs.accessSync(path + name, fs.F_OK);
    } catch (e) {
        flag = false;
    }
    return flag;
}
function checkSize_and_indir(name, path = 'music/') {
    let buff = 'buffer_download';
    let funk = 'DOWNLOAD_SONGS';
    if (path == 'adv/') {
        buff = 'buffer_download_adv';
        funk = 'DOWNLOAD_ADV';
    }
    let url = encodeURI(`${host}${path}${name}`);
    const request = https.get(url, function (response) {
        if (!checkFile(name, path)) {
            db.push(buff, name)
        } else {
            let stats = fs.statSync(path + name);
            let fileSizeInBytes = stats["size"];
            if (Math.trunc(fileSizeInBytes) != parseInt(response.headers["content-length"])) {
                console.log(parseInt(response.headers["content-length"]));
                console.log(Math.trunc(fileSizeInBytes));
                db.push(buff, name)
            }
        }
        if (db.get(buff)) {
            if (process.send) { process.send(funk) }
        }
    })
}
function checkAudioForDownload(arr, path) {
    try {
        if (arr.length > 0) {
            let name;
            arr.forEach(el => {
                if (path == 'adv/') {
                    name = el.name_adv;
                }
                else if (path == 'music/' && el['artist'] || el['name_song'] != '') {
                    name = `${el['artist']}-${el['name_song']}.mp3`;
                }
                checkSize_and_indir(name, path);
            });
        }
    } catch (err) {
        console.log("ERROR STRING 108 SEE LOGS");
    }
}

//****************************************************************************************************** */
//****************************************************************************************************** */

//SORT ADV 
function sortAdv() {
db.delete('adv_interval')
    db.get('adv').forEach(element => {
        if (today >= date.format(new Date(element.date_start), 'YYYY/MM/DD') && today <= date.format(new Date(element.date_stop), 'YYYY/MM/DD')) {
            if (element.type == 'fix') { db.push('adv_fixed', element) }
            else if (element.type == 'interval_t') {
                let flag = false;
                if(db.get('adv_interval')){
                    db.get('adv_interval').forEach(el => {
                        if (el[0].interval == element.interval_t) {
                            el[1].list.push(element);
                            flag = true;
                        }
                    });    
                }
                if (!flag) {
                    db.push('adv_interval',[{ interval: element.interval_t }, { list: [element] }]);
                }
            }
        }
    });
}
//test