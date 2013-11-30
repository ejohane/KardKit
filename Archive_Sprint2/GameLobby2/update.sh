#!/bin/bash
# My first script
DIR=./js/
if [  -f ./css/homepage.css ]; then
    rm ./css/homepage.css
fi
wget -P ./css/ https://www.dropbox.com/s/0uiarjns8glxt3l/homepage.css
sleep 0.5s

if [  -f ./js/lobbyClient.js ]; then
    rm ./js/lobbyClient.js
fi
wget -P ./js/ https://www.dropbox.com/s/tld48q2m27se12c/lobbyClient.js
sleep 0.5s

if [  -f ./js/LobbyCommunication.js ]; then
    rm ./js/LobbyCommunication.js
fi
wget -P ./js/ https://www.dropbox.com/s/h70bv2oyl6stb5v/LobbyCommunication.js
sleep 0.5s

if [  -f ./js/player.js ]; then
    rm ./js/player.js
fi
wget -P ./js/ https://www.dropbox.com/s/59nqrjpcj0oajez/player.js
sleep 0.5s

if [  -f ./js/room.js ]; then
    rm ./js/room.js
fi
wget -P ./js/ https://www.dropbox.com/s/r1xnjwc1u6vm5oq/room.js	
sleep 0.5s

if [  -f ./js/gameRoomClient.js ]; then
    rm ./js/gameRoomClient.js
fi
wget -P ./js/ https://www.dropbox.com/s/9cvqvftce4qek67/gameRoomClient.js
sleep 0.5s

if [  -f ./server.js ]; then
    rm ./server.js
fi
wget https://www.dropbox.com/s/uweq9ljspbyei61/server.js
sleep 0.5s

if [  -f ./gameRoom.html ]; then
    rm ./gameRoom.html
fi
wget https://www.dropbox.com/s/cnm50erty1mkhcz/gameRoom.html
sleep 0.5s

if [  -f ./home.html ]; then
    rm ./home.html
fi
wget https://www.dropbox.com/s/0imual70il6e4qm/home.html
sleep 0.5s



