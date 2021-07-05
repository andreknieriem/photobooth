FROM debian:buster-slim

# Usage:
# (1) Build image (only required once or after this file was changed):
#     $ docker build -t photobooth .
# (2) Start the container:
#     $ docker run --name photobooth --rm -v "$(pwd):/var/www/html/" -p 8080:80 photobooth
# (3) Go to: http://localhost:8080
#
# If you would like to connect to the running container:
# $ docker exec -it photobooth /bin/bash

RUN set -x \
    && apt-get update \
    && apt-get dist-upgrade -y \
    && apt-get install -y nginx php-fpm php-gd gphoto2

RUN set -x \
    && apt-get update \
    && apt-get install -y curl vim gnupg git

RUN set -x \
    && sed -i 's/^\(\s*\)index index\.html\(.*\)/\1index index\.php index\.html\2/g' /etc/nginx/sites-available/default \
    && sed -i '/location ~ \\.php$ {/s/^\(\s*\)#/\1/g' /etc/nginx/sites-available/default \
    && sed -i '/include snippets\/fastcgi-php.conf/s/^\(\s*\)#/\1/g' /etc/nginx/sites-available/default \
    && sed -i '/fastcgi_pass unix:\/run\/php\//s/^\(\s*\)#/\1/g' /etc/nginx/sites-available/default \
    && sed -i '/.*fastcgi_pass unix:\/run\/php\//,// { /}/s/^\(\s*\)#/\1/g; }' /etc/nginx/sites-available/default \
    && sed -i 's/^\(\s*listen \[::\]:80 default_server;\)/#\1/g' /etc/nginx/sites-enabled/default \
    && echo 'client_max_body_size 4M;' >> /etc/nginx/conf.d/custom.conf \
    && /usr/sbin/nginx -t -c /etc/nginx/nginx.conf 

RUN set -x \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn

RUN set -x \
    && mkdir /run/php \
    && echo '#!/bin/bash -xe' > /start.sh \
    && echo 'cd /var/www/html && yarn install && yarn build' >> /start.sh \
    && echo '/usr/sbin/php-fpm7.3 -D' >> /start.sh \
    && echo 'exec /usr/sbin/nginx -g "daemon off;"' >> /start.sh \
    && chmod +x /start.sh

EXPOSE 80

STOPSIGNAL SIGTERM

ENTRYPOINT [ "/start.sh" ]