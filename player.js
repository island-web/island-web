const db = require("croxydb");
const fs = require('fs');
const date = require('date-and-time');
let mpg321 = require('mpg321');

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

console.log("HELLO I`M PLAYER ;)");

let list_music = [];

if(db.get("music_my_playlist").length > 0){
    db.get("music_my_playlist").forEach(song => {
        if (song['artist'] && song['name_song'] != '') {
            list_music.push(`${song['artist']}-${song['name_song']}.mp3`);
        }
    });    
}
list_music = shuffle(list_music);


let count_list_songs = 0;
let player_songs = mpg321().remote();

console.log(`PLAYER PLAY: ${list_music[count_list_songs]}`);
player_songs.play(`music/${list_music[count_list_songs]}`);


player_songs.on('end', function () {
    count_list_songs++;


    if(count_list_songs == list_music.length){
        count_list_songs = 0;
        list_music = shuffle(list_music);
    }

    console.log(`PLAYER PLAY: ${list_music[count_list_songs]}`);
    player_songs.play(`music/${list_music[count_list_songs]}`);
});

player_songs.on('error', function(e){
    console.log(`PLAYER PLAY ERROR: ${e}`);
    fs.writeFileSync(`server/logs.js`, `PLAYER PLAY ERROR: ${e}/n`, { flag: 'a+' });
})