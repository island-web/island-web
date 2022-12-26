const db = require("croxydb");
const fs = require('fs');
const date = require('date-and-time');
const mpg321 = require('mpg321');
const send_info_to_server = require('./logs.js');
const fork = require('child_process').fork;
const colors = require('colors');
let now = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
//let now_full_day = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
let volume_song = 80;
let flag_play_adv = false;
let buffer_for_wait = [];

///PLAYERS///////////////////////////////////////////////////////////////////
/**FOR_SONG */
let count_list_songs = 0;
let player_songs = mpg321().remote();
player_songs.gain(volume_song);
/**FOR_INTERVAL */
let player_interval = mpg321().remote();
/**FOR_FIX */
let player_fixed = mpg321().remote();
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

///PLAY_INTERVAL_ADV///////////////////////////////////////////////////////////////////
function start_interval(list_adv) {
    list_adv = list_adv[0];
    let count = 0;

    send_info_to_server.send_lod(`START_PLAY_INTERVAL_ADV ===> ${list_adv[count]}`, 0, 'play', now, 'adv');
    player_interval.play(`adv/${list_adv[count]}`);
    player_interval.on('end', function () {
        count++;
        if (count == list_adv.length) {
            if (buffer_for_wait.length == 0) {

                flag_play_adv = false;
                player_songs.pause();
                player_songs.gain(volume_song);

                let end_pause_interval = setInterval(function () {
                    volume_song += 5;
                    player_songs.gain(volume_song);
                    if (volume_song == 80) {
                        clearInterval(end_pause_interval);
                    }
                }, 500);
             volume_song = 80;
            }
            else {
                let temp = buffer_for_wait;
                start_interval(temp);
                buffer_for_wait = [];
            }
        } else if (count < list_adv.length) {
            send_info_to_server.send_lod(`START_PLAY_INTERVAL_ADV ===> ${list_adv[count]}`, 0, 'play', now, 'adv');
            player_interval.play(`adv/${list_adv[count]}`);
        }
    })
}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

///CHECK_TIME_FIX_ADV//////////////////////////////////////////////////////
function check_time_fix_adv(all_duration) {
    console.log(db.get('adv_fixed'));

/*     if (fixed.length == 0){
        return false;
    }else{
        fixed.forEach(element => {
            console.log(element.fix);
        });    
    }
 */}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


///SORT////////////////////////////////////////////////////////////////////
function shuffle(arr) {
    var j, temp;
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

console.log("HELLO I`M PLAYER");

let list_music = [];

db.get("music_my_playlist").forEach(song => {
    if (song['artist'] && song['name_song'] != '') {
        list_music.push(`${song['artist']}-${song['name_song']}.mp3`);
    }
});

list_music = shuffle(list_music);






send_info_to_server.send_lod(`START_PLAY_SONG ===> ${list_music[count_list_songs]} `, 0, 'play', date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'));
player_songs.play(`music/${list_music[count_list_songs]}`);


player_songs.on('end', function () {
    count_list_songs++;
    if (count_list_songs == list_music.length) {
        count_list_songs = 0;
        list_music = shuffle(list_music);
    }


    if (count_list_songs == list_music.length) {
        count_list_songs = 0;
        list_music = shuffle(list_music);
    }

    send_info_to_server.send_lod(`START_PLAY_SONG ===>  ${list_music[count_list_songs]} `, 0, 'play', date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'));
    player_songs.play(`music/${list_music[count_list_songs]}`);
});

player_songs.on('error', function (e) {
    send_info_to_server.send_lod(`PLAYER_PLAY_ERROR: =====> ${e}`, 0, 'error', date.format(new Date(), 'YYYY/MM/DD HH:mm:ss'), 'error');
    console.log(`PLAYER_PLAY_ERROR: ${e}`);
    setTimeout(function () {
        process.exit();
    }, 5000)
})

const child_interval = fork('player_adv_interval');
child_interval.on('message', message => {
    if (flag_play_adv) {
        buffer_for_wait = buffer_for_wait.concat(message);
    } else {
        flag_play_adv = true;
        let pause_interval = setInterval(function () {
            volume_song -= 5;
            player_songs.gain(volume_song);
            if (volume_song == 0) {
                player_songs.pause();
                start_interval(message);
                clearInterval(pause_interval);
            }
        }, 500);
    }
})