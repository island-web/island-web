const db = require("croxydb");
const fork = require('child_process').fork;
const date = require('date-and-time');
let play_now;

if(db.get('adv_fixed')){
    setInterval(() => {

        db.get('adv_fixed').forEach(obj => {

            if(date.format(new Date(), 'HH:mm') == obj.fix.slice(0, 5) && obj.id_string != play_now){
                play_now = obj.id_string;
                process.send(obj);
            }
        });

    }, 1000);
}
