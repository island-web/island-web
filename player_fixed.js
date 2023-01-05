const db = require("croxydb");
const fork = require('child_process').fork;
const date = require('date-and-time');
const colors = require('colors');

let play_now;

fixed_interval = setInterval(() => {

    (db.get('adv_fixed') || ['ERROR']).forEach(obj => {

        if (obj == 'ERROR') {
            console.log(colors.cyan('[ DATA_FIXED_ADV_EMPTY ]'));
            clearInterval(fixed_interval);
        } else {

            if (date.format(new Date(), 'HH:mm') == obj.fix.slice(0, 5) && obj.id_string != play_now) {
                play_now = obj.id_string;
                process.send(obj);
            }
        }
    });
    
}, 1000);
