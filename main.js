const fs = require('fs');
const pm2 = require('pm2')
const db = require('croxydb');
const fork = require('child_process').fork;
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

//INITIALIZATION////////////////////////////////////////////////
(db.get("initialization") != 2) ? child_file_start = 'start' : child_file_start = 'work_modules';
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
        setInterval(function () { fs.writeFileSync(`server/logs.js`, `RESTART STATION: /n`, { flag: 'a+' }) }, 3000);
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
	      //fs.writeFileSync(`server/logs.js`, `//RESTART STATION\n`, { flag: 'a+' });
        setTimeout(function(){ process.exit() },10000)
        break;

      
        case `INITIALIZATION_NEXT_STEP`:
          db.set("initialization", "1");
	        fs.writeFileSync(`server/logs.js`, `//RESTART STATION\n`, { flag: 'a+' });
          break;   
  }
}
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////