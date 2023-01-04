const db = require("croxydb");
const fork = require('child_process').fork;
const date = require('date-and-time');
let play_now;

setInterval(() => {

    (db.get('adv_fixed') || ['ERROR']).forEach(obj => {

        if (obj == 'ERROR') {
            killProcess('mpg321');
            fs.writeFileSync(`server/logs.js`, `//RESTART STATION\n`, { flag: 'a' });
        } else {

            if (date.format(new Date(), 'HH:mm') == obj.fix.slice(0, 5) && obj.id_string != play_now) {
                play_now = obj.id_string;
                process.send(obj);
            }
        }
    });
    
}, 1000);
