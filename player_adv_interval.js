const db = require("croxydb");
const fork = require('child_process').fork;
const date = require('date-and-time');
const killProcess = require('kill-process-by-name');
const fs = require('fs');



if (db.get('adv_interval').length > 0) {
    let in_additional = [];
    db.get('adv_interval').forEach(obj => {

        let push_play = [];
        let dur = 0;


        if (!in_additional.includes(obj[1].list_adv[0]['id_string'])) {

            in_additional.push(obj[1].list_adv[0]['id_string']);
            let play_list = [obj[1].list_adv[0]];

            db.get('adv_interval').forEach(add_obj => {
                if (add_obj[0].interval == obj[0].interval && !in_additional.includes(add_obj[1].list_adv[0]['id_string'])) {
                    in_additional.push(add_obj[1].list_adv[0]['id_string']);
                    play_list.push(add_obj[1].list_adv[0]);
                }
            })

            play_list.forEach(adv => {

                if (adv.time_stop > date.format(new Date(), 'HH:mm:ss') && adv.time_start <= date.format(new Date(), 'HH:mm:ss')) {

                    push_play.push(adv.name_adv);
                    dur += adv.duration;
                }
            });
            console.log('///////////////////////////////////////////////');
            console.log(push_play);
            console.log('///////////////////////////////////////////////');
            setInterval(function () {
                let f = false;
                console.log(`work interval_${play_list}`);
                play_list.forEach(adv => {
                    if (adv.time_stop > date.format(new Date(), 'HH:mm:ss') && adv.time_start <= date.format(new Date(), 'HH:mm:ss') && !push_play.includes(adv.name_adv)) {
                        f = true;
                        process.send('RESTART');
                    } else if (adv.time_stop < date.format(new Date(), 'HH:mm:ss') && push_play.includes(adv.name_adv)) {
                        f = true;
                        process.send('RESTART');
                    }
                })


                if (!f && push_play.length > 0) {
                    process.send([push_play, dur]);
                    console.log(push_play);
                }
            }, dur * 1000 + obj[0].interval * 60000)
        }
    });
}