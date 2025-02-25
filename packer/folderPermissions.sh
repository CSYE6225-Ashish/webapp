#!/bin/bash 

sudo groupadd csye6225
sudo useradd csye6225 --shell /usr/sbin/nologin -g csye6225
sudo cp /tmp/webapp.service /etc/systemd/system/

sudo chown -R csye6225:csye6225 /opt/csye6225
sudo chmod -R 750 /opt/csye6225
sleep 10