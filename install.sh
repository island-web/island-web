#!/bin/bash
sudo apt-get update
sudo curl -sSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install nodejs -y
sudo npm install pm2
sudo reboot