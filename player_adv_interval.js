const db = require("croxydb");
const fork = require('child_process').fork;
const date = require('date-and-time');


let int = db.get('adv_interval');

    int.forEach(obj => {
        let all_duration = 0;
        let play_list = [];
        obj[1].list.forEach(element => {

            all_duration += element.duration;
            
            play_list.push(element.name_adv);
        });
        setInterval(function(){
            process.send([play_list, all_duration]);
        }, (obj[0].interval * 60000) + (all_duration * 1000))
    });