FROM php:8.1-cli

RUN docker-php-ext-install curl

COPY . /var/www/html
