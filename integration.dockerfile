FROM hub.lumigame.com/base/nginx:brotli-1.20.2-zlib

COPY ./examples/cocos-3x/.nginx/game.conf /etc/nginx/conf.d/default.conf
COPY ./examples/cocos-3x/build/web-mobile/ /usr/share/nginx/html
COPY ./examples/cocos-3x/remote /usr/share/nginx/html/remote
