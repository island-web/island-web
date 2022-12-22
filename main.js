const AutoGitUpdate = require('auto-git-update');

const config = {
    repository: 'https://github.com/island-web/island-web',
    fromReleases: true,
    tempLocation: 'home/pi/electron/tmp',
    ignoreFiles: ['util/config.js'],
    executeOnComplete: 'home/pi/electron/startTest.bat',
    exitOnComplete: true
}
const updater = new AutoGitUpdate(config);
updater.autoUpdate();


const fs = require('fs');
const pm2 = require('pm2')
const db = require('croxydb');
const fork = require('child_process').fork;
const host = 'https://infiniti-pro.com/';
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

//INITIALIZATION////////////////////////////////////////////////
(db.get("initialization") != 3) ? child_file_start = 'start' : child_file_start = 'work_modules';
const child = fork(child_file_start);
child.on('message', message => {
  command(message);
})
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

//EVENTS WORK PROCESS//////////////////////////////////////////
function command(mes) {
  switch (mes) {

    //******EVENT DOWNLOAD CONTENT*********************************    
      case `DOWNLOAD_SONGS`:
      const child_download_songs = fork(`download_songs`);
      child_download_songs.on('message', m => {
        console.log(m);
        setInterval(function () { 
          child.kill('SIGINT');
          process.exit();
        }, 10000);
      })
      break;


      case `START_PLAY`:
        const child_start_play = fork(`player`);
        child_start_play.on('message', m => {
          console.log(m);
        })
        break;

      
      case `INITIALIZATION_FINISH`:
        db.set("initialization", "2");
        setTimeout(function(){ 
          child.kill('SIGINT');
          process.exit();
        },10000)
        break;

      
      case `INITIALIZATION_NEXT_STEP`:
        db.set("initialization", "1");
	      fs.writeFileSync(`server/logs.js`, `//RESTART STATION\n`, { flag: 'a+' });
        break;
          
    }
    
}
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
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
  if (checkFile(name)) {
      let stats = fs.statSync(path + name);
      let fileSizeInBytes = stats["size"]
      let url = encodeURI(`${host}/music/${name}`);
      const request = https.get(url, function (response) {
          if (Math.trunc(fileSizeInBytes) != parseInt(response.headers["content-length"])) {
              db.push(`buffer_download`, name)
          }
      })
  } else {
      db.push(`buffer_download`, name)
  }
}
function checkSongsForDownload(arr) {
  if(arr.length > 0){
      arr.forEach(el => {
          if (el['artist'] || el['name_song'] != '') {
              let name = `${el['artist']}-${el['name_song']}.mp3`;
              checkSize_and_indir(name);
          }
      });    
  }
}