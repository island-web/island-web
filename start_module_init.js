const shell = require('shelljs');
const fs = require('fs');
const db = require("croxydb");


shell.rm('-rf', '/home/pi/Desktop/TMM_RASPBERRY/tmm.zip');
shell.rm('-rf', '/home/pi/Desktop/TMM_RASPBERRY/island-web');

shell.exec('npm node monit_start.js');

shell.exec('sudo npx pm2 start ecosystem.config.js');



