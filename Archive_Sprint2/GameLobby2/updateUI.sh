#!/bin/bash
# My first script
DIR=./js/

if [  -f .gameUI/css/game.css ]; then
    rm .gameUI/css/game.css
fi
wget -P ./gameUI/css/ https://www.dropbox.com/s/v56v02rfunxu4c9/game.css
sleep 0.5s

if [  -f ./gameUI/game.html ]; then
    rm ./gameUI/game.html
fi
wget -P ./gameUI/ https://www.dropbox.com/s/yjc9tf3uiv4ur4b/game.html
sleep 0.5s

if [  -f ./gameUI/js/actionbar.js ]; then
    rm ./gameUI/js/actionbar.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/3f3nd0bu7lxiwbr/actionbar.js
sleep 0.5s

if [  -f ./gameUI/js/actionRouter.js ]; then
    rm ./gameUI/js/actionRouter.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/injbp8olxvopbnu/actionRouter.js
sleep 0.5s

if [  -f ./gameUI/js/cardSelection.js ]; then
    rm ./gameUI/js/cardSelection.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/894no5pafuaf9rg/cardSelection.js
sleep 0.5s

if [  -f ./gameUI/js/clientInterface.js ]; then
    rm ./gameUI/js/clientInterface.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/yjrl2blo68ww0l9/clientInterface.js
sleep 0.5s

if [  -f ./gameUI/js/chatInterface.js ]; then
    rm ./gameUI/js/chatInterface.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/pkf7v5qewulfync/chatInterface.js
sleep 0.5s

if [  -f ./gameUI/js/global.js ]; then
    rm ./gameUI/js/global.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/sbqtel3hqwv78uo/global.js
sleep 0.5s

if [  -f ./gameUI/js/guiInterface.js ]; then
    rm ./gameUI/js/guiInterface.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/ybua1dq8yhm2bex/guiInterface.js
sleep 0.5s

if [  -f ./gameUI/js/hand.js ]; then
    rm ./gameUI/js/hand.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/zz0c0ldcz11o3e3/hand.js
sleep 0.5s

if [  -f ./gameUI/js/jquery-2-0-3.min.js ]; then
    rm ./gameUI/js/jquery-2-0-3.min.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/ns3u80evhghe7z6/jquery-2-0-3.min.js
sleep 0.5s


if [  -f ./gameUI/js/key_events.js ]; then
    rm ./gameUI/js/key_events.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/s7ihwmz4xmy25b3/key_events.js
sleep 0.5s

if [  -f ./gameUI/js/player.js ]; then
    rm ./gameUI/js/player.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/5n3urtpromjuu0u/player.js
sleep 0.5s


if [  -f ./gameUI/js/click_events.js ]; then
    rm ./gameUI/js/click_events.js
fi
wget -P ./gameUI/js/ https://www.dropbox.com/s/eijzin7q00vizw2/click_events.js
sleep 0.5s

