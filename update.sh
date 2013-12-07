#!/bin/bash
# My first script

if [  -f ./master.zip]; then
    rm -r ./master.zip
fi
if [  -f ./KardKit-master]; then
    rm -r ./KardKit-master
fi

wget -P ./ https://github.com/johanss4/KardKit/archive/master.zip
sleep 0.5s

unzip master.zip



